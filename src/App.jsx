import zdj1 from '/src/assets/galak pizza.webp'
import './App.css'


export default function App() {
  const [zakladka, zmianaZakladki] = useState("Logowanie");
  const [ilosc, zmianaIlosci] = useState(0);


function logowanie() {
  return (
    <>
      <main className="logowanie">
        <h1>Witaj w komunikatorze!</h1>
<h3>zaloguj sie czarnuchu!</h3>
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
        <br />

      <p>niepamietasz hasła?</p><a href="https://www.facebook.com/r.php/" target="_blank"><p>zarejestruj sie</p></a>

        <input type="button" value="zaloguj sie " id="zakladka1" onClick={() => zmianaZakladki("komunikator")}></input>/

        
      </main>

      <div className="boczny">
        <a href="https://galakpizza.pl/" target="_blank"><img src={zdj1} alt="galak pizza" /> </a>

      </div>
    </>
  )
}
function komunikator(){
  return(
    <>
    <main id="komunikator">
      <h1>strona w budowie</h1>
    </main>
    
    </>
  )





}



 const zakladki = {
    Logowanie:  logowanie,
  
  };

  const AktywnaZakladka = zakladki[zakladka];

  return (
    <center>
      <Opcje />
      <br />
      <AktywnaZakladka />
    </center>
  );
}