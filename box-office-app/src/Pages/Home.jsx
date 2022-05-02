import React, { useState } from 'react';
import ActorGrid from '../components/actors/ActorGrid';
import MainPageLayout from '../components/MainPageLayout';
import ShowGrid from '../components/shows/ShowGrid';
import { apiGet } from '../misc/config';
import { useLastQuery } from '../misc/custom-hooks';

const Home = () => {
  const [input, setInput] = useState('');
  // const [input, setInput] = useLastQuery();  //use useLastQuery if you want input value to persist even after page refresh
  const [results, setResults] = useState(null);
  const [searchOption, setSearchOption] = useState('shows');
  const isShowsSearch = searchOption === 'shows'; //returns true for the first time

  const onSearch = () => {
    //fetching the results from the tv maze api
    apiGet(`/search/${searchOption}?q=${input}`).then(result => {
      setResults(result); //setting result state
      console.log(result);
    });
  };

  const onInputChange = ev => {
    setInput(ev.target.value);
  };

  const onKeyDown = ev => {
    if (ev.keyCode === 13) {
      onSearch();
    }
  };

  const renderResults = () => {
    if (results && results.length === 0) {
      return <div>No results</div>;
    }

    if (results && results.length > 0) {
      /** checking if results are bringing shows or persons */ return results[0]
        .show ? (
        <ShowGrid data={results} />
      ) : (
        <ActorGrid data={results} />
      );
    }

    return null;
  };

  /** function to change the type of search */
  const onRadioChange = ev => {
    setSearchOption(ev.target.value);
  };

  return (
    <MainPageLayout>
      <input
        type="text"
        placeholder="Search for something"
        onChange={onInputChange}
        onKeyDown={onKeyDown}
        value={input}
      />
      <label htmlFor="shows-search">
        Shows
        <input
          id="shows-search"
          type="radio"
          value="shows"
          checked={isShowsSearch}
          onChange={onRadioChange}
        />
      </label>
      <label htmlFor="actors-search">
        Actors
        <input
          id="actors-search"
          type="radio"
          value="people"
          checked={!isShowsSearch}
          onChange={onRadioChange}
        />
      </label>
      <button type="button" onClick={onSearch}>
        Search
      </button>
      {renderResults()}
    </MainPageLayout>
  );
};

export default Home;
