export enum PacketKeys {
  JOIN_REQUEST = "PLAYER.JOIN",

  NET_PONG = "NET.PONG",
  NET_PING = "NET.PING",
  NET_REGISTER = "NET.REGISTER",

  ANOTHER_PLAYER_JOINED = "PLAYER.JOINED_ANOTHER",
  ANOTHER_PLAYER_UPDATED = "PLAYER.MOVE",
  INIT_PLAYERS = "INIT.PLAYERS",
  PLAYER_LEAVE = "PLAYER.LEAVE",
}

export type JoinPacketType = {
  netID: string;
  playerID: string;
  name: string;
  x: number;
  y: number;
};

export const createJoinPacket = (packet: JoinPacketType) => {
  return {
    ID: PacketKeys.JOIN_REQUEST,
    netID: packet.netID,
    playerID: packet.playerID,
    playerName: packet.name,
    posX: packet.x,
    posY: packet.x,
  };
};

export const createPongPacket = (netID: string) => {
  return {
    ID: PacketKeys.NET_PONG,
    netID,
  };
};
