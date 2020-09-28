class Lobby {
    nextRoomID = 0;
    rooms = [];
    currRoom;
    static MAX_CAPACITY_PER_ROOM = 6;

    constructor() {
        let newRoom = new Room(`room ${this.nextRoomID}`);
        this.rooms.push(newRoom);
        this.currRoom = newRoom;
    }

    get availableRoomNameToJoin() {
        return this.currRoom.name;
    }

    static getNumOfPeopleInRoom(serverSocket, roomName) {
        return serverSocket.sockets.adapter.rooms[roomName].length;
    }

    allocateNewRoom(){
        this.nextRoomID++;
        this.currRoom = new Room(`room ${this.nextRoomID}`);
        this.rooms.push(this.currRoom);
    }
}

class Room {
    constructor(room_name) {
        this.room_name = room_name;
    }

    get name() {
        return this.room_name;
    }
}

const lobby = new Lobby();

module.exports = {
    Lobby,
    LobbySocketListener: function(io, socket) {
        socket.on("enter lobby", () => {
            let roomName = lobby.availableRoomNameToJoin;
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
