import {useState, useEffect, Fragment} from 'react';
import Pagination from '@components/pagination/pagination';
import SvgIcon, {Icon} from '@components/svg-icon';
import Table from '@components/table/table';
import {TableModel} from '@components/table/table.models';
import {GetBlacklist} from '@constants/react-query-constants';
import {useMutation, useQuery} from 'react-query';
import {BlacklistModel, BlacklistRequest, BlockAccessType} from '../models/blacklist.model';
import {createBlockAccess, getBlacklist, unblockAccess} from '../services/blacklists.service';
import ToolTipIcon from '@components/tooltip-icon/tooltip-icon';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import {DATE_TIME_FORMAT} from '@constants/form-constants';
import DropdownLabel from '@components/dropdown-label';
import {DropdownItemModel} from '@components/dropdown';
import Confirmation from '@components/confirmation/confirmation';
import './blacklist-table.scss';
import Modal from '@components/modal/modal';
import {ControlledInput, ControlledTextArea} from '@components/controllers';
import {useForm} from 'react-hook-form';
import Button from '@components/button/button';
import {useTranslation} from 'react-i18next';
import Spinner from '@components/spinner/Spinner';
import utils from '@shared/utils/utils';
import {addSnackbarMessage} from '@shared/store/snackbar/snackbar.slice';
import {SnackbarType} from '@components/snackbar/snackbar-type.enum';
import {SnackbarPosition} from '@components/snackbar/snackbar-position.enum';
import {useDispatch} from 'react-redux';

const DEFAULT_PAGING = {
    page: 1,
    pageSize: 10,
    totalCount: 100,
    totalPages: 10
}
interface BlacklistsTableProps {
    type: BlockAccessType;
}

