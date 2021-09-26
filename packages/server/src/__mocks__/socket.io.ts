const ServerClass = (<any>jest.createMockFromModule("socket.io")).Server;
const ServerInstance = new ServerClass();

jest.spyOn(ServerInstance, "to").mockReturnValue(ServerInstance);
jest.spyOn(ServerInstance, "in").mockReturnValue(ServerInstance);

export function Server() {
  return ServerInstance;
}
