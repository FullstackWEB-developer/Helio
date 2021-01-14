interface Props {
    text: string,
    type?: string,
    className?: string
}
const Text = ({ text, type, className }: Props) => {
    return (
        <label className={className}>
            {text}
        </label>
    );
}

export default Text;
