import React from "react";
import { A, navigate } from "hookrouter";
import { useSelector } from "react-redux";

const pic = require("./simplechat.png");
const MessengerNavbar = () => {
    const state = useSelector((reduxState) => reduxState);
    const { currentUser } = state;
    const UserName = currentUser.data.data.name;
    const logout = () => {
        localStorage.removeItem("login_access_token");
        localStorage.removeItem("login_refresh_token");
        navigate("/");
        window.location.reload();
    };
    return (
        <nav className="flex flex-row justify-between flex-wrap bg-green-700">
            <div className="w-1/2">
                <div className="w-full  md:w-1/3 lg:w-1/3">
                    <A href="/">
                        <div className="text-white flex items-center mr-6 py-6 pl-6">
                            <img
                                alt="applogo"
                                src={pic}
                                className="h-10 w-10"></img>
                            <span className="font-semibold text-sm md:text-sm lg:text-xl ml-1 tracking-tight">
                                Open Messenger
                            </span>
                        </div>
                    </A>
                </div>
            </div>
            <div className="text-right my-1  w-1/2">
                <div className="mr-5">
                    <p className="text-white text-sm mt-2 font-semibold">
                        Logged in as {UserName}
                    </p>
                    <button
                        className="text-xs items-center lg:text-sm justify-center p-2 px-2 text-black bg-white rounded  hover:text-white hover:bg-black mt-1  cursor-pointer"
                        onClick={logout}>
                        Logout
                    </button>
                </div>
            </div>
        </nav>
    );
};

export default MessengerNavbar;
