import { useTranslation } from 'react-i18next';
import withErrorLogging from '../../../shared/HOC/with-error-logging';
import React, { useState, useEffect} from 'react';
import {ContextKeyValuePair} from '@pages/ccp/models/context-key-value-pair';
import Checkbox from '@components/checkbox/checkbox';
import { useDispatch, useSelector } from 'react-redux';
import { selectLookupValues } from '@pages/tickets/store/tickets.selectors';
import { selectBotContext } from '../store/ccp.selectors';
import { TicketLookupValue } from '@pages/tickets/models/ticket-lookup-values.model';
import { useMutation } from 'react-query';
import {updateTicket} from '@pages/tickets/services/tickets.service';
import { addSnackbarMessage } from '@shared/store/snackbar/snackbar.slice';
import { SnackbarType } from '@components/snackbar/snackbar-type.enum';

const PersonalCallChanger = () => {
    const { t } = useTranslation();
    const ticketLookupValuesReason = useSelector((state) => selectLookupValues(state, 'TicketReason'));
    const [personalCallValue, setPersonalCallValue] = useState<TicketLookupValue | undefined>(undefined);
    const [previousReason, setPreviousReason] = useState<string>();
    const botContext = useSelector(selectBotContext);
    const dispatch = useDispatch();
    const ticketUpdateMutation = useMutation(updateTicket, {
        onError: () => {
            dispatch(addSnackbarMessage({
                message: 'ticket_detail.ticket_update_failed',
                type: SnackbarType.Error
            }));
        }
    });
    useEffect(() => {
        let personalCallValue = ticketLookupValuesReason.filter(x => x.label === 'Personal');
        if(personalCallValue.length > 0){
            setPersonalCallValue(personalCallValue[0]);
        }else{
            setPersonalCallValue(undefined);
        }
    }, [ticketLookupValuesReason]);

    if(personalCallValue && botContext?.ticket && !botContext?.isInBound){
        return (
            <div className='col-span-3 subtitle2'>
                <div className='grid grid-cols-12'>
                    <div className='col-span-5 subtitle2'>
                        <div>{t('ccp.personal_call')}</div>
                    </div>
                    <div className='col-span-5 subtitle2'>
                        <Checkbox name='personalCall' data-testid='personalCall'
                            defaultChecked={personalCallValue?.value === botContext?.ticket?.reason} className={"flex items-center"} heightClass="h-6"
                            onChange={(event) => {
                                if(event.checked){
                                    setPreviousReason(botContext?.ticket?.reason);
                                    ticketUpdateMutation.mutate({
                                        id: botContext?.ticket?.id!,
                                        ticketData: {
                                            reason: personalCallValue?.value
                                        }
                                    });
                                }else{
                                    ticketUpdateMutation.mutate({
                                        id: botContext?.ticket?.id!,
                                        ticketData: {
                                            reason: previousReason
                                        }
                                    });
                                }
                            }}/>
                    </div>
                </div>
            </div>
        );
    }

    return null;
}

export default withErrorLogging(PersonalCallChanger);
