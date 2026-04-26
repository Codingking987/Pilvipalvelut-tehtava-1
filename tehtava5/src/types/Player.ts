export interface Player {
  id: string;       // Firebase UID
  codename: string; // Koodinimi
  guess?: number;   // Tämän kierroksen arvaus
  score: number;    // Kokonaispisteet
}