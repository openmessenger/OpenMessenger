import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { USER_TYPES } from "./Common/constants";
import { getCurrentUser } from "./Redux/actions";
import PublicRouter from "./Router/PublicRouter";
import MessengerRouter from "./Router/MessengerRouter";
import { useAbortableEffect } from "./util/useAbortableEffect";
import "./Notify.css";

const App = () => {
    const dispatch = useDispatch();
    const state = useSelector((reduxState) => reduxState);
    const { currentUser } = state;
    const [user, setUser] = useState(false);

    useAbortableEffect(
        async (status) => {
            const access = localStorage.getItem("login_access_token");
            if (access) {
                const res = await dispatch(getCurrentUser());
                if (!status.aborted && res && res.statusCode === 200) {
                    setUser(res.data);
                }
            } else {
                setUser(null);
            }
        },
        [dispatch]
    );
    if (user !== null && (!currentUser || currentUser.isFetching)) {
        return (
            <>
                <div className="min-h-screen bg-green-100 items-center flex flex-col justify-center overflow-hidden">
                    <div className="flex justify-center items-center p-10">
                        <div className=" text-center text-xl">Loading....</div>
                    </div>
                </div>
            </>
        );
    }

    if (currentUser && currentUser.data) {
        if (currentUser.data.data.type === USER_TYPES.MESSAGER.type) {
            return <MessengerRouter />;
        } else {
            return <PublicRouter />;
        }
    } else {
        return <PublicRouter />;
    }
};

export default App;
