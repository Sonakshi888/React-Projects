import React, { useState } from 'react';
import Square from './Square';

const Board = () => {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [isXNext, setIsXNext] = useState(false);

  /** function to handle click on each sqaure */
  //position is the position of clicked square, pos is the position of iterated square
  const handleSquareClick = position => {
    if(board[position]) { //if square value already set then quit the function
      return;
    }
    setBoard(prev => {  //prev is the old values of board
      return prev.map((square, pos) => {  
        if (pos === position) {
          return isXNext ? 'X': 'O';
        }
        return square;
      });
    });
    setIsXNext((prev) => !prev);  //just reverting the previous value of isXNext
  };

  /** fundtion to render each square */
  const renderSquare = position => {
    return (
      <Square
        value={board[position]}
        onClick={() => {
          handleSquareClick(position);
        }}
      />
    );
  };

  return (
    <div className="board">
      <div className="board-row">
        {renderSquare(0)}
        {renderSquare(1)}
        {renderSquare(2)}
      </div>
      <div className="board-row">
        {renderSquare(3)}
        {renderSquare(4)}
        {renderSquare(5)}
      </div>
      <div className="board-row">
        {renderSquare(6)}
        {renderSquare(7)}
        {renderSquare(8)}
      </div>
    </div>
  );
};
export default Board;
