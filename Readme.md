## Simple-Chess-Engine
---
`simple-chess-engine` is a multiplayer chess engine which keeps track of the board and produces valid possbile moves.

## Features
---
1. Accepts algebraic notation
2. Lists possible valid moves
3. Check detection
4. Checkmate detection
5. Stalemate detection
6. Supports undo
7. Load custom board <sup>**(new)**</sup>

### API
---
 * <a href='#create-game'>Create Game</a>
 * <a href='#get-status'>Get Game Status</a>
 * <a href='#get-possible-moves'>Get Possible Moves</a>
 * <a href='#move-piece'>Move Piece</a>
 * <a href='#get-board'>Get Complete Board</a>
 * <a href='#undo'>Undo</a>
 * <a href='#load-board'>Load Custom Board</a>
 * <a href='#reset'>Reset Game</a>
 * <a href='#debug'>Debug Board</a>

## Usage
---
<h4 id='create-game'>Create Game</h4>
```js
const SimpleChessEngine = require('simple-chess-engine');
const game = new SimpleChessEngine();
```

<h4 id='get-status'>Get Game Status</h4>
```js
/**
 * Returns the current status of the game
 * 
 * @returns {object}
 {
     "nextPlayer": "white",
     "isCheck": false,
     "isCheckmate": false,
     "isStalemate": false
 }
 */
game.getStatus();

```

<h4 id='get-possible-moves'>Get Possible Moves</h4>
```js
/**
 * Returns all the valid possible moves of a piece at the given position
 * @param {string} position
 * 
 * @returns {array}
 ["A3", "C3"]
 */
game.getPossibleMoves('B1');
```

<h4 id='move-piece'>Move Piece</h4>
```js
/**
 * Used to move a piece from source position to destination position
 * @param {string} source
 * @param {string} destination 
 * 
 * @returns {object}
 {
     "success": true | false,
     "status" : {
         "nextPlayer" : 'white' | 'black',
         "isCheck"    : true | false,
         "isCheckmate": true | false,
         "isStalemate": true | false
     }
 }
 *
 * NOTE :: In order to get the updated board, use the getBoard() method.
 */
game.makeMove('B1', 'C3');
```

<h4 id='undo'>Undo</h4>
```js
/**
 * Used to undo any previosly made move
 * 
 * @returns {object}
 {
     "nextPlayer" : 'black' | 'white',
     "isCheck"    : true | false,
     "isCheckmate": true | false,
     "isStalemate": true | false
 }
 *
 * NOTE :: In order to get the updated board, use the getBoard() method.
 */
game.undo();
```

<h4 id='get-board'>Get Complete Board</h4>
```js
/**
 * Used to return the complete board
 * 
 * @param {object} opts 
 * Supported opts:
 *  format: 'JSON' =>(Currently only JSON format is supported, any requested formats might be considered)
 * 
 * @returns {object}
 * 
 {
     "A8": {
         "color": "black",
         "piece": "rook"
     },
     "B8": {
         "color": "black",
         "piece": "bishop"
     },
     ...
 }
 */
game.getBoard();
```

<h4 id='load-board'>Load Custom Board</h4>
```js
let content = JSON.stringify({
    A1: { color: "white", piece: "king" },
    C1: { color: "black", piece: "king" },
    A2: { color: "white", piece: "rook" }
});
let opts = { firstPlayer: 'white' };
/**
 * Used to load custom board
 * @param {string} content => Stringified JSON Object
 * @param {object} opts
 * 
 * Supported opts:
 *  firstPlayer = 'white' | 'black'
 * 
 * @returns {object}
 *  Success Case
    {
        "success": "true",
        "status": {
            "nextPlayer": "white",
            "isCheck": false,
            "isCheckmate": false,
            "isStalemate": false
        }
    }
 *  Failure Case
    {
        "success": "false",
        "reasons": [...]
    }
 */
game.loadBoard(content, opts);
```

<h4 id='reset'>Reset Game</h4>
```js
let opts = { custom: true };
/**
 * Used to reset the board
 * @param {object} opts
 * 
 * Supported opts:
 *  custom = true | false (resetGame with custom=true will reload the custom board which was previousy loaded (if any))
 * 
 * NOTE :: resetGame with custom=false will remove custom board from memory
 * NOTE :: In order to get the updated board, use the getBoard() method.
 */
game.resetGame();
```

<h4 id='debug'>Debug Board</h4>
```js
/**
 * Logs the complete chess board to the console
 */
game.displayBoard();
```
