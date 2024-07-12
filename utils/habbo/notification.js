import { ext } from "../../index.js";
import { HPacket, HDirection } from "gnode-api";

export function createNotification(text) {
    let messagePacket = new HPacket('NotificationDialog', HDirection.TOCLIENT)
      .appendString("")
      .appendInt(3)
      .appendString("display")
      .appendString("BUBBLE")
      .appendString("message")
      .appendString(text, 'utf-8')
      .appendString("image")
      .appendString("https://raw.githubusercontent.com/sirjonasxx/G-ExtensionStore/repo/1.5.1/store/extensions/ListeningMotto/icon.png")
  
    ext.sendToClient(messagePacket);
  }