import React from 'react';
import {useTranslation} from 'react-i18next';
import './stepper.scss';

interface StepperProps {
  numberOfSteps: number;
  currentStep: number;
}
const Stepper = ({numberOfSteps, currentStep}: StepperProps) => {
  const {t} = useTranslation();
  const stepWidth = {
    width: `${(currentStep / numberOfSteps) * 100}%`
  }
  return (
    <div className='w-full flex flex-col relative'>
      <span className='caption-caps'>
        {t('common.step_x_of_x', {current: currentStep, total: numberOfSteps})}
      </span>
      <div className='w-full h-1 stepper my-2'>
        <div className='h-full step' style={stepWidth}></div>
      </div>
    </div>

  );
}

export default Stepper;