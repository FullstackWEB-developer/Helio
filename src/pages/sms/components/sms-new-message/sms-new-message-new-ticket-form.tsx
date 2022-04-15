import {useState, useEffect} from 'react';
import {Option} from '@components/option/option';
import {selectLookupValues, selectEnumValues} from '@pages/tickets/store/tickets.selectors';
import {useDispatch, useSelector} from 'react-redux';
import {getEnumByType} from '@pages/tickets/services/tickets.service';
import { getLookupValues } from '@shared/services/lookups.service';
import Select from '@components/select/select';
import {getOptions, getReasonOption} from '@pages/sms/utils';
import {useTranslation} from 'react-i18next';
import {TicketType} from '@shared/models';

interface SmsNewMessageNewTicketFormProps {
    disabled?: boolean;
    onTicketTypeChange?: (value: TicketType) => void;
    onTicketReasonChange?: (value: string) => void;
    onValidate?: (isValid: boolean) => void;
}
const SmsNewMessageNewTicketForm = ({disabled, ...props}: SmsNewMessageNewTicketFormProps) => {
    const dispatch = useDispatch();
    const {t} = useTranslation();
    const ticketLookupValuesReason = useSelector((state) => selectLookupValues(state, 'TicketReason'));
    const ticketTypes = useSelector((state => selectEnumValues(state, 'TicketType')));

    const [selectedTicketType, setSelectedTicketType] = useState<Option>();
    const [selectedReason, setSelectedReason] = useState<Option>();
    const ticketTypeOptions = getOptions(ticketTypes);
    const reasonOptions = getReasonOption(ticketLookupValuesReason, selectedTicketType);


    const onTicketTypeSelected = (option?: Option) => {
        setSelectedTicketType(option);
        if (option && props.onTicketTypeChange) {
            props.onTicketTypeChange(Number(option.value))
        }
    }
    const onTicketReasonSelected = (option?: Option) => {
        setSelectedReason(option);
        if (option && props.onTicketReasonChange) {
            props.onTicketReasonChange(option.value)
        }
    }

    useEffect(() => {
        if (!props.onValidate) {
            return;
        }
        if (selectedTicketType) {
            if (reasonOptions.length > 0) {
                props.onValidate(!!selectedReason);
            } else {
                props.onValidate(true);
            }
        } else {
            props.onValidate(false);
        }

    }, [selectedTicketType, selectedReason])

    useEffect(() => {
        dispatch(getLookupValues('TicketReason'));
        dispatch(getEnumByType('TicketType'));
    }, [dispatch]);

    return (<div className='flex flex-col'>
        <span className='mb-4 subtitle mt-7 pb-4'>{t('sms.chat.new.new_ticket.form_title')}</span>
        <div className='body2'>{t('sms.chat.new.new_ticket.description')}</div>
        <div className='w-80 pt-6'>

            <Select
                disabled={disabled}
                label='ticket_new.ticket_type'
                onSelect={onTicketTypeSelected}
                data-test-id='ticket-type-test-id'
                options={ticketTypeOptions}
                required={true}
            />

            {selectedTicketType && reasonOptions.length > 0 &&
                <Select
                    disabled={disabled}
                    label='ticket_new.reason'
                    onSelect={onTicketReasonSelected}
                    data-test-id='ticket-reason-test-id'
                    options={reasonOptions}
                    required={true}
                />
            }
        </div>
    </div>);
}

export default SmsNewMessageNewTicketForm;
