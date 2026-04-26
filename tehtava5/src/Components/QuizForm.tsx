import { useState } from 'react';

interface QuizFormProps {
  productName: string;
  productImage: string;
  currentUserId: string;
  onSubmitGuess: (guess: number) => void;
}

export function QuizForm({ productName, productImage, currentUserId, onSubmitGuess }: QuizFormProps) {
  const [guess, setGuess] = useState("");

  return (
    <div className="quiz-card">
      <h2>Mitä tämä maksaa?</h2>
      <img src={productImage} alt={productName} style={{ width: '200px' }} />
      <p><strong>{productName}</strong></p>
      
      <form onSubmit={e => {
        e.preventDefault();
        onSubmitGuess(Number(guess));
      }}>
        <input 
          type="number" 
          value={guess} 
          onChange={e => setGuess(e.target.value)} 
          placeholder="Arvauksesi (€)" 
          required 
        />
        <button type="submit">Lähetä arvaus ({currentUserId})</button>
      </form>
    </div>
  );
}