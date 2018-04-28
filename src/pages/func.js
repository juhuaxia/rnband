'use strict';

import React from 'react';
import { 
    StyleSheet, Navigator, View, TouchableOpacity, Text, Image, Alert, Platform
} from 'react-native';

import PSComponent from 'PaiBandRN/src/components/pscomponent';
import PageNotice from 'PaiBandRN/src/notice/page';

import pageFactory from 'PaiBandRN/src/pages/pagefactory';
import menuService from 'PaiBandRN/src/services/menu';

import config from 'PaiBandRN/src/config';

class Func extends PSComponent {
    constructor(props) {
        super(props);
        //这几个页面头部导航是红色的。
        this.redpages = ['rewards', 'exchange', 'heart'];
        //这几个页面及子页面只有返回按钮
        this.justBackBtn = ['rewards', 'exchange', 'heart', 'grow', 'sport', 'sleep'];
        //这几个页面返回按钮是 x 
        this.backClosePage = ['task', 'taskList'];

        this.state = {
            SubPageIndex: 0,
            backImg: require('PaiBandRN/res/images/back_purple_icon_n.png'),
            closeImg: require('PaiBandRN/res/images/menu_purple_close_icon_n.png'),
        };

        this._routes = menuService.getMenuList();
        const menu = menuService.getMenuByName(props.page);
        this._initRouteID = 0;
        if(menu) {
            this._initRouteID = menu.index;
        }
        this._navigator = null;

        this._goBack = this._goBack.bind(this);
        this._goClose = this._goClose.bind(this);
        this._routeHandler = this._routeHandler.bind(this);
        this._addSubPage = this._addSubPage.bind(this);
    }
    componentWillMount() {
        this._pageBackImg();
    }
    componentDidMount() {
        this.addSubscriber(PageNotice.PAGE_SELECT_SUBPAGE, this._addSubPage);
        this.addSubscriber(PageNotice.GO_BACK, this._goBack);
        this.addSubscriber(PageNotice.SELECT_TASK, this._goBack);
    }

    componentWillUnmount() {
        this.removeSubscriber(PageNotice.PAGE_SELECT_SUBPAGE, this._addSubPage);
        this.removeSubscriber(PageNotice.GO_BACK, this._goBack);
        this.removeSubscriber(PageNotice.SELECT_TASK, this._goBack);
    }

    _addSubPage(page) {
        if(this._navigator) {
            if (this.backClosePage.includes(page.name)) {
                this.setState({
                    SubPageIndex: this.state.SubPageIndex + 1,
                    backImg: require('PaiBandRN/res/images/menu_red_close_icon_n.png')
                })
            }else {
                this.setState({
                    SubPageIndex: this.state.SubPageIndex + 1,
                })
            }
            this._navigator.push({
                title: page.title,
                name: page.name,
                data: page.data,
                sceneIndex: 1,
            });
        }
    }

    _routeHandler(route, navigator) {
        if(this._navigator === null) {
            this._navigator = navigator;
        }

        if(route && route.name) {
            const page = pageFactory.createPage(route.name, { navigator, data: route.data });
            return page;
        }
        return null;
    }

    _goBack() {
        if (this.state.SubPageIndex == 1) {
            this._pageBackImg();
        }

        if(this.state.SubPageIndex > 0) {
            this.setState({
                SubPageIndex: this.state.SubPageIndex - 1,
            });
            this._navigator.pop();
            return ;
        }
        this.sendNotification(PageNotice.PAGE_HOME, pageFactory.currentPage);
    }

    _goClose() {
        this.sendNotification(PageNotice.PAGE_HOME, pageFactory.currentPage);
    }

    _showVersion() {
        Alert.alert(
            '当前版本号',
            config.version,
            [
                {text: '确定'}
            ]
        );
    }

    _pageBackImg(){
        /*
        小花，心愿，心率三个页面及子页面头部图片为红色，默认紫色
         */
        if (this.redpages.includes(this.props.page)) {
            this.setState({
                backImg: require('PaiBandRN/res/images/back_red_icon_n.png'),
                closeImg: require('PaiBandRN/res/images/menu_red_close_icon_n.png'),
            })
        }
    }

    render() {
        
        return  (
            <Navigator
                initialRoute={this._routes[this._initRouteID]}
                renderScene={this._routeHandler} navigationBar={
                    <Navigator.NavigationBar
                        routeMapper={{
                            LeftButton: (route, navigator, index, navState) => { 
                                return (
                                    <View style={styles.navigator_bar_left}>
                                        <TouchableOpacity onPress={this._goBack} style={styles.navigator_bar_btn}>
                                            <Image resizeMode='contain' source={this.state.backImg} style={{width: 26, height: 21}}/>
                                        </TouchableOpacity>
                                        {
                                            this.state.SubPageIndex > 0 && !this.justBackBtn.includes(this.props.page)? (
                                                <TouchableOpacity onPress={this._goClose} style={[styles.navigator_bar_btn, {width: 45}]}>
                                                    <Image resizeMode='cover' source={this.state.closeImg}  style={{width: 26, marginLeft: 25}}/>
                                                </TouchableOpacity>
                                            ) : null
                                        }
                                    </View>
                                ); 
                            },
                            RightButton: (route, navigator, index, navState) => { return ; },
                            Title: (route, navigator, index, navState) => { return (
                                <View style={{flex:1, alignItems: 'center', justifyContent: 'center'}}>
                                    {

                                        config.showVersion ?
                                            (
                                                <TouchableOpacity onPress={this._showVersion}>
                                                    <Text style={[styles.titleStyle, {fontSize: route.title.length > 25 ? 16: 20}]}>{route.title}</Text>
                                                </TouchableOpacity>
                                            ) :
                                            (
                                                <Text style={[styles.titleStyle, {fontSize: route.title.length > 25 ? 16: 20}]}>{route.title}</Text>
                                            )
                                    }
                                </View>
                            ); }
                        }}
                        style={styles.navigator_bar}
                        navigationStyles={Navigator.NavigationBar.StylesIOS}
                    />
                }
            />
        );
    }
}

//---------------------style-----------------------
const styles = StyleSheet.create({
    navigator_bar: {
        backgroundColor: '#FFF',
        shadowColor: '#000',
        shadowOpacity: 0.2,
        shadowRadius: 2,
    },
    navigator_bar_left: {
        marginLeft: 10,
        flex: 1,
        flexDirection: 'row'
    },
    navigator_bar_btn: {
        width: 26,
        alignItems: 'center',
        justifyContent: 'center'
    },
    titleStyle: {
        fontSize: 20,
        color: '#000',
        fontFamily: 'PingFangSC-Medium',
    },
});

export default Func;
