import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [codename, setCodename] = useState('');

  // 3.3. Koodinimen generointi -funktio
  const generateCodename = () => {
    const adjectives = ["Sneaky", "Electric", "Silent", "Hyper", "Cosmic"];
    const animals = ["Fox", "Panda", "Lizard", "Dragon", "Hawk"];
    const number = Math.floor(Math.random() * 3000);

    const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
    const animal = animals[Math.floor(Math.random() * animals.length)];

    return `${adj}${animal}${number}`;
  };

  // 3.2. & 3.4. Toiminnallisuus: Haku ja tallennus
  useEffect(() => {
    // Haetaan aiemmin luotu nimi
    const cachedName = localStorage.getItem("codename");

    if (cachedName) {
      // Jos löytyi, käytetään sitä
      setCodename(cachedName);
    } else {
      // Jos ei löydy, generoidaan uusi ja tallennetaan se heti
      const newName = generateCodename();
      setCodename(newName);
      localStorage.setItem("codename", newName);
    }
  }, []);

  // Toiminto nimen vaihtamiseen (jos käyttäjä haluaa generoida uuden)
  const handleNewName = () => {
    const newName = generateCodename();
    setCodename(newName);
    localStorage.setItem("codename", newName);
  };

  return (
    <div className="container">
      <h1>Koodinimi-sovellus</h1>
      
      <div className="display-card">
        <p>Tervetuloa takaisin! Sinun koodinimesi on:</p>
        <h2 className="codename">{codename}</h2>
      </div>

      <button onClick={handleNewName} className="btn-primary">
        Generoi uusi koodinimi
      </button>

      <p className="footer-info">
        Nimi on tallennettu selaimesi Local Storageen.
      </p>
    </div>
  )
}

export default App