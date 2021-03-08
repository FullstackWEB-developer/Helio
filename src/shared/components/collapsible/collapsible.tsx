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

    const toggle = () => {
        setIsOpen(!isOpen);
    }

    return <div>
        <div className='h-12 flex flex-row justify-between items-center'>
            <div onClick={ () => toggle()} className='subtitle cursor-pointer'>{title}</div>
            <div className='cursor-pointer' onClick={ () => toggle()}>
                {isOpen ? <ArrowUpIcon/> : <ArrowDownIcon/>}
            </div>
        </div>
        {isOpen && <div>{children}</div>}
    </div>;
}

export default withErrorLogging(Collapsible);
