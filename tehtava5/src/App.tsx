import { useState, useEffect } from 'react';
import './App.css';
import LoginForm from './loginForm';
import { auth, logout } from './authService';
import { onAuthStateChanged, type User } from 'firebase/auth';
import { getOrGenerateCodename } from './codenameService';
import { QuizForm } from './Components/QuizForm';
import { RoundResult } from './Components/RoundResult';
import { createSession, submitGuess, joinSession, startGame, nextRound, closeSession } from './Game';
import { onSnapshot, doc, collection, query, where } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { Session } from './types/Session';

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [codename, setCodename] = useState<string>("");
  const [session, setSession] = useState<Session | null>(null);
  const [availableSessions, setAvailableSessions] = useState<Session[]>([]);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) setCodename(getOrGenerateCodename(firebaseUser.uid));
    });
    return () => unsubscribeAuth();
  }, []);

  useEffect(() => {
    if (!user) return;
    const q = query(collection(db, "sessions"), where("status", "==", "waiting"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setAvailableSessions(snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Session)));
    });
    return () => unsubscribe();
  }, [user]);

  useEffect(() => {
    if (!session?.id) return;
    const unsubscribeSession = onSnapshot(doc(db, "sessions", session.id), (docSnap) => {
      if (docSnap.exists()) {
        setSession({ id: docSnap.id, ...docSnap.data() } as Session);
      }
    });
    return () => unsubscribeSession();
  }, [session?.id]);

  const handleCreateGame = async () => {
    if (user) {
      const id = await createSession(`${codename}n peli`, user.uid, codename);
      setSession({ id } as Session);
    }
  };

  const handleJoinGame = async (sessionId: string) => {
    if (user) {
      await joinSession(sessionId, user.uid, codename);
      setSession({ id: sessionId } as Session);
    }
  };

  const handleExitGame = async () => {
    if (session?.id && session.createdBy === user?.uid) {
      await closeSession(session.id);
    }
    setSession(null);
  };

  const handleLogout = async () => {
    if (session?.id && session.createdBy === user?.uid) {
      await closeSession(session.id);
    }
    logout();
    setSession(null);
  };

  const allPlayersGuessed = () => {
    if (!session || !session.players) return false;
    const playersArr = Object.values(session.players);
    return playersArr.length >= 1 && playersArr.every((p: any) => p.guess !== undefined && p.guess !== null);
  };

  return (
    <div className="main-wrapper">
      <header className="game-header">
        <h1>Hintavisa 💰</h1>
        {user && (
          <div className="user-info">
            <span>Pelaaja: <strong>{codename}</strong></span>
            <button className="logout-btn" onClick={handleLogout}>Kirjaudu ulos</button>
          </div>
          
        )}
      </header>

      {!user ? (
        <LoginForm />
      ) : !session?.id ? (
        <div className="lobby-selection card">
          <button onClick={handleCreateGame} className="create-btn">Luo uusi peli</button>
          
          <div className="available-list">
            <h3>Avoimet pelit:</h3>
            {availableSessions.length === 0 ? <p>Ei avoimia pelejä. Luo uusi!</p> : 
              availableSessions.map(s => (
                <div key={s.id} className="session-item">
                  <span>{s.name}</span>
                  <button onClick={() => handleJoinGame(s.id)}>Liity</button>
                </div>
              ))
            }
          </div>
        </div>
      ) : (
       
        <div className="game-area">
          <div className="status-bar">Erä {session.currentRound || 1} / 5 | {session.name}</div>
          
          {session.status === "waiting" && (
            <div className="card waiting-room">
              <p>Odotetaan pelaajia... ({Object.keys(session.players || {}).length})</p>
              {session.createdBy === user.uid ? (
                <button className="start-btn" onClick={() => startGame(session.id)}>Aloita peli 🚀</button>
              ) : (
                <p>Odotetaan, että pelin luoja aloittaa...</p>
              )}
            </div>
          )}

          {session.status === "playing" && (
            <div className="play-section">
              {!allPlayersGuessed() ? (
               
                session.players[user.uid]?.guess !== undefined && session.players[user.uid]?.guess !== null ? (
                  <div className="card"><h3>Arvaus lähetetty! Odotetaan muita... ⏳</h3></div>
                ) : (
                  <QuizForm 
                    productName={session.productName}
                    productImage={session.productImage}
                    currentUserId={codename}
                    onSubmitGuess={(guess) => submitGuess(session.id, user.uid, guess)}
                  />
                )
              ) : (
              
                <div className="card result-card">
                  <RoundResult 
                    players={Object.values(session.players)} 
                    correctPrice={session.correctPrice!} 
                  />
                  
                  <div className="round-controls" style={{ marginTop: '20px' }}>
                    {(session.currentRound || 1) < 5 ? (
                    
                      session.createdBy === user.uid ? (
                        <button className="next-btn" onClick={() => nextRound(session.id, session.players)}>
                          Seuraava kierros ➡️
                        </button>
                      ) : (
                        <p>Luoja aloittaa pian uuden kierroksen...</p>
                      )
                    ) : (
              
                      <div className="final-screen">
                        <h2 style={{color: 'var(--secondary)'}}>Peli ohi! 🎉</h2>
                        <button className="create-btn" onClick={handleExitGame}>
                          Palaa aulaan
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default App;