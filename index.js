import { Extension, HPacket, HDirection } from 'gnode-api'
import processlist from 'node-processlist';
import {default as config} from './config.json'
let spotifyPID;
let oldMusic;

const extensionInfo = {
    name: 'Listening Motto',
    description: 'Display current spotify music you listening in your motto.',
    version: '0.1.3',
    author: 'Lx'
}

const ext = new Extension(extensionInfo)

process
  .on('unhandledRejection', (reason, p) => {
    ext.writeToConsole(`${reason.toString()} Unhandled Rejection at Promise ${p.toString()}`);
  })
  .on('uncaughtException', err => {
    ext.writeToConsole(`${err.toString()} Uncaught Exception thrown`);
  });
  
ext.run();


ext.on('start', async () =>{
    async function ListeningMotto() {
        let customHeaderId = config.header
        let packetInfo;

        if(ext.getPacketInfoManager()) packetInfo = ext.getPacketInfoManager().getPacketInfoFromName(HDirection.TOSERVER, 'ChangeMotto');


        const spotify = await getSpotify()
        if (!spotify) return
        
        const music = await getMusic()
        if (oldMusic && oldMusic === music) return
        oldMusic = music

        let mottoPacket = new HPacket(`{l}{h:${packetInfo ? packetInfo.getHeaderId() : customHeaderId}}{s:"${config.listening}: ${music}"}`);
        ext.sendToServer(mottoPacket)
        
    }
    setInterval(() => ListeningMotto(), 1000);
    
})

async function getSpotify() {
    const spotifyProcesses = await processlist.getProcessesByName('Spotify.exe', {verbose: true})
    const spotifyWindow = spotifyProcesses.find(process => process.windowTitle !== 'N/A' && process.windowTitle !== 'AngleHiddenWindow')
    spotifyPID = spotifyWindow.pid
    return spotifyWindow
}

async function getMusic() {
    let music
    const spotifyProcess = await processlist.getProcessById(spotifyPID, {verbose: true})
    if (spotifyProcess.windowTitle.startsWith('Spotify')) music = 'Nothing'
    else if (spotifyProcess.windowTitle === 'Advertisement') music = 'AD'
    else music = spotifyProcess.windowTitle

    return music
}   
