import axios from "axios";
import React from "react";
import Slider from "react-slick";
import { BattlePassStore } from "../stores/BattlePassStore";
import ProgressBar from "./ProgressBar";
import { UserStore } from "../stores/UserStore";

interface BattlePassProps {}

const BattlePass: React.FC<BattlePassProps> = ({}) => {
  const levels = BattlePassStore((state) => state.levels);
  const curBPLvl = UserStore((state) => state.curBPLvl);
  const curBPExp = UserStore((state) => state.curBPExp);

  const settings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 5,
    slidesToScroll: 1,
  };

  if (!levels) {
    return null;
  }
  return (
    <Slider {...settings}>
      {levels.map((level, index) => (
        <div
          key={level.id}
          className={`w-[226px] pr-4 ${level.level > curBPLvl ? 'opacity-25' : ''}`}
        >
          <div className="flex flex-col rounded overflow-hidden borderGradient p-2 gap-2">
            <div className="relative">
              <img src={`../rewards/art 0${index + 1}.png`} alt="" />
              <div className={`rounded-full flex flex-row gap-1 items-center text-xs py-1 px-2 absolute top-0 left-0 text-xs m-2 bg-stone-400 bg-opacity-70`}>
                <svg width="10" height="11" viewBox="0 0 10 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="0.5" y="0.824219" width="9.35156" height="9.35156" rx="1.55859" fill="#FF7423"/>
                  <g clip-path="url(#clip0_2462_209)">
                  <path d="M3.2096 6.0808C3.16233 6.08096 3.11599 6.0677 3.07596 6.04258C3.03593 6.01745 3.00385 5.98148 2.98345 5.93884C2.96305 5.89621 2.95516 5.84866 2.96071 5.80173C2.96626 5.75479 2.98501 5.71039 3.01478 5.67368L5.48742 3.12612C5.50597 3.10471 5.53124 3.09024 5.5591 3.08509C5.58695 3.07994 5.61573 3.08441 5.64071 3.09777C5.66569 3.11113 5.68538 3.13259 5.69656 3.15861C5.70773 3.18464 5.70973 3.2137 5.70222 3.24101L5.22267 4.74457C5.20853 4.78242 5.20379 4.82313 5.20884 4.86321C5.21389 4.90329 5.22858 4.94155 5.25167 4.97471C5.27475 5.00786 5.30554 5.03492 5.34138 5.05357C5.37722 5.07221 5.41705 5.08188 5.45745 5.08175H7.20578C7.25304 5.08159 7.29938 5.09484 7.33941 5.11997C7.37944 5.1451 7.41152 5.18107 7.43193 5.2237C7.45233 5.26633 7.46021 5.31388 7.45467 5.36082C7.44912 5.40776 7.43037 5.45216 7.40059 5.48886L4.92796 8.03643C4.90941 8.05784 4.88413 8.0723 4.85628 8.07745C4.82843 8.08261 4.79965 8.07813 4.77467 8.06477C4.74969 8.05141 4.73 8.02996 4.71882 8.00393C4.70764 7.9779 4.70565 7.94885 4.71316 7.92154L5.1927 6.41797C5.20684 6.38013 5.21159 6.33942 5.20654 6.29933C5.20149 6.25925 5.18679 6.22099 5.16371 6.18784C5.14062 6.15468 5.10984 6.12762 5.074 6.10898C5.03816 6.09033 4.99833 6.08066 4.95793 6.0808H3.2096Z" stroke="white" stroke-width="0.584473" stroke-linecap="round" stroke-linejoin="round"/>
                  </g>
                  <defs>
                  <clipPath id="clip0_2462_209">
                  <rect width="5.99427" height="5.99427" fill="white" transform="translate(2.21094 2.58398)"/>
                  </clipPath>
                  </defs>
                </svg>
                {level.level} Level
              </div>
              <div className={`${
                level.isPremium ? "bg-[#FF7423]" : "bg-[#21C639]"
              } rounded-full text-xs py-1 px-2 absolute top-0 right-0 text-xs m-2`}>
                {level.isPremium ? "Premium" : "Free"}
              </div>
            </div>
            <div className="flex flex-row gap-4 items-center">
              <span className="text-sm">Dailies</span>
              <ProgressBar
                maxValue={level.experience}
                activeValue={curBPExp > level.experience ? level.experience : curBPExp}
              />
            </div>
            
            {/* <div
              className={`${
                level.isPremium ? "bg-[#FF7423]" : "bg-[#21C639]"
              } rounded-t text-xs py-2 text-center`}
            >
              {level.isPremium ? "Premium Rewards" : "Free"}
            </div>
            <div className="flex flex-col items-center justify-center px-4 pb-2">
              <span className="my-3">{level.level} Level</span>
              <div className="w-[90px] rounded-full flex items-center justify-center overflow-hidden shadow-inner shadow-md">
                <img src={`../rewards/art 0${index + 1}.png`} alt="" />
              </div>
              {level.awards[0]?.amount > 0 && (
                <div className="flex gap-2 items-center my-3">
                  +{level.awards[0]?.amount}
                  <svg
                    width="19"
                    height="20"
                    viewBox="0 0 19 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g clipPath="url(#clip0_2175_859)">
                      <path
                        d="M22.2576 0.505493H0.0883789V14.5962C3.24387 12.4165 7.03423 9.7137 7.70693 8.52859C8.52941 7.07991 8.70261 5.69984 8.23635 4.3122C8.11007 3.93616 8.11093 3.93668 8.51315 4.47216C9.04081 5.1749 9.9371 5.96138 10.6026 6.30568C11.8222 6.93665 13.2464 6.97019 14.8491 6.40541C15.3532 6.22777 15.6427 6.1582 15.4922 6.25092C15.0046 6.5514 14.173 7.37641 13.7651 7.96456C13.2299 8.73601 12.8794 10.0514 12.959 10.9904C13.016 11.6634 13.3245 12.7763 13.6319 13.4178C13.7617 13.6887 13.72 13.6648 13.2907 13.2229C12.6504 12.5637 11.9281 12.1733 10.8855 11.9231C8.86526 11.4383 3.86727 13.5571 0.0883789 15.3942V22.6747H22.2576V0.505493Z"
                        fill="#492BFF"
                      />
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M10.5653 7.39779C11.1503 7.7738 12.1278 7.84614 12.921 7.57213L13.2954 7.44281L12.9013 7.82972C12.0707 8.64523 11.8325 9.53618 12.1406 10.6744C12.2203 10.9691 12.2345 11.1275 12.1722 11.0265C11.9447 10.6582 11.1692 10.1151 10.6648 9.97087C10.1329 9.81887 9.19299 9.90358 8.75931 10.1426C8.62333 10.2176 8.75273 10.0332 9.07422 9.69417C9.90145 8.82134 10.0971 7.8863 9.68032 6.79637L9.5231 6.38503L9.91419 6.80788C10.1293 7.04041 10.4223 7.30587 10.5653 7.39779Z"
                        fill="#FF7423"
                      />
                    </g>
                    <defs>
                      <clipPath id="clip0_2175_859">
                        <rect
                          x="0.0883789"
                          y="0.505493"
                          width="18.6952"
                          height="18.6952"
                          rx="9.34759"
                          fill="white"
                        />
                      </clipPath>
                    </defs>
                  </svg>
                </div>
              )}
              <ProgressBar
                maxValue={level.experience}
                activeValue={curBPExp > level.experience ? level.experience : curBPExp}
              />
            </div> */}
          </div>
        </div>
      ))}
    </Slider>
  );
};

export default BattlePass;