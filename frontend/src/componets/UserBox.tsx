import React from 'react';

interface UserBoxProps {
  userName: string;
}

const UserBox: React.FC<UserBoxProps> = ({ userName }) => {
  return (
    <div className='h-10 flex flex-row gap-2 rounded-full bg-[#2C3039] items-center px-3' >
      <div className="h-6 w-6 rounded-full bg-sky-700">
      </div>
      <div className="flex items-center">
        {userName ? userName : 'Guest'}
      </div>
    </div>
  );
};

export default UserBox;