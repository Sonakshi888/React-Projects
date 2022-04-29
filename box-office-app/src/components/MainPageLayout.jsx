import React from 'react';
import Navs from './Navs';
import Title from './Title';

const MainPageLayout = ({children}) => {
  // here children are the ones that are mentioned in between of the mainpagelayout tag in the file that is calling this component
  return (
    <div>
      <Navs />
      <Title title="Box Office" subtitle="Are you looking for a movie or an actor?"/>
      {children}
    </div>
  );
};

export default MainPageLayout;
