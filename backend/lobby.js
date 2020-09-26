class Lobby {
    nextRoomID = 0;
    rooms = [];
    currRoom = new Room("dummy_room");

    constructor(serverSocket) {
        this.serverSocket = serverSocket;
        let newRoom = new Room(`room ${this.nextRoomID}`);
        this.rooms.push(newRoom);
        this.currRoom = newRoom;
    }

    get roomNameToJoin() {
        if (this.getNumOfPeopleInRoom(this.currRoom) >= Room.maxCapacity) { // the current room is full
            this.nextRoomID++; // we have to use a new room
        }
        this.currRoom = new Room(`room ${this.nextRoomID}`);
        this.rooms.push(this.currRoom);
        return this.currRoom.name;
    }

    getNumOfPeopleInRoom(room) {
        return this.serverSocket.sockets.adapter.rooms[room.name].length;
    }

}

class Room {
    constructor(room_name) {
        this.room_name = room_name;
    }

    static get maxCapacity() {
        return 6;
    }

    get name() {
        return this.room_name;
    }
}
