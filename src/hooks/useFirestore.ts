import { useState, useEffect } from 'react';
import { doc, getDoc, collection, getDocs, query, orderBy, DocumentData } from 'firebase/firestore';
import { db } from '../services/firebase';

export const useFirestoreDoc = (collectionName: string, docId: string) => {
  const [data, setData] = useState<DocumentData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const docRef = doc(db, collectionName, docId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setData(docSnap.data());
        } else {
          setData(null);
        }
      } catch (err) {
        console.error("Error fetching doc:", err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [collectionName, docId]);

  return { data, loading, error };
};

export const useFirestoreCollection = <T = DocumentData>(collectionName: string, orderByField?: string) => {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        let q;
        if (orderByField) {
            q = query(collection(db, collectionName), orderBy(orderByField));
        } else {
            q = collection(db, collectionName);
        }
        
        const querySnapshot = await getDocs(q);
        const items = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...(doc.data() as DocumentData)
        })) as T[];
        setData(items);
      } catch (err) {
        console.error("Error fetching collection:", err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [collectionName, orderByField]);

  return { data, loading, error };
};