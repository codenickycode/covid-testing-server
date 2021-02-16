import React, { useState } from 'react';
import { ArrowDown, ArrowUp } from '../../../icons';

const Test = ({ test, selectedTests, selectTest }) => {
  const [showInfo, setShowInfo] = useState(false);

  const testType = test[0];
  const { name, info } = test[1];

  const handleIconClick = (e) => {
    e.stopPropagation();
    setShowInfo(!showInfo);
  };

  const selected = selectedTests.indexOf(testType) !== -1;
  const arrowIcon = showInfo ? <ArrowUp /> : <ArrowDown />;
  return (
    <div
      className={`flex-col type ${selected ? 'selected' : ''}`}
      onClick={(e) => selectTest(e, testType)}
    >
      <h2>{name}</h2>
      <hr />
      <div className='flex-row more' onClick={handleIconClick}>
        <p className='small bold'>{showInfo ? 'Less info' : 'Learn more'}</p>
        {arrowIcon}
      </div>
      <ul className={showInfo ? 'show-info' : 'no-info'}>
        {info.map((item, index) => {
          return (
            <li key={'info' + index} className='small'>
              {item}
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default Test;
