'use strict';

import React from 'react';
import { Navigator, Text, Alert } from 'react-native';

import PSComponent from 'PaiBandRN/src/components/pscomponent';
import PageNotice from 'PaiBandRN/src/notice/page';
import ServiceNotice from 'PaiBandRN/src/notice/service';

import config from 'PaiBandRN/src/config';
import db from 'PaiBandRN/src/dbs/hashmap';
import pageFactory from 'PaiBandRN/src/pages/pagefactory';

import userService from 'PaiBandRN/src/services/user';
import menuService from 'PaiBandRN/src/services/menu';
import paibandService from 'PaiBandRN/src/services/paiband';
import i18nService from 'PaiBandRN/src/services/i18nservice';

class App extends PSComponent {
    constructor(props) {
        super(props);
        this.state = {
            initState: false
        };
        db.set('appid', this.props.appid);
        db.set('token', this.props.token);
        db.set('uid', this.props.uid);
        db.set('cid', this.props.cid);
        db.set('lang', this.props.lang || config.defaultLang);

        this._routes = [
            {title: 'PaiBand', index: 0, name: 'home'},
            {title: 'Function', index: 1, name: 'func', page: ''}
        ];
        this._navigator = null;

        this._routeHandler = this._routeHandler.bind(this);
        this._navigatorFocus = this._navigatorFocus.bind(this);
        this._pageSelectHandler = this._pageSelectHandler.bind(this);
        this._goHome = this._goHome.bind(this);
    }

    componentDidMount() {
        this.addSubscriber(PageNotice.PAGE_SELECT, this._pageSelectHandler);
        this.addSubscriber(PageNotice.PAGE_HOME, this._goHome);

        this.addSubscriber(ServiceNotice.USERINFO_INIT_ERROR, this._userInitErrorHandler);

        i18nService.init();
        //userService.init();
        Promise.all([userService.init(), menuService.init(), paibandService.init()]).then(r => {
            this.setState({
                initState: true
            });
        }).catch(e => {
            console.log('PaiBand Service init error', e);
            throw e;
        });
    }

    _pageSelectHandler(page) {
        this._routes[1].page = page;
        if(this._navigator) {
            this._navigator.push(this._routes[1]);
        }
    }

    _goHome(page) {
        if(config.isLocalTest) {
            if(this._navigator) {
                this._navigator.pop();
            }
        } else {
            paibandService.closePaiBand(page).then().catch(e => console.log(e));
        }
    }

    _userInitErrorHandler() {
        Alert.alert(
            'Error', 
            'Failed to get user information, please check the network.',
            [
                { text: 'OK' }
            ]
        );
    }

    _routeHandler(route, navigator) {
        if(!config.isLocalTest) {
            route.page = this.props.page;
        }
        if(this._navigator === null) {
            this._navigator = navigator;
        }
        if(route && route.name) {
            // route.name = 'heart'
            const page = pageFactory.createPage(route.name, {page: route.page});
            return page;
        }
        return null;
    }

    _navigatorFocus(route) {
        //console.log(this._navigator);
    }

    render() {
        let view = null;
        if(this.state.initState) {
            view = (
                <Navigator
                    initialRoute={ config.isLocalTest ? this._routes[0] : this._routes[1]}
                    renderScene={this._routeHandler}
                    onDidFocus={this._navigatorFocus}
                />
            );
        }
        return view;
    }
};

export default App;
