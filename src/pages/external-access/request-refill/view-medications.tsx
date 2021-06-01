import {useQuery} from 'react-query';
import {AxiosError} from 'axios';
import {QueryDefaultPharmacy, QueryPatientMedication} from '@constants/react-query-constants';
import {
    getPatientDefaultPharmacy,
    getPatientMedications
} from '@pages/external-access/request-refill/services/request-refill.service';
import {useTranslation} from 'react-i18next';
import {useSelector} from 'react-redux';
import {selectVerifiedPatent} from '@pages/patients/store/patients.selectors';
import {Medication} from '@pages/external-access/request-refill/models/medication.model';
import React, {Fragment} from 'react';
import {Icon} from '@components/svg-icon/icon';
import SvgIcon from '@components/svg-icon/svg-icon';
import './view-medications.scss';
import MedicationListItem from '@pages/external-access/request-refill/components/medication-list-item';
import {Pharmacy} from '@pages/external-access/request-refill/models/pharmacy.model';
import utils from '@shared/utils/utils';
import SendUsMessage from '@pages/external-access/request-refill/components/send-us-message';
import ThreeDots from '@components/skeleton-loader/skeleton-loader';

const ViewMedications = () => {
    const {t} = useTranslation();
    const verifiedPatient = useSelector(selectVerifiedPatent);

    const {isLoading: isMedicationLoading, data: medications} = useQuery<Medication[], AxiosError>([QueryPatientMedication, verifiedPatient?.patientId], () =>
            getPatientMedications(verifiedPatient?.patientId),
        {
            enabled: !!verifiedPatient
        }
    );

    const {isLoading: isDefaultPharmacyLoading, data: defaultPharmacy} = useQuery<Pharmacy, AxiosError>([QueryDefaultPharmacy, verifiedPatient?.patientId, verifiedPatient?.departmentId], () =>
            getPatientDefaultPharmacy(verifiedPatient?.patientId),
        {
            enabled: !!verifiedPatient
        }
    );

    if (isMedicationLoading || isDefaultPharmacyLoading) {
        return <ThreeDots/>
    }

    if (!verifiedPatient) {
        return <div>{t('hipaa_validation_form.hipaa_verification_failed')}</div>;
    }

    if (medications && medications.length < 1) {
        return <div data-test-id='request-refill-no-medication-found'>{t('request-refill.no_medication_found')}</div>
    }

    return  <div id='printContent'>
        <div className='2xl:whitespace-pre 2xl:h-12 2xl:my-3 flex w-full items-center justify-between'>
            <h4>
                {t('external_access.medication_refill.your_medications')}
            </h4>
            <div className='cursor-pointer' onClick={() => window.print()} >
                <SvgIcon type={Icon.Print} fillClass='rgba-05-fill' />
            </div>
        </div>
        <div className='pt-9 pb-9'>
            {t('external_access.medication_refill.below_list')}
        </div>
        <SendUsMessage />
        {medications && (<div>
            <div className="px-6 py-4 flex medication-list-header caption-caps">
                <div className='flex w-11/12 xl:w-4/12'>{t('external_access.medication_refill.medication_list.medication')}</div>
                <div className='hidden xl:flex flex-none w-8'> </div>
                <div className='hidden xl:flex w-6'> </div>
                <div className='hidden xl:flex flex-none w-8'> </div>
                <div className='hidden xl:flex w-3/12'>{t('external_access.medication_refill.medication_list.entered_by')}</div>
                <div className='hidden xl:flex flex-none w-8'> </div>
                <div className='hidden xl:flex w-1/12'>{t('external_access.medication_refill.medication_list.prescribed')}</div>
                <div className='hidden xl:flex flex-none w-8'> </div>
                <div className='hidden xl:flex w-1/12'>{t('external_access.medication_refill.medication_list.stop_date')}</div>
                <div className='hidden xl:flex flex-none w-8'> </div>
                <div className='hidden xl:flex w-2/12'> </div>
            </div>
            <div>
                {
                    medications.map((medication, index) => {
                        return <MedicationListItem data={medication} key={index}/>
                    })
                }
            </div>
        </div>)}
        <div className='border mt-8 lg:w-1/2'>
            <div className='p-6'>
                <div className='subtitle pb-4.5'>
                    {t('external_access.medication_refill.pharmacy_information')}
                </div>
                {defaultPharmacy && <Fragment>
                    <div className='subtitle2'>
                        {defaultPharmacy.clinicalProviderName}
                    </div>
                    <div className='body2'>
                        {`${defaultPharmacy.address1}, ${defaultPharmacy.city}`} <br/>
                        {`${t('external_access.medication_refill.pharmacy_information_ph')} ${utils.formatPhone(defaultPharmacy.phoneNumber)}, 
                          ${t('external_access.medication_refill.pharmacy_information_fax')} ${utils.formatPhone(defaultPharmacy.faxNumber)}`}
                    </div>
                </Fragment>}
            </div>
        </div>
    </div>
}

export default ViewMedications;
