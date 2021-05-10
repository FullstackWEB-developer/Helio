import React, {ChangeEvent, useState} from 'react';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime'
import {useTranslation} from 'react-i18next';
import withErrorLogging from '../../../../shared/HOC/with-error-logging';
import {Ticket} from '../../models/ticket';
import {Controller, useForm} from 'react-hook-form';
import {TicketNote} from '../../models/ticket-note';
import {addNote} from '../../services/tickets.service';
import {useMutation} from 'react-query';
import {setTicket} from '@pages/tickets/store/tickets.slice';
import {Icon} from '@components/svg-icon/icon';
import TextArea from '@components/textarea/textarea';
import {useDispatch} from 'react-redux';

interface TicketDetailAddNoteProps {
    ticket: Ticket,
    onNoteAdded: () => void;
}

const TicketDetailAddNote = ({ticket, onNoteAdded}: TicketDetailAddNoteProps) => {
    dayjs.extend(relativeTime)

    const {t} = useTranslation();
    const dispatch = useDispatch();
    const {handleSubmit, control, errors} = useForm();
    const [noteText, setNoteText] = useState('');
    const addNoteMutation = useMutation(addNote, {
        onSuccess: (data) => {
            dispatch(setTicket(data));
            setNoteText('');
            onNoteAdded();
        }
    });

    const onSubmit = async () => {
        const note: TicketNote = {
            noteText: noteText,
            isVisibleToPatient: false
        };
        if (ticket.id) {
            addNoteMutation.mutate({
                ticketId: ticket.id,
                note
            });
        }
    }

    return (
        <div className='border-t'>
            <form onSubmit={handleSubmit(onSubmit)} className="w-full add-note-section">
                <Controller
                    name='noteText'
                    control={control}
                    defaultValue={''}
                    render={() => (
                        <TextArea
                            error={errors.note?.message}
                            className='pl-6 pt-2 pb-0 pr-0 body2 w-full h-full'
                            data-test-id='ticket-add-notes'
                            placeholder={t('ticket_detail.add_note')}
                            required={true}
                            rows={2}
                            resizable={false}
                            value={noteText}
                            hasBorder={false}
                            onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setNoteText(e.target.value)}
                            hasIcon={true}
                            iconClassNames='medium cursor-pointer'
                            icon={Icon.Send}
                            iconFill='notes-send'
                            iconOnClick={() => {
                                handleSubmit(onSubmit)()
                            }}
                        />
                    )}
                />
            </form>
        </div>
    );
}

export default withErrorLogging(TicketDetailAddNote);
