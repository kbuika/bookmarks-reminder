import { ChromeMessage, Sender } from "./src/types"


const messageFromReactApp = (message: ChromeMessage, sender: any, response: (arg0: string) => void) => {
    console.log("Message Received", {message, sender})

    if(sender.id === chrome.runtime.id && message.from === Sender.React && message.message === "Hello"){
        response("Wassup dude")
    }
    
}

/**
 * Fired when a message is sent from either an extension process or a content script.
 */

chrome.runtime.onMessage.addListener(messageFromReactApp);

