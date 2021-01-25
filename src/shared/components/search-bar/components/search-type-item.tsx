import React from "react";
import {useTranslation} from "react-i18next";
import {SearchType} from "../models/search-type";
interface SearchTypeProps {
    searchType: SearchType,
    onClick: (type: number) => any
}
const SearchTypeItem = ({searchType, onClick}: SearchTypeProps) => {
    const { t } = useTranslation();
    return(
        <div className={"px-4 py-2 hover:bg-blue-500 hover:text-white"} key={searchType.type}>
                                <span className={"cursor-pointer"} onClick={() => onClick(searchType.type)}>
                                    <p>{t(searchType.label)}</p>
                                </span>
        </div>
    )
}

export default SearchTypeItem;