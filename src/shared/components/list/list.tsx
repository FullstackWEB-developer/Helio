import React, {useState} from 'react';
import {useTranslation} from 'react-i18next';
import './list.scss';
import {Option} from '../option/option';
import {UserStatus} from 'src/shared/store/app-user/app-user.models';
import StatusDot from '@components/status-dot/status-dot';
import SvgIcon from '@components/svg-icon/svg-icon';
import {Icon} from '@components/svg-icon/icon';
import SearchInputField from '@components/search-input-field/search-input-field';

interface ListProps {
  options: ListOption[];
  title?: string;
  isSearchable?: boolean;
  onSelect?: (option: ListOption) => void;
}

export interface ListOption extends Option {
  status?: UserStatus;
}

const List = ({options, title, isSearchable = true, onSelect}: ListProps) => {
  const {t} = useTranslation();
  const [filter, setFilter] = useState<string>('');

  const optionSelected = (option: Option) => {
    if (onSelect) {
      onSelect(option);
    }

    setFilter('');
  };

  const getFilteredOptions = () => {
    return options.filter((option) =>
      option.label.toLowerCase().includes(filter.toLowerCase())
    );
  };

  const filteredOptionsContent = getFilteredOptions().map((option) => {
    return (
      <div
        className='cursor-pointer h-6 bg-white body3 flex items-center px-4 truncate w-full hover:bg-primary-500 hover:text-white'
        onClick={() => optionSelected(option)}
        key={option.value}
      >
        <div className='flex flex-row items-center space-x-2 '>
          <div>{option.status && <StatusDot status={option.status} />}</div>
          <div> {option.label}</div>
        </div>
      </div>
    );
  });

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const opts = getFilteredOptions();
    if (e.key === 'Enter') {
      e.preventDefault();
      if (opts && opts.length > 0) {
        optionSelected(opts[0]);
      }
    }
  };
  return (
    <div className='w-full flex flex-col bg-white'>
      {title && (
        <div className='subtitle h-10 pl-4 border-b flex items-center'>
          {t(title)}
        </div>
      )}
      {isSearchable && (
        <SearchInputField onKeyDown={handleKeyDown}
          inputClassNames='h-full w-full'
          wrapperClassNames='h-10 w-full'
          value={filter} placeholder={t('search.placeholder')}
          onChange={(value) => setFilter(value)} />
      )}
      <div className='pt-1 list-items overflow-y-auto'>
        {filteredOptionsContent}
      </div>
    </div>
  );
};

export default List;
