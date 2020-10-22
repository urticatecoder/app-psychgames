class Lobby {
    currRoomID = 0;
    rooms = [];
    currRoom;
    playerToRoom = new Map(); // stores a mapping of a player's id to the room instance he is in
    roomToPlayer = new Map();
    static MAX_CAPACITY_PER_ROOM = 6;
    botID = 0;

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

    getRoomPlayerIsIn(prolificID) {
        return this.playerToRoom.get(prolificID);
    }

    getAllPlayersInRoomWithName(roomName) {
        return this.roomToPlayer.get(roomName);
    }

    getAllPlayersIDsInRoomWithName(roomName) {
        return this.getAllPlayersInRoomWithName(roomName).map(player => player.prolificID);
    }

    findRoomForPlayerToJoin(prolificID) {
        if (this.playerToRoom.has(prolificID)) {
            throw 'Duplicated prolificID found';
        }
        let player = new Player(prolificID);
        this.currRoom.addPlayer(player);
        this.playerToRoom.set(prolificID, this.currRoom);
        this.roomToPlayer.get(this.currRoom.name).push(player);
        return this.currRoom.name;
    }

    addBotPlayers() {
        let botProlificID = 'bot' + this.botID;
        let bot = new Player(botProlificID);
        this.botID++;
        bot.setIsBot(true);
        this.currRoom.addPlayer(bot);
        this.playerToRoom.set(botProlificID, this.currRoom);
        this.roomToPlayer.get(this.currRoom.name).push(bot);
        return this.currRoom.name;
    }

    // need to refactor this method later
    getNumOfPlayersInRoom(roomName) {
        return this.roomToPlayer.get(roomName).length;
    }
}

class Room {
    turnNum = 1; // the current turn number in this room starting at 1
    players = []; // holds player objects who are in this room
    playersWithChoiceConfirmed = new Set(); // holds prolificID of players who have confirmed their choices
    allPlayerLocations = new Map();

    constructor(roomName) {
        if (roomName === undefined) {
            throw 'Room name not defined';
        }
        this.roomName = roomName;
    }

    get name() {
        return this.roomName;
    }

    get playerLocation() {
        return this.allPlayerLocations;
    }

    setPlayerLocation(prolificID, newLocation) {
        this.allPlayerLocations.set(prolificID, newLocation);
    }

    addPlayer(player) {
        if (!(player instanceof Player)) {
            throw 'Parameter is not an instance of the Player class.';
        }
        this.players.push(player);
        this.allPlayerLocations.set(player.prolificID, 0);
    }

    advanceToNextRound() {
        this.turnNum++;
        this.playersWithChoiceConfirmed.clear();
    }

    addPlayerIDToConfirmedSet(prolificID) {
        this.playersWithChoiceConfirmed.add(prolificID);
    }

    hasEveryoneConfirmedChoiceInThisRoom() {
        return this.playersWithChoiceConfirmed.size === Lobby.MAX_CAPACITY_PER_ROOM;
    }

    hasPlayerWithIDConfirmedChoice(prolificID) {
        return this.playersWithChoiceConfirmed.has(prolificID);
    }

    canFindPlayerWithID(prolificID) {
        return this.players.some(player => player.prolificID === prolificID);
    }

    getPlayerWithID(prolificID) {
        return this.players.find(player => player.prolificID === prolificID);
    }

    getEveryoneChoiceAtCurrentTurn() {
        return new Map(
            this.players.map(player => [player.prolificID, player.getChoiceAtTurn(this.turnNum)])
        );
    }


}

class Player {
    choices = []; // stores an array of array

    constructor(prolificID) {
        if (prolificID === undefined) {
            throw 'prolificID not defined';
        }
        this.prolificID = prolificID;
        this.isBot = false;
    }

    setIsBot(isBot) {
        if (typeof (isBot) !== 'boolean') {
            throw 'Parameter is not a Boolean type.';
        }
        this.isBot = isBot;
    }

    recordChoices(choice) {
        if (!(choice instanceof Array)) {
            throw 'Parameter is not an Array.';
        }
        this.choices.push(choice);
    }

    getChoiceAtTurn(turnNum) {
        turnNum = turnNum - 1; // remember to subtract 1 because turnNum in Room starts at 1 instead of 0
        if (turnNum >= this.choices.length) {
            throw 'Array index out of bound.';
        }
        return this.choices[turnNum];
    }
}

const lobby = new Lobby();

module.exports = {
    Lobby,
    Room,
    Player,
    LobbyInstance: lobby,
    LobbySocketListener: function (io, socket) {
        socket.on("enter lobby", (prolificID) => {
            let roomName = lobby.findRoomForPlayerToJoin(prolificID);
            socket.join(roomName);
            socket.roomName = roomName;
            socket.prolificID = prolificID;
            socket.to(roomName).emit('join', socket.id + ' has joined ' + roomName); // to other players in the room, excluding self
            socket.emit('num of people in the room', Lobby.getNumOfPeopleInRoom(io, roomName)); // only to self
            // console.log(Lobby.getNumOfPeopleInRoom(io, roomName));

            // add 5 bot players once a player joins the lobby
            for (let i = 1; i <= 5; i++) {
                lobby.addBotPlayers();
            }

            if (lobby.getNumOfPlayersInRoom(roomName) >= Lobby.MAX_CAPACITY_PER_ROOM) {
                // the current room is full, we have to use a new room
                io.in(roomName).emit('room fill', lobby.getAllPlayersIDsInRoomWithName(roomName)); // to everyone in the room, including self
                lobby.allocateNewRoom();
            }

            // if (Lobby.getNumOfPeopleInRoom(io, roomName) >= Lobby.MAX_CAPACITY_PER_ROOM) {
            //     // the current room is full, we have to use a new room
            //     io.in(roomName).emit('room fill', lobby.getAllPlayersIDsInRoomWithName(roomName)); // to everyone in the room, including self
            //     lobby.allocateNewRoom();
            // }
        });
    }
};
