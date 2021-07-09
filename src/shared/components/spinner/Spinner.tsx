import './spinner.scss';
import SvgIcon from '@components/svg-icon';
import {Icon} from '@components/svg-icon/icon';

export interface SpinnerProps {
    fullScreen?: boolean;
    size?: 'small' | 'medium' | 'large' | 'large-40';
    className?: string
}
const Spinner = ({fullScreen = false, size = fullScreen ? 'large-40' : 'medium', className} : SpinnerProps) => {
    const spinner = <SvgIcon type={Icon.Spinner} className={`icon-${size}`}/>;

    if (fullScreen) {
        return <div className={`flex items-center h-full w-full justify-center ${className}`}>{spinner}</div>
    }

    return <div className={`flex items-center justify-center ${className}`}>{spinner}</div>;
}

export default Spinner;
