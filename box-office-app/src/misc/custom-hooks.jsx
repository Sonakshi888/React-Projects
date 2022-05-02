import { useReducer, useEffect } from 'react';

//reducer for useShows
function showsReducer(prevState, action) {
  switch (action.type) {
    case 'ADD': {
      return [...prevState, action.showId];
    }
    case 'REMOVE': {
      return prevState.filter(showId => showId !== action.showId);
    }
    default: {
      return prevState;
    }
  }
}

function usePersistentReducer(reducer, initialState, key) {
  // useReducer can have 3 parameters last one being the function that sets the initial value for the state
  const [state, dispatch] = useReducer(reducer, initialState, initial => {
    const persisted = localStorage.getItem(key);
    return persisted ? JSON.parse(persisted) : initial;
  });
  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(state));
  }, [state, key]);

  return [state, dispatch];
}

//function to use usePersistentReducer with only one parameter
export function useShows(key = 'shows') {
  return usePersistentReducer(showsReducer, [], key);
}
