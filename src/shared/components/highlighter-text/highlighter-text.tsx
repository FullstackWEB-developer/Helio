import React from "react";
import './highlighter-text.scss';

interface HighlighterTextProps {
    text: string;
    highlighterText?: string;
}
const HighlighterText = ({text, highlighterText}: HighlighterTextProps) => {
    if (!highlighterText) {
        return <>{text}</>
    }

    const regExp = new RegExp(`(${highlighterText})`, 'i');
    const words = text.split(regExp);

    return (
        <>
            {
                React.Children.toArray(words.map(word => {
                    if (word.toLowerCase().startsWith(highlighterText.toLowerCase())) {
                        return <mark className='highlighter-text-mark'>{word}</mark>
                    } else {
                        return word;
                    }
                }))
            }
        </>
    )
}

export default HighlighterText;
