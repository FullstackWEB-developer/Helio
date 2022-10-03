import React from 'react';
import utils from '@shared/utils/utils';
const LabResultPdfHeaderLogo = () => {
    const practiceBranding = JSON.parse(utils.getAppParameter('PracticeBranding'));
    utils.addPracticeBranding(practiceBranding);
    return (<img src={`${utils.getAppParameter('AssetsPath')}${practiceBranding.logoPath}`} alt='Logo'/>)
}

export default LabResultPdfHeaderLogo;
