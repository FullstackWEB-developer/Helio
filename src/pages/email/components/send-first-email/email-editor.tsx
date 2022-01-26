import ReactQuill from 'react-quill';
import React from 'react';
import {useTranslation} from 'react-i18next';
import './email-editor.scss';

export interface EmailEditorProps {
    onChange:(content: string) => void;
    content: string;
}
const EmailEditor = ({onChange, content} : EmailEditorProps) => {
    const {t} = useTranslation();
    return <div className='email-editor'>
        <ReactQuill
        defaultValue=''
        value={content}
        onChange={onChange}
        className='bg-white'
        placeholder={t('email.new_email.body_placeholder')}
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
    </div>
}

export default EmailEditor;
