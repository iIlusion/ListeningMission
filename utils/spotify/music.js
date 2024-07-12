import { getProcessById } from "node-processlist"; 
import { spotifyPID, noMusicText, listeningText } from "../../index.js";

export async function getMusic() {
    let music;
    
    const spotifyProcess = await getProcessById(spotifyPID, {
      verbose: true,
    });

    if (!spotifyProcess) return noMusicText
  
    if (spotifyProcess.windowTitle.startsWith("Spotify"))
        music = noMusicText;
    else if (spotifyProcess.windowTitle === "Advertisement") 
        music = "AD";
    else
        music = spotifyProcess.windowTitle;
  
    return music;
  }

export function formatListeningText(music) {
    const textArray = music.split(" - ")
    const type1 = `${listeningText}: ${music}` // Listening: Artist - Music
    const type2 = `${listeningText}: ${textArray[1]}` // Listening: Music (without Artist)
    if (type1.length <= 38) 
        return type1 
    else if (type2 <= 38)
        return type2
    else if (music.length <= 38)
        return music // Artist - Music (without Listening:)
    else if (textArray[1].length <= 38) 
        return textArray[1] // Music (without Listening and Artist)
    else 
        return music
}