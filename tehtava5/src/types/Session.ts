export type SessionStatus = "waiting" | "playing" | "finished";

export interface Session {
  id: string;
  name: string;
  status: SessionStatus;
  players: Record<string, any>; // Tallennetaan muodossa { [uid]: Player }
  currentRound: number;
  correctPrice: number | null;
  productName: string;
  productImage: string;
  createdBy: string;
}