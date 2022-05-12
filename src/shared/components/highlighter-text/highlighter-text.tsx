import React from "react";
import './highlighter-text.scss';
import ElipsisTooltipTextbox from '@components/elipsis-tooltip-textbox/elipsis-tooltip-textbox';

interface HighlighterTextProps {
    text: string;
    highlighterText?: string;
}
const HighlighterText = ({text, highlighterText}: HighlighterTextProps) => {
    if (!text) {
        return <></>;
    }
    if (!highlighterText) {
        return <ElipsisTooltipTextbox value={text} classNames={"truncate"} asSpan={true} />
    }

    const regExp = new RegExp(`(${highlighterText})`, 'i');
    const words = text.split(regExp);

    return (
        <>
            {
                React.Children.toArray(words.map(word => {
                    if (word.toLowerCase().startsWith(highlighterText.toLowerCase())) {
                        return <mark className='highlighter-text-mark truncate'>{word}</mark>
                    } else {
                        return word;
                    }
                }))
            }
        </>
    )
}

export default HighlighterText;
