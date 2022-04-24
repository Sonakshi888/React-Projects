import React from 'react';

const StatusMessage = ({ winner, current }) => {
  //every method returns true obly if all the el in the array returns true other wise false
  const noMovesLeft = current.board.every(el => el !== null); //it will return true when there will be no space left
  return (
    <h2>
      {winner && `Winner is ${winner}`}
      {!winner &&
        !noMovesLeft &&
        `Next player is ${current.isXNext ? 'X' : 'O'}`}
      {!winner && noMovesLeft && 'X and O tied'}
    </h2>
  );
};

export default StatusMessage;
