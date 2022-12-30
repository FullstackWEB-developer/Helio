import React, {useContext, useState} from 'react';
import Button from '@components/button/button';
import {ExtendedPatient} from '@pages/patients/models/extended-patient';
import {useTranslation} from 'react-i18next';
import { useMutation, useQuery } from 'react-query';
import { getPossiblePatientIds } from '@pages/tickets/services/tickets.service';
import { GetTicketPossiblePatients} from '@constants/react-query-constants';
import ConversationHeaderPossiblePatients from './conversation-header-possible-patients';
import Modal from '@components/modal/modal';
import dayjs from 'dayjs';
import {updateTicket} from '@pages/tickets/services/tickets.service';
import { EmailContext } from '@pages/email/context/email-context';

interface ConversationHeaderMultiPatientPopup {
    ticketId?: string;
    refetchTicket?: () => void;
}
const ConversationHeaderMultiPatientPopup = ({ticketId, refetchTicket}: ConversationHeaderMultiPatientPopup) => {
    const {t} = useTranslation();
    const { getEmailsQuery } = useContext(EmailContext)!;
    const [selectedPatient, setSelectedPatient] = useState<ExtendedPatient>();

    const {data, isLoading} = useQuery([GetTicketPossiblePatients, ticketId], () => {
        if(!!ticketId){
            return getPossiblePatientIds(ticketId)
        }
    }, {
        enabled: true
    });

    const ticketUpdateMutation = useMutation(updateTicket, {
        onSuccess: () => {
            setSelectedPatient(undefined);
            refetchTicket && refetchTicket();
            getEmailsQuery.refetch().then();
        }
    });

    return (
        <div>
            {
                data && !isLoading && <div className='px-8 py-3'>
                    <div className='flex pb-3'>
                        <div className="flex-auto">
                            <div className="body2-primary">{t("email.inbox.possible_multi_patients")}</div>
                        </div>
                    </div>
                    {
                        data.map((patientId) => {
                            return <ConversationHeaderPossiblePatients patientId={patientId} selectPatient={setSelectedPatient} />
                        })
                    }
                </div>
            }
            {
                <Modal isDraggable={true} isOpen={!!selectedPatient} title={t('email.inbox.assign_patient')} onClose={() => setSelectedPatient(undefined)} isClosable={false}>
                    <div className='w-full mb-2'>
                        <div className='mb-2 mt-4'>{t('email.inbox.assign_patient_desc')}</div>
                        <div className='mb-8'>{`${selectedPatient?.firstName} ${selectedPatient?.lastName} | ${dayjs(selectedPatient?.dateOfBirth).format('MM/DD/YYYY')}`}</div>
                        <div className='flex justify-end mb-8'>
                            <Button label='email.inbox.assign' className='mr-6' buttonType='medium' isLoading={ticketUpdateMutation.isLoading} onClick={() => {
                                if(ticketId && selectedPatient){
                                    ticketUpdateMutation.mutate({
                                        id: ticketId,
                                        ticketData: {
                                            patientId: selectedPatient.patientId,
                                            createdForName: `${selectedPatient.firstName} ${selectedPatient.lastName}`
                                        }
                                    });
                                }
                            }} />
                            <Button label='common.cancel' className='mr-6' buttonType='secondary' disabled={ticketUpdateMutation.isLoading} onClick={() => setSelectedPatient(undefined)} />
                        </div>
                    </div>
                </Modal>
            }
        </div>
    )
}

export default ConversationHeaderMultiPatientPopup;
