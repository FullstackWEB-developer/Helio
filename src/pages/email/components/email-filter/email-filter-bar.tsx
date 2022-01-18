import SvgIcon, {Icon} from '@components/svg-icon';
import SearchInputField from '@components/search-input-field/search-input-field';
import dayjs from 'dayjs';
import {DATE_INPUT_LONG_FORMAT} from '@constants/form-constants';
import {useTranslation} from 'react-i18next';
import {EmailFilterModel} from '@pages/email/components/email-filter/email-filter.model';
import {GetTimePeriodLabel} from '@shared/models/email-sms-time-period-options';
import EmailFilter from '@pages/email/components/email-filter/email-filter';
import {EmailQueryType} from '@pages/email/models/email-query-type';

export interface EmailFilterBarProps {
    filter: EmailFilterModel;
    searchTerm?: string;
    onSearchTermChanged: (value) => void;
    onNewEmailClick: () => void;
    emailQueryType? : EmailQueryType;
    isFilterVisible: boolean;
    setFilterVisible: (value: boolean) => void;
    onFilterClick?: (param: EmailFilterModel) => void;
}

const EmailFilterBar = ({filter, searchTerm, onSearchTermChanged, onNewEmailClick, emailQueryType, onFilterClick, isFilterVisible, setFilterVisible}: EmailFilterBarProps) => {
    const {t} = useTranslation();

    if (isFilterVisible) {
        return <EmailFilter
            value={filter}
            isUserFilterEnabled={emailQueryType === EmailQueryType.TeamEmail}
            onCloseClick={() => setFilterVisible(false)}
            onFilterClick={onFilterClick}/>;
    } else return <div>
        <div className='flex-none border-b'>
            <div className='flex flex-row justify-between pt-4 pb-4 pl-5 pr-4'>
                <div className='subtitle2'>{t(GetTimePeriodLabel(filter.timePeriod), {
                    from: dayjs(filter.fromDate).format(DATE_INPUT_LONG_FORMAT),
                    to: dayjs(filter.toDate).format(DATE_INPUT_LONG_FORMAT)
                })}</div>
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

export default EmailFilterBar;
