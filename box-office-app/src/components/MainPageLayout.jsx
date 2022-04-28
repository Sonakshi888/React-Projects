import React from 'react';
import Navs from './Navs';
import Title from './Title';

const MainPageLayout = ({children}) => {
  return (
    <div>
      <Navs />
      <Title title="Box Office" subtitle="Are you looking for a movie or an actor?"/>
      {children}
    </div>
  );
};

export default MainPageLayout;
