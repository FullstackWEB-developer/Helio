import SvgIcon, {Icon} from '@components/svg-icon';
import {useTranslation} from 'react-i18next';
import {useHistory} from 'react-router-dom';

const NewEmailHeader = () => {
    const {t} = useTranslation();
    const history = useHistory();
    return <div className='new-email-title-wrapper h-16 w-full flex items-center px-6 h6 justify-between'>
        <div className='w-1/2 new-email-title'>{t('email.new_email.title')}</div>
        <div className='flex justify-end w-1/2 cursor-pointer'><SvgIcon onClick={() => history.goBack()} type={Icon.Close} fillClass='white-icon'/></div>
    </div>
}

export default NewEmailHeader;
