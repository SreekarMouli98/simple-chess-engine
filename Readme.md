## Simple-Chess - A Multiplayer Chess Engine
`Simple-Chess` is a multiplayer chess-engine which keeps track of the board and produces valid possbile moves.

## Usage
```javascript
const SimpleChessEngine = require('simple-chess-engine');
const game = new SimpleChessEngine();

game.getStatus();
// {
//     "nextPlayer": "white",
//     "isCheck": false,
//     "isCheckmate": false,
//     "isStalemate": false
// }

game.getPossibleMoves('B1');
// ["A3", "C3"]

game.makeMove('B1', 'C3');
// {
//     "success": true,
//     "status": {
//         "nextPlayer": "black",
//         "isCheck": false,
//         "isCheckmate": false,
//         "isStalemate": false
//     }
// }

game.undo();
// {
//     "nextPlayer": "white",
//     "isCheck": false,
//     "isCheckmate": false,
//     "isStalemate": false
// }

game.getBoard({ format: 'JSON' });
// {
//     "A8": {
//         "color": "black",
//         "piece": "rook"
//     },
//     "B8": {
//         "color": "black",
//         "piece": "bishop"
//     },
//     "C8": {
//         "color": "black",
//         "piece": "knight"
//     },
//     "D8": {
//         "color": "black",
//         "piece": "queen"
//     },
//     ...
// }

game.getBoard({ format: 'Array' });
// [
//     {
//         "position": "A8",
//         "color": "black",
//         "piece": "rook"
//     },
//     {
//         "position": "B8",
//         "color": "black",
//         "piece": "bishop"
//     },
//     {
//         "position": "C8",
//         "color": "black",
//         "piece": "knight"
//     },
//     {
//         "position": "D8",
//         "color": "black",
//         "piece": "queen"
//     }
//     ...
// ]

game.displayBoard(); // logs board to console
/*
┌───┬────────────┬──────────────┬──────────────┬─────────────┬────────────┬──────────────┬──────────────┬────────────┐
│   │ A          │ B            │ C            │ D           │ E          │ F            │ G            │ H          │
├───┼────────────┼──────────────┼──────────────┼─────────────┼────────────┼──────────────┼──────────────┼────────────┤
│ 8 │ BLACK ROOK │ BLACK BISHOP │ BLACK KNIGHT │ BLACK QUEEN │ BLACK KING │ BLACK KNIGHT │ BLACK BISHOP │ BLACK ROOK │
├───┼────────────┼──────────────┼──────────────┼─────────────┼────────────┼──────────────┼──────────────┼────────────┤
│ 7 │ BLACK PAWN │ BLACK PAWN   │ BLACK PAWN   │ BLACK PAWN  │ BLACK PAWN │ BLACK PAWN   │ BLACK PAWN   │ BLACK PAWN │
├───┼────────────┼──────────────┼──────────────┼─────────────┼────────────┼──────────────┼──────────────┼────────────┤
│ 6 │            │              │              │             │            │              │              │            │
├───┼────────────┼──────────────┼──────────────┼─────────────┼────────────┼──────────────┼──────────────┼────────────┤
│ 5 │            │              │              │             │            │              │              │            │
├───┼────────────┼──────────────┼──────────────┼─────────────┼────────────┼──────────────┼──────────────┼────────────┤
│ 4 │            │              │              │             │            │              │              │            │
├───┼────────────┼──────────────┼──────────────┼─────────────┼────────────┼──────────────┼──────────────┼────────────┤
│ 3 │            │              │ WHITE BISHOP │             │            │              │              │            │
├───┼────────────┼──────────────┼──────────────┼─────────────┼────────────┼──────────────┼──────────────┼────────────┤
│ 2 │ WHITE PAWN │ WHITE PAWN   │ WHITE PAWN   │ WHITE PAWN  │ WHITE PAWN │ WHITE PAWN   │ WHITE PAWN   │ WHITE PAWN │
├───┼────────────┼──────────────┼──────────────┼─────────────┼────────────┼──────────────┼──────────────┼────────────┤
│ 1 │ WHITE ROOK │              │ WHITE KNIGHT │ WHITE QUEEN │ WHITE KING │ WHITE KNIGHT │ WHITE BISHOP │ WHITE ROOK │
└───┴────────────┴──────────────┴──────────────┴─────────────┴────────────┴──────────────┴──────────────┴────────────┘
*/

game.resetGame();
```
