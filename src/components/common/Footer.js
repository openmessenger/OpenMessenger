import React from "react";
import { A } from "hookrouter";

const Footer = () => {
    return (
        <div className="bottom-0 w-full">
            <section className="py-3 w-full">
                <div className="container text-center mx-auto px-8">
                    <A
                        href="http://github.com/openmessenger"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-black text-center font-bold text-sm sm:mb-2 hover:text-green-700 ">
                        Contribute on Github{" "}
                        <i className="fa fa-github text-xl"></i>
                    </A>
                </div>
            </section>
        </div>
    );
};

export default Footer;
