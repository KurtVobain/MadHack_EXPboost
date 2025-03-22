import React from 'react';
import ProgressBar from './ProgressBar';

interface BoxProps {
  children: React.ReactNode;
}

const Box: React.FC<BoxProps> = ({ children }) => {
  return (
    <div className='borderGradient p-3' >
      {children}
    </div>
  );
};

export default Box;