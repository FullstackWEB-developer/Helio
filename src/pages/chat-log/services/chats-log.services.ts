import {PagedList} from "@shared/models";
import Api from "@shared/services/api";
import utils from "@shared/utils/utils";
import {TicketLogRequestModel, TicketLogModel} from "../../../shared/models/ticket-log.model";

const TicketUrl = '/tickets';

export const getChatsLog = async (request: TicketLogRequestModel): Promise<PagedList<TicketLogModel>> => {
    const {data} = await Api.get(`${TicketUrl}/chat-logs?${utils.serialize(request)}`);
    return data;
}
