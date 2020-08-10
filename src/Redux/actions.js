import { fireRequest } from "./fireRequest";

export const login = (body) => {
    return fireRequest("login", [], body);
};
export const getCurrentUser = () => {
    return fireRequest("currentUser");
};
export const NewMessage = (body) => {
    return fireRequest("NewMessage", [], body);
};

export const allchats = () => {
    return fireRequest("allchats");
};
export const getmsgs = (body) => {
    return fireRequest("getmsgs", [], body);
};
export const SearchUser = (body) => {
    return fireRequest("SearchUser", [], body);
};
export const blockuser = (body) => {
    return fireRequest("blockuser", [], body);
};
