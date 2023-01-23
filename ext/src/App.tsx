import { useEffect, useState } from 'react'
import './App.css'

function App() {
const [currentUrl, setCurrentUrl] = useState<string | undefined>('')

useEffect(() => {
  const queryInfo = {active: true, lastFocusedWindow: true};

  chrome.tabs && chrome.tabs.query(queryInfo, tabs => {
    const url = tabs[0].url
    setCurrentUrl(url)
  })
}, [])
  return (
    <div className="App">
      <h1>Bookmarks Reminder</h1>
      <h2>Current URL: {currentUrl}</h2>
      <input type="date"/>
      <input type="email" placeholder='Enter your email'/>
    </div>
  )
}

export default App


// TODO: Add a button to save the bookmark to IndexedDB
// TODO: Add handlers to read the bookmarks from IndexedDB
// TODO: Send notifications through the background script using the Chrome Notifications API
