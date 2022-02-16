import React from 'react';
import './email-editor.scss';
import FormattedTextarea from '@components/textarea/formatted-textarea';

export interface EmailEditorProps {
    onChange:(content: string) => void;
    content: string;
}
const EmailEditor = ({onChange, content} : EmailEditorProps) => {
    return <div className='email-editor'>
        <FormattedTextarea onChange={onChange} value={content}  />
    </div>
}

export default EmailEditor;
