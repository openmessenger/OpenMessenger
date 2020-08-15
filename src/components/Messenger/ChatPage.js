import React, { useEffect, useState } from "react";
import "./chatpage.css";
import { useDispatch, useSelector } from "react-redux";
import { NewMessage, getmsgs, blockuser } from "../../Redux/actions";
import Loader from "../common/Loader";
import socketIOClient from "socket.io-client";
import "emoji-mart/css/emoji-mart.css";
import { Picker } from "emoji-mart";
const config = {
    baseUrl: process.env.REACT_APP_BASE_URL,
};
const Load = require("./Loader.gif");

const ChatPage = ({ userId }) => {
    const state = useSelector((reduxState) => reduxState);
    const { currentUser } = state;
    const User = currentUser.data;
    const [Input, setInput] = useState("");
    const dispatch = useDispatch();
    const [Rece, setRece] = useState();
    const [received, setreceived] = useState();
    const [image, setImage] = useState("");
    const [success, setSuccess] = useState(false);
    const [Error, seError] = useState(false);
    const [Loading, setLoading] = useState(false);
    const [Sending, setSending] = useState(false);
    const [showEmojis, setShowEmojis] = useState(false);
    const [Blockedme, setBlockedme] = useState(false);
    const [BlockedByMe, setBlockedByMe] = useState(false);
    const uploadPic = () => {
        if (success) {
            setSending(true);
            const data = new FormData();
            data.append("file", image);
            data.append("upload_preset", "insta-clone");
            data.append("cloud_name", "arihant2310");
            fetch("	https://api.cloudinary.com/v1_1/arihant2310/image/upload", {
                method: "post",
                body: data,
            })
                .then((res) => res.json())
                .then((data) => {
                    setSuccess(false);
                    sendMsg(data.url);
                })
                .catch((err) => {
                    console.log(err);
                });
        } else {
            sendMsg("");
        }
    };

    const addEmoji = (e) => {
        let emoji = e.native;
        if (!Blockedme) setInput(Input + emoji);
    };

    const handleEmojis = (e) => {
        setShowEmojis(!showEmojis);
    };

    useEffect(() => {
        let Mount = true;
        window.scrollTo(0, 0);
        const Socket = socketIOClient(config.baseUrl);
        setLoading(true);
        let Err = false;
        let Res = [];
        const starter = () => {
            dispatch(getmsgs({ receiver: userId }))
                .then((res) => {
                    if (Mount && res && res.data !== undefined) {
                        if (res.data.receiver !== undefined) {
                            setreceived(res.data.Messages);
                            setBlockedme(res.data.block.BlockedMe);
                            setBlockedByMe(res.data.block.BlockedbyMe);
                            Res = res.data.receiver;
                            setRece(res.data.receiver);
                            if (res.data.receiver.email === User.data.email) {
                                seError(true);
                                Err = true;
                            }
                        } else {
                            seError(true);
                            Err = true;
                        }
                        setLoading(false);
                        setSending(false);
                    }
                })
                .then(() => {
                    if (Mount && !Err) {
                        const msgbox = document.getElementById("message-box");
                        msgbox.scrollTop = msgbox.scrollHeight;
                    }
                });
        };
        starter();

        Socket.on("msgToClient", (message) => {
            if (
                (message.UserMail === User.data.email &&
                    message.SenderId === Res.email) ||
                (message.UserMail === Res.email &&
                    message.SenderId === User.data.email)
            ) {
                starter();
            }
        });
        return () => {
            Mount = false;
            Socket.close();
        };
    }, [dispatch, userId, User.data.email]);

    const isNullOrWhiteSpace = (str) => {
        return !str || str.length === 0 || /^\s*$/.test(str);
    };

    const downloadImage = (e) => {
//         e = e.replace("http", "https");
        fetch(e, {
            method: "GET",
            headers: {},
        })
            .then((response) => {
                response.arrayBuffer().then(function (buffer) {
                    const url = window.URL.createObjectURL(new Blob([buffer]));
                    const link = document.createElement("a");
                    link.href = url;
                    link.setAttribute(
                        "download",
                        "Image_(" + new Date().toLocaleTimeString() + ").png"
                    );
                    document.body.appendChild(link);
                    link.click();
                });
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const blockUser = () => {
        dispatch(blockuser({ chat_to: userId })).then((res) => {
            if (res && res.data) {
                socketIOClient(config.baseUrl).emit("msgToServer", {
                    UserMail: User.data.email,
                    SenderId: Rece.email,
                    data: "blockStatus",
                });
            }
        });
    };

    const sendMsg = (photoLink) => {
        if (!isNullOrWhiteSpace(Input)) {
            setInput("");
            setSending(true);
            dispatch(
                NewMessage({ msg: Input, receiver: userId, photo:photoLink.replace("http", "https"), })
            ).then((res) => {
                if (!Error) {
                    const msgbox = document.getElementById("message-box");
                    msgbox.scrollTop = msgbox.scrollHeight;
                }
                socketIOClient(config.baseUrl).emit("msgToServer", {
                    UserMail: User.data.email,
                    SenderId: Rece.email,
                    data: Input,
                });
            });
        }
    };

    return (
        <div className="items-center px-3">
            {!Error ? (
                <>
                    {Loading && <Loader msg={"Loading chat..."} />}
                    <div className={`${Loading ? "hidden" : ""}`}>
                        <div className="main-card  mt-16 w-full md:w-1/2 lg:w-2/5">
                            <div className="main-title flex py-3 px-4 bg-green-700 text-sm lg:text-lg font-bold">
                                <span className="w-2/3 ">
                                    {Rece && (
                                        <p className="truncate">{Rece.name}</p>
                                    )}
                                    {Rece && (
                                        <p className="truncate font-semibold text-xs lg:text-sm">
                                            {Rece.email}
                                        </p>
                                    )}
                                </span>
                                <div className="w-1/3 text-right">
                                    {BlockedByMe ? (
                                        <button
                                            onClick={blockUser}
                                            style={{ width: "100px" }}
                                            className="bg-blue-700 text-white rounded px-2 py-1">
                                            Unblock
                                        </button>
                                    ) : (
                                        <button
                                            onClick={blockUser}
                                            style={{ width: "100px" }}
                                            className="bg-red-700 text-white rounded px-2 py-1">
                                            Block
                                        </button>
                                    )}
                                </div>
                            </div>
                            <div className="chat-area" id="message-box">
                                {received &&
                                    received.map((value, id) => {
                                        return (
                                            <div key={id + 1}>
                                                {value.author ===
                                                User.data.email ? (
                                                    <div className="chat-message-div">
                                                        <span
                                                            style={{
                                                                flexGrow: 1,
                                                            }}></span>
                                                        <div className="chat-message">
                                                            {value.photo ? (
                                                                <>
                                                                    <img
                                                                        style={{
                                                                            width:
                                                                                "200px",
                                                                            height:
                                                                                "200px",
                                                                            borderRadius:
                                                                                "7px",
                                                                        }}
                                                                        src={value.photo.replace(
                                                                            "http",
                                                                            "https"
                                                                        )}
                                                                        alt=""
                                                                    />
                                                                    <div className="w-full text-left">
                                                                        <button
                                                                            onClick={(
                                                                                e
                                                                            ) =>
                                                                                downloadImage(
                                                                                    value.photo
                                                                                )
                                                                            }
                                                                            className="rounded-full p-2 text-sm mt-1 bg-green-700 text-white">
                                                                            <svg
                                                                                width="1em"
                                                                                height="1em"
                                                                                viewBox="0 0 16 16"
                                                                                className="bi bi-download"
                                                                                fill="currentColor"
                                                                                xmlns="http://www.w3.org/2000/svg">
                                                                                <path d="M.5 8a.5.5 0 0 1 .5.5V12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V8.5a.5.5 0 0 1 1 0V12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V8.5A.5.5 0 0 1 .5 8z" />
                                                                                <path d="M5 7.5a.5.5 0 0 1 .707 0L8 9.793 10.293 7.5a.5.5 0 1 1 .707.707l-2.646 2.647a.5.5 0 0 1-.708 0L5 8.207A.5.5 0 0 1 5 7.5z" />
                                                                                <path d="M8 1a.5.5 0 0 1 .5.5v8a.5.5 0 0 1-1 0v-8A.5.5 0 0 1 8 1z" />
                                                                            </svg>
                                                                        </button>
                                                                    </div>
                                                                </>
                                                            ) : (
                                                                value.msg
                                                            )}
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div className="chat-message-div">
                                                        <div className="bg-green-200 chat-message">
                                                            {value.photo ? (
                                                                <>
                                                                    <img
                                                                        style={{
                                                                            width:
                                                                                "200px",
                                                                            height:
                                                                                "200px",
                                                                            borderRadius:
                                                                                "7px",
                                                                        }}
                                                                        className="bg-green-200"
                                                                        src={
                                                                            value.photo
                                                                        }
                                                                        alt=""
                                                                    />
                                                                    <div className="w-full text-right">
                                                                        <button
                                                                            onClick={(
                                                                                e
                                                                            ) =>
                                                                                downloadImage(
                                                                                    value.photo
                                                                                )
                                                                            }
                                                                            className="rounded-full p-2 text-sm mt-1 bg-green-700 text-white">
                                                                            <svg
                                                                                width="1em"
                                                                                height="1em"
                                                                                viewBox="0 0 16 16"
                                                                                className="bi bi-download"
                                                                                fill="currentColor"
                                                                                xmlns="http://www.w3.org/2000/svg">
                                                                                <path d="M.5 8a.5.5 0 0 1 .5.5V12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V8.5a.5.5 0 0 1 1 0V12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V8.5A.5.5 0 0 1 .5 8z" />
                                                                                <path d="M5 7.5a.5.5 0 0 1 .707 0L8 9.793 10.293 7.5a.5.5 0 1 1 .707.707l-2.646 2.647a.5.5 0 0 1-.708 0L5 8.207A.5.5 0 0 1 5 7.5z" />
                                                                                <path d="M8 1a.5.5 0 0 1 .5.5v8a.5.5 0 0 1-1 0v-8A.5.5 0 0 1 8 1z" />
                                                                            </svg>
                                                                        </button>
                                                                    </div>
                                                                </>
                                                            ) : (
                                                                value.msg
                                                            )}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                            </div>
                            <div className="input-div flex flex-row" id="end">
                                {Blockedme ? (
                                    <input
                                        className="input-message border-4 border border-red-500 text-red-600  px-2 text-black w-1/2 lg:w-5/6"
                                        type="text"
                                        disabled={true}
                                        placeholder="YOU ARE BLOCKED !!"
                                    />
                                ) : (
                                    <input
                                        className="input-message px-2 text-black w-1/2 lg:w-5/6"
                                        name="message"
                                        type="text"
                                        id="message"
                                        placeholder="Enter message to send"
                                        value={Input}
                                        onChange={(e) => {
                                            setInput(e.target.value);
                                        }}
                                        onKeyPress={(e) => {
                                            if (13 === (e.keyCode || e.which)) {
                                                if (!Sending && !Blockedme)
                                                    sendMsg("");
                                            }
                                        }}
                                    />
                                )}
                                <button
                                    className="input-send hidden md:block lg:block bg-green-700 mr-2 items-center text-center"
                                    onClick={handleEmojis}>
                                    {String.fromCodePoint(0x1f60a)}
                                </button>
                                <input
                                    className="input-send mr-2 bg-green-700 custom-file-input"
                                    type="file"
                                    disabled={Blockedme}
                                    onChange={(e) => {
                                        setImage(e.target.files[0]);
                                        if (
                                            e.target.files[0].name !==
                                                undefined &&
                                            !Blockedme
                                        ) {
                                            setInput(e.target.files[0].name);
                                            setSuccess(true);
                                        }
                                    }}
                                />

                                <button
                                    className="input-send bg-green-700 items-center text-center"
                                    onClick={() => {
                                        if (!Blockedme) uploadPic();
                                    }}
                                    disabled={Sending}>
                                    {!Sending ? (
                                        <svg className="m-0 m-auto h-6 w-6">
                                            <path d="M2,21L23,12L2,3V10L17,12L2,14V21Z" />
                                        </svg>
                                    ) : (
                                        <img
                                            alt="Loader"
                                            className="h-8 w-8 ml-2"
                                            src={Load}></img>
                                    )}
                                </button>
                            </div>
                        </div>

                        {showEmojis ? (
                            <div className="m-0 m-auto text-center">
                                <Picker
                                    onSelect={(e) => addEmoji(e)}
                                    disabled={Blockedme}
                                    emojiTooltip={true}
                                    title="OpenMessenger"
                                />
                            </div>
                        ) : null}
                    </div>
                </>
            ) : (
                <div className="text-2xl m-0 m-auto text-center text-red-600 ml-5 font-bold">
                    Oops an error occured
                </div>
            )}
        </div>
    );
};

export default ChatPage;
