import {Icon} from '@components/svg-icon/icon';
import SvgIcon from '@components/svg-icon/svg-icon';
import React, {ChangeEvent, Fragment, useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import classnames from 'classnames';
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
    onCtrlEnter?: () => void,
    isLoading?: boolean,
    iconClassNames?: string,
    iconFill?: string,
    iconContainerClassName?: string,
    maxLength?: number;
    className?: string;
    placeHolder?: string;
    maxLengthClassName?: string;
    disabled?: boolean;
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
    isLoading,
    overwriteDefaultContainerClasses,
    textareaContainerClasses,
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

    const onKeyPress = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (event.ctrlKey && event.nativeEvent.code === 'Enter' && props.onCtrlEnter) {
            props.onCtrlEnter();
        }
    }

    const defaultContainerClasses = 'flex flex-row w-full h-full items-center border-b';
    const textAreaClass = classnames('mt-1 shadow-none p-4', props.className, {
        'border': hasBorder,
        'resize': resizable,
        'resize-none':!resizable
    });

    return (
        <Fragment>
            <label htmlFor={htmlFor} className='block subtitle'>
                {label}
            </label>
            <div className={`relative ${overwriteDefaultContainerClasses ? '' : defaultContainerClasses} ${textareaContainerClasses ? textareaContainerClasses : ''}`}>
                <textarea ref={ref} {...props} value={textAreaValue} onChange={(e => handleOnChange(e))}
                    placeholder={placeHolder ? placeHolder : ''}
                    className={textAreaClass}
                    onKeyPress={onKeyPress}
                />
                {
                    props.icon && textAreaValue && textAreaValue?.trim()?.length > 0 &&
                    <div
                        className={`absolute right-8 ${iconContainerClassName ? iconContainerClassName : ''} ${isLoading ? 'bottom-4 -mr-2' : 'bottom-6 cursor-pointer'}`}>
                        <SvgIcon
                            isLoading={isLoading}
                            type={props.icon ?? Icon.Send}
                            fillClass={iconFill ? iconFill : ''}
                            className={iconClassNames ? iconClassNames : ''}
                            onClick={onClick} />
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
