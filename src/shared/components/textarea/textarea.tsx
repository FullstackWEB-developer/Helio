import {Icon} from '@components/svg-icon/icon';
import SvgIcon from '@components/svg-icon/svg-icon';
import React, {ChangeEvent, Fragment, useEffect, useRef, useState} from 'react';
import {useTranslation} from 'react-i18next';
import classnames from 'classnames';
import mergeRefs from "react-merge-refs";
import FormattedTextarea from './formatted-textarea';
import ReactQuill from 'react-quill';
import './textarea.scss';

interface TextAreaProps {
    id?: string;
    name?: string;
    value?: string;
    label?: string;
    required?: boolean;
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
    alwaysDisplayIcon?: boolean,
    iconFill?: string,
    iconContainerClassName?: string,
    maxLength?: number;
    className?: string;
    placeHolder?: string;
    maxLengthClassName?: string;
    disabled?: boolean;
    showFormatting?: boolean;
    minRows?: number;
    maxRows?: number;
    rows?: number;
    showSendIconInRichTextMode?: boolean;
    toggleRichTextMode?: boolean;
    focusState?: boolean;
    hyperLinkButton?: boolean;
    hideFormattingButton?: boolean;
}

const TextArea = React.forwardRef<HTMLTextAreaElement, TextAreaProps>(({
    label = '',
    value,
    htmlFor,
    hasBorder = true,
    resizable = true,
    iconClassNames,
    iconFill,
    showFormatting= false,
    iconContainerClassName,
    iconOnClick,
    placeHolder,
    maxLengthClassName,
    rows = 1,
    isLoading,
    overwriteDefaultContainerClasses,
    textareaContainerClasses,
    minRows = rows ? rows : 1,
    maxRows = 3,
   alwaysDisplayIcon,
   showSendIconInRichTextMode,
   toggleRichTextMode = false,
   hyperLinkButton = false,
   hideFormattingButton = false,
    ...props
}: TextAreaProps, ref) => {

    const {t} = useTranslation();
    const [remainLength, setRemainLength] = useState(props.maxLength);
    const [textAreaValue, setTextAreaValue] = useState<string>('');
    const [isFormatEnabled, setFormatEnabled] = useState<boolean>(false);
    const initTextAreaHeight = useRef(0);
    const textAreaRef = React.useRef<HTMLTextAreaElement>(null);
    const formattedTextAreaRef = React.useRef<ReactQuill>(null);
    useEffect(() => {
        setTextAreaValue(value || '');
        setTimeout(() => {
            resizeHeight();
        }, 1);
    }, [value]);

    const onClick = () => {
        if (iconOnClick) {
            iconOnClick();
        }
    }

    useEffect(() => {
        if (textAreaRef.current && ! initTextAreaHeight.current) {
            initTextAreaHeight.current = textAreaRef.current?.clientHeight / rows ?? 0;
        }
    }, [textAreaRef?.current])


    const handleOnChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
        const message = event.target.value;
        setTextAreaValue(message);
        if (props.maxLength) {
            setRemainLength(props.maxLength - message.length);
        }
        if (props.onChange) {
            props.onChange(message);
        }

        resizeHeight();
    }


    const onKeyPress = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (event.ctrlKey && event.nativeEvent.code === 'Enter' && props.onCtrlEnter) {
            props.onCtrlEnter();
        }
    }

    const resizeHeight = () => {
        const field = textAreaRef.current;
        if (field) {
            if (field.scrollHeight / initTextAreaHeight.current > maxRows) {
                return;
            }
            field.style.height = 'auto';
            field.style.height = field.scrollHeight + 'px';
        }
    }

    const textAreaClass = classnames('shadow-none', props.className, {
        'resize': resizable,
        'resize-none':!resizable,
        'mt-1': !isFormatEnabled,
        'pr-14': !!props.icon
    });

    const textAreaWrapperClass = classnames(`${textareaContainerClasses} relative bg-white`,{
        'flex flex-row w-full h-full items-center p-4': !overwriteDefaultContainerClasses,
        'border-b': !hasBorder,
        'border': hasBorder,
        'textarea-wrapper': props.disabled
    });

    const textAreaOutWrapperClass = classnames('w-full h-full',{
        'textarea-wrapper-focus': props.focusState   
    });

    useEffect(() => {
        if(showFormatting || hideFormattingButton){
            setFormatEnabled(toggleRichTextMode);
        }        
    }, [toggleRichTextMode]);


    return (
        <Fragment>
            <div className='flex flex-row justify-between'>
                    <label htmlFor={htmlFor} className='block subtitle2 pb-2'>
                        {t(label)}
                    </label>
                    {showFormatting && <div onClick={() => setFormatEnabled(!isFormatEnabled)} className='cursor-pointer'>
                        <SvgIcon type={Icon.Format} fillClass={`${isFormatEnabled ? 'success-icon' : 'rgba-05-fill'}`}/>
                    </div>}
            </div>
            {isFormatEnabled && <div className='text-area'><FormattedTextarea value={textAreaValue}
                                                   ref={formattedTextAreaRef}
                                                   iconFill='notes-send'
                                                   onChange={(message) => props.onChange && props.onChange(message)}
                                                   onClick={onClick}
                                                   disabled={props.disabled}
                                                   isLoading={isLoading}
                                                   hyperLinkButton={hyperLinkButton}
                                                   showSendIcon={showSendIconInRichTextMode}/></div>}
            {!isFormatEnabled &&<div className={textAreaOutWrapperClass}>
                <div className={textAreaWrapperClass}>
                    <textarea ref={mergeRefs([textAreaRef, ref])}
                              {...props}
                              value={textAreaValue}
                              onChange={(e => handleOnChange(e))}
                              placeholder={placeHolder ? t(placeHolder) : ''}
                              className={textAreaClass}
                              rows={rows}
                              wrap='hard'
                              onKeyPress={onKeyPress}
                    />
                    {
                        props.icon && (alwaysDisplayIcon || (textAreaValue && textAreaValue?.trim()?.length > 0)) &&
                        <div
                            className={`absolute right-8 ${iconContainerClassName ? iconContainerClassName : ''} ${props.disabled ? 'not-allowed' : ''} ${isLoading ? 'bottom-2 -mr-2' : 'bottom-4 cursor-pointer'}`}>
                            <SvgIcon
                                disabled={props.disabled}
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
                </div>}
        </Fragment>
    );
})

export default TextArea;
