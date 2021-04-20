import utils from '@shared/utils/utils';
import dayjs from 'dayjs';
import { TicketNote } from '../../tickets/models/ticket-note';

interface NoteDetailProps {
    item: TicketNote,
    displayBottomBorder?: boolean
}

const NoteDetailItem = ({ item, displayBottomBorder }: NoteDetailProps) => {
    return (
        <div className={`py-5 ${displayBottomBorder ? 'border-b' : ''} w-auto`}>
            <div className='flex justify-between w-full pb-1.5'>
                <span className='body3-medium'>
                    {item.createdOn ? utils.formatUtcDate(item.createdOn, 'MMM DD, YYYY h:mm a') : ''}
                </span>
                <span className='body3-medium'>
                    {item.createdBy ? item.createdBy : ''}
                </span>
            </div>
            <p className='body2'>
                {item.noteText}
            </p>
        </div>
    );
}

export default NoteDetailItem;
