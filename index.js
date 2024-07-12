import { Extension, HPacket, HDirection } from "gnode-api";
import { setMotto, getMotto, createNotification, getMusic, getSpotify, sendMessage, formatListeningText } from "./utils/index.js";

let oldMusic, oldMotto
let announce = false
let enabled = false;

export const listeningText = "Listening"
export const noMusicText = "Nothing"

const extensionInfo = {
  name: "Listening Motto",
  description: "Display current spotify music you listening in your motto.",
  version: "2.0",
  author: "Lxx",
};

let spotify
export let spotifyPID
export const ext = new Extension(extensionInfo);

process
  .on("unhandledRejection", (reason, p) => {
    ext.writeToConsole(
      `${reason.toString()} Unhandled Rejection at Promise ${p.toString()}`
    );
  })
  .on("uncaughtException", (err) => {
    ext.writeToConsole(`${err.toString()} Uncaught Exception thrown`);
  });

ext.run();

ext.interceptByNameOrHash(HDirection.TOCLIENT, "UserObject", (hMessage) => {
  let hPacket = hMessage.getPacket();
  oldMotto = hPacket.read("iSSSS")[4];
});

ext.interceptByNameOrHash(HDirection.TOSERVER, "Chat", (hMessage) => {
  let hPacket = hMessage.getPacket();
  let message = hPacket.readString();

  if (message.startsWith("!")) {
    hMessage.blocked = true

    if (message.startsWith("!announce")) {
      announce = !announce
      createNotification(`You turned announce ${announce ? "On" : "Off"}`)
    }
  }
});

ext.on("click", async () => {
  if (!enabled) {
    enabled = true;
    getMotto();
    setInterval(() => ListeningMotto(), 1000);
    createNotification("Started ListeningMotto successfully!");
  } else {
    enabled = false;
    
    clearInterval(ListeningMotto());
    clearInterval(checkSpotify());

    setMotto(oldMotto);

    createNotification(`Restored Motto to old motto: ${oldMotto}`)
    createNotification("Stopped ListeningMotto successfully!");
  }
});

async function ListeningMotto() {
  if (!spotify) {
    spotify = await getSpotify();
    if (spotify) {
      setInterval(() => checkSpotify(), 5000)
    }
    return
  }

  spotifyPID = spotify.pid

  const music = await getMusic();
  if (oldMusic && oldMusic === music) return;
  
  oldMusic = music;
  const musicText = formatListeningText(music)
  
  createNotification(`Listening: ${music}`);

  setMotto(`${musicText}`)
  
  if (announce) {
    sendMessage(`Listening: ${music}`)
  }
}

export async function checkSpotify() {
  const spotifyProcess = await getSpotify()
  if (!spotifyProcess) spotify = undefined
  else return
}