import React, { Component } from 'react';
import styled from 'styled-components';
import AutoSizeTextArea from './AutoTextArea';
import moment from 'moment';
import Lorem from './LoremIpsum';
import _ from 'lodash';
import Loader from './Loader';
import $ from 'jquery';
import axios from 'axios';
import io from 'socket.io-client';
import withRedux from '../hoc/enhancedComponent';

const bottomChatHeight = 50;

const ChatRoomStyle = styled.div`
height: 100%;
box-sizing: border-box;
width: 100%;
overflow-x: hidden;
position: relative;

.middle {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    width: 100%;
}

.chatBox {
    display: flex;
    margin: 10px 20px;

    &.unread {
        background-color: rgba(255, 255, 255, 0.2);
    }

    .Profile {
        display: flex;
        flex-direction: column;
        color: #FFF;

        img {
            border-radius: 50%;
            width: 70px;
            height: 70px;
        }

        span.time {
            font-size: 0.75em;
            position: relative;
            top: -3px;
        }
    }
    div {
        display: flex;
        align-items: center;
        position: relative;
    }
    &.right {
        justify-content: flex-end;
    }

    .MessageDialogue {
        flex: 1;
        position: relative;
        background-color: #9BFF91;
        padding: 10px 10px 10px 10px;
        display: block;
        max-width: ${(props) => props.width && `${props.width - 2*120}px`};

        &.left {
            left: 30px;
        }

        &.right {
            right: 30px;
            background-color: #70CEFF;
        }

        &.left:before {
            content: ' ';
            position: absolute;
            width: 0;
            height: 0;
            left: -20px;
            right: auto;
            top: 0px;
            transform: translateY(10px);
            bottom: auto;
            border: 22px solid;
            border-color: #9BFF91 transparent transparent transparent;
        }

        &.right:before {
            content: ' ';
            position: absolute;
            width: 0;
            height: 0;
            right: -20px;
            top: 0px;
            transform: translateY(10px);
            bottom: auto;
            border: 22px solid;
            border-color: #70CEFF transparent transparent transparent;
        }

        span {
            position: relative;
            z-index: 1100;
        }
    }
}

.chat-list {
    box-sizing: border-box;
    ${bottomChatHeight && `margin-bottom: ${bottomChatHeight}px;`}
}

.bottom-chat {
    position: fixed;
    ${(props) => props.width && `width: ${props.width}px;`}
    ${bottomChatHeight && `height: ${bottomChatHeight}px;`}
    bottom: 0px;
    background-color: #FFFFFFAA;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1101;

    input {
        width: calc(100% - 100px);
    }

    button {
        width: 50px;
        margin-left: 10px;
        background-color: #00C97AEE;
        font-size: 1rem;
        color: #FFF;
        width: 50px;
        height: 30px;
        outline: none;
        border: none;
        border-radius: 15px;

        &:hover {
            filter: brightness(0.9);
        }
        &:active {
            filter: brightness(0.85);
        }
    }
}

.center {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    overflow: hidden;
    height: calc(100vh - 80px);
    color: #FFF;
    font-size: 1.5rem;

    span {
        width: 80%;
        text-align: center;
    }

    img {
        width: 15vw;
        min-width: 150px;
    }

    button {
        width: 70px;
        height: 30px;
        outline: none;
        background: #F35429;
        border: none;
        color: #FFF;
        font-size: 0.8rem;
        margin: 0px 5px;

        &:hover, &:active {
            color: #F35429;
            background: #FFF;
        }

        &:active {
            filter: brightness(0.9);
        }
    }
}

input, textarea {
    width: 100%;
    box-sizing: border-box;
    padding: 5px 15px;
    min-height: 30px;
    height: 30px;
    border-radius: 20px;
    outline: none;
    border: 2px solid #FFFFFF;
    background-color: #FFFFFFBB;
    color: #777;
    font-size: 1rem;

    &::placeholder {
        color: #AAA;
        opacity: 0.7;
    }
}
`;

const avatarImages = Array.from(new Array(4).keys()).map((idx) => `/static/resources/avatar/a-0${idx+1}.png`)

const GenerateBubble = (isMe, item, idx, isUnread = false) => {
    
    return (
        <div className={`chatBox ${isMe ? 'right' : ''} ${isUnread ? 'unread' : ''}`} key={idx}>
            {
                (!isMe && (
                    <div className="Profile">
                        <img src="http://via.placeholder.com/100x100" />
                        <span>{item.userName}</span>
                        <span className="time">{item.time}</span>
                    </div>
                ))
            }
            <div>
                <div className={`MessageDialogue ${isMe ? 'right blue' : 'left'}`}>
                    <span>
                        {item.message}
                    </span>
                </div>
            </div>
            {
                (isMe && (
                    <div className="Profile">
                        <img src="http://via.placeholder.com/100x100" />
                        <span>{item.userName}</span>
                        <span className="time">{moment(item.time).locale("en").format('Do MMMM YYYY, h:mm:ss a')}</span>
                    </div>
                ))
            }
        </div>
    );
}

