export default {
    login: {
        path: "/api/v1/account/login",
        method: "POST",
        noAuth: true,
    },
    currentUser: {
        path: "/api/v1/account/user",
        method: "GET",
        noAuth: false,
    },
    NewMessage: {
        path: "/api/v1/messages/new",
        method: "POST",
    },
    blockuser: {
        path: "/api/v1/account/block",
        method: "POST",
    },
    allchats: {
        path: "/api/v1/messages/allchats",
        method: "get",
    },
    getmsgs: {
        path: "/api/v1/messages/all",
        method: "post",
    },
    SearchUser: {
        path: "/api/v1/account/search",
        method: "post",
    },
};
