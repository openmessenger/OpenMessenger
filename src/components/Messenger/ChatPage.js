import React, { useEffect, useState } from "react";
import "./chatpage.css";
import { useDispatch, useSelector } from "react-redux";
import { NewMessage, getmsgs } from "../../Redux/actions";
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
        setInput(Input + emoji);
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

    const sendMsg = (photoLink) => {
        if (!isNullOrWhiteSpace(Input)) {
            setInput("");
            setSending(true);
            dispatch(
                NewMessage({ msg: Input, receiver: userId, photo: photoLink })
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
                                <span className="w-1/2 ">
                                    {Rece && (
                                        <p className="truncate">{Rece.name}</p>
                                    )}
                                    {Rece && (
                                        <p className="truncate font-semibold text-xs lg:text-sm">
                                            {Rece.email}
                                        </p>
                                    )}
                                </span>
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
                                                                <img
                                                                    style={{
                                                                        width:
                                                                            "200px",
                                                                        height:
                                                                            "200px",
                                                                        borderRadius:
                                                                            "7px",
                                                                    }}
                                                                    src={
                                                                        value.photo
                                                                    }
                                                                    alt=""
                                                                />
                                                            ) : (
                                                                value.msg
                                                            )}
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div className="chat-message-div">
                                                        <div className="bg-green-200 chat-message">
                                                            {value.photo ? (
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
                                <input
                                    className="input-message px-2 text-black w-1/2 lg:w-5/6"
                                    name="message"
                                    type="text"
                                    id="message"
                                    placeholder="Enter your message here"
                                    value={Input}
                                    onChange={(e) => {
                                        setInput(e.target.value);
                                    }}
                                    onKeyPress={(e) => {
                                        if (13 === (e.keyCode || e.which)) {
                                            if (!Sending) sendMsg("");
                                        }
                                    }}
                                />
                                <button
                                    className="input-send hidden md:block lg:block bg-green-700 mr-2 items-center text-center"
                                    onClick={handleEmojis}>
                                    {String.fromCodePoint(0x1f60a)}
                                </button>
                                <input
                                    className="input-send mr-2 bg-green-700 custom-file-input"
                                    type="file"
                                    onChange={(e) => {
                                        setImage(e.target.files[0]);
                                        if (
                                            e.target.files[0].name !== undefined
                                        ) {
                                            setInput(e.target.files[0].name);
                                        }
                                        setSuccess(true);
                                    }}
                                />

                                <button
                                    className="input-send bg-green-700 items-center text-center"
                                    onClick={uploadPic}
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
