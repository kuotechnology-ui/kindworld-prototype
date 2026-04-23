import {
  collection,
  doc,
  getDocs,
  setDoc,
  deleteDoc,
  onSnapshot,
  writeBatch,
  query,
  Unsubscribe
} from 'firebase/firestore'
import { db } from './firebase'

// Collection names
export const COLLECTIONS = {
  USERS: 'users',
  MISSIONS: 'missions',
  REGISTRATIONS: 'registrations',
  HOUR_SUBMISSIONS: 'hourSubmissions',
  DIRECT_MESSAGES: 'directMessages',
  CERT_REQUESTS: 'certRequests',
  NGO_MESSAGES: 'ngoMessages',
  ACTIVITY_FEED: 'activityFeed',
  FRIEND_REQUESTS: 'friendRequests',
  FRIENDSHIPS: 'friendships',
  FRIEND_MESSAGES: 'friendMessages'
}

// ── Generic helpers ──────────────────────────────────────────────────────────

export async function fetchCollection<T>(col: string): Promise<T[]> {
  const snap = await getDocs(collection(db, col))
  return snap.docs.map(d => ({ ...d.data(), _docId: d.id } as unknown as T))
}

export async function saveDocument(col: string, id: string, data: object): Promise<void> {
  const clean = JSON.parse(JSON.stringify(data)) // strip undefined
  await setDoc(doc(db, col, String(id)), clean, { merge: true })
}

export async function deleteDocument(col: string, id: string): Promise<void> {
  await deleteDoc(doc(db, col, String(id)))
}

// Write an entire array to a collection (batch upsert by id/email)
export async function syncArrayToFirestore(col: string, items: any[], idField: string = 'id'): Promise<void> {
  const batch = writeBatch(db)
  items.forEach(item => {
    const key = String(item[idField] ?? item.email ?? item.id ?? Math.random())
    const ref = doc(db, col, key)
    batch.set(ref, JSON.parse(JSON.stringify(item)), { merge: true })
  })
  await batch.commit()
}

// ── Real-time listeners ──────────────────────────────────────────────────────

export function subscribeToCollection<T>(
  col: string,
  onChange: (items: T[]) => void,
  onError?: (err: Error) => void
): Unsubscribe {
  return onSnapshot(
    query(collection(db, col)),
    snap => {
      const items = snap.docs.map(d => ({ ...d.data(), _docId: d.id } as unknown as T))
      onChange(items)
    },
    err => {
      console.error(`Firestore subscription error [${col}]:`, err)
      onError?.(err)
    }
  )
}