class ChatRoom extends Component {
    constructor(props) {
        super(props);
        this.state = {
            width: -1,
            chat: [],
            isLoading: false,
            markAsUnreads: []
        }
        
        props.socket.on('chat message', (a) => {
            this.onUpdateMessage({
                message: a.msg,
                picture: a.picture,
                userId: a.userId,
                userName: a.userName,
                time: a.time
            })
            this.props.propsFunc.updateMapId("LastMsg", "a", {
                data: ({
                    message: a.msg,
                    picture: a.picture,
                    userId: a.userId,
                    userName: a.userName,
                    time: a.time
                })
            })
        })

        this.props.propsFunc.initMapId("LastMsg", "a");
        this.props.propsFunc.updateMapId("LastMsg", {
            data: {}
        })
    }

    scrollToBottom = () => {
        const elem = $(".chatRoom")[0];
        $(".chatRoom").animate({
            scrollTop: elem.scrollHeight
        }, 200)
    }

    onUpdateMessage = (newMessage) => {
        this.props.updateChat(_.get(this.props, 'selectedChat.id', ''), [newMessage])
        this.scrollToBottom();
    }

    onSubmit = async (e) => {
        e.preventDefault();
        const { socket } = this.props;
        try {
            const Message = this._Message.value;
            if(Message.trim().length > 0) {
                //Do some api logic here
                socket.emit('send message', {
                    msg: Message.trim(),
                    picture: this.props.sharedStore.picture,
                    userId: this.props.sharedStore.userId.data,
                    userName: this.props.sharedStore.username.data,
                    groupId: _.get(this.props, 'selectedChat.id', ''),
                    time: new Date(Date.now())
                })
                if (this._Message) {
                    this._Message.value = ''
                }
            }
        } catch(e) {
            console.log(e)
        }
        
        return false;
    }

    onFetchChat = (chatId) => {
        const { socket } = this.props;
        const packet = {
            groupId: chatId,
            userId: this.props.sharedStore.userId.data
        }
        socket.emit('connectGroup', packet)
        socket.on('join', (res) => {
            console.log(res);
        })
        if(!this.props.chat[chatId]) {
            this.setState({ isLoading: true })
            setTimeout(async () => {
                try {
                    const response = await axios.post(`${this.props.sharedStore.url}/unread`, {
                        groupId: _.get(this.props, 'selectedChat.id', ''),
                        userId: this.props.sharedStore.userId.data
                    })
                    this.setState({
                        isLoading: false,
                        markAsUnreads: response.data.unread
                    }, () => {
                        const elem = $(".chatRoom")[0];
                        elem.scrollTop = elem.scrollHeight
                    })
                    this.props.createChat(chatId, response.data.unread)
                    setTimeout(() => {
                        const elem = $(".chatRoom")[0];
                        elem.scrollTop = elem.scrollHeight
                    }, 300);
                } catch (e) {

                }
            }, Math.floor(Math.random() * 1.5 * 1000 + 500));
        } else {
            setTimeout(() => {
                this.setState({ isLoading: false }, () => {
                    const elem = $(".chatRoom")[0];
                    elem.scrollTop = elem.scrollHeight
                })
            }, 500);
        }

    }

    onRejectRequest = () => {
        alert("SAD")
    }

    onJoinRequest = () => {
        this.setState({ isLoading: true })
        setTimeout(async () => {
            if (_.get(this.props, 'selectedChat.id', '').length > 0) {
                try{
                    await axios.post(`${this.props.sharedStore.url}/chat/join`,{
                        groupId: _.get(this.props, 'selectedChat.id', ''),
                        userId: this.props.sharedStore.userId.data
                    });
                    this.props.onFetchChatList();
                    this.setState({ isLoading: false })
                    this.props.onClickJoined(_.get(this.props, 'selectedChat.id', ''));
                } catch (error) {
                    console.error(error);
                }
            }
        }, 500);
    }

