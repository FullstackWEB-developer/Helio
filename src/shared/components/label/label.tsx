interface LabelProps {
    text: string,
    className?: string
}
const Label = ({ text, className }: LabelProps) => {
    return (
        <label className={className}>
            {text}
        </label>
    );
}

export default Label;
