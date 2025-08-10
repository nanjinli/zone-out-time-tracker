import { auth, db } from '@/firebaseConfig';
import { onAuthStateChanged } from 'firebase/auth';
import { addDoc, collection, doc, getDoc, getDocs, query, setDoc } from 'firebase/firestore';
import React, { createContext, ReactNode, useContext, useEffect, useRef, useState } from 'react';

// --- Interfaces (Data Shapes) ---
export interface ActivityTimer { activity: string; time: number; isRunning: boolean; }
export interface CompletedSession { id: string; name: string; activity: string; duration: number; notes: string; date: string; earnings: number; }

interface TimerContextData {
  timers: ActivityTimer[];
  completedSessions: CompletedSession[];
  currentTimer: ActivityTimer | undefined;
  hourlyRate: number;
  setHourlyRate: (rate: number) => void;
  selectActivity: (activity: string) => void;
  resumeTimer: () => void;
  pauseTimer: () => void;
  saveSession: (sessionData: Omit<CompletedSession, 'id' | 'date' | 'earnings'>) => void;
  calculateEarnings: (duration: number) => number;
  getTotalEarnings: () => number;
}

// --- The Context Provider ---
const TimerContext = createContext<TimerContextData>({} as TimerContextData);

export const TimerProvider = ({ children }: { children: ReactNode }) => {
  const [timers, setTimers] = useState<ActivityTimer[]>([]);
  const [completedSessions, setCompletedSessions] = useState<CompletedSession[]>([]);
  const [currentActivity, setCurrentActivity] = useState<string | null>(null);
  const [hourlyRate, setHourlyRate] = useState<number>(100); // Default hourly rate
  const animationFrameRef = useRef<number | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  // Listen for auth state changes to get userId
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUserId(user ? user.uid : null);
    });
    return unsubscribe;
  }, []);

  // Load sessions and hourlyRate from Firestore on login
  useEffect(() => {
    if (!userId) return;
    const fetchData = async () => {
      // Load hourlyRate
      const userDoc = await getDoc(doc(db, 'users', userId));
      if (userDoc.exists()) {
        const data = userDoc.data();
        if (data.hourlyRate) setHourlyRate(data.hourlyRate);
      }
      // Load completedSessions
      const q = query(collection(db, 'users', userId, 'sessions'));
      const querySnapshot = await getDocs(q);
      const sessions: CompletedSession[] = [];
      querySnapshot.forEach((docSnap) => {
        sessions.push(docSnap.data() as CompletedSession);
      });
      setCompletedSessions(sessions);
    };
    fetchData();
  }, [userId]);

  // Optimized timer loop using requestAnimationFrame
  useEffect(() => {
    let lastUpdate = Date.now();
    
    const updateTimer = () => {
      const now = Date.now();
      const deltaTime = now - lastUpdate;
      
      // Only update if at least 1000ms (1 second) have passed
      if (deltaTime >= 1000) {
        setTimers(prevTimers => {
          let hasChanges = false;
          const updatedTimers = prevTimers.map(timer => {
            if (timer.isRunning) {
              // Increment by 1 second every 1000ms
              const newTime = timer.time + 1;
              if (newTime !== timer.time) {
                hasChanges = true;
                return { ...timer, time: newTime };
              }
            }
            return timer;
          });
          
          return hasChanges ? updatedTimers : prevTimers;
        });
        lastUpdate = now;
      }
      
      animationFrameRef.current = requestAnimationFrame(updateTimer);
    };
    
    animationFrameRef.current = requestAnimationFrame(updateTimer);
    
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  const selectActivity = (activity: string) => {
    // Prevent selecting the same activity multiple times rapidly
    if (currentActivity === activity) {
      return; // Already selected, do nothing
    }
    
    setCurrentActivity(activity);
    // Create a new timer only if one doesn't already exist for this activity
    setTimers(prev => {
      // Clean up any existing timers for this activity first
      const filtered = prev.filter(t => t.activity !== activity);
      
      // Create new timer
      return [...filtered, { 
        activity, 
        time: 0, 
        isRunning: false // Don't start immediately
      }];
    });
  };

  const resumeTimer = () => {
    if (!currentActivity) return;
    setTimers(prev => prev.map(t => {
      if (t.activity === currentActivity) {
        // Simply resume the timer from where it left off
        return { ...t, isRunning: true };
      }
      return t;
    }));
  };

  const pauseTimer = () => {
    if (!currentActivity) return;
    setTimers(prev => prev.map(t => {
      if (t.activity === currentActivity) {
        return { ...t, isRunning: false };
      }
      return t;
    }));
  };

  const calculateEarnings = (duration: number): number => {
    const hours = duration / 3600;
    return Math.round(hours * hourlyRate * 100) / 100;
  };

  const getTotalEarnings = (): number => {
    return completedSessions.reduce((total, session) => total + session.earnings, 0);
  };

  // Update setHourlyRate to persist to Firestore
  const setHourlyRateAndPersist = (rate: number) => {
    setHourlyRate(rate);
    if (userId) {
      setDoc(doc(db, 'users', userId), { hourlyRate: rate }, { merge: true });
    }
  };

  // Update saveSession to persist to Firestore
  const saveSession = (sessionData: Omit<CompletedSession, 'id' | 'date' | 'earnings'>) => {
    const earnings = calculateEarnings(sessionData.duration);
    const newSession: CompletedSession = {
      ...sessionData,
      id: new Date().toISOString() + Math.random(),
      date: new Date().toISOString(),
      earnings,
    };
    setCompletedSessions(prev => [newSession, ...prev]);
    if (userId) {
      addDoc(collection(db, 'users', userId, 'sessions'), newSession);
    }
    // Clean up: remove the timer and deselect the activity
    setTimers(prev => prev.filter(t => t.activity !== sessionData.activity));
    setCurrentActivity(null);
  };

  const currentTimer = timers.find(t => t.activity === currentActivity);

  return (
    <TimerContext.Provider value={{
      timers,
      completedSessions,
      currentTimer,
      hourlyRate,
      setHourlyRate: setHourlyRateAndPersist,
      selectActivity,
      resumeTimer,
      pauseTimer,
      saveSession,
      calculateEarnings,
      getTotalEarnings,
    }}>
      {children}
    </TimerContext.Provider>
  );
};

// --- The Helper Hook ---
export const useTimer = () => {
  return useContext(TimerContext);
};

