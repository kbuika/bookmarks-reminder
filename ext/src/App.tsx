import { useEffect, useState } from "react";

function App() {
  const [currentUrl, setCurrentUrl] = useState<string | undefined>("");
  const [date, setDate] = useState<string>("");
  const [error, setError] = useState<string | undefined>("");

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

  // save reminder to IndexedDB
  const saveReminder = () => {
    setError("")
    const id = Math.floor(Math.random() * 10000000) + 1000;
    if(!date) {
      setError("Please select a date")
      return
    }
    addElement("notificationsStore", {
      uuid: id,
      url: currentUrl,
      reminderDate: new Date(date).toDateString(),
      createdAt: new Date().toISOString(),
      site: new URL(currentUrl!).hostname,
    });
    // send notification
    chrome.notifications.create(`${id}`, {
      type: "basic",
      iconUrl: "icon128.png",
      title: "BookMark Reminder",
      message: `Your bookmark reminder for ${currentUrl?.slice(
        0,
        20
      )}... is set for ${date}`,
      priority: 2,
      requireInteraction: true,
    });
    window.close(); // close the popup
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
      <h2 style={{ fontSize: "1.1em", width: "80%", textAlign: "center" }}>
        Current URL: {currentUrl}
      </h2>
      <input
        type="date"
        onChange={(e) => setDate(e.target.value)}
        placeholder="When?"
      />
      {(error && !date) && <p style={{fontSize: ".9em", marginTop: ".5em", color: "red"}}>{error}</p>}
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
