import dayjs from 'dayjs';
import { TicketNote } from '../../tickets/models/ticket-note';

interface NoteDetailProps {
    item: TicketNote
}

const NoteDetailItem = ({ item }: NoteDetailProps) => {

    return (
        <div className="py-2 border-b w-auto">
            <div className='flex justify-between w-full'>
                <span className="text-gray-400">
                    {item.dateTime ? dayjs.utc().format('MMM DD, YYYY h:mm a') : ''}
                </span>
                <span className="text-gray-400">
                    {item.username ? item.username : ''}
                </span>
            </div>
            <p className="mt-2 text-sm text-gray-900 sm:mt-0">
                {item.noteText}
            </p>
        </div>
    );
}

export default NoteDetailItem;
