const readline = require("readline");
const readlineInterface = readline.createInterface(
  process.stdin,
  process.stdout
);

function ask(questionText) {
  return new Promise((resolve, reject) => {
    readlineInterface.question(questionText, resolve);
  });
}

//global variables
//initialize room inventory
//let roomInventory = [];

//player object
let playerObject = {
  //initialize player inventory
  playerInventory: [],
  //global room location
  currentRoom: "Room #1",
};

//a class for items to pick up in the game
class Item {
  constructor(name, description, action, takeable) {
    this.name = name;
    this.description = description;
    this.action = action || "nothing"; //if item does not have an action property nothing happens
    this.takeable = takeable || "false"; //if item is not takeable returns false
  }

  //a take function method on class Item to take player from one room to the next
  take() {
    if (this.takeable === "true") {
      playerInventory.push(this.name); //this pushes to inventory which is initialized as a global variable
      console.log(`You picked up ${this.name} and it is in your inventory.`);
    } else {
      console.log(`You can't do that action`);
    }
  }

  //a use function method on class Item to use items in the game
  use() {
    if (this.name === "key" && roomInventory.includes("key")) {
      console.log("You can open the door to the Puzzle Room.");
    } else {
      console.log(this.action);
    }
  }
  //an examine function method on class Item to examine items in the game
  examine() {
    console.log(`you see ${this.description}`);
  }
  //a drop function method on class Item to drop items in the game
  drop() {
    if (this.takeable === "true" && playerInventory.includes(this.name)) {
      inventoryPlayer.pop();
      return `You dropped ${this.name}`;
    } else {
      return `You can't do that action`;
    }
  }
}

//initialize items to use in the game
//creates a door item
let door = new Item(
  "door", //name
  "a large, austere door looming in front of you that appears to need a key", //description
  "the door is unlocked", //action
  false //takeable
);

//creates a key item
let key = new Item(
  "key", //name
  "something glinting, there is a key in the hollow of a tree", //description
  "you turn the key", //action
  true //takeable
);

//creates a mushroom item
let mushroom = new Item(
  "mushroom", //name
  "a glowing mushroom", //description
  "you take the mushroom", //actions
  true //takeable
);

//creates a sign item
let sign = new Item(
  "sign", //name
  "a sign posted on a tree", //description
  "you take the sign", //actions
  true //takeable
);

//item lookup table (looks up string version and spits out variable version allowing the variable version to be looked up)
let lookupItemTable = {
  door: door,
  key: key,
  mushroom: mushroom,
  sign: sign,
};

//room class to create rooms for the game
class Room {
  constructor(roomName, roomDescription, locked, item, connections) {
    this.roomName = roomName;
    this.roomDescription = roomDescription;
    this.locked = locked;
    this.item = item;
    this.connections = connections;
  }

  //move method on class Room to move between rooms
  move() {
    if (this.connections.includes(playerObject.currentRoom)) {
      console.log(this.connections);
      //playerObject.currentRoom = this.roomName;//transitions to the current room
      //return `You are in ${currentRoom}. \n ${this.roomDescription}`;
    }
  }
}

//initialize rooms to be used in the game
//the initial room
let main = new Room(
  "Main Room", //roomName
  `You are in the main room of the house. \n Surrounding you are three doors. \n Examine the doors for clues.`, //roomDescription
  false, //locked true or false
  "door", //item
  ["The Enchanted Forest", "The Puzzle Room", "The Chasm"] //connections
);
//a room in the game where items are able to be picked up to advance in the game
let enchanted = new Room(
  "The Enchanted Forest", //roomName
  `You have traveled through a portal and entered the enchanted forest dimension. \n 
  From one of the tree hollows you spy a glint of light. Examine the tree for clues.`, //roomDescription
  false, //locked true or false
  "key", //item
  "Main Room" //connections
);

