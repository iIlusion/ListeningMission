import { getProcessesByName } from "node-processlist";

export async function getSpotify() {
    const spotifyProcesses = await getProcessesByName("Spotify.exe", {
      verbose: true,
    });
    const spotifyWindow = spotifyProcesses.find(
      (process) =>
        process.windowTitle !== "N/A" &&
        process.windowTitle !== "AngleHiddenWindow"
    );

    return spotifyWindow;
  }