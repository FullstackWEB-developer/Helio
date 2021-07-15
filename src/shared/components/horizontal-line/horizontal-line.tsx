import classnames from 'classnames';
import './horizontal-line.scss';

interface HorizontalLineProps {
    text?: string;
    className?: string;
    wrapperClassName?: string;
}

const HorizontalLine = ({wrapperClassName, text = '', className ='body3-medium mx-5 capitalize', ...props}: HorizontalLineProps) => {
    return (<span className={classnames('flex flex-row horizontal-line', wrapperClassName) }><span className={className}>{text}</span></span>);
}

export default HorizontalLine;
