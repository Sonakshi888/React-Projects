import React, { useState } from 'react';
import Board from './components/Board';
import History from './components/History';
import StatusMessage from './components/StatusMessage';
import './styles/root.scss';
import { calculateWinner } from './helpers';

const NEW_GAME = [
  {
    board: Array(9).fill(null),
    isXNext: true,
  },
];
const App = () => {
  //history here is an array with objects inside it
  const [history, setHistory] = useState(NEW_GAME);
  const [currentMove, setCurrentMove] = useState(0);
  const current = history[currentMove]; //setting current with the object history (key = currentMove)(current = history[0] in first go)

  const { winner, winningSquares } = calculateWinner(current.board); //history[0].board

  /** function to handle click on each sqaure */
  //position is the position of clicked square, pos is the position of iterated square
  const handleSquareClick = position => {
    if (current.board[position] || winner) {
      //if square value already set or winner is assigned then quit the function
      return;
    }
    setHistory(prev => {
      const last = prev[prev.length - 1]; //prev[8] in first go

      //prev is the old values of board
      const newBoard = last.board.map((square, pos) => {
        if (pos === position) {
          return last.isXNext ? 'X' : 'O';
        }
        return square;
      });
      return prev.concat({ board: newBoard, isXNext: !last.isXNext });
    });
    setCurrentMove(prev => prev + 1);
  };

  /** function to execute when the go to move number is clicked to show the respective move */
  const moveTo = move => {
    setCurrentMove(move);
  };

  /** function to set the new game */
  const setNewGame = () => {
    setHistory(NEW_GAME);
    setCurrentMove(0);
  };
  return (
    <div className="app">
      <h1>
        TIC <span className="text-green">TAC</span> TOE
      </h1>
      <StatusMessage winner={winner} current={current} />
      <Board
        board={current.board}
        handleSquareClick={handleSquareClick}
        winningSquares={winningSquares}
      />
      <button
        onClick={setNewGame}
        className={`btn-reset ${winner ? 'active' : ''}`}
      >
        Start new game
      </button>
      <h2 style={{fontWeight:'normal'}}>Current Game History</h2>
      <History history={history} moveTo={moveTo} currentMove={currentMove} />
      <div className='bg-balls' />
    </div>
  );
};
export default App;