    componentDidMount() {
        this._isMounted = true
        setTimeout(() => {
            if(this._isMounted) {
                this.setState({ width: $(".chatRoom")[0].offsetWidth });

                let _this = this;
                window.addEventListener("resize", () => {
                    _this.setState({ width: $(".chatRoom")[0].offsetWidth });
                })
            }
        }, 10);
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        const prevChatId = _.get(prevProps, 'selectedChat.id', '');
        const currChatId = _.get(this.props, 'selectedChat.id', '');
        
        if (prevChatId !== currChatId && currChatId.length > 0) {
            this.onFetchChat(_.get(this.props, 'selectedChat.id', ''))
            if (prevProps.selectedIndex !== this.props.selectedIndex) {
                this.setState({ isLoading: true, chat: [], markAsUnreads: [] })
            }
        }

        const isPrevJoined = _.get(prevProps, `latestJoined[${currChatId}]`, false)
        const isCurrJoined = _.get(this.props, `latestJoined[${currChatId}]`, false)

        if (isPrevJoined !== isCurrJoined && isCurrJoined) {
            setTimeout(() => {
                const elem = $(".chatRoom")[0];
                elem.scrollTop = elem.scrollHeight
            }, 300)
        }

        if(prevProps.socketVersion !== this.props.socketVersion) {
            const socket = this.props.socket;
            if(_.get(this.props, 'selectedChat.id', '').length > 0) {
                const packet = {
                    groupId: _.get(this.props, 'selectedChat.id', ''),
                    userId: this.props.sharedStore.userId.data
                }
                socket.emit('connectGroup', packet)
                socket.on('join', (res) => {
                    console.log(res);
                })
            }

            socket.on('chat message', (a) => {
                this.onUpdateMessage({
                    message: a.msg,
                    picture: a.picture,
                    userId: a.userId,
                    userName: a.userName,
                    time: a.time
                })
                this.props.propsFunc.updateMapId("LastMsg", "a", {
                    data: ({
                        message: a.msg,
                        picture: a.picture,
                        userId: a.userId,
                        userName: a.userName,
                        time: a.time
                    })
                })
            })
        }
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    onRequestNewChat = async (e) => {
        e.preventDefault();
        try {
            let value = ''
            if ($($(e.target).children()[0]).is("input")) {
                value = $(e.target).children()[0].value;
                $(e.target).children()[0].value = '';
            } else if ($($(e.target).siblings()[0]).is("input")) {
                value = $(e.target).siblings()[0].value;
                $(e.target).siblings()[0].value = '';
            }
            if(value.length > 0) {
                await axios.post(`${this.props.sharedStore.url}/chat`, {
                    name: value
                });
                this.props.onFetchChatList();
            }
        } catch (e) {
            console.error(e);
        }
        return true;
    }

    render() {
        const { selectedIndex, selectedChat, isCreating } = this.props;
        const { isLoading } = this.state;

        if (isLoading && selectedIndex !== -1) {
            return (
                <ChatRoomStyle width={this.state.width} className="chatRoom">
                    <div className="middle">
                        <Loader scale={2} />
                    </div>
                </ChatRoomStyle>
            );
        }

        if (isCreating) {
            return (
                <ChatRoomStyle width={this.state.width} className="chatRoom">
                    <div className="center">
                        <img src="/static/resources/logo/light.png" />
                        <span>Ceate New Chat</span>
                        <form onSubmit={this.onRequestNewChat}>
                            <div style={{ display: 'flex', marginTop: '10px'}}>
                                <input placeholder="Chat Name"/>
                                <button
                                    type="submit"
                                    style={{
                                        borderRadius: '20px'
                                    }}
                                    onClick={this.onRequestNewChat}
                                ><i className="fa fa-paper-plane" /></button>
                            </div>
                        </form>
                    </div>
                </ChatRoomStyle>
            );
        }

        const Default = (
            <ChatRoomStyle width={this.state.width} className="chatRoom">
                <div className="center">
                    <img src="/static/resources/logo/light.png" />
                    <span>No Chat Selected</span>
                </div>
            </ChatRoomStyle>
        );

        const NotMember = (
            <ChatRoomStyle width={this.state.width} className="chatRoom">
                <div className="center">
                    <img src="/static/resources/logo/light.png" />
                    <span>You are not a member. Do you want to join?</span>
                    <div>
                        <button onClick={this.onJoinRequest}>Yes</button>
                        <button onClick={this.onRejectRequest}>No</button>
                    </div>
                </div>
            </ChatRoomStyle>
        )

        if(selectedIndex === -1) {
            return Default;
        }

        if (!_.get(selectedChat, 'ismember', false) && !this.props.latestJoined[_.get(selectedChat, 'id', '')]) {
            return NotMember;
        }

        const chatId = _.get(this.props, 'selectedChat.id', '');
        const chat = _.get(this.props, `chat[${chatId}]`, []);

        return (
            <ChatRoomStyle
                width={this.state.width}
                style={{ paddingBottom: '30px'}}
                className="chatRoom"
            >
                <div className="chat-list">
                    {chat.map((item, idx) => {
                        if(_.get(this.state, 'markAsUnreads', []).reduce((acc, it) => {
                            return acc || _.isEqual(item, it);
                        }, false)) {
                            return GenerateBubble(item.userName === _.get(this.props, "sharedStore.username.data", ""), item, idx, true)
                        }
                        return GenerateBubble(item.userName === _.get(this.props, "sharedStore.username.data", ""), item, idx)
                    })}
                </div>
                <form
                    className="bottom-chat"
                    onSubmit={this.onSubmit}
                >
                    <input placeholder="Message" ref={(me) => this._Message = me} />
                    <button type="submit"><i className="fa fa-paper-plane" /></button>
                </form>
            </ChatRoomStyle>
        );
    }
}

export default withRedux(ChatRoom, {
    isEnableRedux: true
});
