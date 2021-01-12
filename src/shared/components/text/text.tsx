interface Props {
    text: string,
    type?: string
}
const Text = ({ text, type }: Props) => {
    return (
        <label>
            {text}
        </label>
    );
}

export default Text;