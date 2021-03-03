import React from 'react';
import './radio.scss';
import withErrorLogging from '../../HOC/with-error-logging';
export interface RadioItem {
    label: string;
    value: string;
}

export interface RadioProps {
    name: string;
    items: RadioItem[];
    defaultValue? : string;
    truncate?: boolean;
    onChange: (value: string) => void;
}

const Radio = React.forwardRef<HTMLInputElement, RadioProps>( ({name, items,onChange, defaultValue, truncate = false, ...props} : RadioProps, ref) =>{

    const [value, setValue] = React.useState(defaultValue || '');

    React.useEffect(() => {
        if (onChange) {
            onChange(value);
        }
    }, [value, onChange]);

    return <div>
        {
            items.map(item => {
                return <div key={item.value}>
                    <div className='flex flex-row items-center h-9 cursor-pointer' onClick={() => setValue(item.value)}>
                        <div className='rounded-full outer border border-helio_dark_gray flex justify-center items-center'>
                            <div className={'rounded-full inner bg-helio_dark_gray block ' + (item.value !== value ? 'hidden' : '')}/>
                        </div>
                        <input className='hidden' type='radio' value={item.value} onChange={(_) => {setValue(item.value);}} checked={item.value === value} {...props} name={name} />
                        <div className={'w-60 ' + (truncate ? 'truncate' : '')}>
                            <label className={'pl-4 ' + (truncate ? 'truncate' : '')} htmlFor={name}>{item.label}</label>
                        </div>
                    </div>
                </div>
            })
        }
    </div>;
});

export default withErrorLogging(Radio);
