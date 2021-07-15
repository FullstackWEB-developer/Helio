import SvgIcon, {Icon} from '../svg-icon';
import classnames from 'classnames';
import './text-editor.scss';
import {useRef, useState, useEffect} from 'react';
import {useTranslation} from 'react-i18next';

interface TextEditorProps {
    value?: string;
    className?: string;
    placeholder?: string;
    disabled?: boolean;
    minRow?: number;
    maxRow?: number;
    isFormatEnabled?: boolean;
    isEmojiEnabled?: boolean;
    onRowChange?: (row: number) => void;
    onChange?: (value: string) => void;
    onCtrlEnter?: () => void;
    onFormatClick?: () => void;
    onEmojiClick?: () => void;
}
const TextEditor = ({value,
    className,
    disabled,
    isEmojiEnabled,
    isFormatEnabled,
    minRow = 1,
    maxRow = 3,
    placeholder,
    ...props}: TextEditorProps) => {

    const {t} = useTranslation();
    const [currentRow, setCurrentRow] = useState(minRow);
    const textAreaRef = useRef<HTMLTextAreaElement>(null);
    const initTextAreaHeight = useRef(0);

    useEffect(() => {
        initTextAreaHeight.current = textAreaRef.current?.clientHeight ?? 0;
    }, [])

    const resizeHeight = (target: HTMLTextAreaElement) => {
        const previousRows = target.rows;
        target.rows = minRow;
        const currentRows = ~~(target.scrollHeight / initTextAreaHeight.current);

        if (currentRows === previousRows) {
            target.rows = currentRows;
        }

        if (currentRows >= maxRow) {
            target.rows = maxRow;
            target.scrollTop = target.scrollHeight;
        }
        const row = currentRows < maxRow ? currentRows : maxRow;
        setCurrentRow(row);

        if (props.onRowChange) {
            props.onRowChange(row);
        }
    }

    const onTextAreaChanged = ({target}: React.ChangeEvent<HTMLTextAreaElement>) => {
        resizeHeight(target);
        if (props.onChange) {
            props.onChange(target.value);
        }
    }

    const onKeyPress = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (event.ctrlKey && event.nativeEvent.code === 'Enter' && props.onCtrlEnter) {
            props.onCtrlEnter();
        }
    }

    return (<div className={classnames("border-b flex flex-row input-message py-4 px-4", className)}>
        <textarea
            ref={textAreaRef}
            wrap='hard'
            className="w-full resize-none body2"
            disabled={disabled}
            value={value}
            rows={currentRow}
            onChange={onTextAreaChanged}
            onKeyPress={onKeyPress}
            placeholder={placeholder ? t(placeholder) : t('common.enter_text')}>

        </textarea>
        <div className="flex flex-row item-flex-end">
            {isFormatEnabled &&
                <SvgIcon
                    type={Icon.Format}
                    fillClass='default-toolbar-icon'
                    wrapperClassName="mr-2 ml-4 cursor-pointer"
                    onClick={() => props.onFormatClick && props.onFormatClick()}
                />
            }
            {isEmojiEnabled &&
                <SvgIcon
                    type={Icon.SentimentSatisfied}
                    fillClass='default-toolbar-icon'
                    wrapperClassName="cursor-pointer"
                    onClick={() => props.onEmojiClick && props.onEmojiClick()}
                />
            }
        </div>
    </div>);

}

export default TextEditor;
