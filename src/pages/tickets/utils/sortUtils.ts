import { Icon } from "../../../shared/components/svg-icon/icon";
import {SortDirection} from "../models/sort-direction";

export const SortIconMap = {
    [SortDirection.Asc]: Icon.ArrowUpward,
    [SortDirection.Desc]: Icon.ArrowDownward,
    [SortDirection.None]: ''
}

export const sortDirectionParse = (dir: string) => {
    switch (dir) {
        case 'Asc': return SortDirection.Asc;
        case 'Desc': return SortDirection.Desc;
        default: return SortDirection.None;
    }
}