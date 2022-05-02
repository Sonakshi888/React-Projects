import React from 'react';
import { useShow } from '../misc/custom-hooks';
import { useParams } from 'react-router-dom';
import ShowMainData from '../components/shows/ShowMainData';
import Cast from '../components/shows/Cast';
import Seasons from '../components/shows/Seasons';
import Details from '../components/shows/Details';
import { ShowPageWrapper } from './Show.styled';
import { InfoBlock } from './Show.styled';

const Show = () => {
  const { id } = useParams();
  const { show, isLoading, error } = useShow(id);
  if (isLoading) {
    return <div>Data is being loaded!</div>;
  }
  if (error) {
    return <div>Error occured: {error}</div>;
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
