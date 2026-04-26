import { db } from '../firebaseConfig';
import { 
  collection, 
  addDoc, 
  updateDoc, 
  doc, 
  serverTimestamp,
  increment 
} from 'firebase/firestore';
import { fetchRandomProduct } from './GameController';

export async function createSession(name: string, creatorUid: string, creatorName: string) {
  const sessionData = {
    name: name,
    status: "waiting",
    players: {
      [creatorUid]: { id: creatorUid, codename: creatorName, score: 0 }
    },
    currentRound: 1,
    correctPrice: null,
    productName: "",
    productImage: "",
    createdBy: creatorUid,
    createdAt: serverTimestamp()
  };

  const docRef = await addDoc(collection(db, "sessions"), sessionData);
  return docRef.id;
}

export async function joinSession(sessionId: string, userUid: string, codename: string) {
  const sessionRef = doc(db, "sessions", sessionId);
  await updateDoc(sessionRef, {
    [`players.${userUid}`]: { id: userUid, codename: codename, score: 0 }
  });
}

export async function startGame(sessionId: string) {
  const product = await fetchRandomProduct();
  const sessionRef = doc(db, "sessions", sessionId);
  await updateDoc(sessionRef, {
    status: "playing",
    productName: product.title,
    productImage: product.thumbnail,
    correctPrice: product.price,
    currentRound: 1
  });
}

export async function nextRound(sessionId: string, players: Record<string, any>) {
  const product = await fetchRandomProduct();
  const sessionRef = doc(db, "sessions", sessionId);
  
  // Nollataan arvaukset kaikilta pelaajilta uutta kierrosta varten
  const resetPlayers = { ...players };
  Object.keys(resetPlayers).forEach(uid => {
    // Firestoressa kentän poisto tai nollaus
    resetPlayers[uid].guess = null; 
  });

  await updateDoc(sessionRef, {
    status: "playing",
    productName: product.title,
    productImage: product.thumbnail,
    correctPrice: product.price,
    players: resetPlayers,
    currentRound: increment(1)
  });
}

export async function submitGuess(sessionId: string, userUid: string, guess: number) {
  const sessionRef = doc(db, "sessions", sessionId);
  await updateDoc(sessionRef, {
    [`players.${userUid}.guess`]: guess
  });
}

export async function closeSession(sessionId: string) {
  const sessionRef = doc(db, "sessions", sessionId);
  await updateDoc(sessionRef, { status: "finished" });
}