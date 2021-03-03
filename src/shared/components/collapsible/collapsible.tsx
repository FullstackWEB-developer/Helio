import withErrorLogging from '../../../shared/HOC/with-error-logging';
import React, {useState} from 'react';
import { ReactComponent as ArrowDownIcon } from '../../icons/Icon-Arrow-down-16px.svg';

import { ReactComponent as ArrowUpIcon } from '../../icons/Icon-Arrow-up-16px.svg';
interface AccordionProps {
    title?: string;
    children: React.ReactNode;
}

const Collapsible = ({title, children} : AccordionProps) => {

    const [isOpen, setIsOpen] = useState(false);
    return <div>
        <div className='h-12 flex flex-row justify-between items-center'>
            <div className='font-medium'>{title}</div>
            <div>
                {isOpen ? <span className='cursor-pointer' onClick={ () => setIsOpen(false)}>
                    <ArrowUpIcon/>
                </span> :
                    <span className='cursor-pointer' onClick={ () => setIsOpen(true)}>
                    <ArrowDownIcon/>
                </span>
                }
            </div>
        </div>
        {isOpen && <div>{children}</div>}
    </div>;
}

export default withErrorLogging(Collapsible);