//a room where the puzzle takes place in the game
let puzzle = new Room(
  "The Puzzle Room", //roomName
  `You are now in the puzzle room. \n 
    To pass into the next dimension you must enter a code to pass to the next room.`, //roomDescription
  true, //locked true or false
  "mushroom", //item
  ["The Nimsesku Room", "Room #1"]
);

//a room with nothing in it
let emptiness = new Room(
  "The Emptiness", //roomName
  `You have entered the emptiness. \n
    There is nothing here but a sign.`, //roomDescription
  false, // locked true or false
  "sign", //item
  ["The Abyss", "Room #1"] //connections
);

//a room with nothing in it that ends the game when you enter it
let abyss = new Room(
  "The Abyss", //roomName
  `You have entered the abyss. \n
    There is no turning back now. The wormhole has sucked you in. \n
    The universe has imploded. Game over.`, //roomDescription
  false, //locked true or false
  undefined // no connecting rooms
);

//the room you enter that wins the game
let nimsesku = new Room(
  "The Nimsesku Room", //roomName
  `You have found Nimsesku! \n
    All is restored and you have saved the universe as we know it! \n
    You have won the game!`, //roomDescription
  false, //locked true or false
  undefined // no connecting rooms
);

//lookup table for room class (looks up string version and spits out variable version allowing the variable version to be looked up)
let lookupRoomTable = {
  main: main,
  enchanted: enchanted,
  puzzle: puzzle,
  emptiness: emptiness,
  abyss: abyss,
  nimsesku: nimsesku,
};

//state machine to move between the rooms
// let roomTransitions = {
//   room1: ["The Enchanted Forest", "The Puzzle Room", "The Void"],
//   enchantedForest:["Room #1"],
//   puzzleRoom : ["Room #1", "The Nimsesku Room"],
//   theVoid : ["Room #1", "Further into the Void"]
// }

//function to go between rooms

//FIND NIMSESKU (based loosely on Meow Wolf's House of Eternal Return in Santa Fe)
console.log(`Room #1 -
You are in the main room of the house. \n Surrounding you are three doors. 
Your objective is to find Nimsesku the Hamster and close the wormhole that is wreaking havoc on the universe. 
 Move around the rooms to find Nimsesku. \n Save the universe as we know it! \n If you are unable to save the universe you can leave the game by typing "leave" or "exit".`);

//async function to start the game
async function start() {
  let userAction = await ask("What would you like to do?"); //user inputs an action

  let inputArray = userAction.toLowerCase().split(" "); //user input sanitization takes user action and makes it lower case

  let action = inputArray[0]; //takes input array at index 0

  let target = inputArray
    .slice(
      1 /*-1 looks at the last input may need to change to this ie take small key = "key"*/
    )
    .join(" "); //what you want to find in lookup table - takes input array, slices it at first index of array, then joins it back together

  if (action === "use") {
    //conditional statement for when action is use
    console.log(lookupItemTable[target].use()); //this means use lookup table at the target and use use method on it
    start();
  } else if (action === "take") {
    if (lookupItemTable[target] instanceof Item) {
      //conditional for if an item exists in the room and is takeable
      console.log(lookupItemTable[target].take()); //you are able to take the item
      start();
    } else {
      //console.log(lookupItemTable[target] instanceof Item);//if not you can't take the item
      console.log("You can't take that");
      start();
    }
  } else if (action === "examine") {
    lookupItemTable[target].examine(); //allows you to examine items in the rooms
    start();
  } else if (action === "drop") {
    console.log(lookupItemTable[target].drop()); //allows you to drop items in the rooms from your inventory
  } else if (action === "move") {
    lookupRoomTable[target].move(); //allows you to move rooms
    start();
  } else if (action === "leave" || action === "exit") {
    //allows you to leave the game
    process.exit();
  } else {
    console.log(`Invalid input. Try again!`); //catch all if input is invalid
    start();
  }
}

//starts the game
start();
