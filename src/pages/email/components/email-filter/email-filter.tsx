import classnames from 'classnames';
import SvgIcon, {Icon} from '@components/svg-icon';
import SearchInputField from '@components/search-input-field/search-input-field';
import dayjs from 'dayjs';
import {DATE_INPUT_LONG_FORMAT} from '@constants/form-constants';
import {useTranslation} from 'react-i18next';
import {EmailFilterParamModel} from '@pages/email/components/email-filter/email-filter.model';
import {useState} from 'react';

export interface EmailFilterProps {
    filter: EmailFilterParamModel;
    searchTerm?: string;
    onSearchTermChanged: (value) => void;
    onNewEmailClick: () => void;
}

const EmailFilter = ({filter, searchTerm, onSearchTermChanged, onNewEmailClick}: EmailFilterProps) => {
    const {t} = useTranslation();
    const [isFilterVisible, setFilterVisible] = useState<boolean>();
    const getTimePeriodLabel = (value: string) => {
        switch (value) {
            case '0':
                return t('common.time_periods.today');
            case '1':
                return t('common.time_periods.last_7_days');
            case '2':
                return t('common.time_periods.last_30_days');
            case '3':
                return t('common.time_periods.date_range_value', {
                    from: dayjs(filter.fromDate).format(DATE_INPUT_LONG_FORMAT),
                    to: dayjs(filter.toDate).format(DATE_INPUT_LONG_FORMAT)
                });
            default:
                return '';
        }
    }

    return <div className={classnames({'hidden': isFilterVisible})}>
        <div className='flex-none border-b'>
            <div className='flex flex-row justify-between pt-4 pb-4 pl-5 pr-4'>
                <div className='subtitle2'>{getTimePeriodLabel(filter.timePeriod)}</div>
                <div className='flex flex-row'>
                    <SvgIcon
                        type={Icon.Note}
                        className='cursor-pointer icon-medium'
                        fillClass='default-toolbar-icon'
                        wrapperClassName='mr-7'
                        onClick={onNewEmailClick}
                    />
                    <SvgIcon
                        type={Icon.FilterList}
                        fillClass='default-toolbar-icon'
                        className='cursor-pointer icon-medium'
                        onClick={() => setFilterVisible(true)}
                    />
                </div>
            </div>
        </div>
        <SearchInputField
            wrapperClassNames='h-12 flex-none'
            iconWrapperClassName='pl-5'
            placeholder={t('email.filter.search_placeholder')}
            value={searchTerm}
            onChange={(value) => onSearchTermChanged(value)}
        />
    </div>
}

export default EmailFilter;
