import React from 'react';
import './stepper.css'
const Stepper = ({ steps, currentStep, completedSteps }) => {
  return (
    <ul className="flex relative mx-auto w-[60rem] list-none p-0 mt-24">
      {steps.map((step, index) => {
        const isCurrent = currentStep === index + 1;
        const isComplete = completedSteps.includes(index + 1);

        return (
          <li
            key={index}
            className={`flex-1 py-4 px-10 -ml-5 relative ${isComplete ? 'bg-gradient-to-l from-gray-100 via-gray-200 to-gray-100' : ''} 
              ${isCurrent ? 'bg-white font-bold' : 'bg-gradient-to-l from-white via-gray-100 to-gray-100'} 
              ${index === 0 ? 'clip-path-stepper-item' : ''}
              ${index === steps.length - 1 ? 'clip-path-stepper-item-last' : 'clip-path-stepper-item'}
            `}
          >
            {step}
          </li>
        );
      })}
      <div className="absolute top-0 left-0 w-full h-full bg-gray-200 -ml-5" style={{ width: 'calc(100% - 20px)' }}></div>
    </ul>
  );
};

export default Stepper;
