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
    showSendIcon?: boolean;
}

const FormattedTextarea = React.forwardRef<ReactQuill, FormattedTextareaProps>(({isLoading, iconFill, onClick, value='', onChange, disabled, showSendIcon = true}: FormattedTextareaProps, ref) => {
    const {t} = useTranslation();
    const [content, setContent] = useState(value);

    useEffect(() => {
        setContent(value)
    }, [value])

    const handleChange = (value: string) =>  {
        setContent(value);
        onChange(value);
    }

    const wrapperClass = classnames('relative formatted-text-area', {
        'ql-disabled' : disabled
    })
    return <div className={wrapperClass}>
        <div className='bg-white z-50'>
            <div id="toolbar">
                <select className="ql-size">
                    <option value="huge">{t('email.inbox.formatter.heading')}</option>
                    <option value="large">{t('email.inbox.formatter.subheading')}</option>
                    <option selected></option>
                </select>
                <button className="ql-bold"></button>
                <button className="ql-italic" ></button>
                <button className="ql-underline"></button>
            </div>
            <div id="editor"></div>
        </div>
        <ReactQuill
            ref={ref}
            onChange={(value) => handleChange(value)}
            defaultValue=''
            readOnly={disabled}
            className='bg-white'
            value={content}
            placeholder={t('common.enter_text')}
            modules={{
                toolbar: '#toolbar'
            }}
        />
        {showSendIcon && content.replace(/<[^>]+>/g, '') && <div
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
