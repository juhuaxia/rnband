
import React from 'react';
import IComponent from 'PaiBandRN/src/components/icomponent';
import COMNotice from 'PaiBandRN/src/notice/component';
import {
    StyleSheet, Text, View, Image,TouchableOpacity,
} from 'react-native';

class FlowerBottom extends IComponent{
    propTypes: {
        onPress: React.PropTypes.Function,
        Exchange: React.PropTypes.Function
    }

    render(){
	    return (
            <View style = {styles.wrap}>
                <View style = {styles.footerSlide}>
                    <TouchableOpacity onPress = {this.props.onPress} style = {styles.footerSlide}>
                        <Image source = {require('PaiBandRN/res/images/icon_40_25.png')} />
                        <Text style={styles.footerLeftText} >奖励小花</Text>
                    </TouchableOpacity>
                </View>
                <View style = {styles.footerCenter}>
                    <View style={styles.footerCenterLine}></View>
                </View>
                <View style = {styles.footerSlide}>
                <TouchableOpacity onPress = {this.props.Exchange} style = {styles.footerSlide}>
                    <Image source = {require('PaiBandRN/res/images/icon_40_26.png')} />
                    <Text style={styles.footerSlideText}>兑换小花</Text>
                    </TouchableOpacity>
                </View>
            </View>
	    )
    }
}

const styles = StyleSheet.create({
    wrap:{
        flexDirection:"row",
        // position:"absolute",
        // bottom:0,
        borderTopWidth:1,
        borderTopColor:"#e1e1e1",
        paddingTop:10,
        paddingBottom:10,
        backgroundColor:"#fff",
        zIndex:99
    },
    footerSlide:{
        flex:3,
        alignItems:"center",
        flexDirection:"row",
        justifyContent:"center"
    },
    footerLeftText:{
        fontSize:16,
        paddingLeft:5,
    },
    footerSlideText:{
        fontSize:16,
        paddingLeft:5,
    },
    footerCenter:{
        flex:1,
        alignItems:"center",
        justifyContent:"center"
    },
    footerCenterLine:{
        width:1,
        height:35,
        backgroundColor:"#e1e1e1"
    },
});

export default FlowerBottom;