const BlacklistsTable = ({type, ...props}: BlacklistsTableProps) => {
    dayjs.extend(utc);
    const {t} = useTranslation();
    const dispatch = useDispatch();
    const [isConfirmationDisplayed, setIsConfirmationDisplayed] = useState(false);
    const [isAddNewModalDisplayed, setAddNewModelDisplayed] = useState(false);
    const [rowIdSelected, setRowIdSelected] = useState<string>();
    const {control, handleSubmit, formState} = useForm({mode: 'all'});
    const {isValid} = formState;
    const [blacklistRequest, setBlacklistRequest] = useState<BlacklistRequest>({
        ...DEFAULT_PAGING,
        accessType: type
    });

    const [pagingResult, setPagingResult] = useState({...DEFAULT_PAGING});

    const onDropdownStatusClick = (item: DropdownItemModel, rowId: string) => {
        setRowIdSelected(rowId);
        setIsConfirmationDisplayed(true);
        return false;
    }

    const dropdown: DropdownItemModel[] = [
        {
            label: t('blacklist.status_type.blocked'),
            value: 'true'
        },
        {
            label: t('blacklist.status_type.unblock'),
            value: 'false'
        }
    ];

    const getValueColumnName = () => {
        switch (type) {
            case BlockAccessType.Email:
                return t("blacklist.block_access_type.email");
            case BlockAccessType.IPAddress:
                return t("blacklist.block_access_type.ip");
            case BlockAccessType.Phone:
                return t("blacklist.block_access_type.phone");
        }
    }

    const tableModelInit: TableModel = {
        hasRowsBottomBorder: true,
        rows: [],
        wrapperClassName: '',
        headerClassName: 'h-12',
        rowClass: 'h-14',
        columns: [
            {
                title: getValueColumnName(),
                field: 'value',
                widthClass: 'w-2/6',
                rowClassname: 'subtitle2',
                render: (value: string, row: BlacklistModel) => {
                    return (<span className='flex items-center h-full subtitle2'>{type !== BlockAccessType.Phone ? value : utils.applyPhoneMask(value)}</span>)
                }
            },
            {
                title: t('blacklist.note'),
                field: 'comment',
                alignment: 'start',
                widthClass: 'w-20 flex items-center justify-start h-full',

                render: (value: string, row: BlacklistModel) => {
                    if (!value) {
                        return (<></>);
                    }
                    return (
                        <ToolTipIcon
                            icon={Icon.Comment}
                            iconFillClass='rgba-05-fill'
                            placement='bottom-start'
                            className=''
                        >
                            <div className='flex flex-col p-6 w-80'>
                                <span className='subtitle2'>{row.createdByName}</span>
                                <span className='flex flex-row body3-medium mt-1.5'>
                                    <span>{t('blacklist.reported_on')}:</span>
                                    <span className='ml-0.5'>{dayjs.utc(row.createdOn).local().format(DATE_TIME_FORMAT)}</span>
                                </span>
                                <span className='mt-3 body2'> {value}</span>
                            </div>
                        </ToolTipIcon>
                    );
                }
            },
            {
                title: t('blacklist.status'),
                field: 'isActive',
                widthClass: 'w-48  flex items-center ',
                render: (value: boolean, row: BlacklistModel) => {
                    return (
                        <DropdownLabel
                            excludeSelectedItem
                            arrowDisabled
                            labelClassName='body2'
                            items={dropdown}
                            value={value.toString()}
                            onSelecting={(item) => onDropdownStatusClick(item, row.id)}
                        />
                    )
                }
            },
            {
                title: t('blacklist.reported_by'),
                field: 'createdByName',
                widthClass: 'w-48',
            },
            {
                title: t('blacklist.reported_on'),
                field: 'createdOn',
                alignment: 'start',
                widthClass: 'w-48 flex items-center justify-start h-full',
                render: (value: string) => (
                    <span className='body3-small'>{dayjs.utc(value).local().format(DATE_TIME_FORMAT)}</span>
                )
            }
        ]
    }
    const [tableModel, setTableModel] = useState(tableModelInit);

    useEffect(() => {
        setBlacklistRequest({...blacklistRequest, ...DEFAULT_PAGING, accessType: type});
        setTableModel({...tableModelInit});
        setPagingResult({...DEFAULT_PAGING});
    }, [type]);

    const {refetch, isLoading, isFetching} =
        useQuery([GetBlacklist, blacklistRequest.accessType, blacklistRequest.page, blacklistRequest.pageSize],
            () => getBlacklist(blacklistRequest), {
            enabled: true,
            onSuccess: (response) => {
                const {results, ...paging} = response;
                setTableModel({...tableModel, rows: response.results});
                setPagingResult({...paging});
            }
        });

    const unblockAccessMutation = useMutation(unblockAccess, {
        onSuccess: () => {
            dispatch(addSnackbarMessage({
                type: SnackbarType.Success,
                message: 'blacklist.unblock_success',
                position: SnackbarPosition.TopCenter
            }));
            setIsConfirmationDisplayed(false);
            refetch();
        },
        onError: () => {
            dispatch(addSnackbarMessage({
                type: SnackbarType.Error,
                message: 'blacklist.unblock_fail',
                position: SnackbarPosition.TopCenter
            }));
        }
    });

    const createBlockAccessMutation = useMutation(createBlockAccess, {
        onSuccess: () => {
            setAddNewModelDisplayed(false);
            refetch();
        }
    })

    const onCloseConfirmation = () => {
        setIsConfirmationDisplayed(false);
    }

    const onAddNewBlock = () => {
        setAddNewModelDisplayed(true);
    }

    const onConfirmationOkClick = () => {
        if (!!rowIdSelected) {
            unblockAccessMutation.mutate(rowIdSelected);
        }
    }

    const onAddNewUserBlock = (formData: any) => {
        createBlockAccessMutation.mutate({
            isActive: true,
            accessType: blacklistRequest.accessType,
            value: formData.value,
            comment: formData.comment
        })
    }

    if (isLoading || isFetching) {
        return (<Spinner fullScreen />);
    }

    return (
        <>
            <div className='flex items-center justify-center w-full h-full'>
                <Modal
                    title={t('blacklist.add_new_block_form.title')}
                    className='blacklist-modal-width'
                    isOpen={isAddNewModalDisplayed}
                    isClosable
                    onClose={() => setAddNewModelDisplayed(false)}
                >
                    <div className='flex flex-col pb-6'>
                        {blacklistRequest.accessType === BlockAccessType.Email &&
                            <Fragment>
                                <p className='mb-2 body2'>{t('blacklist.add_new_block_form.email_description')}</p>
                                <ControlledInput
                                    control={control}
                                    name='value'
                                    type='email'
                                    label='blacklist.block_access_type.email'
                                    containerClassName='w-72'
                                    required
                                />
                            </Fragment>
                        }
                        {blacklistRequest.accessType === BlockAccessType.Phone &&
                            <Fragment>
                                <p className='mb-2 body2'>{t('blacklist.add_new_block_form.phone_description')}</p>
                                <ControlledInput
                                    control={control}
                                    name='value'
                                    type='tel'
                                    label='blacklist.block_access_type.phone'
                                    containerClassName='w-72'
                                    required
                                />
                            </Fragment>
                        }
                        {blacklistRequest.accessType === BlockAccessType.IPAddress &&
                            <Fragment>
                                <p className='mb-2 body2'>{t('blacklist.add_new_block_form.ip_description')}</p>
                                <ControlledInput
                                    control={control}
                                    name='value'
                                    type='ip'
                                    label='blacklist.block_access_type.ip'
                                    containerClassName='w-72'
                                    required
                                />
                            </Fragment>
                        }
                        <ControlledTextArea
                            control={control}
                            name='comment'
                            placeholder='blacklist.add_new_block_form.note_placeholder'
                            resizable={false}
                            className='w-full body2'
                            rows={3}
                        />
                        <div className='flex justify-end mt-10'>
                            <Button label='common.cancel' className='mr-6' buttonType='secondary' onClick={() => setAddNewModelDisplayed(false)} />
                            <Button
                                type='submit'
                                buttonType='small'
                                disabled={!isValid}
                                isLoading={createBlockAccessMutation.isLoading}
                                label='blacklist.add_new_block_form.block_user'
                                onClick={() => handleSubmit(onAddNewUserBlock)()}
                            />
                        </div>
                    </div>
                </Modal>
            </div>
            <Confirmation
                title='blacklist.unblock_contact_modal.title'
                message='blacklist.unblock_contact_modal.message'
                okButtonLabel='blacklist.unblock_contact_modal.ok_button_text'
                className='blacklist-modal-width'
                messageClassName='body2'
                isOpen={isConfirmationDisplayed}
                hasOverlay
                isCloseButtonDisabled
                isLoading={unblockAccessMutation.isLoading}
                onOk={() => onConfirmationOkClick()}
                onCancel={onCloseConfirmation}
            />
            <div className='flex flex-col w-full'>
                <div className='flex flex-row justify-between w-full pt-6 pb-4 pl-6 pr-12'>
                    <div className='flex flex-row cursor-pointer' onClick={onAddNewBlock}>
                        <SvgIcon
                            type={Icon.Add}
                            className='icon-medium'
                            fillClass='rgba-05-fill'
                        />
                        <span className='pl-2 body2'>{t('blacklist.add_new_block')}</span>
                    </div>
                    <div>
                        <Pagination
                            value={pagingResult}
                            onChange={(p) => {
                                setBlacklistRequest({...blacklistRequest, page: p.page, pageSize: p.pageSize});
                            }}
                        />
                    </div>
                </div>
                <div>
                    <Table model={tableModel} />
                </div>
            </div>
        </>
    );
}

export default BlacklistsTable
