import classNames from 'classnames';
import React, {useEffect, useState} from 'react';
import './toggle-switch.scss';

const ToggleSwitch = ({isChecked, onSwitch, disabled, name = 'switch'}: {isChecked: boolean, onSwitch?: (checked: boolean) => void, disabled?: boolean, name?: string}) => {

    const [checked, setChecked] = useState(isChecked);

    useEffect(() => {
        setChecked(isChecked);
    }, [isChecked]);

    const onCheckChange = () => {
        if (onSwitch) {
            onSwitch(!checked);
        }
        setChecked(!checked);
    }

    const inputClassNames = classNames('toggle-switch', {'pointer-events-none': disabled});

    return (
        <label className={inputClassNames}>
            <input data-testid={name} type="checkbox" checked={checked} onChange={onCheckChange} disabled={disabled} />
            <span className="slider round"></span>
        </label>
    )
}

export default ToggleSwitch;