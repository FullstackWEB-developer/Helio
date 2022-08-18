import AvatarLabel from '@components/avatar-label';
import {useMemo} from 'react';
import {useSelector} from 'react-redux';
import {selectUserList} from '@shared/store/lookups/lookups.selectors';

interface TableAgentInfoProps {
    agentId: string;
}

const TableAgentInfo = ({agentId}: TableAgentInfoProps) => {
    const users = useSelector(selectUserList);
    const user = useMemo(() => users.find(u => u.id === agentId), [agentId, users]);

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

export default TableAgentInfo;

