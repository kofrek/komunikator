import zdj1 from '/src/assets/galak pizza.webp'
import './App.css'

function App() {
  return (
    <>
      <main className="logowanie">
        <h1>Witaj w komunikatorze!</h1>

        <label>
          Wpisz swoją nazwę
          <input type="text" placeholder="Nazwa użytkownika" />
        </label>

        <br />

        <label>
          Wpisz swoje hasło
          <input type="password" placeholder="Hasło" />
        </label>

        <br />

        <input type="button" value="Potwierdź" />

        <h3>s</h3>
      </main>

      <div className="boczny">
        <a href="https://galakpizza.pl/" target="_blank"><img src={zdj1} alt="galak pizza" /> </a>

      </div>
    </>
  )
}

export default App

