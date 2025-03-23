import React, { useCallback, useEffect, useState } from 'react';
import Box from '../componets/Box';
import ProgressBar from '../componets/ProgressBar';
import BattlePass from '../componets/BattlePass';
import axios from 'axios';
import { UserStore } from '../stores/UserStore';
import { BattlePassStore } from '../stores/BattlePassStore';
import { TypeAnimation } from 'react-type-animation';
import { DaylisDto } from '../types';
import { useLocation } from 'react-router-dom';
import { userIdStore } from '../stores/userIdStore';
import { mockLevels } from '../utils';

interface DashboardPageProps {}

const DashboardPage: React.FC<DashboardPageProps> = ({}) => {
  const location = useLocation();
  const { user_id } = location.state || {};
  const hostname = import.meta.env.VITE_API_URL;
  const setUserState = UserStore((state) => state.setUserState);
  const [daylis, setDaylis] = useState<DaylisDto[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [transactionURL, setTransactionURL] = useState('');

  const profileLevel = UserStore((state) => state.profileLevel);
  const setLevels = BattlePassStore((state) => state.setLevels);
  const curBPExp = UserStore((state) => state.curBPExp);

  const userId = userIdStore((state) => state.userId);

  const [showModal, setShowModal] = useState(true);

  const closeModal = () => {
    setShowModal(false);
  };

  useEffect(() => {
    if (isLoading) {
      return;
    }
    axios
      .get(`api/profile/${userId}`)
      .then((response) => {
        setUserState(response.data.data);
      })
      .catch((error) => {
        console.log(error);
      });

    axios
      .get(`api/dailies`, { params: { userId: userId } })
      .then((response) => {
        setDaylis(response.data.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [isLoading, userId]);

  useEffect(() => {
    axios
      .get(`api/profile/${userId}`)
      .then((response) => {
        setUserState(response.data.data);
      })
      .catch((error) => {
        console.log(error);
      });

    axios
      .get(`api/battlepass/${userId}`)
      .then((response) => {
        setLevels(response.data.data.levels);
      })
      .catch((error) => {
        setLevels(mockLevels);
        console.log(error);
      });
    axios
      .get(`api/dailies`, { params: { userId: userId } })
      .then((response) => {
        setDaylis(response.data.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [setUserState, userId]);

  const checkDaily = useCallback((dailyId: number) => {
    setIsLoading(true);
    axios
      .post(`api/daily/check?userId=${userId}&dailyId=${dailyId}`, {})
      .then((response) => {
        // alert(`Your transaction URL:  ${response.data.transactionURL}`);
        setTransactionURL(response.data.transactionURL);
        setShowModal(true);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  return (
    <>
      {showModal && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000,
          }}
        >
          <Box
          >
            <h2 className="text-2xl">Your reward</h2>
            <p className='my-10'>You recive - 1 000 000 QUBIC. You could check transaction - <a className='hover:underline' href={transactionURL} target='_blank'>{transactionURL}</a></p>
            <button className='bg-[#FF7423] text-white p-2 rounded-md w-72 text-center cursor-pointer mx-auto' onClick={closeModal}>Close</button>
          </Box>
        </div>
      )}
      <div className="text-white">
        <div className="flex flex-row justify-between pt-8">
          <div className="w-80 flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <span className="text-3xl font-semibold">Season 1</span>
              <span className="text-[#AAAAAA] text-xs">
                Complete daily tasks to claim Season 1 rewards
              </span>
            </div>
            <Box
              children={
                <div className="flex flex-col gap-2">
                  <div className="text-xl font-semibold flex flex-row gap-1 items-center">
                    <svg
                      width="17"
                      height="17"
                      viewBox="0 0 17 17"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <rect
                        x="0.5"
                        y="0.5"
                        width="16"
                        height="16"
                        rx="2.66667"
                        fill="#FF7423"
                      />
                      <g clipPath="url(#clip0_2451_846)">
                        <path
                          d="M5.13679 9.49379C5.05593 9.49407 4.97664 9.47139 4.90815 9.4284C4.83966 9.38541 4.78477 9.32387 4.74987 9.25092C4.71496 9.17798 4.70147 9.09663 4.71096 9.01632C4.72045 8.93601 4.75253 8.86005 4.80348 8.79725L9.03402 4.4385C9.06576 4.40187 9.109 4.37712 9.15666 4.36831C9.20431 4.3595 9.25355 4.36715 9.29629 4.39C9.33902 4.41286 9.37272 4.44957 9.39184 4.4941C9.41096 4.53864 9.41438 4.58835 9.40152 4.63508L8.58105 7.20759C8.55686 7.27234 8.54874 7.34199 8.55738 7.41057C8.56602 7.47915 8.59117 7.54461 8.63066 7.60134C8.67016 7.65807 8.72283 7.70436 8.78415 7.73626C8.84548 7.76816 8.91362 7.78471 8.98274 7.78448H11.974C12.0549 7.78421 12.1342 7.80688 12.2027 7.84987C12.2712 7.89286 12.3261 7.95441 12.361 8.02735C12.3959 8.10029 12.4094 8.18165 12.3999 8.26195C12.3904 8.34226 12.3583 8.41823 12.3074 8.48103L8.07681 12.8398C8.04507 12.8764 8.00183 12.9012 7.95417 12.91C7.90652 12.9188 7.85728 12.9111 7.81454 12.8883C7.77181 12.8654 7.73811 12.8287 7.71899 12.7842C7.69987 12.7396 7.69645 12.6899 7.70931 12.6432L8.52978 10.0707C8.55397 10.0059 8.56209 9.93628 8.55345 9.8677C8.54481 9.79912 8.51966 9.73366 8.48017 9.67693C8.44067 9.62021 8.388 9.57391 8.32668 9.54201C8.26535 9.51011 8.19721 9.49357 8.12809 9.49379H5.13679Z"
                          stroke="white"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </g>
                      <defs>
                        <clipPath id="clip0_2451_846">
                          <rect
                            width="10.2559"
                            height="10.2559"
                            fill="white"
                            transform="translate(3.42773 3.51123)"
                          />
                        </clipPath>
                      </defs>
                    </svg>
                    {profileLevel} Level
                  </div>
                  <ProgressBar maxValue={100} activeValue={curBPExp} />
                </div>
              }
            />
            <Box
              children={
                <div className="flex flex-col gap-6">
                  <div className="flex flex-row justify-between items-center">
                    <div className="flex gap-2 items-center text-xl font-semibold">
                      <div className="h-3 w-3 rounded-full bg-purple" />
                      Basic
                    </div>
                    <div className="text-sm text-[#AAAAAA]">Subscription</div>
                  </div>
                  <div className="rounded bg-purple text-center py-2">Get Premium</div>
                </div>
              }
            />
          </div>
          <div className="h-full flex justify-start w-[500px] font-semibold items-center h-[290px]">
            <TypeAnimation
              sequence={[
                'Step by step to knowledge!',
                3000,
                'Learn today, Сonquer tomorrow.',
                3000,
                'Every mistake is a step forward.',
                3000,
                'You can learn anytime, anywhere!',
                3000,
                'Walk your path to success.',
                3000,
                'Small efforts lead to big victories.',
                3000,
                "Don't be afraid to learn something new.",
                3000,
                "Soon you'll surprise yourself.",
                3000,
                'Knowledge is a superpower.',
                3000,
                'Overcome yourself and become the best version.',
                3000,
              ]}
              wrapper="span"
              speed={10}
              style={{ fontSize: '1.5em', display: 'inline-block' }}
              repeat={Infinity}
            />
          </div>
          <div className="w-[330px]">
            <Box
              children={
                <div className="flex flex-col gap-6">
                  <div className="flex flex-col gap-2">
                    <span className="text-xl font-semibold">Daily Progress</span>
                    <span className="text-[#AAAAAA]">Check task if you are done!</span>
                  </div>
                  <div className="flex flex-col gap-4">
                    {daylis.map((daily) => (
                      <div key={daily.dailyId} className="flex flex-row gap-4 items-center">
                        <div className="w-[190px]">
                          <span>{daily.title}</span>
                          <ProgressBar maxValue={1} activeValue={daily.isClosed ? 1 : 0} />
                        </div>
                        <div
                          onClick={() => (daily.isClosed ? {} : checkDaily(daily.dailyId))}
                          className={`flex flex-row gap-2 cursor-pointer rounded-full px-2 ${
                            daily.isClosed ? 'bg-[#21C639]' : 'bg-[#2C3039]'
                          } items-center justify-center h-8 text-xs`}
                        >
                          <svg
                            width="12"
                            height="12"
                            viewBox="0 0 12 12"
                            fill="none"
                            stroke="#FFFFFF"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M6.05263 11.2155C8.93306 11.2155 11.2681 8.88041 11.2681 5.99999C11.2681 3.11956 8.93306 0.784515 6.05263 0.784515C3.1722 0.784515 0.837158 3.11956 0.837158 5.99999C0.837158 8.88041 3.1722 11.2155 6.05263 11.2155Z"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                            <path
                              d="M4.48779 5.99999L5.53089 7.04308L7.61708 4.95689"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                          {daily.isClosed ? 'Done' : isLoading ? 'Processing' : 'Check'}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              }
            />
          </div>
        </div>
        <div className="mt-4">
          <BattlePass />
        </div>
      </div>
    </>
  );
};

export default DashboardPage;