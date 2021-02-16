import React, { useState, useEffect, useContext } from 'react';
import { App } from '../../Providers/Context.js';
import LocationPreview from './Results/LocationPreview.js';
import { SearchResultsSkeleton } from '../../components/Skeletons.js';
import { DatePicker, Page } from '../../components/index.js';

export default function SearchResults({
  searchResults,
  date,
  handleSortBy,
  handleChangeDate,
  handleSelection,
}) {
  const { loading } = useContext(App);
  const [sortBySelected, setSortBySelected] = useState('distance');

  const sortBy = (type) => {
    setSortBySelected(type);
    handleSortBy(type);
  };

  const handleDatePicker = (type) => {
    setFlash(true);
    handleChangeDate(type);
  };

  // visual confirmation of sorting and date changes
  const [flash, setFlash] = useState(false);
  useEffect(() => {
    let timer = null;
    if (flash) {
      timer = setTimeout(() => setFlash(false), 150);
    }
    return () => clearTimeout(timer);
  }, [flash]);

  return loading ? (
    <SearchResultsSkeleton />
  ) : (
    <Page id='search-results'>
      <DatePicker
        handleChangeDate={handleDatePicker}
        date={date}
        setFlash={setFlash}
      />
      <Sort
        sortBySelected={sortBySelected}
        sortBy={sortBy}
        setFlash={setFlash}
      />
      <Results
        searchResults={searchResults}
        handleSelection={handleSelection}
        flash={flash}
      />
    </Page>
  );
}

const Sort = ({ sortBySelected, sortBy, setFlash }) => {
  const handleClick = (type) => {
    setFlash(true);
    sortBy(type);
  };

  let timeClass = `small sort-by ${sortBySelected === 'time' && ' selected'}`;
  let distanceClass = `small sort-by ${
    sortBySelected === 'distance' && ' selected'
  }`;
  return (
    <div className='sort'>
      <p className='bold'>Sort by:</p>
      <p className={timeClass} onClick={() => handleClick('time')}>
        Time
      </p>
      <p className={distanceClass} onClick={() => handleClick('distance')}>
        Distance
      </p>
    </div>
  );
};

const Results = ({ searchResults, handleSelection, flash }) => {
  return (
    <div id='location-previews' className={flash ? 'flash' : ''}>
      {searchResults.map((location) => (
        <LocationPreview
          key={location._id}
          location={location}
          handleSelection={handleSelection}
        />
      ))}
    </div>
  );
};
