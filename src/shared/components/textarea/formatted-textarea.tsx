import React, {useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import ReactQuill from 'react-quill';
import "react-quill/dist/quill.snow.css";
import './formatted-textarea.scss';
import SvgIcon, {Icon} from '@components/svg-icon';
import classnames from 'classnames';
export interface FormattedTextareaProps {
    isLoading?: boolean;
    iconFill?: string;
    onClick?: () => void;
    value?: string;
    onChange:(message: string) =>void;
    disabled?: boolean;
}

    const FormattedTextarea = React.forwardRef<ReactQuill, FormattedTextareaProps>(({isLoading, iconFill, onClick, value='', onChange, disabled}: FormattedTextareaProps, ref) => {
    const {t} = useTranslation();
    const [content, setContent] = useState(value);

    useEffect(() => {
        setContent(value)
    }, [value])

    const handleChange = (value: string) =>  {
        setContent(value);
        onChange(value);
    }

    const wrapperClass = classnames('relative', {
        'ql-disabled' : disabled
    })
    return <div className={wrapperClass}>
            <ReactQuill
                ref={ref}
                onChange={(value) => handleChange(value)}
                defaultValue=''
                readOnly={disabled}
                className='bg-white'
                value={content}
                placeholder={t('common.enter_text')}
                modules={{
                    toolbar: [
                        [{ 'header': [1, 2, false] }],
                        ['bold', 'italic', 'underline']
                    ]
                }}
            formats={[
            "header",
            "font",
            "size",
            "bold",
            "italic",
            "underline"
        ]}
            />
            {content.replace(/<[^>]+>/g, '') && <div
                className={`absolute right-8 cursor-pointer ${isLoading ? 'bottom-2 -mr-2' : 'bottom-4 cursor-pointer'}`}>
                <SvgIcon
                    isLoading={isLoading}
                    type={Icon.Send}
                    disabled={disabled}
                    fillClass={iconFill ? iconFill : ''}
                    className='icon-medium'
                    onClick={onClick}/>
            </div>}
        </div>
})



export default FormattedTextarea;
