import AvatarLabel from '@components/avatar-label';
import {useEffect, useMemo} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {selectUserList} from '@shared/store/lookups/lookups.selectors';
import {getUserList} from '@shared/services/lookups.service';
import {Icon} from '@components/svg-icon';

interface CallContactAgentInfoProps {
    agentId?: string;
    type: 'CHAT' | 'VOICE';
}

const CallContactAgentInfo = ({agentId, type}: CallContactAgentInfoProps) => {
    const dispatch = useDispatch();
    const users = useSelector(selectUserList);
    const user = useMemo(() => users.find(u => u.id === agentId), [agentId, users]);

    useEffect(() => {
        dispatch(getUserList());
    }, [dispatch]);

    if (!agentId) {
        return (
            <AvatarLabel
                firstName={type === 'VOICE' ? 'common.voice' : 'common.chat'}
                lastName='common.bot'
                labelClassName='body2'
                icon={Icon.Bot}
            />
        )
    }

    if (!user) {
        return null;
    }

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

