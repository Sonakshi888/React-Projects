import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { apiGet } from '../misc/config';

const Show = () => {
  const [show, setShow] = useState(null);
  const { id } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    let isMounted = true;

    apiGet(`/shows/${id}?embed[]=seasons&embed[]=cast`)
      .then(results => {
        setTimeout(() => {
          if (isMounted === true) {
            setShow(results);
            setIsLoading(false);
          }
        }, 1000);
      })
      .catch(err => {
        if (isMounted === true) {
          setError(err.message);
          setIsLoading(false);
        }
      });
  }, [id]);
  if (isLoading) {
    return <div>Data is being loaded!</div>;
  }
  if (error) {
    return <div>Error occured: ${error}</div>;
  }
  return <div>Show</div>;
};

export default Show;
