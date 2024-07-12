import { HDirection, HPacket } from "gnode-api";
import { ext } from "../../index.js";

export function sendMessage(message) { 
  let messagePacket = new HPacket('Chat', HDirection.TOSERVER)
  .appendString(message)
  .appendInt(1007)
  .appendInt(0)

  console.log(messagePacket)

  ext.sendToServer(messagePacket);
}