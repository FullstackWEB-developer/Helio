import {UsersPath} from '@app/paths';
import Button from '@components/button/button';
import React, {useEffect} from 'react';
import {useTranslation} from 'react-i18next';
import {useDispatch} from 'react-redux';
import {useHistory} from 'react-router';
import {setIsFilterOpen, setUserFilters} from '../store/users.slice';

const UserListNoResults = () => {
    const {t} = useTranslation();
    const history = useHistory();
    const dispatch = useDispatch();
    const redirectToAdd = () => {
        history.push(`${UsersPath}/new`);
    }

    useEffect(() => {
        dispatch(setIsFilterOpen(true));
    }, []);

    return (
        <div className='pt-10 px-6 flex flex-col'>
            <span className='mb-4 h-11'>{t('users.list_section.no_results')}</span>
            <div className="flex">
                <Button label={'users.list_section.add_users'} className='mr-6' onClick={redirectToAdd} />
                <Button label={'users.list_section.add_users_bulk'} className='mr-6' onClick={redirectToAdd} />
                <Button label={'users.list_section.reset_results'} onClick={() => dispatch(setUserFilters({filters: undefined, resetPagination: true}))} />
            </div>
        </div>
    );
}

export default UserListNoResults;
