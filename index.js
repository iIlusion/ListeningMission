const { Extension, HPacket, HDirection } = require('gnode-api');
var processWindows = require("node-process-windows");

const extensionInfo = {
    name: 'Listening Mission',
    description: 'Display current spotify music you listening in your mission.',
    version: '0.1',
    author: 'Lx'
}

const ext = new Extension(extensionInfo);
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
    async function setMusicMission() {
    var config = require("./config.json")
    let customHeaderId = config.header
    let packetInfo;
    if(ext.getPacketInfoManager()) {
    packetInfo = ext.getPacketInfoManager().getAllPacketInfoFromName(HDirection.TOSERVER, 'ChangeMotto');
    }
    let music = await getMusicName();
    if (music === undefined) music = config.notHaveMusic
    if (oldMusic && oldMusic === music) return
    oldMusic = music
    let missionPacket = new HPacket(`{l}{h:${packetInfo ? packetInfo.getHeaderId() : customHeaderId}}{s:"${config.listening}: ${music}"}`);
    ext.sendToServer(missionPacket);
    }
    setMusicMission()
    setInterval(() => setMusicMission(), 1000);
});



