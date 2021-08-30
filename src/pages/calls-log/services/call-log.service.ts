import {PagedList} from "@shared/models";
import Api from "@shared/services/api";
import utils from "@shared/utils/utils";
import {CallLogRequestModel, CallLogModel} from "../models/call-log.model";

const TicketUrl = '/tickets';

export const getCallsLog = async (request: CallLogRequestModel): Promise<PagedList<CallLogModel>> => {
    const {data} = await Api.get(`${TicketUrl}/call-logs?${utils.serialize(request)}`);
    return data;
}
