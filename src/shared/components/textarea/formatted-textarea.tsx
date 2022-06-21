import React, {useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import ReactQuill, {Quill} from 'react-quill';
import './formatted-textarea.scss';
import 'react-quill/dist/quill.snow.css';
import SvgIcon, {Icon} from '@components/svg-icon';
import classnames from 'classnames';
export interface FormattedTextareaProps {
    isLoading?: boolean;
    iconFill?: string;
    onClick?: () => void;
    value?: string;
    onChange: (message: string) => void;
    disabled?: boolean;
    showSendIcon?: boolean;
    placeHolder?: string;
    hyperLinkButton?: boolean;
}

const FormattedTextarea = React.forwardRef<ReactQuill, FormattedTextareaProps>(({isLoading, iconFill, onClick, value = '', onChange, disabled, showSendIcon = true,
    placeHolder = 'common.enter_text', hyperLinkButton = false}: FormattedTextareaProps, ref) => {
    const {t} = useTranslation();
    const emptyHtml = '<p><br></p>';
    const [content, setContent] = useState(value);

    const Link = Quill.import('formats/link');
    Link.sanitize = (url: string) => {
        // Quill by default creates relative links if scheme is missing.
        if (!url.startsWith('http://') && !url.startsWith('https://')) {
            return `http://${url}`
        }
        return url;
    }

    useEffect(() => {
        setContent(value)
    }, [value])

    const handleChange = (value: string) => {
        if (value === emptyHtml) {
            value = '';
        }
        setContent(value);
        onChange(value);
    }

    const wrapperClass = classnames('relative formatted-text-area w-full', {
        'ql-disabled': disabled
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
                {
                    hyperLinkButton && <button className='ql-link'></button>
                }
            </div>
            <div id="editor"></div>
        </div>
        <ReactQuill
            ref={ref}
            onChange={(value) => handleChange(value)}
            defaultValue=''
            readOnly={disabled}
            className='bg-white links'
            value={content}
            placeholder={t(placeHolder)}
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
                onClick={onClick} />
        </div>}
    </div>
})



export default FormattedTextarea;
