import React from 'react';
import FlowerTop from 'PaiBandRN/src/components/flower-component/flowertop';
import FlowerList from 'PaiBandRN/src/components/flower-component/flowerlist';
import FlowerBottom from 'PaiBandRN/src/components/flower-component/flowerbottom';
import FlowerPop from 'PaiBandRN/src/components/flower-component/flowerpop';
import FlowerReward from 'PaiBandRN/src/components/flower-component/flowerreward';
import FlowerExchange from 'PaiBandRN/src/components/flower-component/flowerexchange';
import flowersService from 'PaiBandRN/src/services/flowers';

import {
    StyleSheet, Text, View, ListView, Modal, Image, TouchableOpacity, Picker, Animated, Dimensions
} from 'react-native';

import IComponent from 'PaiBandRN/src/components/icomponent';
import COMNotice from 'PaiBandRN/src/notice/component';

//假数据
const ORDER_STATUS_DATA = {
    "api":"GetSearchHistory",
    "code":"100",
    "msg":"success",
    "data":[{
        "type":1,
        "status":"45",
        "remark":"请耐心等待商家确认",
        "time":"8月5日 18:13",
        "img":'PaiBandRN/res/images/img_band_flower_petal.png',
    },{
        "type":1,
        "status":"11",
        "remark":"请耐心等待商家确认",
        "time":"8月5日 18:15",
        "img":'PaiBandRN/res/images/img_band_flower_petal.png',
    },{
        "type":2,
        "status":"2",
        "remark":"商品准备中,由商家配送,配送进度请咨询商家",
        "time":"8月5日 18:20",
        "img":'PaiBandRN/res/images/img_band_flower_petal.png',
    },{
         "type":1,
        "status":"23",
        "remark":"你的商品正由XX配送员火速送达中...",
        "time":"8月5日 18:25",
        "img":'PaiBandRN/res/images/img_band_flower_petal@2x.png',
    },{
        "type":1,
        "status":"11",
        "remark":"请耐心等待商家确认",
        "time":"8月5日 18:15",
        "img":'PaiBandRN/res/images/img_band_flower_petal@2x.png',
    },{
        "type":2,
        "status":"2",
        "remark":"商品准备中,由商家配送,配送进度请咨询商家",
        "time":"8月5日 18:20",
        "img":'PaiBandRN/res/images/img_band_flower_petal@2x.png',
    },{
         "type":1,
        "status":"23",
        "remark":"你的商品正由XX配送员火速送达中...",
        "time":"8月5日 18:25",
        "img":'PaiBandRN/res/images/img_band_flower_petal@2x.png',
    }],
};

const {awidth, aheight} = Dimensions.get('window')

export default class Flowers extends IComponent{
    constructor(props){
        super(props);
        this.state={
            dataSource: new ListView.DataSource({
               rowHasChanged: (row1, row2) => row1 !== row2,
            }),
            orderStatuts : [],
            flowerTip:false,//控制什么是小花弹窗是否显示
            flowerReward:false,//控制奖励小花弹窗是否显示
            flowerExchange:false,//控制兑换小花弹窗是否显示
            modalVisible: false,//控制遮罩层是否显示
            transparent: true,
            animationType: "none",
            flowersNumInfo:{},//获取孩子当前小红花数据
        }

        this._updateFlower = this._updateFlower.bind(this);
    }

    componentDidMount(){
        this.addSubscriber(COMNotice.FLOWERSCHANGE, this._updateFlower)

        this._updateFlower();
    }

    componentWillUnmount() {
        this.removeSubscriber(COMNotice.FLOWERSCHANGE, this._updateFlower)
    }

    _updateFlower() {
        flowersService.getFlowers().then(data => {
            console.log('flowersService getFlowers data', data);
            data = typeof data === 'object' ? data : {};
            this.setState({
                flowersNumInfo:data,
            });
        }).catch(e => {
            console.log('flowersService getToday error', e);
        });
    }


    FlowerTip(){
        this.setState({
            flowerTip:true,
            modalVisible:true,
        });
    }

    FlowerReward(){
        this.setState({
            flowerReward:true,
            modalVisible:true,
        });
    }

