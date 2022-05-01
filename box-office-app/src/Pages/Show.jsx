import React, { useEffect, useReducer } from 'react';
import { useParams } from 'react-router-dom';
import { apiGet } from '../misc/config';

const Show = () => {
  const initialState = {
    isLoading: true,
    show: null,
    error: false,
  };
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
  const { id } = useParams();
  const [{ isLoading, show, error }, dispatch] = useReducer(
    reducer,
    initialState
  );
  useEffect(() => {
    let isMounted = true;

    apiGet(`/shows/${id}?embed[]=seasons&embed[]=cast`)
      .then(results => {
        setTimeout(() => {
          if (isMounted === true) {
            dispatch({ type: 'FETCH_SUCCESS', show: results });
          }
        }, 1000);
      })
      .catch(err => {
        if (isMounted === true) {
          dispatch({ type: 'FETCH_ERROR', error: err.message });
        }
      });
  }, [id]);
  console.log(show);
  if (isLoading) {
    return <div>Data is being loaded!</div>;
  }
  if (error) {
    return <div>Error occured: ${error}</div>;
  }
  return <div>Show</div>;
};

export default Show;
