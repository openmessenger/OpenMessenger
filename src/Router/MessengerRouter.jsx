import React from "react";
import { useRoutes, useRedirect } from "hookrouter";
import MessengerNavbar from "../components/Navbars/MessengerNavbar";
import Homepage from "../components/Messenger/Homepage";
import ChatPage from "../components/Messenger/ChatPage";

const routes = {
    "/chat": () => <Homepage />,
    "/chat/:id": ({ id }) => <ChatPage userId={id} />,
};

const MessengerRouter = () => {
    useRedirect("/", "/chat");
    const pages = useRoutes(routes);

    return (
        <>
            <div className="min-h-screen bg-green-100">
                <MessengerNavbar />
                {pages}
            </div>
        </>
    );
};

export default MessengerRouter;
