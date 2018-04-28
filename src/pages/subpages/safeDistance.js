import React from 'react'
import {Text, View, Image, TouchableOpacity, Animated, ScrollView, Alert, Easing, Switch, Platform} from 'react-native'
import {NativeModules,NativeAppEventEmitter} from 'react-native'
import styles from 'PaiBandRN/src/style/safeDistanceStyles'
import IComponent from 'PaiBandRN/src/components/icomponent';
import ServiceNotice from 'PaiBandRN/src/notice/service';
import PaiBandService from 'PaiBandRN/src/services/paiband'
import UserSerivice from 'PaiBandRN/src/services/user'
import db from 'PaiBandRN/src/dbs/hashmap';
import SwitchAndroid from 'PaiBandRN/src/components/SwitchAndroid'
const SwitchCross = Platform.OS === 'ios' ? Switch : SwitchAndroid;


export default class SafeDistance extends IComponent {
    constructor(props) {
        super(props);
        this.state = {
            switchStatus: false, //开关状态
            outOfDistance: false, //是否超出安全距离
            BluetoothStatus: null, //蓝牙状态 0未打开手机蓝牙 1已经连接 2连接中  3未找到指定设备
            Nickname: null, // 孩子姓名
            deviceid: null, // 设备id
            statusData: {  //  初始化信息
                backColor: '#a5a5a5',
                tipText: '未开启',
                unSafeTip: ''
            },
            scanMove: new Animated.Value(0), 
            value: false, //开关状态
            didUnmount: false, //解决组件卸载与异步请求冲突的bug
        }
        this.scanMoveFun = () => {
            this.state.scanMove.setValue(0);  
            Animated.timing(         
                this.state.scanMove,  
                {
                    toValue: 1,
                    duration: 2500,
                    easing: Easing.linear,
                },         
            ).start(this.scanMoveFun);          
        }
        this.changeStatus = async (value) => {
            this.state.value = value;
            //关闭监听不做任何判断，直接关闭
            if (!value) {
                PaiBandService.syncWriteSecurity(false).then(res => {
                    //Alert.alert('关闭安全模式')
                }).catch(err => {
                    console.log('关闭安全模式失败')
                })
                const newStatusData = {
                    backColor: '#a5a5a5',
                    tipText: '未开启',
                    unSafeTip: ''
                }
                this.setState({
                    switchStatus: value,
                    statusData: newStatusData
                });
            }else{
                if (!this.state.deviceid || this.state.BluetoothStatus == null) {
                    this.getUserInfo();
                    await this.getBluetoothStatus('init');
                }
                this.openSwitch(value);
                PaiBandService.syncWriteSecurity(true).then(res => {
                    //Alert.alert('开启安全模式')
                }).catch(err => {
                    console.log('开启安全模式失败')
                });
            }
            
        }
    }
    openSwitch(){
        if (!this.state.value) {
            return
        }
        switch(this.state.BluetoothStatus){
            case undefined: 
                Alert.alert('获取蓝牙状态失败，请确保手机蓝牙已打开并连接到手环'); 
                this.changeStatus(false);
                return;
            case null: 
                Alert.alert('获取蓝牙状态失败，请确保手机蓝牙已打开并连接到手环'); 
                this.changeStatus(false);
                return;
            case 0: 
                Alert.alert('请开启手机蓝牙'); 
                this.changeStatus(false);
                return;
            case 1: 
                this.state.outOfDistance = false;
                break;
            case 2: 
                this.state.outOfDistance = true;
                break;
            case 3: 
                this.state.outOfDistance = true;
                break;
        }
        let newStatusData;

        if (this.state.outOfDistance) {
            newStatusData = {
                backColor: '#ed5564',
                tipText: '安全距离外',
                unSafeTip: this.state.Nickname + '已超出安全连接距离'
            }
        } else {
            newStatusData = {
                backColor: '#48cfae',
                tipText: '安全距离内',
                unSafeTip: ''
            }
        }
        
        this.setState({
            switchStatus: this.state.value,
            statusData: newStatusData
        });
    }
    
