import Button from "@components/button/button";
import {ControlledSelect, ControlledInput} from "@components/controllers";
import SvgIcon, {Icon} from "@components/svg-icon";
import {InviteUserModel} from "@shared/models";
import {getProviders} from "@shared/services/lookups.service";
import {getRoleWithState, searchUserInDirectory} from "@shared/services/user.service";
import {selectProviderList, selectRoleList} from "@shared/store/lookups/lookups.selectors";
import utils from "@shared/utils/utils";
import {useEffect, useMemo, useState} from "react";
import {useForm} from "react-hook-form";
import {useTranslation} from "react-i18next";
import {useDispatch, useSelector} from "react-redux";
import {Option} from '@components/option/option';
import {useQuery} from "react-query";
import {useDebounce} from "@shared/hooks";
import {DEBOUNCE_SEARCH_DELAY_MS} from "@constants/form-constants";
import {SearchUserInActiveDirectory} from "@constants/react-query-constants";
import ProviderMappingToolTip from "./provider-tool-tip";

interface UserAddRowProps {
    index: number;
    value?: InviteUserModel;
    isLast?: boolean;
    onChange?: (index: number, value: InviteUserModel) => void;
    onRemoveClick?: (index: number) => void;
    onAddClick?: (index: number, value: InviteUserModel) => void;
}

const UserAddRow = ({
    index,
    value,
    isLast,
    ...props
}: UserAddRowProps) => {
    const {t} = useTranslation();

    const {control, handleSubmit, setValue, getValues} = useForm({
        shouldUnregister: false,
        mode: "all"
    });

    const dispatch = useDispatch();
    const roles = useSelector(selectRoleList);
    const providers = useSelector(selectProviderList);

    const [email, setEmail] = useState('');
    const [emailOptionSelected, setEmailOptionSelected] = useState<Option>();
    const [debounceCompanySearchTerm] = useDebounce(email, DEBOUNCE_SEARCH_DELAY_MS);

    const [emailOptions, setEmailOption] = useState<Option[]>([]);

    const providerOptions = useMemo(() => utils.parseOptions(providers,
        item => utils.stringJoin(' ', item.firstName, item.lastName),
        item => item.id.toString()
    ), [providers]);

    const rolesOptions = useMemo(() => utils.parseOptions(roles,
        item => item.name,
        item => item.name
    ), [roles]);

    useEffect(() => {
        setValue('providerId', value?.providerId ?? '');

        if (value?.email && value?.name) {
            setValue('email', value.name);
            setEmailOptionSelected({label: value.name, value: value.email});
        } else {
            setEmailOption([]);
            setValue('email', '');
            setEmailOptionSelected(undefined);
        }

        if (value?.roles && value.roles.length > 0) {
            setValue('role', value.roles[0]);
        } else {
            setValue('role', '');
        }

    }, [index, value])

    useEffect(() => {
        setValue('providerId', value?.providerId ?? '');

        if (value?.email && value?.name) {
            setValue('email', value.name);
            setEmailOptionSelected({label: value.name, value: value.email});
        } else {
            setEmailOption([]);
            setValue('email', '');
            setEmailOptionSelected(undefined);
        }

        if (value?.roles && value.roles.length > 0) {
            setValue('role', value.roles[0]);
        } else {
            setValue('role', '');
        }

    }, [index, value])

    useEffect(() => {
        dispatch(getProviders());
        dispatch(getRoleWithState);
    }, [dispatch])


    const emailQuery = useQuery([SearchUserInActiveDirectory, debounceCompanySearchTerm],
        () => searchUserInDirectory({searchText: debounceCompanySearchTerm}),
        {
            enabled: debounceCompanySearchTerm.length > 2,
            onSuccess: (data) => {
                const options = utils.parseOptions(data.results,
                    item => item.displayName,
                    item => item.mail,
                    item => item.mail,
                    item => item
                );
                setEmailOption(options);
            }
        });

    const isValid = () => {
        const values = getValues();
        return emailOptionSelected && !!values.role;
    }

    const convertToModel = (formData: any): InviteUserModel => {
        return {
            email: emailOptionSelected?.value ?? '',
            name: emailOptionSelected?.label ?? '',
            firstName: emailOptionSelected?.object.givenName,
            lastName: emailOptionSelected?.object.surname,
            providerId: formData.providerId,
            roles: [formData.role]
        }
    }


    const change = (formData: any, isNew: boolean) => {
        if (isValid()) {
            const result = convertToModel(formData);

            if (isNew) {
                if (props.onAddClick) {
                    props.onAddClick(index, result);
                }
            } else if (!isLast && props.onChange) {
                props.onChange(index, result);
            }
        }
    }

    const submit = (isNew: boolean) => handleSubmit((formData) => change(formData, isNew))();

    const onEmailChange = (inputValue: string) => {
        setEmail(inputValue);
        if (!inputValue) {
            setEmailOption([]);
        }
    }

    const onEmailSuggestionClick = (option: Option) => {
        setValue('email', option.label);
        setEmailOptionSelected(option);
    }

    return (<div className='flex flex-row items-center mt-3.5'>
        <div className='mr-8 w-80'>
            <ControlledInput
                name="email"
                defaultValue=''
                control={control}
                type='text'
                label='users.add_section.name_or_email'
                forceAutoSuggestSelect
                autosuggestDropdown
                autosuggestOptions={emailOptions}
                onDropdownSuggestionClick={onEmailSuggestionClick}
                isFetchingSuggestions={emailQuery.isLoading || emailQuery.isFetching}
                selectedSuggestion={emailOptionSelected}
                onChange={(event) => onEmailChange(event.target.value)}
                onBlur={() => submit(false)}
            />
        </div>
        <div className='mr-8'>
            <ControlledSelect
                name="role"
                control={control}
                label='users.add_section.role'
                options={rolesOptions}
                onSelect={() => submit(false)}
            />
        </div>
        <div className='flex flex-row items-center w-80'>
            <ControlledSelect
                name="providerId"
                control={control}
                label='users.ehr_provider_mapping'
                assistiveText={t('users.ehr_provider_mapping_assistive_text')}
                options={providerOptions}
                onSelect={() => submit(false)}
            />

        </div>
        {isLast &&
            <div className='pb-6 ml-2'>
                <ProviderMappingToolTip />
            </div>
        }
        {!isLast &&
            <div className="pb-6 ml-2">
                <SvgIcon
                    type={Icon.Close}
                    className='cursor-pointer'
                    onClick={() => props.onRemoveClick && props.onRemoveClick(index)}
                    fillClass='rgba-05-fill'
                />
            </div>
        }
        {isLast &&
            <div className="pb-6 ml-8">
                <Button
                    label='common.add'
                    buttonType='medium'
                    disabled={!isValid()}
                    onClick={() => submit(true)}
                />
            </div>
        }
    </div>);
}

export default UserAddRow;
