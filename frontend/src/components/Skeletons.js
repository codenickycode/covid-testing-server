import React from 'react';

export const Shimmer = () => {
  return (
    <div className='shimmer-wrapper'>
      <div className='shimmer'></div>
    </div>
  );
};

export const IconSkeleton = () => {
  return <div className='skeleton-icon'></div>;
};

export const ButtonSkeleton = () => {
  return (
    <div className='skeleton-div-row'>
      <div className='skeleton-btn'>
        <Shimmer />
      </div>
    </div>
  );
};

export const ImageSkeleton = ({ size }) => {
  return (
    <div className={`skeleton-img-${size} skeleton-relative`}>
      <Shimmer />
    </div>
  );
};

export const HeaderSkeleton = () => {
  return (
    <div className='skeleton-div-row hide'>
      <IconSkeleton />
      <div className='skeleton-h1text'>Loading...</div>
      <IconSkeleton />
      <Shimmer />
    </div>
  );
};

export const WelcomeSkeleton = () => {
  return (
    <div className='page transition show'>
      <div className='skeleton-h1 skeleton-relative'>
        <Shimmer />
      </div>
      <div className='skeleton-p skeleton-relative'>
        <Shimmer />
      </div>
      <div className='skeleton-img-med skeleton-relative'>
        <Shimmer />
      </div>
      <div className='skeleton-h1 skeleton-relative'>
        <Shimmer />
      </div>
      <div className='skeleton-p skeleton-relative'>
        <Shimmer />
      </div>
      <div className='skeleton-btn'>
        <Shimmer />
      </div>
    </div>
  );
};

export const SearchResultsSkeleton = () => {
  return (
    <div className='page transition show'>
      <div className='skeleton-div skeleton-hidden'>
        <div className='skeleton-wide'>
          <Shimmer />
        </div>
        <div className='skeleton-div skeleton-hidden'>
          <LocationPreviewSkeleton />
          <LocationPreviewSkeleton />
          <LocationPreviewSkeleton />
        </div>
      </div>
    </div>
  );
};

export const LocationPreviewSkeleton = () => {
  return (
    <div className='skeleton-div-row'>
      <div className='skeleton-img skeleton-relative'>
        <Shimmer />
      </div>
      <div className='skeleton-div skeleton-hidden'>
        <div className='skeleton-h skeleton-relative'>
          <Shimmer />
        </div>
        <div className='skeleton-p skeleton-relative'>
          <Shimmer />
        </div>
        <div className='skeleton-p skeleton-relative'>
          <Shimmer />
        </div>
        <div className='skeleton-p skeleton-relative'>
          <Shimmer />
        </div>
      </div>
    </div>
  );
};

export const LoginSkeleton = ({ header, message }) => {
  return (
    <div className='transition show'>
      <div className='skeleton-div skeleton-hidden'>
        <h1 className='skeleton-h1text'>{header || ''}</h1>
        <p className='skeleton-ptext'>{message || ''}</p>
        <div className='skeleton-spacer'></div>
        <div className='skeleton-div'>
          <div className='skeleton-left'>
            <Shimmer />
          </div>
          <div className='skeleton-wide'>
            <Shimmer />
          </div>
          <div className='skeleton-left'>
            <Shimmer />
          </div>
          <div className='skeleton-wide'>
            <Shimmer />
          </div>
          <div className='skeleton-left'>
            <Shimmer />
          </div>
          <div className='skeleton-wide'>
            <Shimmer />
          </div>
        </div>
        <div className='skeleton-btn'>
          <Shimmer />
        </div>
      </div>
    </div>
  );
};

export const AppointmentsSkeleton = () => {
  return (
    <div className='page transition show'>
      <div className='skeleton-div skeleton-hidden'>
        <div className='skeleton-h1'></div>
        <div className='skeleton-wide'>
          <Shimmer />
        </div>
        <div className='skeleton-spacer'></div>
        <div className='skeleton-div'>
          <div className='skeleton-h relative'>
            <Shimmer />
          </div>
          <div className='skeleton-p relative'>
            <Shimmer />
          </div>
          <div className='skeleton-spacer'></div>
          <div className='skeleton-h relative'>
            <Shimmer />
          </div>
          <div className='skeleton-p relative'>
            <Shimmer />
          </div>
        </div>
      </div>
    </div>
  );
};

export const AccountSkeleton = () => {
  return (
    <div className='page transition show'>
      <div className='skeleton-div'>
        <div className='skeleton-div-row'>
          <div className='skeleton-img'>
            <Shimmer />
          </div>
          <div className='skeleton-wide'>
            <Shimmer />
          </div>
        </div>
        <div className='skeleton-spacer'></div>
        <div className='skeleton-div-row'>
          <div className='skeleton-img'>
            <Shimmer />
          </div>
          <div className='skeleton-wide'>
            <Shimmer />
          </div>
        </div>
        <div className='skeleton-spacer'></div>
        <div className='skeleton-div-row'>
          <div className='skeleton-img'>
            <Shimmer />
          </div>
          <div className='skeleton-wide'>
            <Shimmer />
          </div>
        </div>
        <div className='skeleton-spacer'></div>
        <div className='skeleton-div-row'>
          <div className='skeleton-img'>
            <Shimmer />
          </div>
          <div className='skeleton-wide'>
            <Shimmer />
          </div>
        </div>
        <div className='skeleton-spacer'></div>
        <div className='skeleton-div-row'>
          <div className='skeleton-img'>
            <Shimmer />
          </div>
          <div className='skeleton-wide'>
            <Shimmer />
          </div>
        </div>
        <div className='skeleton-spacer'></div>
      </div>
    </div>
  );
};

export const AccountItemSkeleton = ({ message }) => {
  return (
    <div className='skeleton-div-row'>
      <div className='skeleton-left relative'>
        <Shimmer />
      </div>
      <p className='skeleton-ptext'>{message || ''}</p>
      <div className='skeleton-right relative'>
        <Shimmer />
      </div>
    </div>
  );
};

export const SettingsSkeleton = () => {
  return (
    <div className='page transition show'>
      <div className='skeleton-div'>
        <div className='skeleton-wide'>
          <Shimmer />
        </div>
        <div className='skeleton-spacer'></div>
        <div className='skeleton-wide'>
          <Shimmer />
        </div>
        <div className='skeleton-spacer'></div>
        <div className='skeleton-wide'>
          <Shimmer />
        </div>
      </div>
    </div>
  );
};

export default LoginSkeleton;