    /*
    获取蓝牙状态
     */
    async getBluetoothStatus(data){
        if (data == 'init') {
            try{
                const result = await PaiBandService.getBluetoothStatus(this.state.deviceid);
                this.state.BluetoothStatus = result&&result.status;
                this.openSwitch();
                return result
            }catch(err){
                console.log('获取蓝牙状态失败')
            }
        }else{
            // this.state.BluetoothStatus = 1
            this.state.BluetoothStatus = data&&data.status;
            this.openSwitch();
        }
    }
    // 获取用户信息
    getUserInfo(){
        this.state.cid = db.get('cid');
        this.state.deviceid = UserSerivice.getDeviceID(this.state.cid);
        this.state.Nickname =  UserSerivice.getNickname(this.state.cid) || '孩子';//获取当前孩子姓名
    }
    componentDidMount(){
        this.getUserInfo();
        this.scanMoveFun();
        this.getBluetoothStatus('init');
        this.addSubscriber(ServiceNotice.PAIBAND_SERVICE_BLUETOOTHSTATUS, this.getBluetoothStatus)
    }
    
    componentWillUnmount(){
        this.removeSubscriber(ServiceNotice.PAIBAND_SERVICE_BLUETOOTHSTATUS, this.getBluetoothStatus)
        clearInterval(this.timer);
        this.state.didUnmount = true;
        PaiBandService.syncWriteSecurity(false).then(res => {
            //Alert.alert('关闭安全模式')
        }).catch(err => {
            console.log('关闭安全模式失败')
        })
    }

    setNotice(){
        if(!this.state.switchStatus){
            Alert.alert('设定预警通知需开启安全模式')
            return
        }   
        PaiBandService.openNotification().then(res => {
            if(res.status == 0){
                Alert.alert('设定预警通知成功')
            }else{
                Alert.alert('设定预警通知失败')
            }
        }).catch(err => {
            Alert.alert('设定预警通知失败')
        })
    }

    render() {

        return (
            <ScrollView style={styles.safeDistanceContainer}>
                <View style={{backgroundColor: this.state.statusData.backColor}}>
                    <Image source={require('PaiBandRN/res/images/img_band_data_cover_pattern.png')} style={styles.backImg} resizeMode={'stretch'}>
                        <View>
                            <Image source={require('PaiBandRN/res/images/img_band_data_circle_distance.png')} style={styles.circleDistance} resizeMode={'stretch'}>
                                {
                                    this.state.switchStatus? 
                                    <Animated.Image source={require('PaiBandRN/res/images/img_band_data_circle_distance_scan.png')} style={[styles.scanImg, { transform: [{"rotate": this.state.scanMove.interpolate({
                                               inputRange: [0, 1],
                                               outputRange: ['0deg', '360deg']  
                                        })}]}]} resizeMode={'stretch'}>
                                    <Animated.View style={[styles.safeTextConainer,  this.state.outOfDistance? styles.outDistanceText: null, { transform: [{"rotate": this.state.scanMove.interpolate({
                                               inputRange: [0, 1],
                                               outputRange: ['-0deg', '-360deg']  
                                        })}]}]}>
                                        <Text style={styles.safeStatusTips}>
                                            {this.state.statusData.tipText}
                                        </Text>
                                        <Text style={styles.outOfDistanceTips}>
                                            {this.state.outOfDistance? this.state.statusData.unSafeTip:null}
                                        </Text>
                                    </Animated.View>
                                    </Animated.Image> : <Text style={[styles.safeStatusTips, styles.closeListen]}>{this.state.statusData.tipText}</Text>
                                }
                            </Image>
                        </View>
                    </Image>
                </View>
                <View style={styles.setRemind}>
                    <View style={[styles.setStatus, styles.currenState]}>
                        <Text style={styles.setStatusText}>当前状态</Text>
                        <SwitchCross value={this.state.switchStatus} onValueChange={this.changeStatus}></SwitchCross>
                    </View>
                    <View style={styles.setStatus}>
                        <TouchableOpacity onPress = {this.setNotice.bind(this)} style={styles.setNotice}>
                            <Text style={styles.setStatusText}>设定预警通知</Text>
                            <Image source={require('PaiBandRN/res/images/btn_arrow_g.png')} style={styles.showAllRrrow}></Image>
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={styles.useTips}>
                    <View style={styles.useTipsTitleView}>
                        <Text style={styles.useTipsTitleText}>使用注意</Text>
                    </View>
                    <View style={styles.useTipsView}>
                        <Text style={styles.useTipsText}>开启安全连接状态下，当孩子离开安全距离时APP会发出预警提醒家长。</Text>
                         <Text style={styles.useTipsText}>请保持葡萄手环APP开启，手机系统设定中提示和音量开启。</Text>
                    </View>
                </View>
            </ScrollView>
        )
    }
}
