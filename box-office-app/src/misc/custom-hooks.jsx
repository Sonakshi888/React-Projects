import { useReducer, useEffect, useState } from 'react';
import { apiGet } from '../misc/config';

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

//custom hook to persist the input in input field
export function useLastQuery(key = 'lastQuery') {
  const [input, setInput] = useState(() => {
    const persisted = sessionStorage.getItem(key);
    return persisted ? JSON.parse(persisted) : '';
  });
  const setPersistedInput = newState => {
    setInput(newState);
    sessionStorage.setItem(key, JSON.stringify(newState));
  };
  return [input, setPersistedInput];
}

//reducer for hook useShow
const reducer = (prevState, action) => {
  switch (action.type) {
    case 'FETCH_SUCCESS': {
      return { isLoading: false, show: action.show, error: null };
    }
    case 'FETCH_ERROR': {
      return { isLoading: false, error: action.error };
    }
    default:
      return prevState;
  }
};

//custom hook to get state for a show
export function useShow(showId) {
  const [state, dispatch] = useReducer(reducer, {
    isLoading: true,
    show: null,
    error: false,
  });
  useEffect(() => {
    let isMounted = true;
    apiGet(`/shows/${showId}?embed[]=seasons&embed[]=cast`)
      .then(results => {
        if (isMounted === true) {
          dispatch({ type: 'FETCH_SUCCESS', show: results });
        }
      })
      .catch(err => {
        if (isMounted === true) {
          dispatch({ type: 'FETCH_ERROR', error: err.message });
        }
      });
  }, [showId]);
  return state;
}
