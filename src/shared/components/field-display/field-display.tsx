import Text from '../text/text';

interface Props {
    label: string,
    value: string,
    labelType?: string,
    valueType?: string
}
const FieldDisplay = ({ label, value, labelType, valueType }: Props) => {
    return (
        <div className="flex flex-col px-2">
            <div>
                <Text text={label} type={labelType} />
            </div>
            <div >
                <Text text={value} type={valueType} />
            </div>
        </div>
    );
}

export default FieldDisplay;