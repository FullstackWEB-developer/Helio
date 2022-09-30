import {useTranslation} from 'react-i18next';
import {Option} from '@components/option/option';
import classnames from 'classnames';
import './select-cell.scss';
import Checkbox from '@components/checkbox/checkbox';
import {useState} from 'react';

export interface SelectCellProps {
    item: Option,
    isSelected?: boolean,
    onClick: (item: Option) => void,
    disabled?: boolean,
    className?: string,
    changeCursorValueOnHover?: () => void;
    truncateAssistiveText?: boolean;
    isMultiple?: boolean;
}

const SelectCell = ({item, isSelected, onClick, disabled, isMultiple = false, ...props}: SelectCellProps) => {

    const {t} = useTranslation();
    const [isChecked, setIsChecked] = useState(isSelected);

    const calculateCss = (): string => {
        let cssClass = ''
        if (isSelected && !isMultiple) {
            cssClass = cssClass + ' body2-white ';
        }
        else {
            cssClass = cssClass + ' body2 ';
        }
        return cssClass;
    }
    const bgCssClass = isSelected && !isMultiple ? ' is-selected ' : ' cursor-pointer '

    const cellClicked = () => {
        if (onClick) {
            onClick(item);
        }
        if (isMultiple) {
            setIsChecked(!isChecked);
        }
    }

    const handleMouseOver = () => {
        if (props.changeCursorValueOnHover) {
            props.changeCursorValueOnHover();
        }
    }

    if (disabled) {
        return null;
    }

    const assistiveTextCss = classnames('pl-4 body3-small assistive-text', {
        'select-cell-assistive-text-line-clamped': props.truncateAssistiveText
    })

    return (
        <div onMouseDown={(e) => {e.preventDefault()}} onMouseOver={() => handleMouseOver()}
            className={`w-full select-cell justify-between flex items-center ${calculateCss()} ${bgCssClass} ${props.className}`} onClick={() => !isMultiple && cellClicked()}>
            {isMultiple && <Checkbox className='flex items-center justify-self-center pl-4' name={item.value} label='' checked={isChecked} onChange={() => cellClicked()}/>}
            <div className={classnames('flex flex-col justify-center w-full', {'py-2': !!item.assistiveText})} data-test-id='select-cell-icon-content' onClick={() => cellClicked()} >
                <div className='flex items-center pl-4' data-test-id={`select-cell-text-${item.label}`} data-testid={`select-cell-text-${item.label}`}>{t(item.label)}</div>
                {item.assistiveText &&
                    <span className={assistiveTextCss}>{item.assistiveText}</span>
                }
            </div>
        </div>
    );
}

export default SelectCell;
