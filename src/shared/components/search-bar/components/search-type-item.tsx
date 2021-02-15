import React from "react";
import {useTranslation} from "react-i18next";
import {SearchType} from "../models/search-type";
interface SearchTypeProps {
    searchType: SearchType,
    selected: boolean,
    onClick: (type: number) => any
}
const SearchTypeItem = ({searchType, selected, onClick}: SearchTypeProps) => {
    const { t } = useTranslation();
    return(
        <div className={`px-4 py-2 hover:bg-primary-400 hover:text-white ${selected ? "text-primary" : ""}`} key={searchType.type}>
                                <span className={"cursor-pointer"} onClick={() => onClick(searchType.type)}>
                                    <p>{t(searchType.label)}</p>
                                </span>
        </div>
    )
}

export default SearchTypeItem;