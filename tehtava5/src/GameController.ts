import { Product } from './types/Product';


export async function fetchRandomProduct(): Promise<Product> {
  try {
    const res = await fetch("https://dummyjson.com/products");
    if (!res.ok) throw new Error("Tuotteiden haku epäonnistui");
    
    const data = await res.json();
    const products = data.products;
    
    // Valitaan satunnainen tuote listasta
    const randomIndex = Math.floor(Math.random() * products.length);
    const product: Product = products[randomIndex];
    
    return product;
  } catch (error) {
    console.error("Virhe tuotteen haussa:", error);
    throw error;
  }
}


export function calculatePoints(guess: number, correct: number): number {
  const difference = Math.abs(guess - correct);
  const points = Math.max(0, 100 - difference);
  return Math.round(points);
}


export function isRoundOver(players: any[]): boolean {
  if (players.length < 2) return false;
  return players.every(p => p.guess !== undefined && p.guess !== null);
}