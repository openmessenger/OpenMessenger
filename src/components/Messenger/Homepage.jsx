import React, { useState, useEffect } from "react";
import { A } from "hookrouter";
import { SearchUser, allchats } from "../../Redux/actions";
import { useDispatch } from "react-redux";
import Loader from "../common/Loader";

export default function Homepage() {
    const [Data, setData] = useState([]);
    const [keyword, setkeyword] = useState("");
    const [Search, setSearch] = useState("");
    const dispatch = useDispatch();
    const [render, setrender] = useState(Math.random());
    const [Loading, setLoading] = useState(false);

    useEffect(() => {
        setLoading(true);
        dispatch(allchats()).then((res) => {
            if (res && res.data !== undefined) {
                const resp = res.data.result;
                setData(resp);
                setLoading(false);
            }
        });
    }, [render, dispatch]);

    const isNullOrWhiteSpace = (str) => {
        return !str || str.length === 0 || /^\s*$/.test(str);
    };

    const Searcher = () => {
        setkeyword(Search);
        if (isNullOrWhiteSpace(Search) === true) {
            setSearch("");
            setkeyword("");
            setrender(Math.random());
        } else
            dispatch(SearchUser({ chat_to: Search })).then((res) => {
                if (res && res.data.searchresults !== undefined)
                    setData(res.data.searchresults);
            });
    };

    return (
        <div className="m-0 m-auto">
            {Loading && <Loader msg={"Loading chats...."} />}
            {!Loading && (
                <>
                    <div>
                        <div className="m-0 text-center m-auto text-blue-900 text-2xl font-semibold">
                            <p>Chats</p>
                        </div>
                        <div className="flex text-center text-black font-semibold">
                            <div className="text-right w-2/3">
                                <input
                                    type="search"
                                    name="serch"
                                    value={Search}
                                    onChange={(e) => {
                                        setSearch(e.target.value);
                                    }}
                                    onKeyPress={(e) => {
                                        if (13 === (e.keyCode || e.which)) {
                                            Searcher();
                                        }
                                    }}
                                    placeholder="Enter name or Email Id"
                                    className="bg-gray-200 border border-gray-500 shadow-lg h-10 m-0 m-auto px-3 pr-10 rounded-full text-lg focus:outline-none"
                                />
                            </div>
                            <div className="text-right md:text-left lg:text-left w-1/3 lg:w-1/2 md:w-1/2">
                                <button
                                    type="submit"
                                    onClick={Searcher}
                                    className="bg-green-800 text-white m-0 m-auto py-3 px-3   rounded-full rounded-full px-2 py-2">
                                    <svg
                                        className="h-4 w-4 fill-current"
                                        xmlns="http://www.w3.org/2000/svg"
                                        version="1.1"
                                        id="Capa_1"
                                        x="0px"
                                        y="0px"
                                        viewBox="0 0 56.966 56.966">
                                        <path d="M55.146,51.887L41.588,37.786c3.486-4.144,5.396-9.358,5.396-14.786c0-12.682-10.318-23-23-23s-23,10.318-23,23  s10.318,23,23,23c4.761,0,9.298-1.436,13.177-4.162l13.661,14.208c0.571,0.593,1.339,0.92,2.162,0.92  c0.779,0,1.518-0.297,2.079-0.837C56.255,54.982,56.293,53.08,55.146,51.887z M23.984,6c9.374,0,17,7.626,17,17s-7.626,17-17,17  s-17-7.626-17-17S14.61,6,23.984,6z" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                        <div></div>
                        <div>
                            {Data.length > 0 ? (
                                <div className="m-0 m-auto mt-6 items-center text-center">
                                    {keyword.length > 0 && (
                                        <div className="font-bold capital">
                                            <h2>
                                                Search results for {keyword}
                                            </h2>
                                        </div>
                                    )}
                                    {Data.map((value, id) => {
                                        return (
                                            <A
                                                href={`chat/${value.id}`}
                                                key={id + 1}>
                                                <div className="lg:w-1/3 w-3/4 flex m-0 m-auto p-2 lg:p-3 md:p-3 font-semibold  px-2 my-2 shadow-lg  bg-green-700 rounded">
                                                    <div className="w-1/3">
                                                        <img
                                                            className="h-16  w-16 rounded-full "
                                                            alt="Profilepic"
                                                            src={
                                                                value.photo
                                                            }></img>
                                                    </div>
                                                    <div className="w-2/3 text-lg lg:text-2xl text-white font-semibold">
                                                        {value.name}
                                                    </div>
                                                </div>
                                            </A>
                                        );
                                    })}
                                </div>
                            ) : (
                                <>
                                    {keyword.length > 0 && (
                                        <div className="w-full text-lg font-sans font-semibold text-center mt-3 text-red-600">
                                            No Results for {keyword} :-(
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
