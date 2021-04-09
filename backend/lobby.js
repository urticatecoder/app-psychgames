const GameTwoAllocation = require('./game2.js').GameTwoAllocation;
const GameTwo = require('./game2.js');
const DB_API = require('./db/db_api');

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
    currRoomID = 0; // used as part of a room's name
    currRoom; // new players who enter the lobby will join this room
    rooms = new Map(); // stores a mapping of room name to room instance
    playerToRoom = new Map(); // stores a mapping of a player's id to the room instance he is in
    roomToPlayer = new Map(); // stores a mapping of a room instance to an array of players who are in this room
    static MAX_CAPACITY_PER_ROOM = 6;
    botID = 0; // used as part of a bot's id

    constructor() {
        this.allocateNewRoom();
    }

    allocateNewRoom() {
        this.currRoomID++;
        this.currRoom = new Room(`room ${this.currRoomID}`);
        this.rooms.set(this.currRoom.name, this.currRoom);
        this.roomToPlayer.set(this.currRoom.name, []);
    }

    getRoomPlayerIsIn(prolificID) {
        return this.playerToRoom.get(prolificID);
    }

    getRoomByRoomName(roomName){
        return this.rooms.get(roomName)
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

    addBotPlayersToRoom(roomName){
        let numPlayers = this.getNumOfPlayersInRoom(roomName);
        if (numPlayers<Lobby.MAX_CAPACITY_PER_ROOM){
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

    fillInBotPlayers(io, roomName){
        let numPlayers = this.getNumOfPlayersInRoom(roomName);
        for (let i = numPlayers; i<Lobby.MAX_CAPACITY_PER_ROOM; i++){
            this.addBotPlayersToRoom(roomName);
        }
        io.in(roomName).emit('room fill', this.getAllPlayersIDsInRoomWithName(roomName)); // to everyone in the room, including self
        this.allocateNewRoom();
        console.log("The room is filled with users");
    }

    /**
     * @deprecated use getNumOfPeopleInRoom(roomName) instead
     * @param serverSocket
     * @param roomName
     * @returns {number}
     */
    static getNumOfPeopleInRoom(serverSocket, roomName) {
        return serverSocket.sockets.adapter.rooms[roomName].length;
    }

    // need to refactor this method later
    getNumOfPlayersInRoom(roomName) {
        return this.roomToPlayer.get(roomName).length;
    }

    reset() {
        this.currRoomID = 0;
        this.currRoom = undefined;
        this.rooms.clear();
        this.playerToRoom.clear();
        this.roomToPlayer.clear();
        this.botID = 0;
        this.allocateNewRoom();
    }
}


/**
 * @author Xi Pu
 * Class representing a room of 6 players. It contains data/information specific to a room/experiment session
 * allocateNewRoom in the lobby class is used to add new room instances
 * @see Lobby.allocateNewRoom
 */
class Room {
    turnNum = 1; // the current turn number in this room starting at 1
    players = []; // holds player objects who are in this room
    playersWithChoiceConfirmed = new Set(); // holds prolificID of players who have confirmed their choices at the current turn
    allPlayerLocations = new Map();
    gameOneResults = []; // two groups for winners/losers, winners = gameOneResults[0], losers = gameOneResults[1]
    gameTwoPayoff = GameTwo.generateCompeteAndInvestPayoff();
    gameOneTurnCount = 0; // turns for game 1
    allPlayerTimes = new Map();
    /**
     * @constructor
     * @param roomName {string}
     */
    constructor(roomName) {
        if (roomName === undefined) {
            throw 'Room name not defined';
        }
        this.roomName = roomName;
        // getter method for time
        this.getTime = function(prolific) { 
            let time = this.allPlayerTimes.get(prolific);
            return 60 - ((Date.now() - time) / 1000);
        }
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

    get GameOneTurnCount(){
        return this.gameOneTurnCount;
    }

    setGameOneTurnCount(newCount){
        this.gameOneTurnCount = newCount;
    }

    /**
     * @param player Must be an instance of Player
     */
    addPlayer(player) {
        if (!(player instanceof Player)) {
            throw 'Parameter is not an instance of the Player class.';
        }
        this.players.push(player);
        this.setPlayerLocation(player.prolificID, 50);
        this.allPlayerTimes.set(player.prolificID, Date.now());
        // this.allPlayerLocations.set(player.prolificID, 0);
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

    /**
     * Set who are the winners and losers for game 1. This will be used to form groups in game 2
     * @param results {[][]} an array of two arrays that represents winners and losers.
     * Example input: [['player1', 'player2', 'player4'], ['player3', 'player5', player6]]
     */
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
        console.log('compete keep invest');
        console.log('winner sum: ' +  winnerSum.allocationAsArray);
        // losers
        let loserIDs = this.gameOneResults[1];
        let loserAllocations = [];
        loserIDs.forEach((id) => {
            loserAllocations.push(this.getPlayerWithID(id).getAllocationAtTurn(this.turnNum));
        });
        let loserSum = GameTwoAllocation.sumAllocations(loserAllocations);
        console.log('loser sum: ' + loserSum.allocationAsArray);
        return [winnerSum.allocationAsArray, loserSum.allocationAsArray];
    }

    /**
     * @return {number[]} an array of two numbers. The first number is the compete payoff and the second number is the invest payoff
     */
    getCompeteAndInvestPayoffAtCurrentTurn() {
        return this.getCompeteAndInvestPayoffAtTurnNum(this.turnNum);
    }

    /**
     * @param turnNum {number}
     * @return {number[]} an array of two numbers. The first number is the compete payoff and the second number is the invest payoff
     */
    getCompeteAndInvestPayoffAtTurnNum(turnNum) {
        let idx = turnNum - 1; // remember to subtract 1 because turnNum in Room starts at 1 instead of 0
        return this.gameTwoPayoff[idx];
    }

    /**
     * gets player allocation at specific turn number 
     * @param {*} prolificID 
     * @param {*} turnNum 
     */
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

/**
 * @author Xi Pu
 * Class representing an individual player.
 * It contains data/information specific to a player, e.g. prolificID, choices and allocations he/she made in each turn of game 1 and 2.
 */
class Player {
    choices = []; // stores an array of array to represent choices made by this player in game 1
    allocations = []; // stores an array of array to represent allocations of tokens made by this player in game 2
    keepTotal = 0; // stores the total keep of game2 
    investTotal = 0; // stores the total invest of game2 
    competeTotal = 0; // stores the total compete of game2 
    investRate = 0; // stores the total keep of game2 
    competeRate = 0; // stores the total keep of game2 
    /**
     * @constructor
     * @param prolificID {string}
     */
    constructor(prolificID) {
        if (prolificID === undefined) {
            throw 'prolificID not defined';
        }
        this.prolificID = prolificID;
        this.isBot = false;
    }

    /**
     * @param isBot {boolean}
     */
    setIsBot(isBot) {
        if (typeof (isBot) !== 'boolean') {
            throw 'Parameter is not a Boolean type.';
        }
        this.isBot = isBot;
    }

    updateCompeteAmount(competeValue){
        this.competeTotal = this.competeTotal + competeValue;
    }

    getCompeteAmount(){
        return this.competeTotal;
    }

    updateKeepAmount(keepValue){
        this.keepTotal = this.keepTotal + keepValue;
    }

    getKeepAmount(){
        return this.keepTotal;
    }

    updateInvestAmount(investValue){
        this.investTotal = this.investTotal + investValue;
    }

    getInvestAmount(){
        return this.investTotal;
    }

    /**
     * @param choice {string[]} an array of selected players' IDs in game 1
     */
    recordChoices(choice) {
        if (!(choice instanceof Array)) {
            throw 'Parameter is not an Array.';
        }
        this.choices.push(choice);
    }

    /**
     * @param turnNum {number}
     * @return {string[]}
     */
    getChoiceAtTurn(turnNum) {
        turnNum = turnNum - 1; // remember to subtract 1 because turnNum in Room starts at 1 instead of 0
        if (turnNum >= this.choices.length) {
            throw 'Array index out of bound.';
        }
        return this.choices[turnNum];
    }

    getGameOneChoiceCount(){
        return this.choices.length;
    }

    getGameTwoChoiceCount(){
        return this.allocations.length;
    }

    /**
     * @param compete {number}
     * @param keep {number}
     * @param invest {number}
     */
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

/**
 * @author Xi Pu
 * The following code is for exporting all the classes in this file, the singleton lobby instance and two socket listeners.
 * LobbyBotSocketListener is used only for testing by automatically adding bots
 * LobbyDefaultSocketListener is used in production
 */
const lobby = new Lobby(); // this is the global lobby instance that will be exported for other modules to get access to

module.exports = {
    Lobby,
    Room,
    Player,
    LobbyInstance: lobby,
    LobbyBotSocketListener: function (io, socket) {
        socket.on("enter lobby", (prolificID) => {
            prolificID = prolificID.toString();
            let roomName = lobby.findRoomForPlayerToJoin(prolificID);
            socket.join(roomName);
            socket.roomName = roomName;
            socket.prolificID = prolificID;
            socket.to(roomName).emit('join', socket.id + ' has joined ' + roomName); // to other players in the room, excluding self
            socket.emit('num of people in the room', lobby.getNumOfPlayersInRoom(roomName)); // only to self

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
            socket.emit('num of people in the room', lobby.getNumOfPlayersInRoom(roomName)); // only to self
            
            // if lobby timer runs out, add bots ---> HAS NOT BEEN TESTED but should work
            // socket.on("lobby time end", () => {
            //     for(let i = lobby.getNumOfPlayersInRoom(roomName); i <= Lobby.MAX_CAPACITY_PER_ROOM; i++){
            //         lobby.addBotPlayers();
            //     }
            // });

            // console.log('prolificID '+prolificID+' socketID '+socket.id + ' has joined ' + roomName); // to other players in the room, excluding self
            // console.log('num of people in the room '+lobby.getNumOfPlayersInRoom(roomName)); // only to self
            const numPlayers = lobby.getNumOfPlayersInRoom(roomName);

            if (numPlayers >= Lobby.MAX_CAPACITY_PER_ROOM) {
                // the current room is full, we have to use a new room
                io.in(roomName).emit('room fill', lobby.getAllPlayersIDsInRoomWithName(roomName)); // to everyone in the room, including self
                lobby.allocateNewRoom();
                console.log("The room is filled with users");
            }else{
                if(numPlayers==1){
                    setTimeout(lobby.fillInBotPlayers.bind(lobby), 60000, io, roomName);
                } 
            }
        });
    }
};
