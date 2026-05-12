import { collection, doc, setDoc, getDocs, deleteDoc, query, where, orderBy, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db, auth } from '../firebase';
import { handleFirestoreError, OperationType } from '../lib/firestoreUtils';
import { BingoItem, VibeMode } from '../types';

export const updateUserSettings = async (theme: string, completedBingosOffset: number = 0) => {
  if (!auth.currentUser) return;
  try {
    const userRef = doc(db, 'users', auth.currentUser.uid);
    const snap = await getDoc(userRef);
    if (!snap.exists()) return;
    
    const currentBingos = snap.data().completedBingos || 0;
    
    await updateDoc(userRef, {
      theme,
      completedBingos: currentBingos + completedBingosOffset
    });
  } catch (err) {
    handleFirestoreError(err, OperationType.UPDATE, 'users');
  }
};

export const saveGridToFirestore = async (mode: VibeMode, title: string, items: BingoItem[]) => {
  if (!auth.currentUser) throw new Error("Must be logged in");
  
  const gridId = `grid_${Date.now()}`;
  try {
    const docRef = doc(db, 'saved_grids', gridId);
    await setDoc(docRef, {
      userId: auth.currentUser.uid,
      mode,
      title,
      items,
      createdAt: serverTimestamp()
    });
    return gridId;
  } catch (err) {
    handleFirestoreError(err, OperationType.CREATE, 'saved_grids');
  }
};

export const getSavedGrids = async () => {
  if (!auth.currentUser) return [];
  
  try {
    const q = query(
      collection(db, 'saved_grids'), 
      where('userId', '==', auth.currentUser.uid)
    );
    const snap = await getDocs(q);
    const data = snap.docs.map(d => ({ id: d.id, ...d.data() } as any));
    return data.sort((a, b) => (b.createdAt?.toMillis?.() || 0) - (a.createdAt?.toMillis?.() || 0));
  } catch (err) {
    handleFirestoreError(err, OperationType.LIST, 'saved_grids');
    return [];
  }
};

export const saveVibeDiaryEntry = async (mode: VibeMode, items: BingoItem[]) => {
  if (!auth.currentUser) throw new Error("Must be logged in");
  
  const diaryId = `diary_${Date.now()}`;
  try {
    const docRef = doc(db, 'vibe_diary', diaryId);
    await setDoc(docRef, {
      userId: auth.currentUser.uid,
      mode,
      items,
      date: new Date().toISOString(),
      createdAt: serverTimestamp()
    });
    return diaryId;
  } catch (err) {
    handleFirestoreError(err, OperationType.CREATE, 'vibe_diary');
  }
};

export const getVibeDiaryEntries = async () => {
  if (!auth.currentUser) return [];
  
  try {
    const q = query(
      collection(db, 'vibe_diary'), 
      where('userId', '==', auth.currentUser.uid)
    );
    const snap = await getDocs(q);
    const data = snap.docs.map(d => ({ id: d.id, ...d.data() } as any));
    return data.sort((a, b) => (b.createdAt?.toMillis?.() || 0) - (a.createdAt?.toMillis?.() || 0));
  } catch (err) {
    handleFirestoreError(err, OperationType.LIST, 'vibe_diary');
    return [];
  }
};
