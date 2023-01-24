import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [currentUrl, setCurrentUrl] = useState<string | undefined>("");
  const [date, setDate] = useState<string>("");
  const [email, setEmail] = useState<string>("");

  useEffect(() => {
    const queryInfo = { active: true, lastFocusedWindow: true };

    chrome.tabs &&
      chrome.tabs.query(queryInfo, (tabs) => {
        const url = tabs[0].url;
        setCurrentUrl(url);
      });
  }, []);

  const keys = {
    notifications: [{ site: "", id: ""}],
  };
  let db!: IDBDatabase;
  const request = indexedDB.open("data", 1);
  request.onerror = (err) =>
    console.error(`IndexedDB error: ${request.error}`, err);
  request.onsuccess = () => (db = request.result);
  request.onupgradeneeded = () => {
    const db = request.result;
    const notificationsStore = db.createObjectStore("notificationsStore", {
      keyPath: keys.notifications[0].id,
    });
    keys.notifications.forEach((key) =>
      notificationsStore.createIndex(key.id, key.id)
    );
  };

  const addElement = (store: string, payload: object) => {
    const open = indexedDB.open("data");
    open.onsuccess = () => {
      db = open.result;
      if ([...db.objectStoreNames].find((name) => name === store)) {
        const transaction = db.transaction(store, "readwrite");
        const objectStore = transaction.objectStore(store);
        const serialized = JSON.parse(JSON.stringify(payload));
        const request = objectStore.add(serialized);
        request.onerror = () => console.error(request.error);
        transaction.oncomplete = () => db.close();
      } else {
        indexedDB.deleteDatabase("data");
      }
    };
  };

  const saveReminder = () => {
    addElement("notificationsStore", {
      uuid: Math.floor(Math.random() * 10000000) + 1000,
      url: currentUrl,
      email: email,
      reminderDate: new Date(date).toISOString(),
      createdAt: new Date().toISOString(),
      site: new URL(currentUrl!).hostname,
    });
  };
  return (
    <div className="App">
      <h1>Bookmarks Reminder</h1>
      <h2>Current URL: {currentUrl}</h2>
      <input type="date" onChange={(e) => setDate(e.target.value)} />
      <input type="email" placeholder="Enter your email" onChange={(e) => setEmail(e.target.value)}/>
      <button onClick={saveReminder}>Remind Me</button>
    </div>
  );
}

export default App;

// TODO: Add a button to save the bookmark to IndexedDB
// TODO: Add handlers to read the bookmarks from IndexedDB
// TODO: Send notifications through the background script using the Chrome Notifications API
