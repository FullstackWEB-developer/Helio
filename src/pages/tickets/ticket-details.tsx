import React from 'react';
import { useSelector } from 'react-redux';
import { selectTicketById } from './store/tickets.selectors'
import FieldDisplay from "../../shared/components/field-display/field-display";
import { RootState } from "../../app/store";

interface Props {
    id: number
}
const TicketItem = ({ id }: Props) => {
    const item = useSelector((state: RootState) => selectTicketById(state, id))
    return (
        <div className={"row"}>
            <div className={"col-12"}>
                <FieldDisplay label='Id' value={item.id.toString()} labelType={"label"} />
            </div>
            <div className={"col-12"}>
                <FieldDisplay label='Comment' value={item.comment} labelType={"label"} />
            </div>
            <div className={"col-12"}>
                <FieldDisplay label='Status' value={item.status} labelType={"label"} />
            </div>
            <hr/>
        </div>
    );
}

export default TicketItem;