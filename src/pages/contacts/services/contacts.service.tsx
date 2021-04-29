import axios from 'axios';

const api = axios.create({
    baseURL: 'https://api.instantwebtools.net/v1/'
});

export const getContacts = async (page: number) => {
    const results = await api.get(`passenger?page=${page}&size=50`);
    return {
        data: results?.data?.data?.map((contact: any, index: number) => {return {name: contact.name, id: contact._id, isCompany: index % 2 === 0}}),
        nextPage: page < results.data.totalPages ? page + 1 : undefined
    };
}