import React, { Component } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import Router from 'next/router'
import enhancedComponent from '../hoc/enhancedComponent';
import axios from 'axios';

const AppBarStyle = styled.section`
display: flex;
background-color: #F1F1F1;
margin: 0px;
padding: 10px 20px;
box-sizing: border-box;
justify-content: center;
align-items: center;
color: #2195F3;
${(props) => { return props.bgColor && `background-color: ${props.bgColor};`}}
${(props) => { return props.color && `color: ${props.color};` }}
position: fixed;

i {
    font-size: 2em;
    padding-right: 10px;
}
h1 {
    margin: 0px;
    padding: 0px;
    font-size: 1rem;
}

.right {
    position: absolute;
    right: 10px;
}

button {
    background-color: #FFFFFF99;
    outline: none;
    display: inline-flex;
    justify-content: center;
    align-items: center;
    margin: 0;
    padding: 0 30px;
    border: 0px;
    height: 35px;
    width: 35px;
    border-radius: 30px;
    margin-right: 5px;
    box-shadow: 0px 3px 10px #00000030;

    &:hover {
        filter: brightness(0.9);
        box-shadow: 0px 1px 10px #00000030;
    }

    &:active {
        filter: brightness(0.85);
        box-shadow: none;
    }

    i {
        padding: 0;
    }
}
`;

class AppBar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            parentWidth: -1
        }
    }
    componentDidMount() {
        this._isMounted = true
        let _this = this;
        setTimeout(() => {
            if(this._isMounted) {
                let width = 0
                try {
                    width = ReactDOM.findDOMNode(_this._me).parentNode.offsetWidth   
                    _this.setState({
                        parentWidth: width
                    })                 
                } catch (e) {
                    _this.setState({
                        parentWidth: 0
                    })
                }
                window.addEventListener("resize", () => {
                    try {
                        if (ReactDOM.findDOMNode(_this._me)) {
                            _this.setState({
                                parentWidth: ReactDOM.findDOMNode(_this._me).parentNode.offsetWidth
                            })
                        }
                    } catch (e) {
                        _this.setState({
                            parentWidth: 0
                        })
                    }
                })
            }
        }, 10)
    }

    componentWillUnmount() {
        this._isMounted = false
    }

    onLeaveGroup = async () => {
        try {
            const { url, userId } = this.props.sharedStore;
            await axios.post(`${url}/chat/leave`, {
                groupId: _.get(this.props, 'selectedChat.id', ''),
                userId: userId.data
            });
            const lastMsg = _.get(this.props.oProps, 'map.LastMsg.a.data', null);

            let res = await axios.post(`${url}/notify`, {
                userId: userId,
                groupId: _.get(this.props, 'selectedChat.id', ''),
                lastMsg: lastMsg
            })
            console.log(res);

            this.props.onFetchChatList();
        } catch (e) {
            console.error(e)
        }
    }

    onLogout = () => {
        if(window.confirm("Are you sure?")) {
            this.props.propsFunc.updateMapId("UserStat", "username", "")
            this.props.propsFunc.updateMapId("UserStat", "password", "")
            this.props.propsFunc.updateMapId("ChatStore", "groupList", {
                data: null
            })
    
            setTimeout(() => {
                Router.push({
                    pathname: '/'
                });
            }, 0);
        }
    }

    render() {
        const { text, icon, bgColor, color, isMain } = this.props;
        return (
            <AppBarStyle bgColor={bgColor} color={color} ref={(me) => this._me = me} style={{
                width: `${this.state.parentWidth}px`
            }}>
                <i className={icon} />
                <h1>{text}</h1>
                {
                    isMain && (
                        <div className="right">
                            {
                                // <button title="Edit Profile">
                                //     <i className="fa fa-user" />
                                // </button>
                            }
                            {
                                (this.props.selectedChat !== null) && (
                                    <button
                                        onClick={this.onLeaveGroup}
                                        title="Leave group"
                                    >
                                        <i className="fa fa-times" />
                                    </button>
                                )
                            }
                            <button
                                onClick={this.onLogout}
                                title="Log out"
                            >
                                <i className="fa fa-sign-out" />
                            </button>
                        </div>
                    )
                }
            </AppBarStyle>
        );
    }
} 

AppBar.propTypes = {
    text: PropTypes.string.isRequired
}

export default AppBar;
