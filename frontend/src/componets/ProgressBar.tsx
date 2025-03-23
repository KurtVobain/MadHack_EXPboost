import React from 'react';

interface ProgressBarProps {
  maxValue: number;
  activeValue: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ maxValue, activeValue }) => {
  const progressPercentage = Math.min((activeValue / maxValue) * 100, 100);

  return (
    <div className="flex items-center w-full">
      <div className="relative w-full h-2 bg-[#2C3039] rounded-full overflow-hidden">
        <div
          className="absolute h-full bgGradient"
          style={{ width: `${progressPercentage}%` }}
        />
      </div>
      <span className="ml-2 text-[#AAAAAA] text-xs">
        {activeValue}/{maxValue}
      </span>
    </div>
  );
};

export default ProgressBar;