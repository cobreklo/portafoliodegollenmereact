import React from 'react';

export const CRTOverlay: React.FC = () => {
  return (
    <>
      <div className="crt-global-overlay" aria-hidden="true"></div>
      <div className="crt-overlay" aria-hidden="true"></div>
    </>
  );
};
