import { useEffect, useState } from "react";

function App() {
  const [currentUrl, setCurrentUrl] = useState<string | undefined>("");
  const [date, setDate] = useState<string>("");

  useEffect(() => {
    const queryInfo = { active: true, lastFocusedWindow: true };

    chrome.tabs &&
      chrome.tabs.query(queryInfo, (tabs) => {
        const url = tabs[0].url;
        setCurrentUrl(url);
      });
  }, []);

  const keys = {
    notifications: [{ site: "", id: "" }],
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
      reminderDate: new Date(date).toDateString(),
      createdAt: new Date().toISOString(),
      site: new URL(currentUrl!).hostname,
    });
  };
  return (
    <div
      style={{
        display: "flex",
        flexFlow: "column nowrap",
        alignItems: "center",
        justifyContent: "center",
        padding: "2em",
        height: "auto",
        width: "30em",
        borderRadius: "8px",
      }}
    >
      <h1 style={{ fontSize: "1.2em" }}>Bookmarks Reminder</h1>
      <h2 style={{ fontSize: "1.1em", width: "80%", textAlign: "center" }}>Current URL: {currentUrl}</h2>
      <input
        type="date"
        onChange={(e) => setDate(e.target.value)}
        placeholder="When?"
      />
      <button
        onClick={saveReminder}
        style={{
          height: "auto",
          padding: ".5em",
          backgroundColor: "blue",
          color: "white",
          border: "none",
          borderRadius: "5px",
          marginTop: "1em",
          cursor: "pointer",
        }}
      >
        Remind Me
      </button>
    </div>
  );
}

export default App;

// TODO: Add a button to save the bookmark to IndexedDB
// TODO: Add handlers to read the bookmarks from IndexedDB
// TODO: Send notifications through the background script using the Chrome Notifications API
