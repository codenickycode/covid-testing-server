import { render, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import ContextProvider from '../../Providers/Context';
import SearchResults from './Results';
import { initLocations } from '../../tools/mockData/initLocations';

let searchResults, datePicker, sortByTime, sortByDistance, previews;
const handleSortBy = jest.fn();
const handleChangeDate = jest.fn();
const handleSelection = jest.fn();
describe('SearchResults', () => {
  beforeEach(() => {
    searchResults = initLocations();
    const { getByText } = render(
      <ContextProvider>
        <SearchResults
          searchResults={searchResults}
          date={'January 1, 2021'}
          handleSortBy={handleSortBy}
          handleChangeDate={handleChangeDate}
          handleSelection={handleSelection}
        />
      </ContextProvider>
    );
    datePicker = document.querySelector('.date-picker');
    sortByTime = getByText('Time');
    sortByDistance = getByText('Distance');
    previews = document.querySelectorAll('.location-preview');
  });

  it('renders a date picker with date passed from props', () => {
    expect(datePicker.innerHTML).toContain('Jan');
  });

  it('renders sort buttons', () => {
    expect(sortByTime).toBeTruthy();
    expect(sortByDistance).toBeTruthy();
  });

  it('renders search result location previews passed in from props', () => {
    expect(previews.length).toBe(searchResults.length);
  });

  it('calls handleSelection on preview click', () => {
    expect(handleSelection).toBeCalledTimes(0);
    fireEvent.click(previews[0]);
    expect(handleSelection).toBeCalledTimes(1);
  });
});
