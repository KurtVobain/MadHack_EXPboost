import React, { useState } from 'react';
import Box from '../componets/Box';
import Dropdown from '../componets/Dropdown';

interface CoursesPageProps {
}

const courses = [
  "LearnWeb3"
]

const CoursesPage: React.FC<CoursesPageProps> = ({  }) => {
  const [activeCourses, setActiveCourses] = useState<string | null>(null);

  return (
    <div className='flex flex-col gap-6 w-[660px] mx-auto' >
      <span className='text-3xl'>Add Your Courses</span>
      <div className="max-w-[440px] text-gray">
        Connect your courses to track progress and stay on top of your learning journey.
      </div>
      <Box children = {
        <div className="flex flex-col gap-4 ">
          <span className='text-xl'>Add Learning Platform</span>
          <div className="max-w-[440px]">
            Select your learning platform and enter your username or profile URL. We’ll take it from there!
          </div>
          <div className="flex flex-row h-11 gap-4">
            <Dropdown options={courses} activeValue={activeCourses} onChange={(value) => setActiveCourses(value)}/>
            <div className="rounded bg-purple text-center py-2.5 w-44 p-4">
              Add Platform
            </div>
          </div>
          
        </div>
      }/>
      <span className='text-3xl'>Courses</span>
      <div className="w-full p-12 bg-[#202329] border border-[#2C3039] text-center">
        
        <div className="flex flex-col gap-2">
          <span>You haven’t added any courses yet.</span>
          <span className='text-gray'>Start by adding your first course to track your progress and earn rewards!</span>
        </div>
      </div>
    </div>
  );
};

export default CoursesPage;