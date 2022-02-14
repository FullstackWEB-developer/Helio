import {useTranslation} from 'react-i18next';
import {ExtendedPatient} from '@pages/patients/models/extended-patient';
import {useMemo, useRef, useState} from 'react';
import Dropdown, {DropdownItemModel, DropdownModel} from '@components/dropdown';
import {PatientPhoneType} from '@pages/patients/enums/patient-phone-type.enum';
import SvgIcon, {Icon} from '@components/svg-icon';
import {selectVoiceCounter} from '@pages/ccp/store/ccp.selectors';
import {useSelector} from 'react-redux';
import {EmailPath, SmsPath} from '@app/paths';
import {EMPTY_GUID} from '@pages/email/constants';
import utils from '@shared/utils/utils';
import { Link } from 'react-router-dom';
import {customHooks} from '@shared/hooks';
import './patient-header-actions.scss';

export interface PatientHeaderActionsProps {
    patient: ExtendedPatient;
    refreshPatient: () => void;
}

const PatientHeaderActions = ({patient, refreshPatient} : PatientHeaderActionsProps) => {
    const {t} = useTranslation();
    const voiceCounter = useSelector(selectVoiceCounter);
    const patientHasAnyPhoneOption = patient?.mobilePhone || patient.homePhone;
    const [phoneTypeOptions, setPhoneTypeOptions] = useState<DropdownItemModel[]>([]);
    const typeDropdownRef = useRef<HTMLDivElement>(null);
    const [selectedPhoneType, setSelectedPhoneType] = useState<PatientPhoneType>(phoneTypeOptions?.length > 0 ? Number(phoneTypeOptions[0].value) : PatientPhoneType.MobilePhone);
    const [displayPhoneTypeDropdown, setDisplayPhoneTypeDropdown] = useState<boolean>(false);
    customHooks.useOutsideClick([typeDropdownRef], () => {
        setDisplayPhoneTypeDropdown(false);
    });
    useMemo(() => {
        const generatePhoneTypeDropdownOptions = (): DropdownItemModel[] => {
            let options: DropdownItemModel[] = [];
            const {mobilePhone, homePhone} = patient;
            if (mobilePhone) {
                options.push({label: t('patient.phone_types.1'), value: String(PatientPhoneType.MobilePhone)});
            }
            if (homePhone) {
                options.push({label: t('patient.phone_types.2'), value: String(PatientPhoneType.HomePhone)});
            }
            return options;
        }

        const options = generatePhoneTypeDropdownOptions();
        setPhoneTypeOptions(options);
        if (!options.find(a => a.value=== selectedPhoneType.toString()) && options[0]) {
            setSelectedPhoneType(Number(options[0].value))
        }
    }, [patient, t]);

    const phoneTypeDropdownModel: DropdownModel = {
        defaultValue: selectedPhoneType?.toString(),
        onClick: (id) => phoneTypeSelected(Number(id)),
        items: phoneTypeOptions
    };

    const phoneTypeSelected = (type: PatientPhoneType) => {
        setDisplayPhoneTypeDropdown(false);
        setSelectedPhoneType(type);
    }

    const handleOnPhoneClick = () => {
        switch (selectedPhoneType) {
            case PatientPhoneType.MobilePhone:
                if (patient.mobilePhone) {
                    utils.initiateACall(patient.mobilePhone);
                }
                break;
            case PatientPhoneType.HomePhone:
                if (patient.homePhone) {
                    utils.initiateACall(patient.homePhone);
                }
                break;
            default:
                break;
        }
    }

    return <div className='flex flex-row justify-between pt-5'>
        <div className='flex'>
            <span className={`pr-3 ${voiceCounter === 1 || !patientHasAnyPhoneOption} ? '' : 'cursor-pointer'`} >
                <SvgIcon type={Icon.ChannelPhone}
                         className='icon-x-large'
                         fillClass='success-icon'
                         strokeClass='patient-stroke-color'
                         onClick={handleOnPhoneClick}
                         disabled={voiceCounter === 1 || !patientHasAnyPhoneOption}
                />
            </span>
                <div className='flex items-center' ref={typeDropdownRef}>
                    <div
                        onClick={() => {if (patientHasAnyPhoneOption) {setDisplayPhoneTypeDropdown(!displayPhoneTypeDropdown)} }}
                        className='flex flex-row'>
                        <div className={`${patientHasAnyPhoneOption ? 'body3-big' : 'patient-phone-type-disabled'}`}>
                            {t(`patient.phone_types.${selectedPhoneType}`)}
                        </div>
                        <div className='pl-1.5'>
                            <SvgIcon type={displayPhoneTypeDropdown ? Icon.ArrowUp : Icon.ArrowDown}
                                     disabled={voiceCounter === 1}
                                     className='icon-medium'
                                     fillClass={`${patientHasAnyPhoneOption ? 'patient-dropdown-arrows' : 'rgba-025-fill'}`} />
                        </div>
                    </div>
                    {displayPhoneTypeDropdown &&
                        <div className='absolute bottom'>
                            <Dropdown model={phoneTypeDropdownModel} />
                        </div>}
                </div>

                <span className={'pl-10 pr-8'} >
                        <Link
                            className={patient.mobilePhone ? '' : 'disabled-link'}
                            to={{
                                pathname:patient.mobilePhone ? `${SmsPath}` : '#',
                                state: {
                                    patient
                                }
                            }}>
                            <SvgIcon type={Icon.ChannelSms}
                                     disabled={!patient.mobilePhone}
                                     fillClass={patient.mobilePhone ? 'success-icon' : ''}
                                     className='icon-x-large'
                                     strokeClass='patient-stroke-color'
                            />
                        </Link>
                    </span>
                {
                    <span className="pr-8">
                             <Link
                                 className={patient?.emailAddress ? '' : 'disabled-link'}
                                 to={{
                                     pathname:patient?.emailAddress ? `${EmailPath}/${EMPTY_GUID}` : '#',
                                     state: {
                                         patient
                                     }
                                 }}>
                             <SvgIcon type={Icon.ChannelEmail}
                                      disabled={!patient.emailAddress}
                                      className='icon-x-large'
                                      fillClass={patient.emailAddress ? 'success-icon' : ''}
                                      strokeClass='patient-stroke-color'
                             /></Link>
                         </span>
                }
            </div>
        <div className='flex flex-row'>
            <div className='body2-primary pr-2 cursor-pointer' onClick={() => refreshPatient()}>
                {t('patient.summary.refresh')}
            </div>
            <div>
                <span className='cursor-pointer'>
                    <SvgIcon className='icon-medium'
                             type={Icon.Refresh}
                             onClick={() => refreshPatient()}
                             fillClass='rgba-05-fill'
                    />
                </span>
            </div>
        </div>
    </div>
}

export default PatientHeaderActions;
