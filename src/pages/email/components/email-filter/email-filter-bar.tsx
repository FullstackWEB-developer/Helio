import SvgIcon, {Icon} from '@components/svg-icon';
import SearchInputField from '@components/search-input-field/search-input-field';
import dayjs from 'dayjs';
import {DATE_INPUT_LONG_FORMAT} from '@constants/form-constants';
import {useTranslation} from 'react-i18next';
import {EmailFilterModel} from '@pages/email/components/email-filter/email-filter.model';
import {GetTimePeriodLabel, TimePeriodDateRange} from '@shared/models/email-sms-time-period-options';
import EmailFilter from '@pages/email/components/email-filter/email-filter';
import {EmailQueryType} from '@pages/email/models/email-query-type';
import {EmailPath} from '@app/paths';
import {useHistory} from 'react-router';
import {EMPTY_GUID} from '@pages/email/constants';

export interface EmailFilterBarProps {
    filter: EmailFilterModel;
    searchTerm?: string;
    onSearchTermChanged: (value) => void;
    emailQueryType? : EmailQueryType;
    isFilterVisible: boolean;
    setFilterVisible: (value: boolean) => void;
    onFilterClick?: (param: EmailFilterModel) => void;
}

const EmailFilterBar = ({filter, searchTerm, onSearchTermChanged, emailQueryType, onFilterClick, isFilterVisible, setFilterVisible}: EmailFilterBarProps) => {
    const {t} = useTranslation();
    const history = useHistory();

    const newEmail = () => {
        history.replace(`${EmailPath}/${EMPTY_GUID}`)
    }

    const GetTimeLabel = () => {
        if (filter.timePeriod === TimePeriodDateRange) {
            return t('common.time_periods.date_range_value', {
                from: dayjs(filter.fromDate).format(DATE_INPUT_LONG_FORMAT),
                to: dayjs(filter.toDate).format(DATE_INPUT_LONG_FORMAT)
            });
        }
        return GetTimePeriodLabel(filter.timePeriod);
    }

    if (isFilterVisible) {
        return <EmailFilter
            value={filter}
            isUserFilterEnabled={emailQueryType === EmailQueryType.TeamEmail}
            onCloseClick={() => setFilterVisible(false)}
            onFilterClick={onFilterClick}/>;
    } else return <div>
        <div className='flex-none border-b'>
            <div className='flex flex-row justify-between pt-4 pb-4 pl-5 pr-4'>
                <div className='subtitle2'>{t(GetTimeLabel())}</div>
                <div className='flex flex-row'>
                    <SvgIcon
                        type={Icon.Note}
                        className='cursor-pointer icon-medium'
                        fillClass='default-toolbar-icon'
                        wrapperClassName='mr-7'
                        onClick={newEmail}
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

export default EmailFilterBar;
