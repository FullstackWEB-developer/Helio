import React, {ChangeEvent, useRef, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {useTranslation} from 'react-i18next';
import {Controller, useForm} from 'react-hook-form';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc'
import withErrorLogging from '../../../shared/HOC/with-error-logging';
import {selectNoteContext, selectNotes} from '../store/ccp.selectors';
import {setNotes} from '../store/ccp.slice';
import TextArea from '../../../shared/components/textarea/textarea';
import {addNote} from '../../tickets/services/tickets.service';
import {TicketNote} from '../../tickets/models/ticket-note';
import NoteDetailItem from './note-detail-item';
import './note-context.scss';
import {Icon} from '@components/svg-icon/icon';
import {useMutation} from 'react-query';
import {setTicket} from '@pages/tickets/store/tickets.slice';

const NoteContext = () => {
    dayjs.extend(utc);
    const {t} = useTranslation();
    const dispatch = useDispatch();
    const ticketId = useSelector(selectNoteContext).ticketId;
    const username = useSelector(selectNoteContext).username;
    const notes: TicketNote[] = useSelector(selectNotes) || [];
    const [noteText, setNoteText] = useState('');
    const notesBottom = useRef<HTMLDivElement>(null);


    const addNoteMutation = useMutation(addNote, {
        onSuccess: (data) => {
            setTicket(data);
        }
    });

    const onSubmit = async () => {
        const note: TicketNote = {
            noteText: noteText,
            isVisibleToPatient: false
        };
        if (ticketId) {
            addNoteMutation.mutate({ticketId, note});
            note.createdOn = dayjs().utc().toDate();
            note.createdBy = username;
            dispatch(setNotes([...notes, note]));
            setNoteText('');
            notesBottom.current?.scrollIntoView({ behavior: 'smooth' });
        }
    }

    const { handleSubmit, control, errors } = useForm();

    if (!ticketId) {
        return <div>{t('ccp.note_context.no_ticket_id')}</div>;
    }

    return (
        <div className="flex flex-col">
            <div className={'pt-3.5 pl-6 pr-3 overflow-hidden flex flex-col'}>
                <div className={'h7 h-9'}>{t('ccp.note_context.header')}</div>
                <div className='grid grid-flow-row auto-rows-max md:auto-rows-min overflow-y-auto overflow-x-hidden notes-container pr-3'>
                    {
                        notes.map((item, key) => <NoteDetailItem key={key} item={item} displayBottomBorder={key < notes.length - 1} />)
                    }
                    <div ref={notesBottom}/>
                </div>
            </div>
            <div className="overflow-hidden border-t">
                <form onSubmit={handleSubmit(onSubmit)} className="w-full add-note-section">
                    <Controller
                        name='note'
                        control={control}
                        defaultValue={''}
                        render={() => (
                            <TextArea
                                error={errors.note?.message}
                                className='h-full pl-6 pt-2 pb-0 pr-0 body2 w-full'
                                data-test-id='note-context-notes'
                                placeholder={t('ccp.note_context.enter_your_note')}
                                value={noteText}
                                required={true}
                                rows={2}
                                resizable={false}
                                hasBorder={false}
                                onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setNoteText(e.target.value)}
                                iconClassNames='medium cursor-pointer'
                                icon={Icon.Send}
                                iconFill='notes-send'
                                iconOnClick={() => { handleSubmit(onSubmit)() }}
                            />
                        )}
                    />
                </form>
            </div>
        </div>
    )
}

export default withErrorLogging(NoteContext);
