export enum PacketKeys {
  JOIN_REQUEST = "PLAYER.JOIN",

  NET_PONG = "NET.PONG",
  NET_PING = "NET.PING",
  NET_REGISTER = "NET.REGISTER",
}

export type JoinPacketType = {
  playerId: string;
  playerName: string;
  posX: number;
  posY: number;
};

export const createJoinPacket = (packet: JoinPacketType) => {
  return {
    ID: PacketKeys.JOIN_REQUEST,
    playerId: packet.playerId,
    playerName: packet.playerName,
    posX: packet.posX,
    posY: packet.posY,
  };
};

export const createPongPacket = (netID: string) => {
  return {
    ID: PacketKeys.NET_PONG,
    netID,
  };
};
