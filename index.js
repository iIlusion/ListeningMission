const { Extension, HPacket, HDirection } = require('gnode-api');
var processWindows = require("node-process-windows");

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

ext.on('start', async () => {
    let oldMusic;
    function getMusicName () {
        return new Promise((resolve, reject) => {
            processWindows.getProcesses(function(err, processes) {
                if (err) {
                    reject(err);
                    return;
                }
                const found = processes.find(p => {
                    return p.processName === 'Spotify' && p.mainWindowTitle && p.mainWindowTitle !== 'Spotify Free' && p.mainWindowTitle !== 'Spotify Premium';
                });
                if (found) {
                    resolve(found.mainWindowTitle);
                } else {
                    resolve();
                }
            });
        });
    }
    async function setMusicMotto() {
    var config = require("./config.json")
    let customHeaderId = config.header
    let packetInfo;
    if(ext.getPacketInfoManager()) {
    packetInfo = ext.getPacketInfoManager().getPacketInfoFromName(HDirection.TOSERVER, 'ChangeMotto');
    }
    let music = await getMusicName();
    if (music === undefined) music = config.notHaveMusic
    if (oldMusic && oldMusic === music) return
    oldMusic = music
    let motoPacket = new HPacket(`{l}{h:${packetInfo ? packetInfo.getHeaderId() : customHeaderId}}{s:"${config.listening}: ${music}"}`);
    ext.sendToServer(motoPacket);
    }
    setMusicMotto()
    setInterval(() => setMusicMotto(), 1000);
});
