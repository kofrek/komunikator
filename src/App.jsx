import zdj1 from '/src/assets/galak pizza.webp'
import './App.css'
import { useState } from 'react'

export default function App() {
  const [zakladka, zmianaZakladki] = useState("Logowanie")

  function logowanie() {
    return (
      <>
        <main className="logowanie">
          <h1>Witaj w komunikatorze!</h1>
          <h3>Zaloguj się</h3>

          <label>
            <p>Wpisz swoją nazwę</p>
            <input type="text" placeholder="Nazwa użytkownika" />
          </label>

          <br />

          <label>
            <p>Wpisz swoje hasło</p>
            <input type="password" placeholder="Hasło" />
          </label>

          <br />
          <br />

          <p>Nie pamiętasz hasła?</p>

          <input
            type="button"
            value="Zarejestruj się"
            id="zakladka2"
            onClick={() => zmianaZakladki("Rejestrowanie")}
          />

          <input
            type="button"
            value="Zaloguj się"
            id="zakladka1"
            onClick={() => zmianaZakladki("Komunikator")}
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
    )
  }

  function komunikator() {
    return (
      
      <main id="komunikator">
        <div className="cont">
        <h3>Witaj w komunikatorze</h3>
        <div id="kanaly">
          <p>
       znajomy 1
          
          </p>
              <p>
            znajomy  2
          
          </p>
          <p>
            znajomy  3
          
          
          </p>
          <div id="glowny">
            
          <h1>
          ty niemądro osóbko
          </h1>
            <h1> ty furasie
            </h1>
          
          </div>
        
        
        </div>
        <div id="wylogowywanie"><input
            type="button"
            value="wyloguj  się"
            id="zakladka3"
            onClick={() => zmianaZakladki("Rejestrowanie")}
          /></div>
          </div>
      </main>
    )
  }

  function rejestrowanie() {
    return (
      <>
        <main id="logowanie">
          <h1>Witaj w komunikatorze!</h1>
          <h3>Zarejestruj się</h3>

          <label>
            <p>Wpisz swoją nazwę</p>
            <input type="text" placeholder="Nazwa użytkownika" />
          </label>

          <br />

          <label>
            <p>Wpisz swoje hasło</p>
            <input type="password" placeholder="Hasło" />
          </label>

          <br />
          <br />

        

          <input
            type="button"
            value="rejestracja"
            id="zakladka1"
            onClick={() => zmianaZakladki("Komunikator")}
          />
  <p>Masz już konto?</p>
          <input
            type="button"
            value="zaloguj sie"
            id="zakladka2"
            onClick={() => zmianaZakladki("Logowanie")}
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
    )
  }

  const zakladki = {
    Logowanie: logowanie,
    Komunikator: komunikator,
    Rejestrowanie: rejestrowanie,
  }

  const AktywnaZakladka = zakladki[zakladka]

  return (
    <div className="kontener">
      <br />
      <AktywnaZakladka />
    </div>
  )
}
