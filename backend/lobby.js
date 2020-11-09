const GameTwoAllocation = require('./game2.js').GameTwoAllocation;
const GameTwo = require('./game2.js');
const DB_API = require('./db/db_api');

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
            throw `Duplicated prolificID ${prolificID} found`;
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

    reset() {
        this.currRoomID = 0;
        this.rooms = [];
        this.currRoom = undefined;
        this.playerToRoom.clear();
        this.roomToPlayer.clear();
        this.botID = 0;
        this.allocateNewRoom();
    }
}

class Room {
    turnNum = 1; // the current turn number in this room starting at 1
    players = []; // holds player objects who are in this room
    playersWithChoiceConfirmed = new Set(); // holds prolificID of players who have confirmed their choices
    allPlayerLocations = new Map();
    gameOneResults = []; // two groups for winners/losers
    gameTwoPayoff = GameTwo.generateCompeteAndInvestPayoff();

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

    advanceToGameTwo() {
        this.turnNum = 0;
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

    get gameOneResults() {
        return this.gameOneResults;
    }

    setGameOneResults(results) {
        this.gameOneResults = results;
    }

    getTeamAllocationAtCurrentTurn() {
        // winners
        let winnerIDs = this.gameOneResults[0];
        let winnerAllocations = [];
        winnerIDs.forEach((id) => {
            winnerAllocations.push(this.getPlayerWithID(id).getAllocationAtTurn(this.turnNum));
        });
        let winnerSum = GameTwoAllocation.sumAllocations(winnerAllocations);

        // losers
        let loserIDs = this.gameOneResults[1];
        let loserAllocations = [];
        loserIDs.forEach((id) => {
            loserAllocations.push(this.getPlayerWithID(id).getAllocationAtTurn(this.turnNum));
        });
        let loserSum = GameTwoAllocation.sumAllocations(loserAllocations);

        return [winnerSum.allocationAsArray, loserSum.allocationAsArray];
    }

    getCompeteAndInvestPayoffAtCurrentTurn() {
        return this.getCompeteAndInvestPayoffAtTurnNum(this.turnNum);
    }

    getCompeteAndInvestPayoffAtTurnNum(turnNum) {
        let idx = turnNum - 1; // remember to subtract 1 because turnNum in Room starts at 1 instead of 0
        return this.gameTwoPayoff[idx];
    }

    getPlayerAllocationAtTurnNum(prolificID, turnNum) {
        let player = this.getPlayerWithID(prolificID);
        return player.getAllocationAtTurn(turnNum);
    }

    // need to refactor this code
    getOthersAllocationAtTurnNum(prolificID, turnNum) {
        let teammatesAllocation = [];
        let opponentsAllocation = [];
        if (this.gameOneResults[0].includes(prolificID)) {
            this.gameOneResults[0].forEach((id) => {
                if (id !== prolificID) { // excluding self
                    let teammate = this.getPlayerWithID(id);
                    teammatesAllocation.push(teammate.getAllocationAtTurn(turnNum));
                }
            });
            this.gameOneResults[1].forEach((id) => {
                let opponent = this.getPlayerWithID(id);
                opponentsAllocation.push(opponent.getAllocationAtTurn(turnNum));
            });
        } else {
            this.gameOneResults[1].forEach((id) => {
                if (id !== prolificID) { // excluding self
                    let teammate = this.getPlayerWithID(id);
                    teammatesAllocation.push(teammate.getAllocationAtTurn(turnNum));
                }
            });
            this.gameOneResults[0].forEach((id) => {
                let opponent = this.getPlayerWithID(id);
                opponentsAllocation.push(opponent.getAllocationAtTurn(turnNum));
            });
        }
        return [teammatesAllocation, opponentsAllocation];
    }
}

class Player {
    choices = []; // stores an array of array to represent choices made by this player in game 1
    allocations = []; // for game 2

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

    recordAllocationForGameTwo(compete, keep, invest) {
        this.allocations.push(new GameTwoAllocation(compete, keep, invest));
    }

    getAllocationAtTurn(turnNum) {
        if (turnNum <= 0) {
            throw 'Invalid turn num.';
        }
        turnNum = turnNum - 1; // remember to subtract 1 because turnNum in Room starts at 1 instead of 0
        if (turnNum >= this.allocations.length) {
            throw 'Array index out of bound.';
        }
        return this.allocations[turnNum];
    }
}

const lobby = new Lobby();

module.exports = {
    Lobby,
    Room,
    Player,
    LobbyInstance: lobby,
    LobbyBotSocketListener: function (io, socket) {
        socket.on("enter lobby", (prolificID) => {
            prolificID = prolificID.toString();
            // console.log("Received enter lobby from frontend with prolificID: ", prolificID);
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
                DB_API.saveExperimentSession(lobby.getAllPlayersIDsInRoomWithName(roomName));
                lobby.allocateNewRoom();
            }
            // if (Lobby.getNumOfPeopleInRoom(io, roomName) >= Lobby.MAX_CAPACITY_PER_ROOM) {
            //     // the current room is full, we have to use a new room
            //     io.in(roomName).emit('room fill', lobby.getAllPlayersIDsInRoomWithName(roomName)); // to everyone in the room, including self
            //     lobby.allocateNewRoom();
            // }
        });
    },
    LobbyDefaultSocketListener: function (io, socket) {
        socket.on("enter lobby", (prolificID) => {
            prolificID = prolificID.toString();
            let roomName = lobby.findRoomForPlayerToJoin(prolificID);
            socket.join(roomName);
            socket.roomName = roomName;
            socket.prolificID = prolificID;
            socket.to(roomName).emit('join', socket.id + ' has joined ' + roomName); // to other players in the room, excluding self
            socket.emit('num of people in the room', Lobby.getNumOfPeopleInRoom(io, roomName)); // only to self
            // console.log(Lobby.getNumOfPeopleInRoom(io, roomName));

            if (lobby.getNumOfPlayersInRoom(roomName) >= Lobby.MAX_CAPACITY_PER_ROOM) {
                // the current room is full, we have to use a new room
                io.in(roomName).emit('room fill', lobby.getAllPlayersIDsInRoomWithName(roomName)); // to everyone in the room, including self
                lobby.allocateNewRoom();
            }
        });
    }
};
