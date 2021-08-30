import AvatarLabel from '@components/avatar-label';
import {useEffect, useMemo} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {selectUserList} from '@shared/store/lookups/lookups.selectors';
import {getUserList} from '@shared/services/lookups.service';

interface CallContactAgentInfoProps {
    agentId: string;
}

const CallContactAgentInfo = ({agentId}: CallContactAgentInfoProps) => {
    const dispatch = useDispatch();
    const users = useSelector(selectUserList);
    const user = useMemo(() => users.find(u => u.id === agentId), [agentId, users]);

    useEffect(() => {
        dispatch(getUserList());
    }, [dispatch]);

    return (
        <AvatarLabel
            firstName={user?.firstName ?? ''}
            lastName={user?.lastName ?? ''}
            picture={user?.profilePicture}
            labelClassName='body2'
        />
    );
}

export default CallContactAgentInfo;

