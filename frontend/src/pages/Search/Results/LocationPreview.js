import React from 'react';
import { ArrowRight } from '../../../icons';

const LocationPreview = ({ location, handleSelection }) => {
  const { name, address } = location;
  const available = location.available.length > 0;

  return (
    <div
      className='location-preview'
      onClick={() => handleSelection(location._id)}
    >
      <div className='preview-info'>
        <div>
          <h2>{name}</h2>
          <hr />
          <p className='preview-address'>
            {address.street}, {address.city}, {address.state} {address.zip}
          </p>
        </div>
        {available ? (
          <>
            <p className='preview-next'>Next:</p>
            <p className='preview-time bold'>{location.available[0]}</p>
          </>
        ) : (
          <p className='preview-time bold'>No available appointments today</p>
        )}
      </div>
      <ArrowRight />
    </div>
  );
};

export default LocationPreview;
