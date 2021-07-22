import React, {useEffect, useState} from "react";
import SvgIcon, {Icon} from '@components/svg-icon';
import {keyboardKeys} from '@components/search-bar/constants/keyboard-keys';
import {useTranslation} from 'react-i18next';
import {Paging} from "@shared/models";

interface PaginationProps {
    value: Paging;
    onChange?: (value: Paging) => void;
}

const Pagination = ({value, ...props}: PaginationProps) => {
    const {t} = useTranslation();
    const [currentPaging, setCurrentPaging] = useState(value);
    const [currentPage, setCurrentPage] = useState(value.page);

    const onKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === keyboardKeys.enter) {
            if (!currentPage) {
                return;
            }

            const newPaging: Paging = {
                ...value,
                page: currentPage
            };
            onChanged(newPaging);
        }
    }
    const onInputChanged = ({target}: React.ChangeEvent<HTMLInputElement>) => {
        const valueAsNumber = Number(target.value);
        setCurrentPage(valueAsNumber);
    }

    const onChanged = (paging: Paging) => {
        setCurrentPaging(paging);
        if (props.onChange) {
            props.onChange(paging);
        }
    }
    const onPreviousClick = () => {
        if (currentPaging.page > 1) {
            const previousPaging: Paging = {
                ...value,
                page: value.page - 1
            };
            onChanged(previousPaging);
        }
    };


    const nextPage = () => {
        if (currentPaging.page < value.totalPages) {
            const nextPaging: Paging = {
                ...value,
                page: value.page + 1
            };
            onChanged(nextPaging);
        }
    };

    useEffect(() => {
        setCurrentPage(value.page);        
    }, [value.page])

    const numberOfItemTo = ((currentPaging.pageSize * currentPaging.page) > currentPaging.totalCount) ? currentPaging.totalCount : (currentPaging.pageSize * currentPaging.page);
    let numberOfItemFrom = numberOfItemTo > (currentPaging.pageSize * (currentPaging.page - 1)) ? (currentPaging.pageSize * (currentPaging.page - 1)) : 1;
    if (numberOfItemFrom < 1) {
        numberOfItemFrom = 1;
    }

    return (
        <div className='flex flex-row items-center'>
            <div className='pr-8 text-sm text-gray-400'>
                <span>
                    {
                        t('tickets.pagination', {
                            numOfItemsFrom: numberOfItemFrom,
                            numOfItemsTo: numberOfItemTo,
                            totalCount: value.totalCount
                        })
                    }
                </span>
            </div>
            <SvgIcon type={Icon.ArrowLeft}
                className='cursor-pointer'
                fillClass='active-item-icon'
                onClick={onPreviousClick}
            />

            <input type='text'
                className='ml-6 mr-6 text-center border rounded-md w-11'
                value={currentPage}
                onChange={onInputChanged}
                onKeyDown={(e) => onKeyDown(e)}
            />

            <SvgIcon
                type={Icon.ArrowRight}
                className='cursor-pointer'
                fillClass='active-item-icon'
                onClick={nextPage}
            />
        </div>
    );
}

export default Pagination;
