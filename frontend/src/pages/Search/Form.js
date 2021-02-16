import React, { useState } from 'react';
import { TESTS } from '../../tools/info/TESTS';
import Test from './Form/Test.js';
import tools from '../../tools';
import * as icons from '../../icons';
import { Button, Input, Page, WithIcon } from '../../components';

const SearchForm = ({ handleSubmit }) => {
  const [zip, setZip] = useState('');
  const [tests, setTests] = useState([]);
  const [error, setError] = useState('');

  const selectTest = (e, type) => {
    let newTests = [...tests];
    const index = tests.indexOf(type);
    index === -1 ? newTests.push(type) : newTests.splice(index, 1);
    setTests(newTests);
  };

  const handleZipInput = ({ target: { value } }) => {
    if (!tools.validNum(value)) return;
    setZip(value);
  };

  const submit = (e) => {
    e.preventDefault();
    if (zip.length < 5) return setError('Zip required');
    let testsFilter = {};
    for (let key of Object.keys(TESTS)) {
      testsFilter[key] = tests.includes(key);
    }
    handleSubmit(testsFilter, zip);
  };

  return (
    <Page id='search-form'>
      <form id='form-home' className='flex-col' onSubmit={submit}>
        <Header />
        <Tests tests={tests} selectTest={selectTest} />
        <ZipInput zip={zip} handleZipInput={handleZipInput} />
        {error && <p className='error'>{error}</p>}
        <Button type='submit' label='Search availability' />
      </form>
    </Page>
  );
};

export default SearchForm;

const Header = () => {
  return (
    <div>
      <WithIcon icon={icons.document}>
        <h1>Choose test type</h1>
      </WithIcon>
      <WithIcon icon={icons.spacer}>
        <p>
          We will only show locations matching your requirements. Select all
          that apply.
        </p>
      </WithIcon>
    </div>
  );
};

const Tests = ({ tests, selectTest }) => {
  return (
    <div className='items flex-col'>
      {Object.entries(TESTS).map((test) => {
        return (
          <Test
            key={test[0]}
            selectedTests={tests}
            selectTest={selectTest}
            test={test}
          />
        );
      })}
    </div>
  );
};

const ZipInput = ({ zip, handleZipInput }) => {
  return (
    <>
      <div id='search-form-zip-div'>
        <WithIcon icon={icons.address}>
          <h1>Your location</h1>
        </WithIcon>
      </div>
      <Input
        autoFocus={true}
        field={'zip'}
        value={zip}
        placeholder='Enter your zipcode'
        onChange={(e) => handleZipInput(e)}
      />
    </>
  );
};
