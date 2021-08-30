import classnames from 'classnames';
import React, {useState, useEffect, useRef} from 'react';
import './slider.scss';

interface SliderProps {
    value?: number;
    min?: number;
    max?: number;
    step?: number;
    className?: string;
    onChange?: (value: number) => void;
}

const Slider = ({
    value = 0,
    min = 0,
    max = 100,
    step,
    className,
    ...props
}: SliderProps) => {

    const [currentValue, setCurrentValue] = useState(value);
    const inputRangeRef = useRef<HTMLInputElement>(null);


    useEffect(() => {
        setCurrentValue(value);
    }, [value])

    useEffect(() => {
        if (!inputRangeRef.current) {
            return () => { };
        }

        const inputElement = inputRangeRef.current;

        const changeBackground = () => {

            const distance = (currentValue - min) / (max - min);
            const distancePorcentaje = isNaN(distance) ? 0 : distance * 100;

            inputElement.style.background = `linear-gradient(to right, var(--slider-traveled-track) 0%, var(--slider-traveled-track) ${distancePorcentaje}%, var(--slider-runnable-track) ${distancePorcentaje}%, var(--slider-runnable-track) 100%)`
        }

        changeBackground();
        inputElement.addEventListener('input', () => changeBackground())

        return () => {
            inputElement.removeEventListener('input', () => changeBackground())

        }
    }, [max, min, currentValue])

    const onChanged = (event: React.ChangeEvent<HTMLInputElement>) => {
        setCurrentValue(event.target.valueAsNumber);
        props.onChange?.(event.target.valueAsNumber);
    }

    return (
        <input
            ref={inputRangeRef}
            type='range'
            min={min}
            max={max}
            step={step}
            value={currentValue}
            onChange={onChanged}
            className={classnames('slider', className)}
        />
    )
};

export default Slider;
