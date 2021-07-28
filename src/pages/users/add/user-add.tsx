import Button from '@components/button/button';
import TextArea from '@components/textarea/textarea';
import {InviteUserModel} from '@shared/models';
import {sendUserInvitation} from '@shared/services/user.service';
import {useState} from 'react';
import {Trans, useTranslation} from 'react-i18next';
import {useMutation} from 'react-query';
import {Link, useHistory} from 'react-router-dom';
import {UsersPath} from '@app/paths';
import UserAddList from '../components/user-add-list';
import {addSnackbarMessage} from '@shared/store/snackbar/snackbar.slice';
import {useDispatch} from 'react-redux';
import {SnackbarType} from '@components/snackbar/snackbar-position.enum';
import './user-add.scss';

const UserAdd = () => {
    const {t} = useTranslation();
    const history = useHistory();
    const dispatch = useDispatch();

    const [userList, setUserList] = useState<InviteUserModel[]>([]);
    const [invitationMessage, setInvitationMessage] = useState('');

    const sendUserInvitationsMutation = useMutation(sendUserInvitation,
        {
            onSuccess: () => {
                dispatch(addSnackbarMessage({
                    type: SnackbarType.Success,
                    message: 'users.add_section.invitation_sent_success'
                }));
                history.push(UsersPath);
            },
            onError: () => {
                dispatch(addSnackbarMessage({
                    type: SnackbarType.Error,
                    message: 'users.add_section.invitation_sent_error'
                }));
            },
        })

    const onClick = () => {
        sendUserInvitationsMutation.mutate({
            users: userList,
            invitationMessage: invitationMessage
        });
    }

    return (
        <div className='flex flex-col w-full px-6 py-8 user-add'>
            <h5>{t('users.add_section.title')}</h5>
            <span className='mt-10'>
                <Trans i18nKey="users.add_section.description" >
                    <Link to={UsersPath}></Link>
                </Trans>
            </span>
            <div>
                <UserAddList
                    onChange={(value) => {
                        setUserList(value);
                    }}
                />
            </div>
            <div className='mt-8'>
                <label className='ml-4 subtitle2'>{t('users.add_section.personalize_message_title')}</label>
                <TextArea
                    placeHolder={t('users.add_section.personalize_message_placeholder')}
                    overwriteDefaultContainerClasses
                    rows={3}
                    className='invitation-message-text-area'
                    textareaContainerClasses='body2'
                    resizable={false}
                    value={invitationMessage}
                    onChange={(message) => setInvitationMessage(message)}
                />
            </div>
            <div className='mt-10'>
                <Button
                    label='users.add_section.add_button'
                    disabled={userList.length < 1}
                    isLoading={sendUserInvitationsMutation.isLoading}
                    onClick={onClick}
                />
            </div>
        </div>
    );
}

export default UserAdd;
