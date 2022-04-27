import React, { useState } from 'react';
import Square from './Square';

const Board = ({ board, handleSquareClick, winningSquares }) => {
  /** fundtion to render each square */
  const renderSquare = position => {
    if(winningSquares) {
      var isWinningSquare = winningSquares.includes(position);
    } 
    return (
      <Square
        value={board[position]}
        onClick={() => {
          handleSquareClick(position);
        }}
        isWinningSquare = {isWinningSquare}
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
