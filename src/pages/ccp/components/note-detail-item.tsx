import utils from '@shared/utils/utils';
import {TicketNote} from '../../tickets/models/ticket-note';
import {useSelector} from 'react-redux';
import {useMemo} from 'react';
import {selectUserList} from '@shared/store/lookups/lookups.selectors';

interface NoteDetailProps {
    item: TicketNote,
    displayBottomBorder?: boolean
}

const NoteDetailItem = ({item, displayBottomBorder}: NoteDetailProps) => {
    const userList = useSelector(selectUserList);

    const userFullName = useMemo(() => {
        if (!!item.createdBy && !!userList) {
            const user = userList.find(a => a.id === item.createdBy);
            return user ? `${user.firstName} ${user.lastName}` : '';
        }

        return '';
    }, [userList, item.createdBy]);
    return (
        <div className={`py-5 ${displayBottomBorder ? 'border-b' : ''} w-auto`}>
            <div className='flex justify-between w-full pb-1.5'>
                <span className='body3-medium'>
                    {item.createdOn ? utils.formatUtcDate(item.createdOn, 'MMM DD, YYYY h:mm a') : ''}
                </span>
                <span className='body3 note-detail-created-by'>
                    {userFullName}
                </span>
            </div>
            <p className='body2'>
                {item.noteText}
            </p>
        </div>
    );
}

export default NoteDetailItem;
