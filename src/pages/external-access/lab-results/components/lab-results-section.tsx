import React, {ReactNode} from 'react';

const LabResultsSection = ({title, children}: {title: string, children: ReactNode}) => {
    return (
        <div className='w-full pt-2'>
            <div className='pb-2 lab-results-border-bottom h-10'>{title}</div>
            <div className="py-4">
                {
                    children
                }
            </div>
        </div>
    )
}

export default LabResultsSection;