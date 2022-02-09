import React, {useRef, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {useTranslation} from 'react-i18next';
import {Controller, useForm} from 'react-hook-form';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc'
import withErrorLogging from '../../../shared/HOC/with-error-logging';
import TextArea from '../../../shared/components/textarea/textarea';
import {addNote} from '../../tickets/services/tickets.service';
import {TicketNote} from '../../tickets/models/ticket-note';
import NoteDetailItem from './note-detail-item';
import './note-context.scss';
import {Icon} from '@components/svg-icon/icon';
import {useMutation} from 'react-query';
import {setTicket} from '@pages/tickets/store/tickets.slice';
import {selectBotContext} from '@pages/ccp/store/ccp.selectors';
import {selectAppUserDetails} from '@shared/store/app-user/appuser.selectors';
import {addNoteToTicket} from '@pages/ccp/store/ccp.slice';
import {addSnackbarMessage} from '@shared/store/snackbar/snackbar.slice';
import {SnackbarType} from '@components/snackbar/snackbar-type.enum';

const NoteContext = () => {
    dayjs.extend(utc);
    const {t} = useTranslation();
    const dispatch = useDispatch();
    const [noteText, setNoteText] = useState('');
    const notesBottom = useRef<HTMLDivElement>(null);
    const botContext = useSelector(selectBotContext);
    const user = useSelector(selectAppUserDetails);
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
        if (!!botContext?.ticket?.id) {
            const ticketId = botContext?.ticket?.id;
            addNoteMutation.mutate({ticketId, note}, {
                onSuccess: () => {
                    note.createdOn = dayjs().utc().toDate();
                    note.createdBy = user.id;
                    note.createdByName = user.fullName
                    setNoteText('');
                    dispatch(addNoteToTicket({ticketId, note}));
                    notesBottom.current?.scrollIntoView({behavior: 'smooth'});
                },
                onError: () => {
                    dispatch(addSnackbarMessage({
                        type: SnackbarType.Error,
                        message: 'ccp.note_context.note_add_error'
                    }));
                }
            });
        }
    }

    const {handleSubmit, control, errors} = useForm();

    return (
        <div className="flex flex-col">
            <div className={'pt-3.5 pl-6 pr-3 overflow-hidden flex flex-col'}>
                <div className={'h7 h-9'}>{t('ccp.note_context.header')}</div>
                <div className='grid grid-flow-row auto-rows-max md:auto-rows-min overflow-y-auto overflow-x-hidden notes-container pr-3'>
                    {
                        (botContext?.ticket?.notes || []).map((item, key) => <NoteDetailItem key={key} item={item} displayBottomBorder={key < (botContext.ticket?.notes || []).length - 1} />)
                    }
                    <div ref={notesBottom} />
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
                                className='h-full pb-0 pr-0 body2 w-full h-full'
                                textareaContainerClasses='pl-4 h-full w-full'
                                data-test-id='note-context-notes'
                                placeHolder={t('ccp.note_context.enter_your_note')}
                                value={noteText}
                                required={true}
                                overwriteDefaultContainerClasses={true}
                                rows={4}
                                isLoading={addNoteMutation.isLoading}
                                resizable={false}
                                hasBorder={false}
                                onChange={(message) => setNoteText(message)}
                                iconClassNames='icon-medium'
                                icon={Icon.Send}
                                iconFill='notes-send'
                                iconOnClick={() => {handleSubmit(onSubmit)()}}
                            />
                        )}
                    />
                </form>
            </div>
        </div>
    )
}

export default withErrorLogging(NoteContext);