    FlowerExchange(){
        this.setState({
            flowerExchange:true,
            modalVisible:true,
        });
    }

    _setModalVisible(visible) {
        this.setState({
            modalVisible: visible,
            flowerTip: visible,
            flowerReward: visible,
            flowerExchange: visible,
        });
    }

    render() {
        //什么是小花弹窗内容
        let FlowerTip = null;
        if(this.state.flowerTip == true){
            FlowerTip = <FlowerPop />;
        }

        //奖励小花弹窗内容
        let FlowerRewardInfo = null;
        if(this.state.flowerReward == true){
            FlowerRewardInfo = <FlowerReward flowersNumInfo = {this.state.flowersNumInfo} onPress = {this._setModalVisible.bind(this, false)} />;
        }

        //兑换小花弹窗内容
        let FlowerExchangeInfo = null;
        if(this.state.flowerExchange == true){
            FlowerExchangeInfo = <FlowerExchange flowersNumInfo = {this.state.flowersNumInfo} orderStatuts = {this.state.orderStatuts} onPress = {this._setModalVisible.bind(this, false)} />;
        }

        //小花历史内容
        let ListIsHas = null;
        if(this.state.flowersNumInfo.reward_times > 0 || this.state.flowersNumInfo.exchange_times > 0){
            ListIsHas = <FlowerList dataSource = {this.state.dataSource} orderStatuts = {this.state.orderStatuts}/>;
        }else{
            ListIsHas =
            <View style = {styles.dataNull}>
                <View style = {styles.dataNullText}>
                    <View style = {styles.dataNullTextLeft}>
                        {/*<View style = {styles.dataNullLine}></View>*/}
                        <View style={styles.dataNullCrical}></View>
                    </View>
                    <View style = {styles.dataNullTextRight}><Text style={styles.dataText}>还没有小花呢</Text></View>
                </View>
                <Image style = {styles.dataNullImage} source = {require('PaiBandRN/res/images/img_band_flower_tips_01.png')} />
            </View>
        }
        return (
            <View style={styles.container}>
                <Modal
                        animationType = {this.state.animationType}
                        transparent={this.state.transparent}
                        visible={this.state.modalVisible}
                        onRequestClose={() => {this._setModalVisible.bind(this, false)}}>
                        <View style={styles.mark}>
                            <TouchableOpacity style={styles.mark} onPress={this._setModalVisible.bind(this, false)}></TouchableOpacity>
                        </View>
                    {FlowerTip}
                    {FlowerRewardInfo}
                    {FlowerExchangeInfo}
                </Modal>
                
                <FlowerTop onPress = {this.FlowerTip.bind(this)} flowersNumInfo = {this.state.flowersNumInfo} />
                {ListIsHas}
                <FlowerBottom onPress = {this.FlowerReward.bind(this)} Exchange = {this.FlowerExchange.bind(this)} />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex:1,
        paddingTop:64,
        // paddingBottom:60,
        // backgroundColor:"#ebebeb",
        // backgroundColor:"red",
    },
    mark:{
        backgroundColor:"#000",
        opacity:0.5,
        flex:1,
    },
    dataNull:{
        flex:1,
        position:"relative",
        backgroundColor:"#f5f5f5",
    },
    dataNullImage:{
        position:"absolute",
        bottom:5,
        left:40,
    },
    dataNullText:{
        height:50,
        backgroundColor:"#fff",
        flexDirection:"row",
    },
    dataNullTextLeft:{
        width:50,
        alignItems:"flex-end",
    },
    dataNullCrical:{
        width:10,
        height:10,
        backgroundColor:"#f5f5f5",
        borderRadius:50,
        position:'absolute',
        right:-6,
        top:15,
        zIndex:50
    },
    dataNullLine:{
        width:2,
        height:20,
        backgroundColor:"#f5f5f5",
        marginRight:4,
    },
    dataNullTextRight:{
        alignItems:"flex-start",
        justifyContent:"center",
        paddingLeft:10,
        flex:1,
        borderLeftWidth: 2,
        borderLeftColor: '#f5f5f5',
    },
    dataText:{
        color:"#959595",
        fontSize:16,
    },
});

