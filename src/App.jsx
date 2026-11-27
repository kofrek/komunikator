
import zdj1 from '/src/assets/galak pizza.webp';
import './App.css';

import { useState, useEffect } from 'react';
import { supabase } from './lib/supabaseClient';

export default function App() {
  //zakladki
  const [zakladka, zmianaZakladki] = useState("Logowanie");

  // logowanie
  const [email, setEmail] = useState("");
  const [password, setHasło] = useState("");
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");
  const [czekanie, setCzekanie] = useState(false);

  //znajomi
  const [znajomi, setZnajomi] = useState([]);
  const [aktywnyZnajomy, setAktywnyZnajomy] = useState(null);
  const [szukanyEmail, setSzukanyEmail] = useState("");
  const [dodawanie, setDodawanie] = useState(false);

  // wiadomosci
  const [wiadomosci, setWiadomosci] = useState([]);
  const [nowaWiadomosc, setNowaWiadomosc] = useState("");
  const [wysylanie, setWysylanie] = useState(false);

  const [wiadomoscBledu, setWiadomoscBledu] = useState("");


  useEffect(() => {
    let aktywny = true;

    const sprawdzSesje = async () => {
      const {
        data: { session },
        error
      } = await supabase.auth.getSession();

      if (!aktywny) return;

      if (error) {
        setError(error.message);
        return;
      }

      setUser(session?.user ?? null);

      if (session?.user) {
        zmianaZakladki("Komunikator");
      }
    };

    sprawdzSesje();

    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);

      if (session?.user) {
        zmianaZakladki("Komunikator");
      } else {
        zmianaZakladki("Logowanie");
        setZnajomi([]);
        setAktywnyZnajomy(null);
        setWiadomosci([]);
      }
    });

    return () => {
      aktywny = false;
      subscription.unsubscribe();
    };
  }, []);



  const logowanieUzytkownika = async () => {
    setError("");

    if (!email.trim() || !password) {
      setError("Wpisz email i hasło!");
      return;
    }

    setCzekanie(true);

    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password: password
    });

    setCzekanie(false);

    if (error) {
      setError("Nieprawidłowy email lub hasło!");
      console.log(error.message);
    }
  };

  

  const sprawdzanie = async () => {
    setError("");

    if (!email.trim() || !password) {
      setError("Wpisz email i hasło!");
      return;
    }

    if (password.length < 6) {
      setError("Hasło musi mieć minimum 6 znaków!");
      return;
    }

    setCzekanie(true);

    const { data, error } = await supabase.auth.signUp({
      email: email.trim(),
      password: password
    });

    setCzekanie(false);

    if (error) {
      setError(error.message);
      return;
    }

    if (data.session) {
      setUser(data.user);
      zmianaZakladki("Komunikator");
    } else {
      setError("Sprawdź pocztę i potwierdź adres email.");
      zmianaZakladki("Logowanie");
    }
  };

  

  const wyloguj = async () => {
    setCzekanie(true);

    const { error } = await supabase.auth.signOut();

    setCzekanie(false);

    if (error) {
      setWiadomoscBledu(error.message);
      return;
    }

    setUser(null);
    setEmail("");
    setHasło("");
    setZnajomi([]);
    setAktywnyZnajomy(null);
    setWiadomosci([]);
    setWiadomoscBledu("");
    zmianaZakladki("Logowanie");
  };


  const pobierzZnajomych = async () => {
    if (!user) return [];

    const { data, error } = await supabase
      .from('friendships')
      .select('user_id, friend_id')
      .or(`user_id.eq.${user.id},friend_id.eq.${user.id}`);

    if (error) {
      setWiadomoscBledu(error.message);
      return [];
    }

    const identyfikatory = [
      ...new Set(
        data.map(relacja =>
          relacja.user_id === user.id
            ? relacja.friend_id
            : relacja.user_id
        )
      )
    ];

    if (identyfikatory.length === 0) {
      setZnajomi([]);
      return [];
    }

    const { data: profile, error: bladProfilu } = await supabase
      .from('profiles')
      .select('id, email, display_name')
      .in('id', identyfikatory);

    if (bladProfilu) {
      setWiadomoscBledu(bladProfilu.message);
      return [];
    }

    setZnajomi(profile || []);

    setAktywnyZnajomy(stary => {
      if (!stary) return null;

      return profile.find(p => p.id === stary.id) || null;
    });

    return profile || [];
  };

  // Automatyczne pobieranie znajomych po zalogowaniu

  useEffect(() => {
    if (user) {
      pobierzZnajomych();
    }
  }, [user]);



  const dodajZnajomego = async (e) => {
    e.preventDefault();

    setWiadomoscBledu("");

    const szukany = szukanyEmail.trim().toLowerCase();

    if (!szukany) {
      setWiadomoscBledu("Wpisz email użytkownika!");
      return;
    }

    if (szukany === user.email?.toLowerCase()) {
      setWiadomoscBledu("Nie możesz dodać samego siebie!");
      return;
    }

    setDodawanie(true);

    // Szukanie użytkownika

    const { data: znaleziony, error } = await supabase
      .from('profiles')
      .select('id, email, display_name')
      .eq('email', szukany)
      .maybeSingle();

    if (error) {
      setWiadomoscBledu(error.message);
      setDodawanie(false);
      return;
    }

    if (!znaleziony) {
      setWiadomoscBledu("Nie znaleziono takiego użytkownika!");
      setDodawanie(false);
      return;
    }

  

    const juzJest = znajomi.some(
      znajomy => znajomy.id === znaleziony.id
    );

    if (juzJest) {
      setWiadomoscBledu("Ten użytkownik jest już znajomym!");
      setDodawanie(false);
      return;
    }



    const { error: bladDodawania } = await supabase
      .from('friendships')
      .insert({
        user_id: user.id,
        friend_id: znaleziony.id
      });

    if (bladDodawania) {
      setWiadomoscBledu(bladDodawania.message);
      setDodawanie(false);
      return;
    }

    setSzukanyEmail("");

    const nowiZnajomi = await pobierzZnajomych();

    setAktywnyZnajomy(znaleziony);

    setWiadomoscBledu("Pomyślnie dodano znajomego!");

    setDodawanie(false);
  };


  useEffect(() => {
    if (!user || !aktywnyZnajomy) {
      setWiadomosci([]);
      return;
    }

    let aktywny = true;

    const pobierz = async () => {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .or(
          `and(sender_id.eq.${user.id},receiver_id.eq.${aktywnyZnajomy.id}),and(sender_id.eq.${aktywnyZnajomy.id},receiver_id.eq.${user.id})`
        )
        .order('created_at', { ascending: true });

      if (!aktywny) return;

      if (error) {
        setWiadomoscBledu(error.message);
        return;
      }

      setWiadomosci(data || []);
    };

    pobierz();

    // Nasłuchiwanie nowych wiadomości

    const kanal = supabase
      .channel(`rozmowa-${user.id}-${aktywnyZnajomy.id}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages'
        },
        payload => {
          const wiadomosc = payload.new;

          const pasuje =
            (wiadomosc.sender_id === user.id &&
              wiadomosc.receiver_id === aktywnyZnajomy.id) ||
            (wiadomosc.sender_id === aktywnyZnajomy.id &&
              wiadomosc.receiver_id === user.id);

          if (pasuje) {
            setWiadomosci(stare => {
              if (stare.some(m => m.id === wiadomosc.id)) {
                return stare;
              }

              return [...stare, wiadomosc];
            });
          }
        }
      )
      .subscribe();

    return () => {
      aktywny = false;
      supabase.removeChannel(kanal);
    };
  }, [user, aktywnyZnajomy]);

  // =====================================
  // WYSYŁANIE WIADOMOŚCI
  // =====================================

  const wyslijWiadomosc = async (e) => {
    e.preventDefault();

    if (!nowaWiadomosc.trim()) return;
    if (!aktywnyZnajomy) return;

    setWysylanie(true);
    setWiadomoscBledu("");

    const { error } = await supabase
      .from('messages')
      .insert({
        sender_id: user.id,
        receiver_id: aktywnyZnajomy.id,
        content: nowaWiadomosc.trim()
      });

    setWysylanie(false);

    if (error) {
      setWiadomoscBledu("Nie udało się wysłać wiadomości: " + error.message);
      return;
    }

    setNowaWiadomosc("");
  };



  const formatujDate = (data) => {
    return new Date(data).toLocaleString("pl-PL", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };




  const logowanie = (
    <>
      <main className="logowanie">
        <h1>Witaj w komunikatorze!</h1>
        <h3>Zaloguj się</h3>

        {error && <p className="error">{error}</p>}

        <p>Wpisz swój email</p>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />

        <br />

        <p>Wpisz swoje hasło</p>

        <input
          type="password"
          placeholder="Hasło"
          value={password}
          onChange={e => setHasło(e.target.value)}
          onKeyDown={e => {
            if (e.key === "Enter") logowanieUzytkownika();
          }}
        />

        <br />
        <br />

        <p>Nie pamiętasz hasła?</p>

        <input
          type="button"
          value="Zarejestruj się"
          id="zakladka2"
          onClick={() => {
            setError("");
            zmianaZakladki("Rejestrowanie");
          }}
        />

        <br />
        <br />

        <button
          onClick={logowanieUzytkownika}
          disabled={czekanie}
        >
          {czekanie ? "Logowanie..." : "Zaloguj się"}
        </button>
      </main>

      <div className="boczny">
        <a
          href="https://galakpizza.pl/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img src={zdj1} alt="galak pizza" />
        </a>
      </div>
    </>
  );



  const rejestrowanie = (
    <>
      <main id="logowanie">
        <h1>Witaj w komunikatorze!</h1>
        <h3>Zarejestruj się</h3>

        {error && <p className="error">{error}</p>}

        <p>Wpisz swój email</p>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />

        <br />

        <p>Wpisz swoje hasło</p>

        <input
          type="password"
          placeholder="Hasło"
          value={password}
          onChange={e => setHasło(e.target.value)}
        />

        <br />
        <br />

        <button
          onClick={sprawdzanie}
          disabled={czekanie}
        >
          {czekanie ? "Rejestrowanie..." : "Rejestracja"}
        </button>

        <p>Masz już konto?</p>

        <input
          type="button"
          value="Zaloguj się"
          id="zakladka2"
          onClick={() => {
            setError("");
            zmianaZakladki("Logowanie");
          }}
        />
      </main>

      <div className="boczny">
        <a
          href="https://galakpizza.pl/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img src={zdj1} alt="galak pizza" />
        </a>
      </div>
    </>
  );


  const komunikator = (
    <main id="komunikator">

      <div className="cont">

        <header className="naglowek-komunikatora">
          <h2>Komunikator</h2>

          <div>
            <span>{user?.email}</span>

            <button
              onClick={wyloguj}
              disabled={czekanie}
            >
              Wyloguj się
            </button>
          </div>
        </header>

        {wiadomoscBledu && (
          <p className="error">{wiadomoscBledu}</p>
        )}

        <div className="uklad-komunikatora">

          {/* PANEL ZNAJOMYCH */}

          <aside className="panel-znajomych">

            <h3>Twoi znajomi</h3>

            <form onSubmit={dodajZnajomego}>
              <input
                type="email"
                placeholder="Email użytkownika"
                value={szukanyEmail}
                onChange={e => setSzukanyEmail(e.target.value)}
              />

              <button
                type="submit"
                disabled={dodawanie}
              >
                {dodawanie ? "Dodawanie..." : "Dodaj znajomego"}
              </button>
            </form>

            <div className="lista-znajomych">

              {znajomi.length === 0 && (
                <p>Nie masz jeszcze znajomych.</p>
              )}

              {znajomi.map(znajomy => (
                <button
                  key={znajomy.id}
                  className={
                    aktywnyZnajomy?.id === znajomy.id
                      ? "znajomy aktywny"
                      : "znajomy"
                  }
                  onClick={() => {
                    setAktywnyZnajomy(znajomy);
                    setWiadomoscBledu("");
                  }}
                >
                  <strong>
                    {znajomy.display_name || znajomy.email}
                  </strong>

                  <small>{znajomy.email}</small>
                </button>
              ))}

            </div>

          </aside>

          {/* PANEL ROZMOWY */}

          <section className="panel-rozmowy">

            {!aktywnyZnajomy ? (

              <div className="brak-rozmowy">
                <h2>Witaj w komunikatorze!</h2>
                <p>Wybierz znajomego, aby rozpocząć rozmowę.</p>
              </div>

            ) : (

              <>
                <div className="naglowek-rozmowy">
                  <h3>
                    {aktywnyZnajomy.display_name ||
                      aktywnyZnajomy.email}
                  </h3>

                  <small>{aktywnyZnajomy.email}</small>
                </div>

                {/* WIADOMOŚCI */}

                <div className="wiadomosci">

                  {wiadomosci.length === 0 && (
                    <p className="brak-wiadomosci">
                      Nie ma jeszcze wiadomości.
                      Napisz coś jako pierwszy!
                    </p>
                  )}

                  {wiadomosci.map(wiadomosc => {

                    const moje =
                      wiadomosc.sender_id === user.id;

                    return (
                      <div
                        key={wiadomosc.id}
                        className={
                          moje
                            ? "wiadomosc moja"
                            : "wiadomosc obca"
                        }
                      >

                        <strong>
                          {moje
                            ? "Ty"
                            : aktywnyZnajomy.display_name ||
                              aktywnyZnajomy.email}
                        </strong>

                        <p>{wiadomosc.content}</p>

                        <small>
                          {formatujDate(wiadomosc.created_at)}
                        </small>

                      </div>
                    );
                  })}

                </div>

                {/* FORMULARZ WYSYŁANIA */}

                <form
                  className="formularz-wiadomosci"
                  onSubmit={wyslijWiadomosc}
                >

                  <input
                    type="text"
                    placeholder="Napisz wiadomość..."
                    value={nowaWiadomosc}
                    maxLength={5000}
                    onChange={e =>
                      setNowaWiadomosc(e.target.value)
                    }
                  />

                  <button
                    type="submit"
                    disabled={
                      wysylanie || !nowaWiadomosc.trim()
                    }
                  >
                    {wysylanie ? "Wysyłanie..." : "Wyślij"}
                  </button>

                </form>

              </>
            )}

          </section>

        </div>

      </div>

    </main>
  );

  return (
    <div className="kontener">

      <br />

      {zakladka === "Logowanie" && logowanie}

      {zakladka === "Rejestrowanie" && rejestrowanie}

      {zakladka === "Komunikator" && komunikator}

    </div>
  );
}
