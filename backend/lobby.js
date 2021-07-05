const ObjectID = require("bson-objectid");
const DB_API = require('./db/db_api');
const FrontendEventMessage = require("./frontend_event_message.js").FrontendEventMessage;
const BackendEventMessage = require("./backend_event_message.js").BackendEventMessage;
const Room = require("./room.js").Room;
const Player = require("./player.js").Player;
const ROOM_WAIT_TIME_MILLISECONDS = require("./games_config.js").ROOM_WAIT_TIME_MILLISECONDS;

/**
 * @author Xi Pu
 * Class representing lobby. It contains all the data to support features like putting players into groups of 6
 * and keep tracks of the current state of the entire game e.g. which player is in which room
 * Intended to be used as a singleton global variable.
 * You can use the following example import statement to get the global instance.
 * @example
 * const lobby = require("./lobby.js").LobbyInstance;
 */
class Lobby {
    currRoom; // new players who enter the lobby will join this room
    passive = new Map(); // stores proflic IDs of passive players
    rooms = new Map(); // stores a mapping of room name to room instance
    playerToRoom = new Map(); // stores a mapping of a player's id to the corresponding room instance
    roomToPlayer = new Map(); // stores a mapping of a room instance to an array of players who are in this room
    static MAX_CAPACITY_PER_ROOM = 6;
    botID = 0; // used as part of a bot's id


    constructor() {
        this.allocateNewRoom();
    }

    allocateNewRoom() {
        this.currRoom = new Room(ObjectID());
        this.rooms.set(this.currRoom.name.toString(), this.currRoom);
        this.roomToPlayer.set(this.currRoom.name.toString(), []);
    }

    printRoomsMap() {
        this.rooms.forEach((value, key) => { console.log(`m[${key}] = ${value.name}`); });
    }

    getRoomByRoomName(roomName) {
        return this.rooms.get(roomName.toString());
    }

    getRoomTurnNum(roomName) {
        let room = this.rooms.get(roomName.toString());
        return room.turnNum;
    }

    getAllPlayersInRoom(roomName) {
        return this.roomToPlayer.get(roomName.toString());
    }

    getAllPlayersIDs(roomName) {
        return this.getAllPlayersInRoom(roomName.toString()).map(player => player.prolificID);
    }

    getRoomNameOfPlayer(prolificID) {
        let room = this.getRoomOfPlayer(prolificID);
        return room.name;
    }

    getRoomOfPlayer(prolificID) {
        console.log('getRoomOfPlayer:');
        if (!this.playerToRoom.has(prolificID)) {
            console.log('Room not found');
            return undefined;
        }
        console.log('Room found');
        // console.log(this.playerToRoom);
        let room = this.playerToRoom.get(prolificID);
        // console.log(room);
        return room;
    }

    getPlayerByProlificID(prolificID) {
        let room = this.getRoomOfPlayer(prolificID);
        let player = room.getPlayerWithID(prolificID);
        return player;
    }

    areCoPlayersReady(prolificID) {
        let room = this.getRoomOfPlayer(prolificID);
        return room.hasEveryoneConfirmed();
    }

    hasPlayerConfirmedChoices(prolificID) {
        let room = this.getRoomOfPlayer(prolificID);
        if (!room.hasPlayerConfirmed(prolificID)) {
            this.passive.set(prolificID, true);
            return false;
        } else {
            this.passive.delete(prolificID);
            return true;
        }
    }

    findRoomForPlayerToJoin(prolificID) {
        if (this.playerToRoom.has(prolificID)) {
            throw `Duplicated prolificID ${prolificID} found`;
        }
        console.log('findRoomForPlayerToJoin: ');
        console.log(prolificID);
        let player = new Player(prolificID);
        this.currRoom.addPlayer(player);
        this.playerToRoom.set(prolificID, this.currRoom);
        this.roomToPlayer.get(this.currRoom.name.toString()).push(player);
        console.log('Room ' + this.currRoom.name + ' mapped to player ' + prolificID);
        return this.currRoom.name;
    }

    addBotPlayers() {
        let botProlificID = 'bot' + this.botID;
        let bot = new Player(botProlificID);
        this.botID++;
        bot.setIsBot(true);
        this.currRoom.addPlayer(bot);
        this.playerToRoom.set(botProlificID, this.currRoom);
        this.roomToPlayer.get(this.currRoom.name.toString()).push(bot);
        return this.currRoom.name;
    }

