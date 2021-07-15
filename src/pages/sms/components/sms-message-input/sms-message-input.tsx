import {useState} from 'react';
import classnames from 'classnames';
import SvgIcon, {Icon} from '@components/svg-icon';
import TextEditor from '@components/text-editor';

interface SmsMessageInputProps {
    isLoading?: boolean;
    onSendClick?: (text: string) => void;
    onTemplateClick?: () => void;
}

const SmsMessageInput = ({isLoading, ...props}: SmsMessageInputProps) => {

    const [hasMultipleRow, setMultipleRow] = useState(false);
    const [text, setText] = useState('');
    const [sendIconEnabled, setSendIconEnabled] = useState(false);

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

    return (
        <div className='flex flex-row content-center justify-between'>
            <SvgIcon
                wrapperClassName={classnames("flex-none flex flex-row mr-4 py-4 cursor-pointer", alignIcon())}
                fillClass='default-toolbar-icon'
                type={Icon.Comment}
                onClick={() => props.onTemplateClick && props.onTemplateClick()}
            />
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
