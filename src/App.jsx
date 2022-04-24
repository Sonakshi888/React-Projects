import React, { useState } from 'react';
import Board from './components/Board';
import './styles/root.scss';
import { calculateWinner } from './helpers';

const App = () => {
  //history here is an array with objects inside it
  const [history, setHistory] = useState([{
    board: Array(9).fill(null),
    isXNext: true,
  }]);
  const [currentMove, setCurrentMove] = useState(0);
  const current = history[currentMove]; //setting current with the object history (key = currentMove)
  const [isXNext, setIsXNext] = useState(false);
  const winner = calculateWinner(current.board);
  const message = winner
    ? `Winner is ${winner}`
    : `Next player is ${current.isXNext ? 'X' : 'O'}`;
    
  /** function to handle click on each sqaure */
  //position is the position of clicked square, pos is the position of iterated square
  const handleSquareClick = position => {
    if (current.board[position] || winner) {
      //if square value already set then quit the function
      return;
    }
    setHistory(prev => {
      const last = prev[prev.length - 1];

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

  return (
    <div className="app">
      <h1>TIC TAC TOE</h1>
      <h2>{message}</h2>
      <Board board={current.board} handleSquareClick={handleSquareClick} />
    </div>
  );
};
export default App;
