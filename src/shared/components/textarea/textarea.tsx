import {Icon} from '@components/svg-icon/icon';
import SvgIcon from '@components/svg-icon/svg-icon';
import React, {ChangeEvent, Fragment} from 'react';
import {useTranslation} from 'react-i18next';

interface TextAreaProps extends React.HTMLAttributes<HTMLTextAreaElement> {
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
    onChange?: (e: ChangeEvent<HTMLTextAreaElement>) => void,
    icon?: Icon,
    iconOnClick?: () => void,
    isLoading?: boolean,
    iconClassNames?: string,
    iconFill?: string,
    iconContainerClassName? : string
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
                                                                           ...props
                                                                       }: TextAreaProps, ref) => {
                                                                            
    const {t} = useTranslation();                                                                  
    const onClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        if (iconOnClick) {
            iconOnClick();
        }
    }    
    const defaultContainerClasses = 'flex flex-row w-full h-full items-center';                                                                
    return (
        <Fragment>
            <label htmlFor={htmlFor} className='block subtitle'>
                {label}
            </label>
            <div className={`${props.overwriteDefaultContainerClasses ? '' : defaultContainerClasses} ${props.textareaContainerClasses ? props.textareaContainerClasses : ''}`}>
                <textarea ref={ref} {...props} value={value}
                        className={`mt-1 shadow-none p-4 ${(hasBorder ? ' border ' : '')} ${resizable ? 'resize' : 'resize-none'} ${props.className}`}/>
                {
                    props.icon && value && value?.trim()?.length > 0 &&
                    <div
                        className={`flex-grow ${iconContainerClassName ? iconContainerClassName : 'px-7'}`}>
                        {
                            props.isLoading ? <span className='subtitle3-small'>{`${t('common.processing')}...`}</span> :
                                <SvgIcon
                                    type={props.icon ?? Icon.Send}
                                    fillClass={iconFill ? iconFill : ''}
                                    className={iconClassNames ? iconClassNames : ''}
                                    onClick={(e) => {
                                        onClick(e)
                                    }}/>
                        }
                    </div>                    
                }
            </div>            
            {props.error && <div className='text-red-500'>{props.error}</div>}
        </Fragment>
    );
})

export default TextArea;
