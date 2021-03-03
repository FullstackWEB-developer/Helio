import React from 'react';
import './checkbox.scss';
import withErrorLogging from '../../HOC/with-error-logging';
export interface CheckboxCheckEvent {
    value: string;
    checked: boolean;
}

interface CheckboxProps {
    name: string,
    label: string,
    defaultChecked?: boolean,
    value : string,
    truncate?: boolean;
    onChange: (event: CheckboxCheckEvent) => void
}

const Checkbox  = React.forwardRef<HTMLInputElement, CheckboxProps>(({name, label, value, defaultChecked, truncate = false, onChange, ...props} : CheckboxProps, ref) =>{
    const [checked, setChecked] = React.useState(defaultChecked || false);

    React.useEffect(() => {
        if (onChange) {
            onChange({value, checked});
        }
    }, [checked]);

    return  <div onClick={() => setChecked(!checked)} className='cursor-pointer flex flex-row items-center h-9'>
        <span className='outer border border-helio_dark_gray flex justify-center items-center'>
            <span className={'inner bg-helio_dark_gray block ' + (!checked ? 'hidden' : '')}/>
        </span>
        <input
            className='hidden'
            ref={ref}
            type="checkbox"
            name={name}
            value={value}
            checked={checked}
            onChange={e => {
                setChecked(e.target.checked);
            }}
        />
        <div className={'w-60 ' + (truncate ? 'truncate' : '')}>
            <label className='pl-4 text-helio_dark_gray' htmlFor={`${name}_${value}`}>{label}</label>
        </div>
    </div>;
})

export default withErrorLogging(Checkbox);
