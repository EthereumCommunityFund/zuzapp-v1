import NodeRSA from "node-rsa";
import { ITicketData, RSATicketPCD } from "./RSATicketPCD";

export function getTicketData(pcd?: RSATicketPCD): ITicketData {
  let ticketData: ITicketData = {};
  try {
    ticketData = JSON.parse(
      pcd?.proof?.rsaPCD?.claim?.message ?? "{}"
    ) as ITicketData;
  } catch (e) {
    //
  }

  return ticketData;
}

export function getPublicKey(pcd?: RSATicketPCD): NodeRSA | undefined {
  const encodedPublicKey = pcd?.proof?.rsaPCD?.proof?.publicKey;
  if (!encodedPublicKey) {
    return undefined;
  }

  try {
    const key = new NodeRSA(encodedPublicKey, "public");
    return key;
  } catch (e) {
    console.log("failed to deserialize key");
  }

  return undefined;
}

const INVALID_TICKET_QR_CODE_COLOR = "#d3d3d3";

export function getQRCodeColorOverride(pcd: RSATicketPCD): string | undefined {
  const ticketData = getTicketData(pcd);
  if (ticketData.isConsumed || ticketData.isRevoked) {
    return INVALID_TICKET_QR_CODE_COLOR;
  }
  // otherwise, don't override and use default
  return undefined;
}
