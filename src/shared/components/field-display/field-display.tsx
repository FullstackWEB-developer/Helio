import React from 'react';
import './styles.css';
import Text from '../text/text';

interface Props {
    label: string,
    value: string,
    labelType?: string,
    valueType?: string
}
const FieldDisplay = ({ label, value, labelType, valueType }: Props) => {
    return (
        <div className={`field-display row`}>
            <div className={"col-3"}>
                <Text text={label} type={labelType} />
            </div>
            <div className={"col-9"}>
                <Text text={value} type={valueType}/>
            </div>
        </div>
    );
}

export default FieldDisplay;