
import zdj1 from '/src/assets/galak pizza.webp'
import './App.css'
import { useState } from 'react'
import { supabase } from './lib/supabaseClient';

export default function App() {
  const [zakladka, zmianaZakladki] = useState("Logowanie")

  const [email, setEmail] = useState("");
  const [password, setHasło] = useState("");
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");
  const [czekanie, setCzekanie] = useState(false);

  // Funkcja rejestracji
  const sprawdzanie = async () => {
    setError("");
    setCzekanie(true);

    const { data, error } = await supabase.auth.signUp({
      email: email,
      password: password
    });

    console.log("DANE:", data);
    console.log("BŁĄD:", error);

    setCzekanie(false);

    if (error) {
      setError(error.message);
      return;
    }

    setUser(data.user ?? null);

    console.log("Użytkownik:", data.user);
    console.log("Sesja:", data.session);
  };

  // ZAKŁADKA LOGOWANIE
  const logowanie = (
    <>
      <main className="logowanie">
        <h1>Witaj w komunikatorze!</h1>
        <h3>Zaloguj się</h3>

        <p>Wpisz swój email</p>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />

        <br />

        <p>Wpisz swoje hasło</p>
        {error && <p className="error">{error}</p>}
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
          onClick={sprawdzanie}
          //onClick={() => zmianaZakladki("komunikator")}
          disabled={czekanie}
        >
          {czekanie ? "Poczekaj mordo..." : "Zaloguj się"}
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
            value="wyloguj się"
            id="zakladka3"
            onClick={() => zmianaZakladki("Rejestrowanie")}
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
          value="zaloguj sie"
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
  )
}
