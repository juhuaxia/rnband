import React from 'react';
import { StyleSheet, Text, View,Dimensions,TouchableOpacity, WebView } from 'react-native';
import StylesCommon from 'PaiBandRN/src/style/common';

import AutoHeightWebView from 'PaiBandRN/src/components/autoheightwebview';


export default class DescriptionBox extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            active_tips: this.props.descCon.active_tips || '暂无数据',
            addition_tips: this.props.descCon.addition_tips || ''
        }
    }

    componentWillReceiveProps(nextprops) {
        this.setState({
            active_tips: (nextprops.descCon && nextprops.descCon.active_tips) || '暂无数据',
            addition_tips: (nextprops.descCon && nextprops.descCon.addition_tips) || ''
        });
    }

    render() {
        return (
            <View style={[StylesCommon.common_card, styles.descWrap]}>
                <View style={styles.descTitle}>
                    <Text style={styles.descTitleText}>{this.props.descTitle || ""}</Text>
                </View>
                <View style={styles.descCon}>
                    {
                        <AutoHeightWebView html={ this.state.active_tips + (this.state.addition_tips ? ('<br>' + this.state.addition_tips) : '') } /> 
                    }
                </View>
            </View>
        )
    }
}


const styles = StyleSheet.create({
    descWrap:{
        flex: 1,
        backgroundColor:"#fff",
    },
    descTitle:{
        flex: 1,
        paddingBottom:10,
        paddingTop:15,
        marginLeft:15,
        marginRight:15,
        borderBottomWidth:1,
        borderColor:"#e1e1e1",
    },
    descTitleText:{
        fontSize:14,
        color:"#646464",
    },
    descCon:{
        flex: 1,
        paddingBottom:15,
        paddingTop:15,
        paddingLeft:15,
        paddingRight:15,
        borderWidth: 0
    },
    descConText:{
        flex: 1
        //fontSize:16,
        //color:"#313131",
    },
    spacing_8:{
        height:10,
        backgroundColor:"#ebebeb"
    },
});
