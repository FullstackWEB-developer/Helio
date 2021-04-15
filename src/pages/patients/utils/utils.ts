import dayjs from 'dayjs';
import {Insurance} from '@pages/patients/models/insurance';
import {ChartInsurance} from '@pages/patients/models/chart-insurance';

const getAge = (dob: string) => {
    const timeDiff = Math.abs(Date.now() - new Date(dob).getTime());
    return Math.floor((timeDiff / (1000 * 3600 * 24))/365);
}

const formatDob = (dob: string) => {
    const date = new Date(dob);
    return dayjs(date).format('MM/DD/YYYY');
}

const getPrimaryInsuranceHeader = (primaryInsurance: Insurance | ChartInsurance, message: string) => {
    let primaryInsuranceHeader = message;
    if (primaryInsurance.insurancePackageId || primaryInsurance.insurancePackageAddress1 ||
        primaryInsurance.insurancePackageCity || primaryInsurance.insurancePackageState ||
        primaryInsurance.insurancePackageZip) {
        primaryInsuranceHeader = `[${primaryInsurance.insurancePackageId || ''}] ${primaryInsurance.insurancePackageAddress1 || ''}, ${primaryInsurance.insurancePackageCity || ''}`
            + ` ${primaryInsurance.insurancePackageState || ''}, ${primaryInsurance.insurancePackageZip || ''}`;
    }
    return primaryInsuranceHeader;
}

const utils = {
    getAge, formatDob, getPrimaryInsuranceHeader
}

export default utils
