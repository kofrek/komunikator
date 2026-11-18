import zdj1 from '/src/assets/galak pizza.webp'
import './App.css'
import { useState } from 'react'


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

 <p>niepamietasz hasła?</p>    <input type="button" value="zarejestruj sie " id="zakladka2" onClick={() => zmianaZakladki("Rejestrowanie")}></input>
  <input type="button" value="zaloguj sie " id="zakladka1" onClick={() => zmianaZakladki("Komunikator")}></input>
 </main>
 <div className="boczny">
 <a href="https://galakpizza.pl/" target="_blank"><img src={zdj1} alt="galak pizza" /> </a>
</div>
</>
)
 } function komunikator(){                                                                                                                                                                             return(
 <>
  <main id="komunikator">
<h3>cos</h3>
   
    
</main>
                                                                                                                                                                                            
 </>
)
}
  function rejestrowanie(){                                                                                                                                                                             return(
 <>
  <main id="rejestrowanie">
<h3>cos2</h3>
   
    
</main>
                                                                                                                                                                                            
 </>
)
}
const zakladki = {
 Logowanie:  logowanie,
 Komunikator: komunikator,
Rejestrowanie: rejestrowanie,
                                                                                                                                                                                                         
};
 const AktywnaZakladka = zakladki[zakladka];
return (
<center>

<br />
<AktywnaZakladka />
</center>
);
}
