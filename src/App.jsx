import zdj1 from '/src/assets/galak pizza.webp'
import './App.css'

function App() {
  return (
    <>
      <main className="logowanie">
        <h1>Witaj w komunikatorze!</h1>

        <label>
        <p>  Wpisz swoją nazwę</p>
          <input type="text" placeholder="Nazwa użytkownika" />
        </label>

        <br />

        <label>
  <p>        Wpisz swoje hasło</p>
          <input type="password" placeholder="Hasło" />
        </label>

        <br />

        <input type="button" value="Potwierdź" />

        
      </main>

      <div className="boczny">
        <a href="https://galakpizza.pl/" target="_blank"><img src={zdj1} alt="galak pizza" /> </a>

      </div>
    </>
  )
}

export default App

