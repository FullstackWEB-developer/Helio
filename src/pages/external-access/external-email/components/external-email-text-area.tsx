import React from 'react';
import FormattedTextarea from '@components/textarea/formatted-textarea';

const ExternalEmailTextArea = ({content, handleChange}: {content: string, handleChange: (value: string) => void}) => {
    return (
        <div className='reply-editor flex flex-1 overflow-hidden w-full'>
            <FormattedTextarea placeHolder='external_access.email.type_your_message' onChange={handleChange} showSendIcon={false} value={content}  />
        </div>
    )
}

export default ExternalEmailTextArea;
