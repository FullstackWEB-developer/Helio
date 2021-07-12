import {Icon} from '@components/svg-icon/icon';
import SvgIcon from '@components/svg-icon/svg-icon';
import React, {ChangeEvent, Fragment, useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';

interface TextAreaProps {
    id?: string;
    name?: string;
    value?: string;
    label?: string;
    required?: boolean;
    rows?: number;
    error?: string;
    htmlFor?: string;
    hasBorder?: boolean;
    resizable?: boolean;
    textareaContainerClasses?: string,
    overwriteDefaultContainerClasses?: boolean,
    onChange?: (message: string) => void,
    icon?: Icon,
    iconOnClick?: () => void,
    isLoading?: boolean,
    iconClassNames?: string,
    iconFill?: string,
    iconContainerClassName?: string,
    maxLength?: number;
    className?: string;
    placeHolder?: string;
    maxLengthClassName?: string;
}

const TextArea = React.forwardRef<HTMLTextAreaElement, TextAreaProps>(({
                                                                           label,
                                                                           value,
                                                                           htmlFor,
                                                                           hasBorder = true,
                                                                           resizable = true,
                                                                           iconClassNames,
                                                                           iconFill,
                                                                           iconContainerClassName,
                                                                           iconOnClick,
                                                                           placeHolder,
                                                                           maxLengthClassName,
                                                                           ...props
                                                                       }: TextAreaProps, ref) => {

    const {t} = useTranslation();
    const [remainLength, setRemainLength] = useState(props.maxLength);
    const [textAreaValue, setTextAreaValue] = useState<string>('');

    useEffect(() => {
        setTextAreaValue(value || '');
    }, [value]);

    const onClick = () => {
        if (iconOnClick) {
            iconOnClick();
        }
    }
    const handleOnChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
        const message = event.target.value;
        setTextAreaValue(message);
        if (props.maxLength) {
            setRemainLength(props.maxLength - message.length);
        }
        if (props.onChange) {
            props.onChange(message);
        }
    }
    const defaultContainerClasses = 'flex flex-row w-full h-full items-center';
    return (
        <Fragment>
            <label htmlFor={htmlFor} className='block subtitle'>
                {label}
            </label>
            <div className={`${props.overwriteDefaultContainerClasses ? '' : defaultContainerClasses} ${props.textareaContainerClasses ? props.textareaContainerClasses : ''}`}>
                <textarea ref={ref} {...props} value={textAreaValue} onChange={(e => handleOnChange(e))}
                          placeholder={placeHolder ? placeHolder : ''}
                          className={`mt-1 shadow-none p-4 ${(hasBorder ? ' border ' : '')} ${resizable ? 'resize' : 'resize-none'} ${props.className}`}/>
                {
                    props.icon && textAreaValue && textAreaValue?.trim()?.length > 0 &&
                    <div
                        className={`flex-grow ${iconContainerClassName ? iconContainerClassName : 'px-7'} ${props.isLoading ? '-mr-2' : 'cursor-pointer'}`}>
                        <SvgIcon
                            isLoading={props.isLoading}
                            type={props.icon ?? Icon.Send}
                            fillClass={iconFill ? iconFill : ''}
                            className={iconClassNames ? iconClassNames : ''}
                            onClick={onClick}/>
                    </div>
                }
            </div>
            {
                props.maxLength && <div className={`flex justify-end pt-1 pr-4 ${maxLengthClassName ? maxLengthClassName : 'body3'}`}>
                    {t('external_access.characters', {maxLength: remainLength})}
                </div>
            }
            {props.error && <div className='text-red-500'>{props.error}</div>}
        </Fragment>
    );
})

export default TextArea;
