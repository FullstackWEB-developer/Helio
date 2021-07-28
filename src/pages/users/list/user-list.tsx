import {useTranslation} from 'react-i18next';

const UserList = () => {
    const {t} = useTranslation();
    return (
        <div className='flex flex-col w-full px-6 py-8 user-add'>
            <h5>{t('users.list_section.title')}</h5>
        </div>
    );
}


export default UserList;

