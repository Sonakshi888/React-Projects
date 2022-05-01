import React, { useEffect, useReducer } from 'react';
import { useParams } from 'react-router-dom';
import ShowMainData from '../components/shows/ShowMainData';
import Cast from '../components/shows/Cast';
import Seasons from '../components/shows/Seasons';
import Details from '../components/shows/Details';
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
  return (
    <div>
      <ShowMainData
        image={show.image}
        name={show.name}
        summary={show.summary}
        rating={show.rating}
        tags={show.tags}
      />
      <div>
        <h2>Details</h2>
        <Details
          status={show.status}
          network={show.network}
          premiered={show.premiered}
        />
      </div>
      <div>
        <h2>Seasons</h2>
        <Seasons seasons={show._embedded.seasons} />
      </div>
      <div>
        <h2>Cast</h2>
        <Cast cast={show._embedded.cast} />
      </div>
    </div>
  );
};

export default Show;
