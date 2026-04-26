import { Player } from "../types/Player";

interface RoundResultProps {
  players: Player[];
  correctPrice: number;
}

export function RoundResult({ players, correctPrice }: RoundResultProps) {
  // Järjestetään pelaajat niin, että lähimpänä oleva on ensin
  const sortedPlayers = [...players].sort((a, b) => {
    const diffA = Math.abs((a.guess || 0) - correctPrice);
    const diffB = Math.abs((b.guess || 0) - correctPrice);
    return diffA - diffB;
  });

  return (
    <div className="round-result">
      <h3>Kierroksen tulos</h3>
      <p className="correct-price-highlight">
        Oikea hinta oli: <strong>{correctPrice} €</strong>
      </p>

      <table className="result-table">
        <thead>
          <tr>
            <th>Pelaaja</th>
           </tr>
        </thead>
        <tbody>
          {sortedPlayers.map((p) => {
            const diff = p.guess !== undefined ? Math.abs(p.guess - correctPrice) : "---";
            return (
              <li key={p.id} className="result-item">
                <span className="player-name">{p.codename}:</span>
                <span className="player-guess"> {p.guess ?? 'Ei arvausta'} €</span>
                <span className="player-diff">(ero: {typeof diff === 'number' ? diff.toFixed(2) : diff} €)</span>
              </li>
            );
          })}
        </tbody>
      </table>
      
      <div style={{ marginTop: '20px' }}>
        <p>Voittaja: <strong>{sortedPlayers[0]?.codename}</strong>!</p>
      </div>
    </div>
  );
}

export default RoundResult;