import React from 'react';
import './email-editor.scss';
import FormattedTextarea from '@components/textarea/formatted-textarea';

export interface EmailEditorProps {
    onChange:(content: string) => void;
    content: string;
    showSendIcon?: boolean
}
const EmailEditor = ({onChange, content, showSendIcon = true} : EmailEditorProps) => {
    return <div className='email-editor'>
        <FormattedTextarea onChange={onChange} showSendIcon={showSendIcon} value={content}  />
    </div>
}

export default EmailEditor;
