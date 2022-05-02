import React, { useEffect, useReducer } from 'react';
import { useParams } from 'react-router-dom';
import ShowMainData from '../components/shows/ShowMainData';
import Cast from '../components/shows/Cast';
import Seasons from '../components/shows/Seasons';
import Details from '../components/shows/Details';
import { apiGet } from '../misc/config';
import { ShowPageWrapper } from './Show.styled';
import { InfoBlock } from './Show.styled';

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
        if (isMounted === true) {
          dispatch({ type: 'FETCH_SUCCESS', show: results });
        }
      })
      .catch(err => {
        if (isMounted === true) {
          dispatch({ type: 'FETCH_ERROR', error: err.message });
        }
      });
  }, [id]);
  if (isLoading) {
    return <div>Data is being loaded!</div>;
  }
  return (
    <ShowPageWrapper>
      <ShowMainData
        image={show.image}
        name={show.name}
        summary={show.summary}
        rating={show.rating}
        tags={show.tags}
      />
      <InfoBlock>
        <h2>Details</h2>
        <Details
          status={show.status}
          network={show.network}
          premiered={show.premiered}
        />
      </InfoBlock>
      <InfoBlock>
        <h2>Seasons</h2>
        <Seasons seasons={show._embedded.seasons} />
      </InfoBlock>
      <InfoBlock>
        <h2>Cast</h2>
        <Cast cast={show._embedded.cast} />
      </InfoBlock>
    </ShowPageWrapper>
  );
};

export default Show;
