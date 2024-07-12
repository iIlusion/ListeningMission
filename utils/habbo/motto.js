import { ext } from "../../index.js";
import { HPacket, HDirection } from "gnode-api";

export function getMotto() {
    let infoPacket = new HPacket("{out:InfoRetrieve}");
    ext.sendToServer(infoPacket);
  }
  
export function setMotto(motto) {
    let mottoPacket = new HPacket('ChangeMotto', HDirection.TOSERVER)
      .appendString(motto, 'utf-8')
    ext.sendToServer(mottoPacket);
  }
  