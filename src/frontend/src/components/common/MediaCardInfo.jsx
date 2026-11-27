import React from 'react';

export default function MediaCardInfo({ title, artist, className = '', artistClassName = '' }) {
  return (
    <div className={className}>
      {title}
      <p className={artistClassName}>{artist}</p>
    </div>
  );
}
