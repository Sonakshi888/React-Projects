import React from 'react';

const StatusMessage = ({ winner, current }) => {
  //every method returns true obly if all the el in the array returns true other wise false
  const noMovesLeft = current.board.every(el => el !== null); //it will return true when there will be no space left
  return (
    <div className="status-message">
      {winner && (
        <>
          Winner is{' '}
          <span className={winner === 'X' ? 'text-green' : 'text-orange'}>
            {winner}
          </span>
        </>
      )}
      {!winner && !noMovesLeft && (
        <>
          Next player is{' '}
          <span className={current.isNext ? 'text-green' : 'text-orange'}>
            {' '}
            {current.isXNext ? 'X' : 'O'}{' '}
          </span>
        </>
      )}
      {!winner && noMovesLeft && (
        <>
          <span className='text-green'>X </span>and
          <span className='text-orange'> Y</span> tied!
        </>
      )}
    </div>
  );
};

export default StatusMessage;
