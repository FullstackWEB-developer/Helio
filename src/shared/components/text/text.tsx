import React from 'react';
import './styles.css';

interface Props {
    text: string,
    type?: string
}
const Text = ({ text, type }: Props) => {
    return (
        <label className={`text ${type}`}>
            {text}
        </label>
    );
}

export default Text;