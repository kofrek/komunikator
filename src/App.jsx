
import zdj1 from '/src/assets/galak pizza.webp'
import './App.css'
import { useState, useEffect } from 'react'
import { supabase } from './lib/supabaseClient';

export default function App() {
  const [zakladka, zmianaZakladki] = useState("Logowanie");

  const [email, setEmail] = useState("");
  const [password, setHasło] = useState("");
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");
  const [czekanie, setCzekanie] = useState(false);

  // Sprawdzanie istniejącej sesji użytkownika
  useEffect(() => {
    const sprawdzSesje = async () => {
      const {
        data: { session },
        error
      } = await supabase.auth.getSession();

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

    // Nasłuchiwanie zmian stanu logowania
    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);

      if (session?.user) {
        zmianaZakladki("Komunikator");
      } else {
        zmianaZakladki("Logowanie");
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // LOGOWANIE
  const logowanieUzytkownika = async () => {
    setError("");

    if (!email || !password) {
      setError("Wpisz email i hasło!");
      return;
    }

    setCzekanie(true);

    const { data, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password
    });

    setCzekanie(false);

    if (error) {
      setError("Nieprawidłowy email lub hasło!");
      console.log("Błąd logowania:", error.message);
      return;
    }

    console.log("Zalogowano:", data.user);

    setUser(data.user);
    zmianaZakladki("Komunikator");
  };

  // REJESTRACJA
  const sprawdzanie = async () => {
    setError("");

    if (!email || !password) {
      setError("Wpisz email i hasło!");
      return;
    }

    if (password.length < 6) {
      setError("Hasło musi mieć minimum 6 znaków!");
      return;
    }

    setCzekanie(true);

    const { data, error } = await supabase.auth.signUp({
      email: email,
      password: password
    });

    setCzekanie(false);

    if (error) {
      setError(error.message);
      console.log("Błąd rejestracji:", error);
      return;
    }

    console.log("Zarejestrowano:", data.user);

    if (data.session) {
      setUser(data.user);
      zmianaZakladki("Komunikator");
    } else {
      setError("Sprawdź swoją pocztę i potwierdź adres email.");
      zmianaZakladki("Logowanie");
    }
  };

  // WYLOGOWANIE
  const wyloguj = async () => {
    setCzekanie(true);

    const { error } = await supabase.auth.signOut();

    setCzekanie(false);

    if (error) {
      setError(error.message);
      return;
    }

    setUser(null);
    setEmail("");
    setHasło("");
    setError("");
    zmianaZakladki("Logowanie");
  };

  // ZAKŁADKA LOGOWANIE
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

  // ZAKŁADKA KOMUNIKATOR
  const komunikator = (
    <main id="komunikator">
      <div className="cont">
        <h3>Witaj w komunikatorze</h3>

        <p>
          Zalogowano jako: {user?.email}
        </p>

        <div id="kanaly">
          <p>znajomy 1</p>
          <p>znajomy 2</p>
          <p>znajomy 3</p>

          <div id="glowny">
            <h1>ty niemądro osóbko</h1>
            <h1>ty furasie</h1>
          </div>
        </div>

        <div id="wylogowywanie">
          <input
            type="button"
            value="Wyloguj się"
            id="zakladka3"
            onClick={wyloguj}
            disabled={czekanie}
          />
        </div>
      </div>
    </main>
  );

  // ZAKŁADKA REJESTROWANIE
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

  // WYŚWIETLANIE ZAKŁADEK
  return (
    <div className="kontener">
      <br />

      {zakladka === "Logowanie" && logowanie}
      {zakladka === "Komunikator" && komunikator}
      {zakladka === "Rejestrowanie" && rejestrowanie}
    </div>
  );
}
