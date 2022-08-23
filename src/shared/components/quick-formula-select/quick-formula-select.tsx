import React, {useState} from 'react';
import {useTranslation} from 'react-i18next';

const QuickFormulaSelect = ({formulaSelectionHandler}:{formulaSelectionHandler: (value: string) => void}) => {
    const {t} = useTranslation();
    const [formulaOptions, setFormulaOptions] = useState<{key: string, label: string}[]>([
        {key: 'firstName', label: 'First Name'},
        {key: 'lastName', label: 'Last Name'},
        {key: 'fullName', label: 'Full Name'},
        {key: 'shortName', label: 'Short Name (eg. J.Smith)'},
        {key: 'ticketId', label: 'Ticket ID'},
        {key: 'ticketNumber', label: 'Ticket Number'},
        {key: 'ticketLink', label: 'Ticket Link'},
        {key: 'smsConnversationLink', label: 'SMS Conversation Link'},
        {key: 'emailConversationLink', label: 'Email Conversation Link'},
        {key: 'userFirstName', label: 'User First Name'},
        {key: 'blockedAccessTypeString', label: 'Blocked String'},
        {key: 'blockedAccessLink', label: 'Blocked Link'},
        {key: 'blockedAccessValue', label: 'Blocked Value Details'},
        {key: 'helioLink', label: 'Helio Log In'},
        {key: 'newPatientRegistrationLink', label: 'New Patient Registration Form'},
        {key: 'labResultLink', label: 'Test Results'},
        {key: 'departmentAddress', label: 'Department Address'},
        {key: 'departmentPhone', label: 'Department Phone Number'},
        {key: 'department.patientDepartmentName', label: 'Department Name'},
        {key: 'department.address', label: 'Department Address'},
        {key: 'department.address2', label: 'Department Address 2'},
        {key: 'department.city', label: 'Department City'},
        {key: 'department.state', label: 'Department State'},
        {key: 'department.zip', label: 'Department ZIP'},
        {key: 'department.parkingInformation', label: 'Department Parking Info'},
        {key: 'department.directionsLink', label: 'Department Directions Link'},
    ])

    const handleFormulaSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
        formulaSelectionHandler(e.target.value);
        e.target.value = "";
    }
    return (
        <select className='body3 pl-4 mr-20' defaultValue='' onChange={handleFormulaSelect}>
            <option value="" selected disabled hidden>{t('common.insert')}</option>
            {
                formulaOptions.map(o => <option key={o.key} value={o.key} label={o.label}></option>)
            }
        </select>
    )
}

export default QuickFormulaSelect;
