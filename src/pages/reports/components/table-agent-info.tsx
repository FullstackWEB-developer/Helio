import React, {useMemo} from 'react';
import {useSelector} from 'react-redux';
import {selectUserList} from '@shared/store/lookups/lookups.selectors';
import Avatar from '@components/avatar';
import utils from '@shared/utils/utils';
import ElipsisTooltipTextbox from '@components/elipsis-tooltip-textbox/elipsis-tooltip-textbox';
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
        <div className='flex flex-row items-center'>
            <div className='w-10 h-10'>
            <Avatar userFullName={utils.stringJoin(' ', user.firstName, user.lastName)}
                    userId={user?.id}
                    displayStatus={false}
                    userPicture={user.profilePicture} />
            </div>
                <ElipsisTooltipTextbox hasInlineBlock={true}
                                       classNames='pl-4 items-center body2 h-full truncate'
                                       asSpan={true}
                                       value={utils.stringJoin(' ', user.firstName, user.lastName)} />
        </div>
    );
}

export default TableAgentInfo;
