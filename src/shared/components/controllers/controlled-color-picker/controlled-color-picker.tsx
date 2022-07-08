import { SketchPicker } from 'react-color';
import { Controller } from 'react-hook-form';
import { Control } from 'react-hook-form/dist/types/form';
import { useTranslation } from 'react-i18next';
import { useRef, useState } from 'react';
import './controlled-color-picker.scss'

export interface ControlledInputProps {
    control: Control;
    required?: boolean;
    name: string;
    value?: string;
    defaultValue?: string;
    onChangeColor?: (key:string, color: string) => void,
}

const ControlledColorPicker = ({
    control,
    required = false,
    name,
    value,
    defaultValue,
    onChangeColor,
}: ControlledInputProps) => {
    const defaultColor = '#000000';
    const parentRef = useRef<HTMLDivElement>(null);
    const { t } = useTranslation();
    const requiredText = t('common.required');
    const [displayColorPicker, setDisplayColorPicker] = useState<boolean>(false);
    return (
        <Controller
            name={name}
            control={control}
            rules={{
                required: required ? requiredText : ''
            }}
            value={value}
            defaultValue={defaultValue ?? defaultColor}
            render={(controllerProps) => {
                return (
                    <div ref={parentRef}>
                        <div className='flex flex-row items-center'>
                            <div className='color-wrapper' onClick={() => setDisplayColorPicker(!displayColorPicker)}>
                                <div className='color' style={{ backgroundColor: controllerProps.value ?? defaultValue ?? defaultColor }} />
                            </div>
                            <div className='ml-4 body3-medium'>{`HEX: ${controllerProps.value ?? defaultValue ?? defaultColor}`}</div>
                        </div>

                        {displayColorPicker &&
                            <div className='popover' style={{ top: parentRef.current?.getBoundingClientRect().bottom }}>
                                <div className='cover' onClick={() => setDisplayColorPicker(false)} />
                                <SketchPicker  {...controllerProps} color={controllerProps.value ?? defaultValue ?? defaultColor} onChange={(color, _) => {
                                    controllerProps.onChange(color.hex);
                                    onChangeColor && onChangeColor(name, color.hex);
                                }} />
                            </div>}

                    </div>
                );
            }}
        />
    );
}
export default ControlledColorPicker;