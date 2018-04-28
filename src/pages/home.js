
'use strict';

import React from 'react';
import {
    StyleSheet, Image, View, ListView, WebView, Dimensions, Text
} from 'react-native';

import jutils from 'jutils';

import IComponent from 'PaiBandRN/src/components/icomponent';
import PageNotice from 'PaiBandRN/src/notice/page';
import COMNotice from 'PaiBandRN/src/notice/component';
import ServiceNotice from 'PaiBandRN/src/notice/service';

import IconButton from 'PaiBandRN/src/components/icon-button';

import menuService from 'PaiBandRN/src/services/menu';

const {width, height} = Dimensions.get('window');

//---------------------class-----------------------
class Home extends IComponent {
    constructor(props) {
        super(props);

        this.state = {
            menuList: []
        };

        this._pageSelectHandler = this._pageSelectHandler.bind(this);

        console.log(this.i18nLang);
        console.log(this.i18n('test_abc'));
        console.log(this.i18n(['test_abc', 'test_abc']));
    }

    componentDidMount() {
        this.addSubscriber(COMNotice.ICONBUTTON_CLICK, this._pageSelectHandler);

        this.setState({
            menuList: menuService.getMenuList()
        });
    }

    componentWillUnmount() {
        this.removeSubscriber(COMNotice.ICONBUTTON_CLICK, this._pageSelectHandler);
    }

    _pageSelectHandler(page) {
        const targetPage = menuService.getNameByTitle(page);
        if(targetPage) {
            this.sendNotification(PageNotice.PAGE_SELECT, targetPage);
        }
    }

    _renderMenuButton(m) {
        if(m) {
            return <IconButton icon={m.icon} name={m.title} style={styles.menu_button} />;
        }
        return null;
    }

    render() {
        const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => true});

        return (
            <View style={{flex: 1}}>
                <WebView
                    ref={webview => {this._webview = webview;}}
                    automaticallyAdjustContentInsets={false}
                    style={styles.webview}
                    source={require('PaiBandRN/res/webs/index.html')}
                    javaScriptEnabled={true}
                    domStorageEnabled={true}
                    decelerationRate='normal'
                    startInLoadingState={true}
                    scrollEnabled={false}
                    onMessage={this._webviewMessageHandler}/>
                <Image source={require('PaiBandRN/res/images/test.jpeg')} resizeMode='cover' style={styles.banner} />
                <ListView contentContainerStyle={styles.menu_container} dataSource={ds.cloneWithRows(this.state.menuList)} renderRow={this._renderMenuButton} enableEmptySections={true} />
            </View>
        );
    }
}

//---------------------style-----------------------
const styles = StyleSheet.create({
    webview: {
        backgroundColor: 'red'
    },
    banner: {
        width: width,
        height: 340
    },
    menu_container: {
        height: 280,
        flexDirection: 'row',
        flexWrap: 'wrap'
    },
    menu_button: {
        marginBottom: 10,
        width: width / 3,
        height: 60
    }
});

export default Home;

