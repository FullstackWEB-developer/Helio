import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import './select.scss';
import customHooks from '@shared/hooks/customHooks';
import SelectCell from './select-cell';
import { Option } from '@components/option/option';
import { keyboardKeys } from '@components/search-bar/constants/keyboard-keys';
import SvgIcon from '@components/svg-icon/svg-icon';
import { Icon } from '@components/svg-icon/icon';
import { isIOS, isIOS13 } from 'react-device-detect';
import Spinner from '@components/spinner/Spinner';
import classnames from 'classnames';
interface SelectProps {
  label?: string;
  value?: Option | string;
  searchQuery?: string;
  autoComplete?: boolean;
  options: Option[];
  error?: string;
  order?: boolean;
  assistiveText?: string;
  disabled?: boolean;
  defaultValue?: Option | string | null;
  defaultValues?: Option[];
  required?: boolean;
  suggestionsPlaceholder?: string;
  isLoading?: boolean;
  className?: string;
  onTextChange?: (value: string) => void;
  onSelect?: (option?: Option) => void;
  truncateAssistiveText?: boolean;
  allowClear?: boolean;
  isMultiple?: boolean;
  name?: string;
  onClose?: () => void;
  onFocus?: () => void;
}
const Select = React.forwardRef<HTMLDivElement, SelectProps>(
  (
    {
      options,
      order,
      label,
      className,
      autoComplete = true,
      defaultValue = null,
      truncateAssistiveText = false,
      allowClear = false,
      isMultiple = false,
      defaultValues,
      ...props
    }: SelectProps,
    ref,
  ) => {
    const { t }: { t: any } = useTranslation();
    const [open, setOpen] = useState(false);
    const [selectedOption, setSelectedOption] = useState<
      Option | null | undefined
    >(
      typeof defaultValue === 'string'
        ? options?.find(a => !!a && a?.value === defaultValue)
        : defaultValue,
    );
    const [searchQuery, setSearchQuery] = useState<string | null>(null);
    const [selectedOptions, setSelectedOptions] = useState<Option[]>([]);
    const [cursor, setCursor] = useState<number>(-1);
    let managedOptions = options && options.length > 0 ? [...options] : [];
    if (order) {
      managedOptions = managedOptions.sort((a, b) =>
        a.label.localeCompare(b.label),
      );
    }
    const innerRef = customHooks.useCombinedForwardAndInnerRef(ref);
    const inputRef = useRef<HTMLInputElement>(null);
    customHooks.useOutsideClick([innerRef], () => {
      if (open) {
        onClose();
      }
    });

    useEffect(()=>{
      setSelectedOption(
        typeof defaultValue === 'string'
        ? options?.find(a => !!a && a?.value === defaultValue)
        : defaultValue
      );
    },[defaultValue]);

    const searchOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchQuery(e.target.value);
      setCursor(0);
      if (props.onTextChange) {
        props.onTextChange(e.target.value);
      }
    };

    const onClose = () => {
      setOpen(false);
      if (props.onClose) {
        props.onClose();
      }
    };

    useEffect(() => {
      if (
        isMultiple &&
        defaultValues &&
        defaultValues.length > 0 &&
        options &&
        options.length > 0
      ) {
        const selectedOptions: Option[] = [];
        defaultValues.forEach(opt => {
          const foundOption = options?.find(a => a?.value === opt?.value);
          if (foundOption) {
            selectedOptions.push(foundOption);
          }
        });
        setSelectedOptions(selectedOptions);
      }
    }, [defaultValues, options]);

    const renderOptions = (): Option[] => {
      if (searchQuery) {
        return managedOptions.filter(o =>
          o.label.toLowerCase().includes(searchQuery.toLowerCase()),
        );
      }
      return managedOptions;
    };
    const selectValueChange = (option?: Option) => {
      if (!isMultiple) {
        setSelectedOption(option);
        setSearchQuery(null);
        inputRef?.current?.blur();
      } else {
        if (option) {
          let index = selectedOptions.indexOf(option);
          if (index < 0) {
            selectedOptions.push(option);
          } else {
            selectedOptions.splice(index, 1);
          }
        }
      }
      if (props.onSelect) {
        props.onSelect(option);
      }
    };

    useEffect(() => {
      if (typeof props.value === 'string') {
        if (selectedOption?.value !== props.value) {
          setSelectedOption(
            options?.find(
              a => !!a?.value && a.value.toString() === props.value?.toString(),
            )!,
          );
        }
      } else if (props.value?.value) {
        if (props.value && selectedOption?.value !== props.value.value) {
          setSelectedOption(props.value);
        }
      }
      if (props.searchQuery) {
        setSearchQuery(props.searchQuery);
      }
    }, [props.value]);

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (!open) {
        return;
      }
      switch (e.key) {
        case keyboardKeys.arrowUp: {
          e.preventDefault();
          if (cursor > 0) {
            setCursor(cursor - 1);
          }
          break;
        }
        case keyboardKeys.arrowDown: {
          e.preventDefault();
          if (cursor < renderOptions().length - 1) {
            setCursor(cursor + 1);
          }
          break;
        }
        case keyboardKeys.enter: {
          e.preventDefault();
          const currentlyAvailableOptions = renderOptions();
          if (cursor >= 0 && cursor <= currentlyAvailableOptions.length - 1) {
            selectValueChange(currentlyAvailableOptions[cursor]);
          }
          break;
        }
      }
    };
    const handleArrowClick = () => {
      if (!isMultiple) {
        open ? inputRef.current?.blur() : inputRef.current?.focus();
      } else if (open) {
        onClose();
      } else {
        setOpen(true);
      }
    };

    const determineLabelTypography = () => {
      return `body${
        open || searchQuery || selectedOption || selectedOptions.length > 0
          ? '3'
          : '2'
      }`;
    };

    const assistiveTextClass = classnames({
      'assistive-text-color-focused': open,
      'assistive-text-color-inactive': !open,
    });

    const OptionSection = () => {
      if (props.isLoading) {
        return <Spinner />;
      }

      const currentOptions = renderOptions();
      if (currentOptions.length > 0) {
        return (
          <>
            {currentOptions
              .filter(a => !!a)
              .map((option: Option, index) => (
                <SelectCell
                  item={option}
                  isMultiple={isMultiple}
                  truncateAssistiveText={truncateAssistiveText}
                  key={`${index}-${option.value}`}
                  isSelected={
                    option.value === selectedOption?.value ||
                    selectedOptions.some(a => a.value === option.value)
                  }
                  onClick={() => selectValueChange(option)}
                  disabled={option.disabled}
                  className={`${cursor === index ? 'active' : ''}`}
                  changeCursorValueOnHover={() =>
                    (!isIOS || !isIOS13) && setCursor(index)
                  }
                />
              ))}
          </>
        );
      }
      return (
        <div className='w-full pt-2 text-center subtitle3-small'>
          {t(props.suggestionsPlaceholder || 'common.autocomplete_search')}
        </div>
      );
    };

    const getInputLabel = () => {
      if (!!searchQuery) {
        return searchQuery;
      }
      if (!isMultiple) {
        return t(selectedOption?.label);
      }
      if (selectedOptions.length === 0) {
        return '';
      }
      if (selectedOptions.length === 1) {
        return t(selectedOptions[0].label);
      }
      return t('common.multiple');
    };

    const onBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      if (!isMultiple) {
        onClose();
        e.target.value = '';
        setSearchQuery(null);
        setCursor(-1);
      }
    };

    return (
      <div
        ref={innerRef}
        className={classnames(
          `select-wrapper relative w-full flex flex-col h-20 ${
            props.disabled ? 'select-wrapper-disabled' : ''
          }`,
          className,
        )}
      >
        <div className={`select relative flex flex-col ${open ? 'open' : ''}`}>
          <input
            data-testid={props.name}
            name={props.name}
            ref={inputRef}
            type='text'
            autoComplete={autoComplete ? 'on' : 'nope'}
            onChange={e => searchOnChange(e)}
            autoCorrect={autoComplete ? 'on' : 'off'}
            spellCheck={autoComplete ? 'true' : 'false'}
            readOnly={!autoComplete}
            onFocus={e => {
              setOpen(true);
              e.target.select();
              if (!autoComplete) {
                e.target.removeAttribute('readonly');
              }
              props.onFocus?.();
            }}
            onBlur={e => {
              onBlur(e);
            }}
            onKeyDown={e => {
              handleKeyDown(e);
            }}
            className={`pl-4 pr-8 body2 ${
              !label ? 'pt-2.5' : 'select-trigger-pt'
            } h-1${!label ? '0' : '4'} relative truncate select-trigger ${
              selectedOption || selectedOptions.length > 0 || searchQuery
                ? 'activated'
                : ''
            } ${props.error ? 'error' : ''} `}
            value={getInputLabel()}
            disabled={props.disabled}
          />
          {label && (
            <label className={`select-label absolute truncate`}>
              {props.required && !props.disabled && (
                <span className={'text-danger'}>*</span>
              )}
              <span
                className={`select-label-span ${determineLabelTypography()}`}
              >
                {t(label)}
              </span>
            </label>
          )}
          <div className={`absolute pt-${!label ? '3' : '4'} right-4 `}>
            <div className='flex flex-row items-start'>
              {allowClear && selectedOption && open && (
                <div
                  onMouseDown={e => {
                    e.preventDefault();
                  }}
                >
                  <SvgIcon
                    className='cursor-pointer'
                    type={Icon.Clear}
                    fillClass='select-arrow-fill'
                    onClick={() => selectValueChange()}
                  />
                </div>
              )}
              <div
                className='cursor-pointer'
                onClick={handleArrowClick}
                onMouseDown={e => {
                  e.preventDefault();
                }}
              >
                {
                  <SvgIcon
                    type={open ? Icon.ArrowUp : Icon.ArrowDown}
                    fillClass={'select-arrow-fill'}
                  />
                }
              </div>
            </div>
          </div>
          <div
            className={classnames(
              `absolute py-2 options${
                isMultiple ? ' multiple-select-options' : ''
              }`,
            )}
          >
            <OptionSection />
          </div>
        </div>
        {props.assistiveText && !props.error && (
          <div
            className={`h-6 max-h-6 pl-4 ${
              open ? 'assistive-text-focus' : ''
            } body3 pt-1 truncate`}
          >
            <span className={assistiveTextClass}>{t(props.assistiveText)}</span>
          </div>
        )}
        {props.error && (
          <div className={'h6 pl-4 body3 pt-1 text-danger truncate'}>
            {props.error}
          </div>
        )}
      </div>
    );
  },
);

export default Select;
