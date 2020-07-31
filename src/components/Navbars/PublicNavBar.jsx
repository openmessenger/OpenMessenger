import React from "react";
import { A } from "hookrouter";
const pic = require("./simplechat.png");
const PublicNavBar = () => {
    return (
        <nav className="flex items-center justify-between flex-wrap bg-green-700">
            <div className="md:w-1/2 w-full lg:w-1/2">
                <div className="w-full  md:w-2/3 lg:w-1/3">
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
        </nav>
    );
};

export default PublicNavBar;
