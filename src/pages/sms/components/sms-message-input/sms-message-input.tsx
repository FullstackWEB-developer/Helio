import React, {useRef, useState} from 'react';
import classnames from 'classnames';
import SvgIcon, {Icon} from '@components/svg-icon';
import TextEditor from '@components/text-editor';
import NotificationTemplateSelect from '@components/notification-template-select/notification-template-select';
import {NotificationTemplate, NotificationTemplateChannel} from '@shared/models/notification-template.model';
import customHooks from '../../../../shared/hooks/customHooks';
import {TemplateUsedFrom} from '@components/notification-template-select/template-used-from';

interface SmsMessageInputProps {
    isLoading?: boolean;
    onSendClick?: (text: string) => void;
    onTemplateClick?: () => void;
}

const SmsMessageInput = ({isLoading, ...props}: SmsMessageInputProps) => {

    const [hasMultipleRow, setMultipleRow] = useState(false);
    const [text, setText] = useState('');
    const [sendIconEnabled, setSendIconEnabled] = useState(false);
    const templateDiv = useRef<HTMLDivElement>(null);
    const [displayTemplateForTab, setDisplayTemplateForTab] = useState<boolean>(false);

    customHooks.useOutsideClick([templateDiv], () => {
        setDisplayTemplateForTab(false);
    });

    const alignIcon = () => ({
        'items-end': hasMultipleRow,
        'items-center': !hasMultipleRow
    });

    const onTextEditorChange = (value: string) => {
        setText(value);
        setSendIconEnabled(!!value);
    }

    const onSendClick = () => {
        if (sendIconEnabled && props.onSendClick) {
            props.onSendClick(text);
            setText('');
        }
    }

    const onTemplateSelect = (template: NotificationTemplate) => {
        setDisplayTemplateForTab(false);
        if (!template.requirePreProcessing) {
            setText(template.content);
        }
    }

    return (
        <div className='flex flex-row content-center justify-between'>
            <div ref={templateDiv}  className='relative'>
                <div onClick={() => {setDisplayTemplateForTab(!displayTemplateForTab)}}>
                    <SvgIcon
                        wrapperClassName={classnames("flex-none flex flex-row mr-4 py-4 cursor-pointer", alignIcon())}
                        fillClass='default-toolbar-icon'
                        type={Icon.Comment}
                        onClick={() => props.onTemplateClick && props.onTemplateClick()}
                    />
                </div>
                {<div className='absolute bottom-0 z-50' hidden={!displayTemplateForTab}>
                    <NotificationTemplateSelect
                        channel={NotificationTemplateChannel.Sms}
                        onSelect={(template) => onTemplateSelect(template)}
                        usedFrom={TemplateUsedFrom.Inbox}
                    /></div>}
            </div>
            <TextEditor
                className="flex-1"
                isEmojiEnabled
                isFormatEnabled
                disabled={isLoading}
                value={text}
                onRowChange={(row) => setMultipleRow(row > 1)}
                onChange={onTextEditorChange}
                onCtrlEnter={()=> onSendClick()}
            />
            <SvgIcon
                wrapperClassName={classnames("flex-none flex flex-row ml-4 py-4 cursor-pointer", alignIcon())}
                fillClass='default-toolbar-icon'
                className={isLoading ? 'icon-small' : 'icon-medium'}
                type={Icon.Send}
                isLoading={isLoading}
                onClick={() => onSendClick()}
            />
        </div>
    );
}

export default SmsMessageInput;
