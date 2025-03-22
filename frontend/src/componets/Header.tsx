import React from 'react';
import Logo from './Logo';
import CoinBox from './CoinBox';
import UserBox from './UserBox';
import { UserStore } from '../stores/UserStore';
import { useLocation, useNavigate } from 'react-router-dom';

interface HeaderProps {
}

const Header: React.FC<HeaderProps> = ({  }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const balance = UserStore(state => state.balance);
  const userName = UserStore(state => state.userName);
  return (
    <div className='h-16 w-full flex flex-row justify-between px-8 items-center'>
      <div className="flex gap-10">
        <Logo />
        <div className="flex items-center text-lg cursor-pointer">
          <div className={`px-4 border-b  ${location.pathname === "/dashboard" ? "border-purple" : "border-black"}`} onClick={() => navigate('/dashboard')}>
            Dashboard
          </div>
          <div className={`px-4 border-b  ${location.pathname === "/courses" ? "border-purple" : "border-black"}`} onClick={() => navigate('/courses')}>
            Courses
          </div>
        </div>
      </div>
      <div className="flex flex-row gap-6">
        <CoinBox balance = {balance} />
        <UserBox userName={userName}/>
      </div>
    </div>
  );
};

export default Header;