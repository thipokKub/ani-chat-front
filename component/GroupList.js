import React, { Component } from 'react';
import styled from 'styled-components';
import GroupItem from './GroupItem';
import $ from 'jquery';
import _ from 'lodash';

const GroupListStyle = styled.section`
box-sizing: border-box;
/* padding-top: 40px; */

.header {
    background-color: #FFFFFF70;
    box-sizing: border-box;
    padding: 5px 15px;
    border: 1px solid #00000011;
}

.header-2 {
    background-color: #FFFFFF90;
    box-sizing: border-box;
    padding: 5px 15px;
    font-size: 1.5em;
    border: 1px solid #00000011;
    text-align: center;
    color: #333;

    span {
        color: #000;
    }
}

.search-bar {
    height: 40px;
    background-color: #FFFFFF99;
    position: fixed;
    display: flex;
    justify-content: center;
    align-items: center;
    transform: translateY(-40px);
    z-index: 1000;
    border-bottom: 1px solid rgba(0, 0, 0, 0.1);
    ${(props) => props.width && `width: ${props.width}px;`}

    input {
        outline: none;
        width: 90%;
        padding: 5px 10px;
        border-radius: 100px;
        border: 1px solid rgba(0, 0, 0, 0.15);
    }

    .close.icon {
        color: #000;
        right: 14px;
        margin-top: 0;
        margin-left: 0;
        width: 15px;
        height: 15px;
        position: absolute;
    }

    .close.icon:before {
        content: '';
        position: absolute;
        top: 7px;
        width: 15px;
        height: 1px;
        background-color: currentColor;
        -webkit-transform: rotate(-45deg);
                transform: rotate(-45deg);
    }

    .close.icon:after {
        content: '';
        position: absolute;
        top: 7px;
        width: 15px;
        height: 1px;
        background-color: currentColor;
        -webkit-transform: rotate(45deg);
                transform: rotate(45deg);
    }
}
`;

class GroupList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            width: -1
        }
    }
    componentDidMount() {
        this._isMounted = true
        setTimeout(() => {
            if(this._isMounted) {
                this.setState({ width: $(".GroupList")[0].offsetWidth });
                let _this = this;
                window.addEventListener("resize", () => {
                    _this.setState({ width: $(".GroupList")[0].offsetWidth });
                })
            }
        }, 10);
    }
    componentWillUnmount() {
        this._isMounted = false
    }
    render() {
        let JoinedGroup = []
        let UnjoinedGroup = []
        let username = "";
        if (this.props.sharedStore) {
            if (this.props.sharedStore.username) {
                username = this.props.sharedStore.username.data;
            }
            if (this.props.sharedStore.groupList && this.props.sharedStore.groupList.constructor === Array) {
                this.props.sharedStore.groupList.forEach((item, index) => {
                    if (item.ismember) {
                        JoinedGroup.push({
                            item: item,
                            idx: index
                        })
                    } else {
                        UnjoinedGroup.push({
                            item: item,
                            idx: index
                        })
                    }
                })
            }

        }
        return (
            <GroupListStyle width={this.state.width} className="GroupList">
                {
                    // <section className="search-bar">
                    //     <input placeholder="Group Name" />
                    //     <i className="close icon"></i>
                    // </section>
                }
                <section>
                    <div className="header-2">
                        Joined As <span>{username}</span>
                    </div>
                </section>
                <section>
                    <div className="header">Already Member</div>
                    <section>
                        {JoinedGroup.map((it, idx) => {
                            return (
                                <GroupItem
                                    item={it.item}
                                    key={idx}
                                    onSelect={this.props.onSelectedIndex(it.idx)}
                                />
                            )
                        })}
                    </section>
                </section>
                <section>
                    <div className="header">Non Member</div>
                    <section>
                        {UnjoinedGroup.map((it, idx) => {
                            return (
                                <GroupItem
                                    item={it.item}
                                    key={idx}
                                    onSelect={this.props.onSelectedIndex(it.idx)}
                                />
                            )
                        })}
                    </section>
                </section>
                <section>
                    <div className="header">Create New Chat</div>
                    <section>
                        <GroupItem
                            innerColor={'green'}
                            outerColor={'green'}
                            onSelect={this.props.onToggleCreate}
                            renderJSX={(props) => {
                                return [
                                    <div className="img" key={1}>
                                        <p>
                                            <img
                                                src={"/static/resources/PlusSM.png"}
                                                className="logo"
                                                alt="logo"
                                                style={{
                                                    opacity: 0.95
                                                }}
                                            />
                                        </p>
                                    </div>,
                                    <div key={2}>
                                        <h2>Create new chat</h2>
                                    </div>
                                ];
                            }}
                        />
                    </section>
                </section>
            </GroupListStyle>
        );
    }
}

export default GroupList;