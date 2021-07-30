import React from 'react';
import withErrorLogging from '@shared/HOC/with-error-logging';
import {useDispatch, useSelector} from 'react-redux';
import {
    selectEnumValuesAsOptions,
    selectLookupValuesAsOptions,
    selectTicketUpdateModel
} from '@pages/tickets/store/tickets.selectors';
import ControlledSelect from '@components/controllers/controlled-select';
import {Option} from '@components/option/option';
import {Control, Controller} from 'react-hook-form';
import {setTicketUpdateModel} from '@pages/tickets/store/tickets.slice';
import {selectLocationsAsOptions} from '@shared/store/lookups/lookups.selectors';
import {useTranslation} from 'react-i18next';
import {addSnackbarMessage} from '@shared/store/snackbar/snackbar.slice';
import {SnackbarType} from '@components/snackbar/snackbar-position.enum';
import TagInput from '@components/tag-input/tag-input';
import {Icon} from '@components/svg-icon';
import {showCcp} from '@shared/layout/store/layout.slice';
import Logger from '@shared/services/logger';
import Spinner from '@components/spinner/Spinner';
import ControlledInput from '@components/controllers/ControlledInput';
import {TicketUpdateModel} from '@pages/tickets/models/ticket-update.model';
import utils from '@shared/utils/utils';
import {Ticket} from '@pages/tickets/models/ticket';

interface TicketInfoProps {
    ticket: Ticket,
    control: Control<TicketUpdateModel>
}

const TicketDetailTicketInfo = ({ticket, control}: TicketInfoProps) => {

    const updateModel = useSelector(selectTicketUpdateModel);
    const logger = Logger.getInstance();
    const dispatch = useDispatch();
    const {t} = useTranslation();
    const statusOptions = useSelector((state => selectEnumValuesAsOptions(state, 'TicketStatus')));
    const locationOptions = useSelector(selectLocationsAsOptions);
    const priorityOptions = useSelector((state => selectEnumValuesAsOptions(state, 'TicketPriority')));
    const departmentOptions = useSelector((state) => selectLookupValuesAsOptions(state, 'Department'));
    const reasonOptions = useSelector((state) => selectLookupValuesAsOptions(state, 'TicketReason'));
    const tagOptions = useSelector((state) => selectLookupValuesAsOptions(state, 'TicketTags'));
    const ticketTypeOptions = useSelector((state) => selectEnumValuesAsOptions(state, 'TicketType'));

    const handleChangeItem = (fieldName: string, option?: Option) => {
        if (option) {
            dispatch(setTicketUpdateModel({
                ...updateModel,
                [fieldName]: option
            }));
        }
    }

    const handleTags = (tags: string[]) => {
        dispatch(setTicketUpdateModel({
            ...updateModel,
            tags
        }));
    }

    const handleCallbackNumberChange = (number: string) => {
        dispatch(setTicketUpdateModel({
            ...updateModel,
            callbackPhoneNumber: utils.clearFormatPhone(number)
        }));
    }

    if (!updateModel) {
        return <Spinner size='medium' />
    }

    const initiateACall = (phoneToDial?: string) => {
        dispatch(showCcp());
        if (window.CCP.agent && phoneToDial) {
            const endpoint = connect.Endpoint.byPhoneNumber(phoneToDial);
            window.CCP.agent.connect(endpoint, {
                failure: (e: any) => {
                    dispatch(addSnackbarMessage({
                        type: SnackbarType.Error,
                        message: 'contacts.contact_details.error_dialing_phone'
                    }));

                    logger.error(t('contacts.contact_details.error_dialing_phone'), e);
                }
            })
        }
    }

    return (
        <div className='pt-2'>
            <ControlledSelect
                name='status'
                label={'ticket_detail.info_panel.status'}
                options={statusOptions}
                control={control}
                onSelect={(option?: Option) => handleChangeItem('status', option)}
            />
            <ControlledSelect
                name='priority'
                label={'ticket_detail.info_panel.priority'}
                options={priorityOptions}
                control={control}
                onSelect={(option?: Option) => handleChangeItem('priority', option)}
            />

            <ControlledSelect
                name='type'
                label={'ticket_detail.info_panel.ticket_type'}
                options={ticketTypeOptions}
                control={control}
                onSelect={(option?: Option) => handleChangeItem('type', option)}
            />
            {
                ticket.callbackPhoneNumber &&
                <ControlledInput
                    name='callbackPhoneNumber'
                    type='tel'
                    control={control}
                    onChange={(e) => handleCallbackNumberChange(e.target.value)}
                    dropdownIcon={Icon.Phone} label={'ticket_detail.info_panel.callback_number'}
                    dropdownIconClickHandler={() => {initiateACall(updateModel.callbackPhoneNumber)}} />
            }
            {(reasonOptions.length > 0) &&
                <ControlledSelect
                    name='reason'
                    label={'ticket_detail.info_panel.reason'}
                    options={reasonOptions}
                    control={control}
                    onSelect={(option?: Option) => handleChangeItem('reason', option)}
                />
            }
            <ControlledSelect
                name='department'
                label={'ticket_detail.info_panel.department'}
                options={departmentOptions}
                control={control}
                onSelect={(option?: Option) => handleChangeItem('department', option)}
            />
            <ControlledSelect
                name='location'
                label={'ticket_detail.info_panel.location'}
                options={locationOptions}
                control={control}
                onSelect={(option?: Option) => handleChangeItem('location', option)}
            />
            <div className='pb-8'>
                <Controller
                    name='tagsInput'
                    control={control}
                    defaultValue={updateModel.tags}
                    render={(props) => (
                        <TagInput
                            {...props}
                            tagOptions={tagOptions}
                            label={'ticket_detail.info_panel.tags'}
                            initialTags={updateModel.tags}
                            data-test-id='ticket-detail-tag-input'
                            className={'w-full border-none h-14'}
                            setSelectedTags={handleTags}
                        />
                    )}
                />
            </div>
        </div >
    )
}
export default withErrorLogging(TicketDetailTicketInfo);
