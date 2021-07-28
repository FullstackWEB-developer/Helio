import {InviteUserModel} from "@shared/models";
import React, {useState} from "react";
import UserAdd from "./user-add-row";

interface UserAddListProps {
    onChange?: (value: InviteUserModel[]) => void
}

const UserAddList = ({onChange}: UserAddListProps) => {

    const [rows, setRows] = useState<InviteUserModel[]>([]);

    const updateRow = (index: number, value: InviteUserModel) => {
        if (index in rows) {
            const newRows = [...rows];
            newRows[index] = value;
            return newRows;
        }
        return rows;
    }

    const addRow = (_: number, value: InviteUserModel) => {
        const newRows = [...rows, value];
        setRows(newRows);
        if (onChange) {
            onChange(newRows);
        }
    }

    const onRowChanged = (index: number, value: InviteUserModel) => {
        const newRows = updateRow(index, value);
        setRows(newRows);

        if (onChange) {
            onChange(newRows);
        }
    }

    const onRemoveClick = (index: number) => {
        const newRow = [...rows];
        newRow.splice(index, 1);
        setRows(newRow);
    }

    return (
        <div className='flex flex-col'>
            {
                React.Children.toArray(
                    Array.from({length: rows.length + 1},
                        (_, index) =>
                            <UserAdd
                                index={index}
                                value={rows[index]}
                                isLast={rows.length === index}
                                onAddClick={addRow}
                                onRemoveClick={onRemoveClick}
                                onChange={onRowChanged}
                            />
                    )
                )
            }
        </div>
    );
}

export default UserAddList;
