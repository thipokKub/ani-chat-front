import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import withRedux from 'next-redux-wrapper'
import initStore from '../redux/store';
import rootActions from '../redux/actions/index';

import Router from 'next/router'
import NProgress from 'nprogress'

Router.onRouteChangeStart = (url) => {
    NProgress.start()
}
Router.onRouteChangeComplete = () => setTimeout(() => {
    NProgress.done()
}, 200);
Router.onRouteChangeError = () => setTimeout(() => {
    NProgress.done()
}, 200);

export default function (ComposedComponent, option) {
    class connecting extends Component {
        render() {
            return (
                <ComposedComponent {...this.props}>
                    {this.props.children}
                </ComposedComponent>
            );
        }
    };
    function mapStateToProps(state) {
        return { ...state };
    }
    function mapDispatchToProps(dispatch) {
        return bindActionCreators({ ...rootActions }, dispatch);
    }
    return withRedux(initStore, mapStateToProps, mapDispatchToProps)(connecting);
}
