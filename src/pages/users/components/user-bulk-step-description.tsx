import React from 'react';
import {useTranslation} from 'react-i18next';
import {BulkAddStep} from '../models/bulk-add-step.enum';
import './user-bulk-step-description.scss';

const BulkAddStepDescription = ({step}: {step: BulkAddStep}) => {
    const {t} = useTranslation();
    return (
        <div className='pt-4 flex flex-col bulk-description'>
            <h6>
                <span className='emphasized'> {t('users.bulk_section.step_x', {step: step})}</span>
                {t(`users.bulk_section.step_${step}_title`)}
            </h6>
            <div className='body2 pt-4 w-10/12'>
                {
                    step === BulkAddStep.ProviderMapping ?
                        <div>
                            {t('users.bulk_section.step_3_description')}
                            <b>{t('users.bulk_section.step_3_description_bold')}</b>
                            {t('users.bulk_section.step_3_continuation')}
                        </div> :
                        <div>{t(`users.bulk_section.step_${step}_description`)}</div>
                }
            </div>
        </div>
    );
}

export default BulkAddStepDescription;