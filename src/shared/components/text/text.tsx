interface Props {
    text: string,
    type?: string,
    cssClass?: string
}
const Text = ({ text, type, cssClass }: Props) => {
    return (
        <label className={cssClass}>
            {text}
        </label>
    );
}

export default Text;
