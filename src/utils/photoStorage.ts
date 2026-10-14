/**
 * Robust IndexedDB storage for team member photos to bypass localStorage 5MB limit
 */

const DB_NAME = 'CardiologyHubDB';
const STORE_NAME = 'team_photos';
const DB_VERSION = 1;

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      reject(new Error('IndexedDB not supported'));
      return;
    }
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function savePhoto(memberId: string, dataUrl: string): Promise<void> {
  try {
    const db = await openDB();
    const tx = db.transaction(STORE_NAME, 'readwrite');
    tx.objectStore(STORE_NAME).put(dataUrl, memberId);
    return new Promise((resolve, reject) => {
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  } catch (err) {
    console.error('Failed to save photo to IndexedDB, fallback to localStorage', err);
    try {
      localStorage.setItem(`cardiology_photo_${memberId}`, dataUrl);
    } catch (e) {
      // Ignore
    }
  }
}

export async function getPhotos(): Promise<Record<string, string>> {
  try {
    const db = await openDB();
    const tx = db.transaction(STORE_NAME, 'readonly');
    const store = tx.objectStore(STORE_NAME);
    const getAllKeysReq = store.getAllKeys();

    return new Promise((resolve) => {
      getAllKeysReq.onsuccess = () => {
        const keys = getAllKeysReq.result as string[];
        const results: Record<string, string> = {};
        if (keys.length === 0) {
          // Check localStorage fallback
          ['valensya', 'barbie', 'brilliana', 'brendon', 'nath', 'cayley'].forEach((k) => {
            const v = localStorage.getItem(`cardiology_photo_${k}`);
            if (v) results[k] = v;
          });
          resolve(results);
          return;
        }

        let completed = 0;
        keys.forEach((key) => {
          const getReq = store.get(key);
          getReq.onsuccess = () => {
            if (getReq.result) {
              results[key] = getReq.result as string;
            }
            completed++;
            if (completed === keys.length) {
              resolve(results);
            }
          };
          getReq.onerror = () => {
            completed++;
            if (completed === keys.length) resolve(results);
          };
        });
      };
      getAllKeysReq.onerror = () => resolve({});
    });
  } catch (err) {
    const results: Record<string, string> = {};
    ['valensya', 'barbie', 'brilliana', 'brendon', 'nath', 'cayley'].forEach((k) => {
      const v = localStorage.getItem(`cardiology_photo_${k}`);
      if (v) results[k] = v;
    });
    return results;
  }
}
