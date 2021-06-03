import {Icon} from '@components/svg-icon/icon';
import SvgIcon from '@components/svg-icon/svg-icon';
import Tooltip from '@components/tooltip/tooltip';
import {useRef, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {useHistory} from 'react-router';
import utils from '../../../../shared/utils/utils';
import {LabResult} from '../models/lab-result.model';

interface LabResultListItemProps {
    labResult: LabResult
}

const LabResultListItem = ({labResult}: LabResultListItemProps) => {
    const {t} = useTranslation();
    const [displayTooltip, setDisplayTooltip] = useState(false);
    const noteIcon = useRef(null);
    const history = useHistory();
    return (
        <>
            <div>{labResult?.description || t('common.not_available')}</div>
            <div className='hidden sm:block'>
                {
                    labResult?.labResultNote ?
                        <div className='w-6 h-6' ref={noteIcon} onMouseOver={() => setDisplayTooltip(true)} onMouseOut={() => setDisplayTooltip(false)}>
                            <SvgIcon className='cursor-pointer' type={Icon.Comment} fillClass='lab-result-icons-fill' />
                        </div> : t('common.not_available')
                }
            </div>
            <div className='hidden sm:block'>{labResult?.providerName || t('common.not_available')}</div>
            <div>{labResult?.labResultDate ? utils.formatDateShortMonth(labResult?.labResultDate?.toString()) : t('common.not_available')}</div>
            <div className='m-auto'><SvgIcon type={Icon.View} className='cursor-pointer' fillClass='lab-result-icons-fill' onClick={()=>history.push(`/o/lab-results/${labResult.labResultId}`)} /></div>
            <Tooltip targetRef={noteIcon} placement='bottom-start' isVisible={displayTooltip}>
                <div className='p-6 w-80 flex flex-col'>
                    {labResult?.providerName && <span className='mb-3 subtitle2'>{labResult.providerName}</span>}
                    <span className='body2'>{labResult.labResultNote}</span>
                </div>
            </Tooltip>
        </>
    )
}

export default LabResultListItem;
