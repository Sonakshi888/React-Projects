import React, { useState } from 'react';
import Board from './components/Board';
import './styles/root.scss';
import { calculateWinner } from './helpers';

const App = () => {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [isXNext, setIsXNext] = useState(false);

  console.log(board);
  const winner = calculateWinner(board);
  const message = winner
    ? `Winner is ${winner}`
    : `Next player is ${isXNext ? 'X' : 'O'}`;
  /** function to handle click on each sqaure */
  //position is the position of clicked square, pos is the position of iterated square
  const handleSquareClick = position => {
    if (board[position] || winner) {
      //if square value already set then quit the function
      return;
    }
    setBoard(prev => {
      //prev is the old values of board
      return prev.map((square, pos) => {
        if (pos === position) {
          return isXNext ? 'X' : 'O';
        }
        return square;
      });
    });
    setIsXNext(prev => !prev); //just reverting the previous value of isXNext
  };

  return (
    <div className="app">
      <h1>TIC TAC TOE</h1>
      <h2>{message}</h2>
      <Board board={board} handleSquareClick={handleSquareClick} />
    </div>
  );
};
export default App;
