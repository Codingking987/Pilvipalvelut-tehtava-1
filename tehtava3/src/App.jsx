import { useState } from 'react'
import './App.css'

function App() {
  const [koodinimi, setKoodinimi] = useState('Klikkaa nappia!');

  const adjektiivit = ['Vihreä', 'Nopea', 'Salainen', 'Kyber', 'Pohjoinen', 'Loistava'];
  const substantiivit = ['Kettu', 'Susi', 'Haukka', 'Koodari', 'Pilvi', 'Bitti'];

  const generoiNimi = () => {
    const adj = adjektiivit[Math.floor(Math.random() * adjektiivit.length)];
    const sub = substantiivit[Math.floor(Math.random() * substantiivit.length)];
    setKoodinimi(`${adj} ${sub}`);
  };

  return (
    <div className="container">
      <h1>Koodinimi-generaattori</h1>
      <div className="display">
        <h2>{koodinimi}</h2>
      </div>
      <button onClick={generoiNimi} className="generate-btn">
        Generoi uusi nimi
      </button>
    </div>
  )
}

export default App