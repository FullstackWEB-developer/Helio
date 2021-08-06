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

export interface MessageTemplateSelectProps {
    channel: NotificationTemplateChannel;
    category?: string;
    onSelect: (template: NotificationTemplate) => void;
    asSelect?: boolean;
    selectLabel?: string;
    disabled?: boolean;
}

const NotificationTemplateSelect = ({channel, category, onSelect, asSelect, selectLabel}: MessageTemplateSelectProps) => {
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

    customHooks.useOutsideClick([templateDiv], () => {
        setDisplayTemplateForTab(false);
    });

    const shouldFetch = () => {
        return channel === NotificationTemplateChannel.Sms ?  (!smsTemplates || smsTemplates.length < 1)
            :(!emailTemplates || emailTemplates.length < 1);
    }

    const {isLoading, isFetching} = useQuery([GetMessageTemplates, channel, category], () => getTemplates(channel, category), {
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

        if (asSelect) {
            let opts = data.map(a => {
                return {
                    value: a.id,
                    object: a,
                    label: `${a.category} - ${a.logicKey}`
                } as Option
            })
            setOptions(opts);
        } else {
            let items = data.map(a => {
                return {
                    value: a.id,
                    object: a,
                    label: `${a.category} - ${a.logicKey} - ${a.id}`,
                    content: <div className='flex flex-row w-96 justify-between pl-4 pr-3'>
                        <div className='body2 template-item flex items-center'>{a.category} - {a.logicKey}</div>
                        <div className='body3-medium template-item flex items-center'>{a.id}</div>
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
        return isLoading || isFetching;
    }

    if (asSelect) {
        return <Select onSelect={(option) => onSelect(option?.object)} label={selectLabel} options={options} />;
    }
    return <div ref={templateDiv} className='relative'>
        <div className='cursor-pointer' onClick={() => {
            setDisplayTemplateForTab(!displayTemplateForTab)
        }}>
            <div className='w-10 h-10 flex items-center justify-center'>
                <SvgIcon isLoading={isLoadingOrFetching()} type={Icon.Templates} fillClass='rgba-05-fill' className='icon-medium'/>
            </div>
        </div>
        <div className='absolute bottom-0 z-50' hidden={!displayTemplateForTab || isLoadingOrFetching() || items.length === 0 }>
            <div className='w-96'><Dropdown model={dropdownModel}/></div>
        </div>
    </div>
}

export default NotificationTemplateSelect;
