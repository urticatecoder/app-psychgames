class Lobby {
    currRoomID = 0;
    rooms = [];
    currRoom;
    playerToRoom = new Map(); // stores a mapping of a player's id to the room instance he is in
    roomToPlayer = new Map();
    static MAX_CAPACITY_PER_ROOM = 6;

    constructor() {
        this.allocateNewRoom();
    }

    static getNumOfPeopleInRoom(serverSocket, roomName) {
        return serverSocket.sockets.adapter.rooms[roomName].length;
    }

    allocateNewRoom() {
        this.currRoomID++;
        this.currRoom = new Room(`room ${this.currRoomID}`);
        this.rooms.push(this.currRoom);
        this.roomToPlayer.set(this.currRoom.name, []);
    }

    getRoomPlayerIsIn(prolificID){
        return this.playerToRoom.get(prolificID);
    }

    getAllPlayersInRoomWithName(roomName){
        return this.roomToPlayer.get(roomName);
    }

    findRoomForPlayerToJoin(prolificID){
        if (this.playerToRoom.has(prolificID)) {
            throw 'Duplicated prolificID found'
        }
        this.playerToRoom.set(prolificID, this.currRoom);
        this.roomToPlayer.get(this.currRoom.name).push(new Player(prolificID));
        return this.currRoom.name;
    }
}

class Room {
    constructor(room_name) {
        if (room_name === undefined) {
            throw 'Room name not defined';
        }
        this.room_name = room_name;
        this.turnNum = 1;
        this.players = [];
    }

    get name() {
        return this.room_name;
    }

    addPlayer(player){
        if (! player instanceof Player){
            throw 'Parameter is not an instance of the Player class.';
        }
        this.players.push(player);
    }

    canFindPlayerWithID(prolificID){
        let found = false;
        this.players.forEach((player) => {
            if (player.prolificID === prolificID){
                found = true;
            }
        });
        return found;
    }
}

class Player {
    constructor(prolificID) {
        if (prolificID === undefined) {
            throw 'prolificID not defined';
        }
        this.prolificID = prolificID;
        this.isBot = false;
    }

    setIsBot(isBot){
        if (typeof(isBot) !== 'boolean'){
            throw 'Parameter is not a Boolean type.';
        }
        this.isBot = isBot;
    }
}

const lobby = new Lobby();

module.exports = {
    Lobby,
    Room,
    Player,
    LobbySocketListener: function (io, socket) {
        socket.on("enter lobby", (prolificID) => {
            let roomName = lobby.findRoomForPlayerToJoin(prolificID);
            socket.join(roomName);
            socket.roomName = roomName;
            socket.to(roomName).emit('join', socket.id + ' has joined ' + roomName);
            console.log(Lobby.getNumOfPeopleInRoom(io, roomName));
            if (Lobby.getNumOfPeopleInRoom(io, roomName) >= Lobby.MAX_CAPACITY_PER_ROOM) {
                // the current room is full, we have to use a new room
                io.in(roomName).emit('room fill', roomName + ' is filled up.');
                lobby.allocateNewRoom();
            }
        });
    }
};
