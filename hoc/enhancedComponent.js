import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import withRedux from 'next-redux-wrapper'
import PropTypes from 'prop-types';
import _ from 'lodash';
import Head from 'next/head';

import rootActions from '../redux/actions/index';
import initStore from '../redux/store';
import {
    time_pageDelay,
    enableNProgress,
    enableRandomPageDelay,
    randomPageDelayRatio
} from '../constraint/variables';
import { randomRatio } from '../function/general';

import Router from 'next/router'
import NProgress from 'nprogress'

Router.onRouteChangeStart = (url) => {
    if (enableNProgress) NProgress.start()
}
Router.onRouteChangeComplete = () => {
    if (enableNProgress) {
        setTimeout(() => {
            NProgress.done()
        }, enableRandomPageDelay ? randomRatio(time_pageDelay, randomPageDelayRatio) : time_pageDelay);
    }
}
Router.onRouteChangeError = () => {
    if (enableNProgress) {
        setTimeout(() => {
            NProgress.done()
        }, enableRandomPageDelay ? randomRatio(time_pageDelay, randomPageDelayRatio) : time_pageDelay);
    }
}

export default function (ComposedComponent, option) {

    //Validate option
    const isEnableRedux = _.get(option, 'enableRedux', true)

    const optionReduxState = _.get(option, 'reduxOption.stateName')
    let optionReduxStateFlag = false
    if (optionReduxState) {
        optionReduxStateFlag = true
        if(optionReduxState.constructor === Array) {
            if(optionReduxState.reduce((res, val) => {
                return res && typeof val === "string"
            }, true)) optionReduxStateFlag = false
        }
    }

    const optionReduxDispatch = _.get(option, 'reduxOption.dispatchName')
    let optionReduxDispatchFlag = false
    if (optionReduxDispatch) {
        optionReduxDispatchFlag = true
        if (optionReduxDispatch.constructor === Array) {
            if (optionReduxDispatch.reduce((res, val) => {
                return res && typeof val === "string"
            }, true)) optionReduxDispatchFlag = false
        }
    }

    const optionStyleUrls = _.get(option, 'styleUrls')
    let optionStyleUrlsFlag = false
    if(optionStyleUrls) {
        optionStyleUrlsFlag = true
        if(optionStyleUrls.constructor === Array) {
            if (optionStyleUrls.reduce((res, val) => {
                return res && typeof val === "string"
            }, true)) optionStyleUrlsFlag = false
        }
    }

    const optionHead = _.get(option, 'headOption')
    let optionHeadFlag = false
    if (optionHead) {
        optionHeadFlag = true
        if (optionHead.constructor === Array) {
            if (optionHead.reduce((res, val) => {
                return res && typeof val.tag === "string" && ["object", "undefined"].indexOf(typeof val.option) !== -1
            }, true)) optionHeadFlag = false
        }
    }

    if (optionReduxStateFlag || optionReduxDispatchFlag || optionStyleUrlsFlag || optionHeadFlag) {
        throw new Error("Invalid option type")
        return null;
    }
    //End validate

    //Higher order class
    class EnhancedComponent extends Component {
        render() {
            let headInner = []
            if (optionStyleUrls) {
                optionStyleUrls.forEach((txt, index) => {
                    headInner.push(<style key={index} dangerouslySetInnerHTML={{ __html: txt }} />);
                })
            }
            if(optionHead) {
                optionHead.forEach((val, index) => {
                    headInner.push(
                        <val.tag
                            key={`head-${index}`}
                            {...val.option}
                        >
                            {
                                val.content
                            }
                        </val.tag>
                    )
                })
            }

            if (headInner.length > 0) {
                return [
                    <Head key="head">
                        {headInner}
                    </Head>,
                    <ComposedComponent key="body" {...this.props}>
                        {this.props.children}
                    </ComposedComponent>
                ]
            }

            return (
                <ComposedComponent {...this.props}>
                    {this.props.children}
                </ComposedComponent>
            );
        }
    };

    function mapStateToProps(state) {
        if(_.get(option, 'reduxOption.stateName', null) !== null) {
            const demandState = _.get(option, 'reduxOption.stateName')
            const keys = Object.keys(state)
            return demandState.reduce((res, val) => {
                if(keys.indexOf(val) !== -1) {
                    res[val] = state[val]
                }
                return val
            }, {});
        }
        return { ...state };
    }
    function mapDispatchToProps(dispatch) {
        if (_.get(option, 'reduxOption.dispatchName', null) !== null) {
            const demandDispatch = _.get(option, 'reduxOption.dispatchName')
            const keys = Object.keys(rootActions)
            const selectedActions = demandDispatch.reduce((res, val) => {
                if (keys.indexOf(val) !== -1) {
                    res[val] = rootActions[val]
                }
                return val
            }, {});
            return bindActionCreators({ ...selectedActions }, dispatch);
        }
        return bindActionCreators({ ...rootActions }, dispatch);
    }

    ComposedComponent.propTypes = {
        ...ComposedComponent.propTypes,
        enableRedux: PropTypes.bool,
        reduxOption: PropTypes.shape({
            stateName: PropTypes.arrayOf(PropTypes.string),
            dispatchName: PropTypes.arrayOf(PropTypes.string)
        }),
        styleUrls: PropTypes.arrayOf(PropTypes.string),
        headOption: PropTypes.arrayOf(PropTypes.shape({
            tag: PropTypes.string.isRequired,
            option: PropTypes.object,
            content: PropTypes.any
        }))
    }

    ComposedComponent.defaultProps = {
        ...ComposedComponent.defaultProps,
        enableRedux: true
    }

    EnhancedComponent.propTypes = ComposedComponent.propTypes

    if (isEnableRedux) {
        return withRedux(initStore, mapStateToProps, mapDispatchToProps)(EnhancedComponent);
    }
    return EnhancedComponent;
}

