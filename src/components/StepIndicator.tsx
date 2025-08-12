import React from 'react';
import { Check } from 'lucide-react';
import { StepStatus } from '../types';

interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
}

interface StepProps {
  stepNumber: number;
  status: StepStatus;
  title: string;
  isLast?: boolean;
}

const Step: React.FC<StepProps> = ({ stepNumber, status, title, isLast }) => {
  return (
    <div className="flex items-center">
      <div className="flex flex-col items-center">
        <div
          className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
            status === 'completed'
              ? 'bg-gradient-to-r from-purple-500 to-blue-500 border-transparent text-white'
              : status === 'current'
              ? 'border-purple-500 text-purple-500 bg-purple-50'
              : 'border-gray-300 text-gray-400 bg-white'
          }`}
        >
          {status === 'completed' ? (
            <Check size={16} />
          ) : (
            <span className="text-sm font-semibold">{stepNumber}</span>
          )}
        </div>
        <span
          className={`mt-2 text-xs font-medium transition-colors duration-300 ${
            status === 'current' || status === 'completed'
              ? 'text-gray-900'
              : 'text-gray-500'
          }`}
        >
          {title}
        </span>
      </div>
      {!isLast && (
        <div
          className={`w-16 h-px ml-4 mr-4 transition-colors duration-300 ${
            status === 'completed' ? 'bg-purple-500' : 'bg-gray-300'
          }`}
        />
      )}
    </div>
  );
};

const StepIndicator: React.FC<StepIndicatorProps> = ({ currentStep, totalSteps }) => {
  const steps = [
    'Informações',
    'Estilo Visual', 
    'Público-alvo',
    'Conceitos',
    'Refinamento'
  ];

  const getStepStatus = (stepIndex: number): StepStatus => {
    if (stepIndex < currentStep - 1) return 'completed';
    if (stepIndex === currentStep - 1) return 'current';
    return 'pending';
  };

  return (
    <div className="flex justify-center mb-8 overflow-x-auto pb-4">
      <div className="flex items-center space-x-0">
        {steps.map((title, index) => (
          <Step
            key={index}
            stepNumber={index + 1}
            status={getStepStatus(index)}
            title={title}
            isLast={index === steps.length - 1}
          />
        ))}
      </div>
    </div>
  );
};

export default StepIndicator;