    addBotPlayersToRoom(roomName) {
        roomName = roomName.toString();
        let numPlayers = this.getNumOfPlayersInRoom(roomName);
        if (numPlayers < Lobby.MAX_CAPACITY_PER_ROOM) {
            let botProlificID = 'bot' + this.botID;
            let bot = new Player(botProlificID);
            this.botID++;
            bot.setIsBot(true);
            const room = this.getRoomByRoomName(roomName);
            room.addPlayer(bot);
            this.playerToRoom.set(botProlificID, room);
            this.roomToPlayer.get(roomName).push(bot);
        }
        return roomName;
    }

    handleRoomFill(io, roomName) {
        roomName = roomName.toString();
        const playerIDs = lobby.getAllPlayersIDs(roomName);
        io.sockets.in(roomName).emit(BackendEventMessage.ROOM_FILL, playerIDs); // to everyone in the room, including self
        DB_API.saveExperimentSession(roomName, playerIDs);
        console.log("The room is filled with users");
        console.log("roomName=" + roomName);
        console.log("playerIDs=" + playerIDs);
        this.allocateNewRoom();
    }


    fillInBotPlayers(io, roomName) {
        roomName = roomName.toString();
        let numPlayers = this.getNumOfPlayersInRoom(roomName);
        console.log("Time's up. The room already has " + numPlayers + " players.");
        for (let i = numPlayers; i < Lobby.MAX_CAPACITY_PER_ROOM; i++) {
            this.addBotPlayersToRoom(roomName);
        }
        this.handleRoomFill(io, roomName);
    }

    // need to refactor this method later
    getNumOfPlayersInRoom(roomName) {
        roomName = roomName.toString();
        return this.roomToPlayer.get(roomName).length;
    }

    reset() {
        this.currRoom = undefined;
        this.rooms.clear();
        this.playerToRoom.clear();
        this.roomToPlayer.clear();
        this.botID = 0;
        this.allocateNewRoom();
    }
}

/**
 * LobbyBotSocketListener is used for automated bot testing only
 * LobbyDefaultSocketListener should used in production
 */
const lobby = new Lobby(); // this is the global lobby instance that will be exported for other modules to get access to

module.exports = {
    Lobby,
    LobbyInstance: lobby,
    LobbyBotSocketListener: function (io, socket) {
        socket.on(FrontendEventMessage.ENTER_LOBBY, (prolificID) => {
            prolificID = prolificID.toString();
            let roomName = lobby.findRoomForPlayerToJoin(prolificID);
            socket.join(roomName);
            socket.roomName = roomName;
            socket.prolificID = prolificID;
            socket.to(roomName).emit(BackendEventMessage.PLAYER_JOIN_ROOM, socket.id + ' has joined ' + roomName); // to other players in the room, excluding self
            let num = lobby.getNumOfPlayersInRoom(roomName)
            socket.emit(BackendEventMessage.NUM_PLAYER_IN_ROOM, roomName, num); // only to self
            // Send player's time to frontend
            let room = lobby.getRoomByRoomName(roomName);
            let time = room.getTime();
            io.in(roomName).emit(BackendEventMessage.PLAYER_TIME, time);

            // add 5 bot players once a player joins the lobby
            for (let i = 1; i <= 5; i++) {
                lobby.addBotPlayers();
            }

            if (lobby.getNumOfPlayersInRoom(roomName) >= Lobby.MAX_CAPACITY_PER_ROOM) {
                // the current room is full, we have to use a new room
                lobby.handleRoomFill(io, roomName);
            }
        });
    },
    LobbyDefaultSocketListener: function (io, socket) {
        socket.on(FrontendEventMessage.ENTER_LOBBY, (prolificID) => {
            prolificID = prolificID.toString();
            let roomName = lobby.findRoomForPlayerToJoin(prolificID);
            socket.join(roomName, function () {
                // console.log(socket.id + " now in rooms ", socket.rooms);
                socket.roomName = roomName;
                socket.prolificID = prolificID;
                socket.to(roomName).emit(BackendEventMessage.PLAYER_JOIN_ROOM, socket.id + ' has joined ' + roomName); // to other players in the room, excluding self
                socket.emit(BackendEventMessage.NUM_PLAYER_IN_ROOM, roomName, lobby.getNumOfPlayersInRoom(roomName)); // only to self

                // Send player's time to frontend
                let room = lobby.getRoomByRoomName(roomName);
                let time = room.getTime();
                io.in(roomName).emit(BackendEventMessage.PLAYER_TIME, time);

                const numPlayers = lobby.getNumOfPlayersInRoom(roomName);
                if (numPlayers >= Lobby.MAX_CAPACITY_PER_ROOM) {
                    // the current room is full, we have to use a new room
                    lobby.handleRoomFill(io, roomName);
                } else {
                    if (numPlayers == 1) {
                        setTimeout(lobby.fillInBotPlayers.bind(lobby), ROOM_WAIT_TIME_MILLISECONDS, io, roomName);
                    }
                }
            });

        });
    }
};
