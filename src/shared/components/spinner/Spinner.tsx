import './spinner.scss';
import SvgIcon from '@components/svg-icon';
import {Icon} from '@components/svg-icon/icon';
import {useTranslation} from 'react-i18next';

export interface SpinnerProps {
    fullScreen?: boolean;
    size?: 'small' | 'medium' | 'large' | 'large-40';
    className?: string,
    title?: string;
}
const Spinner = ({fullScreen = false, size = fullScreen ? 'large-40' : 'medium', className, title=''} : SpinnerProps) => {
    const {t} = useTranslation();
    const spinner = <SvgIcon type={Icon.Spinner} className={`icon-${size}`}/>;

    if (fullScreen) {
        return <div className={`flex flex-col space-y-4 items-center h-full w-full justify-center ${className}`}>
            <div>{spinner}</div>
            {title && <div className='body2'>{t(title)}</div>}
        </div>
    }

    return <div className={`flex flex-col space-y-4 items-center justify-center ${className}`}>
        <div>{spinner}</div>
        {title && <div className='body2'>{t(title)}</div>}
    </div>;
}

export default Spinner;
