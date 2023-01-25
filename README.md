# bookmarks-reminder
I saw an interesting article on a Monday, I wanted to read through and take some notes, so I bookmarked it and promised myself I would read it that Wednesday. 4 months later, I idly open my bookmarks tab and I see the link to that article. Crap! I forgot about this. This is to help me reduce the ``Crap! I forgot about this`` moments.

## Getting Started
You will need to install [Vite](https://vitejs.dev/) if you don't have it already

``` yarn install ``` or ``` npm install ```

``` yarn run build ``` or ``` npm run build ```

> The build command generates a /dist directory and this is the directory that is deployed as the Chrome Extension

## Loading the Chrome Extension

Once the /dist directory is generated,

 - Open [Manage Extensions](chrome://extensions/) under the extensions tab

 - Turn on ``Developer Mode`` on the top right.

 - Click `` Load unpacked `` and upload the /dist folder

 - Viola! :tada: The extension is ready.

 > When you make any changes to the code, make sure you run the build step and refresh the extension. < Working on a better build step (Maybe HMR even)>


### Task List
- [x] Build the UI, a simple popup with a form. (Needs better styling, Tailwind?)
- [x] Store Notification data in IndexedDB
- [ ] Run Background script that reads IndexedDB and creates alarms
- [ ] Better Documentation 

### Out of Scope

- [ ] Rethink the data storage and logic (Supabase and Edge Functions for "out-of-chrome" notifications)


### Current Implementation (Crude)

``` mermaid
sequenceDiagram

PopUp (React) ->> IndexedDB: Notification Data

Background Script ->> IndexedDB: Read Data and create alarms

```





