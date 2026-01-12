import React, { useEffect } from 'react';

export const CRTOverlay: React.FC = () => {
  useEffect(() => {
    document.body.classList.add('crt-body-filter');
    return () => {
      document.body.classList.remove('crt-body-filter');
    };
  }, []);

  return (
    <div className="crt-global-overlay" aria-hidden="true"></div>
  );
};
