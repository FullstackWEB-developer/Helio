import React from 'react';
import {useTranslation} from 'react-i18next';
import ReactQuill from 'react-quill';

const ExternalEmailTextArea = ({content, handleChange}: {content: string, handleChange: (value: string) => void}) => {
    const {t} = useTranslation();
    return (
        <div className='reply-editor flex flex-1 overflow-hidden'>
            <ReactQuill
                onChange={(value) => handleChange(value)}
                defaultValue=''
                className='bg-white h-full w-full'
                value={content}
                placeholder={t('common.enter_text')}
                modules={{
                    toolbar: [
                        [{'header': [1, 2, false]}],
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
    )
}

export default ExternalEmailTextArea;