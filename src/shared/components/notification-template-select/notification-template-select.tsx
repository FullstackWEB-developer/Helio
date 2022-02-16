import {useQuery, useQueryClient} from 'react-query';
import {GetMessageTemplates} from '@constants/react-query-constants';
import {getTemplates} from '@shared/services/notifications.service';
import {NotificationTemplate, NotificationTemplateChannel} from '@shared/models/notification-template.model';
import Dropdown, {DropdownItemModel, DropdownModel} from '@components/dropdown';
import {useEffect, useRef, useState} from 'react';
import Select from '@components/select/select';
import {Option} from '@components/option/option';
import customHooks from '../../hooks/customHooks';
import SvgIcon, {Icon} from '@components/svg-icon';
import {usePrevious} from '@shared/hooks/usePrevious';
import './notification-template-select.scss';
import {useDispatch, useSelector} from 'react-redux';
import {selectEmailTemplates, selectSmsTemplates} from '@shared/store/app/app.selectors';
import {setEmailTemplates, setSmsTemplates} from '@shared/store/app/app.slice';
import {TemplateUsedFrom} from '@components/notification-template-select/template-used-from';
import classnames from 'classnames';

export interface MessageTemplateSelectProps {
    channel: NotificationTemplateChannel;
    category?: string;
    onSelect: (template: NotificationTemplate) => void;
    asSelect?: boolean;
    selectLabel?: string;
    disabled?: boolean;
    isLoading?: boolean;
    resetValue?: number;
    usedFrom: TemplateUsedFrom,
    placement?:'bottom' | 'top'
}

const NotificationTemplateSelect = ({channel, category, onSelect, asSelect, selectLabel, isLoading, resetValue, usedFrom, placement = 'top', disabled}: MessageTemplateSelectProps) => {
    const [items, setItems] = useState<DropdownItemModel[]>([]);
    const [options, setOptions] = useState<Option[]>([]);
    const templateDiv = useRef<HTMLDivElement>(null);
    const previousChannel = usePrevious(channel);
    const dispatch = useDispatch();
    const queryClient = useQueryClient();
    const [selectedTemplate, setSelectedTemplate] = useState<string>();
    const [displayTemplateForTab, setDisplayTemplateForTab] = useState<boolean>(false);
    const smsTemplates = useSelector(selectSmsTemplates);
    const emailTemplates = useSelector(selectEmailTemplates);
    const [displaySelect, setDisplaySelect] = useState<boolean>(true);

    useEffect(() => {
        if (resetValue && resetValue > 0) {
            setDisplaySelect(false);
            setTimeout(() => setDisplaySelect(true), 0);
        }
    }, [resetValue])

    customHooks.useOutsideClick([templateDiv], () => {
        setDisplayTemplateForTab(false);
    });

    const shouldFetch = () => {
        return channel === NotificationTemplateChannel.Sms ?  (!smsTemplates || smsTemplates.length < 1)
            :(!emailTemplates || emailTemplates.length < 1);
    }

    const {isLoading: isLoadingTemplates, isFetching} = useQuery([GetMessageTemplates, channel, category, usedFrom], () => getTemplates(channel, usedFrom, category), {
        enabled: shouldFetch(),
        onSuccess:(data) => {
            if (channel === NotificationTemplateChannel.Sms) {
                dispatch(setSmsTemplates(data));
            } else if (channel === NotificationTemplateChannel.Email) {
                dispatch(setEmailTemplates(data));
            }
        }
    });

    useEffect(() => {
        let data : NotificationTemplate[] = [];
        if (channel === NotificationTemplateChannel.Sms) {
            data = smsTemplates;
        } else if (channel === NotificationTemplateChannel.Email) {
            data = emailTemplates;
        }

        if (!data) {
            return;
        }

        if (asSelect) {
            let opts = data.map(a => {
                return {
                    value: a.id,
                    object: a,
                    label: `${a.displayText}`
                } as Option
            })
            setOptions(opts);
        } else {
            let items = data.map(a => {
                return {
                    value: a.id,
                    object: a,
                    label: `${a.displayText} - ${a.id}`,
                    content: <div className='flex flex-row w-96 justify-between pl-4 pr-3'>
                        <div className='body2 template-item flex items-center'>{a.displayText}</div>
                        <div className='body3-medium template-item flex items-center pr-1'>{a.id}</div>
                    </div>
                } as DropdownItemModel
            })
            setItems(items);
        }

    }, [emailTemplates, smsTemplates, channel]);

    useEffect(() => {
        queryClient.invalidateQueries([GetMessageTemplates, previousChannel, category]).then()
    }, [channel]);

    const itemSelected = (item: DropdownItemModel) => {
        setDisplayTemplateForTab(false);
        setSelectedTemplate(item.object.id);
        onSelect(item.object);
    }

    const dropdownModel: DropdownModel = {
        isSearchable: true,
        items,
        itemsWrapperClass: 'py-2 h-80',
        defaultValue: selectedTemplate,
        onClick: (_, item) => itemSelected(item)
    };

    const isLoadingOrFetching = () => {
        return isLoading || isFetching || isLoadingTemplates;
    }

    if (asSelect) {
        if (!displaySelect) {
            return <div className='h-20'/>;
        }
        return <Select disabled={disabled} onSelect={(option) => onSelect(option?.object)} label={selectLabel} options={options} />;
    }

    const dropdownWrapperClassname = classnames('absolute z-50', {
        'bottom-0' : placement === 'top',
        'bottom-50': placement === 'bottom'
    })

    return <div ref={templateDiv} className='relative'>
        <div className='cursor-pointer' onClick={() => {
            !disabled && setDisplayTemplateForTab(!displayTemplateForTab)
        }}>
            <div className='w-10 h-10 flex items-center justify-center'>
                <SvgIcon isLoading={isLoadingOrFetching()} type={Icon.Templates} disabled={disabled} fillClass='rgba-05-fill' className='icon-medium'/>
            </div>
        </div>
        <div className={dropdownWrapperClassname} hidden={!displayTemplateForTab || isLoadingOrFetching() || items.length === 0 }>
            <div className='w-96'><Dropdown model={dropdownModel}/></div>
        </div>
    </div>
}

export default NotificationTemplateSelect;
