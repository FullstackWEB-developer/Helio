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
    const redirectToAdd = (toBulk = false) => {
        history.push(toBulk ? `${UsersPath}/bulk` : `${UsersPath}/new`);
    }

    useEffect(() => {
        dispatch(setIsFilterOpen(true));
    }, []);

    return (
        <div className='pt-10 px-6 flex flex-col'>
            <span className='mb-4 h-11'>{t('users.list_section.no_results')}</span>
            <div className="flex">
                <Button data-testid='add-user' label={'users.list_section.add_users'} className='mr-6' onClick={() => redirectToAdd()} />
                <Button data-testid='add-bulk-user' label={'users.list_section.add_users_bulk'} className='mr-6' onClick={() => redirectToAdd(true)} />
                <Button data-testid='reset' label={'users.list_section.reset_results'} className='mr-6' onClick={() => dispatch(setUserFilters({filters: undefined, resetPagination: true}))} />
                <Button data-testid='back' buttonType='secondary' label={'users.list_section.back'} onClick={() => dispatch(setUserFilters({filters: undefined, resetPagination: true}))} />
            </div>
        </div>
    );
}

export default UserListNoResults;
