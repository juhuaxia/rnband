'use strict';

import React from 'react';
import {
    StyleSheet, TouchableHighlight, Image, Text, View
} from 'react-native';

import IComponent from 'PaiBandRN/src/components/icomponent';
import COMNotice from 'PaiBandRN/src/notice/component';

//---------------------class-----------------------
class IconButton extends IComponent {
    static propTypes = {
        icon: React.PropTypes.string.isRequired,
        name: React.PropTypes.string.isRequired
    };

    constructor(props) {
        super(props);

        this._touchHandler = this._touchHandler.bind(this);
    }

    init() {
    }

    update() {
    }

    _touchHandler() {
        // console.log('IconButton onPress', this.props.name);
        this.sendNotification(COMNotice.ICONBUTTON_CLICK, this.props.name);
    }

    render() {
        return (
            <TouchableHighlight activeOpacity={1} underlayColor={'#FFFFFF'} onPress={this._touchHandler} style={this.props.style}>
                <View style={styles.container}>
                    <View style={styles.icon_container}>
                        <Image source={{uri: this.props.icon}} style={styles.icon} />
                    </View>
                    <Text>
                        {this.props.name}
                    </Text>
                </View>
            </TouchableHighlight>
        );
    }
}

//---------------------style-----------------------
const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        minWidth: 100,
    },
    icon_container: {
        flex: 2,
        alignItems: 'center',
        justifyContent: 'center',
        height: 40
    },
    icon: {
        width: 30,
        height: 30
    },
    button_txt: {
        flex: 1,
        fontSize: 20,
        textAlign: 'center'
    }
});

export default IconButton;
