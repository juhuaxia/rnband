import React from 'react';
import {Text, View, Image, TouchableOpacity, ScrollView, Alert, Switch, Platform} from 'react-native';
import styles from 'PaiBandRN/src/style/heartSetStyle';
import StylesCommon from 'PaiBandRN/src/style/common';
import heartclockService from 'PaiBandRN/src/services/heartclock';
import PaiBandService from 'PaiBandRN/src/services/paiband';
import UserSerivice from 'PaiBandRN/src/services/user';
import IComponent from 'PaiBandRN/src/components/icomponent';
import ServiceNotice from 'PaiBandRN/src/notice/service';
import db from 'PaiBandRN/src/dbs/hashmap';
import SwitchAndroid from 'PaiBandRN/src/components/SwitchAndroid';
const SwitchCross = Platform.OS === 'ios' ? Switch : SwitchAndroid;
 // const SwitchCross = SwitchAndroid;
import Picker from 'PaiBandRN/src/components/picker';

const testData = [
    {"clock_id": 1,"time": "07:30","status":1},
    {"clock_id": 1,"time": "07:30","status":1},
    {"clock_id": 1,"time": "07:30","status":1},
    {"clock_id": 1,"time": "07:30","status":1},
]
export default class HeartSet extends IComponent {
    cid = null; //孩子id
    deviceid = null; //设备id
    editFailed = false; //修改或添加的闹钟是否重复
    avoidModel = false; //防止Model和Alert冲突，在Model结束后再弹出Alert
    didUnmount = false; //解决组件卸载与异步请求冲突的bug
    editFailedText = ''; //修改失败提示
    BluetoothStatus = null; //蓝牙状态

    state = {
        clockSets: [], //所有闹钟
        pickerHourSelected: null, //已选择的小时
        pickerMinuteSelected: null, //已选择的分钟
        pickerVisible: false, //弹出框是否显示
        selectIndex: null, //被编辑的闹钟索引
    }

    constructor(props) {
        super(props);
    }

    /*
    保存编辑
     */
    savePicker = async (hour, minute) => {
        if (!this.deviceid || this.BluetoothStatus == null) {
            this._getUserInfo();
            await this._getBluetoothStatus('init');
        }
        let newTime = hour + ':' + minute;
        let clocksets = this.state.clockSets;
        let selectIndex = this.state.selectIndex;
        /*
        判断当前闹钟重复
         */
        clocksets.forEach(item => {
            if (item.time == newTime) {
                this.editFailed = true;
            }
        })
        this.setState({
            pickerHourSelected: null,
            pickerMinuteSelected: null,
            pickerVisible: false,
            selectIndex: null,
        })
        //闹钟不重复时进行操作，重复时直接初始化
        if (!this.editFailed) {
            if (this.BluetoothStatus == 1) {
                const clockid = clocksets[selectIndex].clock_id;
                const time = newTime;
                const postStatus = Number(clocksets[selectIndex].status);
                const newClockList = this._getNewClock();
                newClockList[selectIndex].time = time;
                this._asyncNative(newClockList).then(asyncStatus => {
                    if (asyncStatus&&asyncStatus.status == 0) {
                        // clocksets[selectIndex].time = newTime;
                        // clocksets = this._sortList(clocksets);
                        // this._initState(clocksets)
                        heartclockService.modifyHeartClock(clockid, time, postStatus).then(res => {
                            if (this.didUnmount) return;
                            if (res.http_code == 200) {
                                clocksets[selectIndex].time = newTime;
                                clocksets = this._sortList(clocksets);
                                this._initState(clocksets)
                            }else{
                                this._initState(clocksets)
                                this.editFailed = true;
                                this.editFailedText = this.i18n('heartclock_tip_editFailed');
                                this._asyncNative(clocksets).then(res => {

                                }).catch(err => {

                                })
                            }
                        }).catch(err => {
                            if (this.didUnmount) return;
                            this._initState(clocksets)
                            this.editFailed = true;
                            this.editFailedText = this.i18n('heartclock_tip_editFailed');
                            this._asyncNative(clocksets).then(res => {

                            }).catch(err => {
                                
                            })
                        })
                    }else{
                        if (this.didUnmount) return;
                        this._initState(clocksets)
                        this.editFailed = true;
                        this.editFailedText = this.i18n('heartclock_tip_syncFailed');
                    }
                }).catch(err => {
                    if (this.didUnmount) return;
                    this._initState(clocksets)
                    this.editFailed = true;
                    this.editFailedText = this.i18n('heartclock_tip_syncFailed');
                })
            }else{
                this._initState(clocksets)
                this.avoidModel = true;
            }
        }else{
            this._initState(clocksets)
            this.editFailed = true;
            this.editFailedText = this.i18n('heartclock_tip_repeat');
        }
    }

    /*
    初始化数据
     */
    _initState(clocksets){
        this.setState({
            clockSets: clocksets,
        })
    }

    /*
    点击开关按钮
     */
    _changeStatus = async(index) => {

        if (!this.deviceid || this.BluetoothStatus == null) {
            this._getUserInfo();
            await this._getBluetoothStatus('init');
        }
        if (!this._dealBlueStatus()) {
            this.setState({
                clockSets: this.state.clockSets
            })
            return
        }
        const clockSets = this.state.clockSets;
        const clock = clockSets[index];
        const status = !clock.status;
        const clockid = clock.clock_id;
        const time = clock.time;
        const postStatus = Number(status);
        let asyncStatus;
        try{
            const newClockList = this._getNewClock();
            newClockList[index].status = !newClockList[index].status;
            console.log(newClockList)
            asyncStatus = await this._asyncNative(newClockList);
        }catch(err){
            console.log('同步闹钟失败')
        }

        if (asyncStatus&&asyncStatus.status == 0) {
            heartclockService.modifyHeartClock(clockid, time, postStatus).then(res => {
                if (this.didUnmount) return;
                if (res.http_code == 200) {
                    console.log('编辑闹钟成功', res);
                    clockSets[index].status = status;
                    this.setState({
                        clockSets,
                    })
                }else{
                    Alert.alert(this.i18n('heartclock_tip_editFailed'));
                    this._asyncNative(this.state.clockSets).then(res => {

                    }).catch(err => {
                        
                    })
                }
            }).catch(err => {
                if (this.didUnmount) return;
                Alert.alert(this.i18n('common_net_disconnect'), this.i18n('heartclock_tip_editFailed'));
                this._asyncNative(this.state.clockSets).then(res => {

                }).catch(err => {
                    
                })
            })
        }else{
            if (this.didUnmount) return;
            Alert.alert(this.i18n('heartclock_tip_syncFailed'))
        }
    }

    /*
    编辑闹钟，记录当前闹钟时间，传入picker作为初始数据
     */
    _editClock = (item, index) => {
        const splitTime = item.time.split(':');
        this.setState({
            pickerHourSelected: splitTime[0],
            pickerMinuteSelected: splitTime[1],
            pickerVisible: true,
            selectIndex: index,
        })
    }
    
    /*
    取消编辑，初始化数据
     */
    cancelPicker = () => {
        this.setState({
            pickerHourSelected: null,
            pickerMinuteSelected: null,
            pickerVisible: false,
            selectIndex: null,
        })
    }

    /*
    获取新的闹钟数据，多层嵌套的引用类型
     */
    _getNewClock(){
        const newClock = [];
        this.state.clockSets.forEach((item) => {
            newClock.push({...item});
        });
        return newClock
    }

    /*
    同步客户端定时心率闹钟
     */
    async _asyncNative(clockList){
        if (!this.deviceid) {
            this._getUserInfo();
        }
        let asyncClock = [];
        clockList.forEach(item => {
            if (item.status) {
                asyncClock.push(item.time)
            }
        })
        try{
            console.log(asyncClock)
            const result = await PaiBandService.syncWriteHeartClock(this.deviceid, this.cid, asyncClock);
            return result
        }catch(err){
            console.log(err);
        }
    }

    /*
    初始化数据
     */
    _initData(list = []){
        /*
        获取后的数据状态status 0/1 转换成布尔值
         */
        list.map(item => {
            item.status = Boolean(item.status);
            return item
        })
        /*
        如果用户的闹钟数不足四个，发送请求添加至四个，默认值为00:00，状态为false
         */
        if (list.length < 4) {
            for (let i = 0; i < 4 - list.length; i++) {
                const time = "00:0" + i;
                list.push({
                    "time": time,
                    "status":false  
                })
                heartclockService.addHeartClock(time).then(res => {
                    console.log(res)
                }).catch(err => {
                    console.log(err)
                })
            }
        }
        list = this._sortList(list);
        this._asyncNative(list);
        this.setState({
            clockSets: list,
        })
    }

    /*
    闹钟按时间排序
     */
    _sortList(listArr){
        listArr.map(item => {
            const sortArr = item.time.split(':');
            item.sortIndex = parseInt(sortArr[0] + sortArr[1]);
            return item
        })
        let arrExchange;
        for (let i = 0; i < listArr.length; i++) {
            for (let j = 0; j < listArr.length; j++) {
                if (listArr[i].sortIndex < listArr[j].sortIndex) {
                    arrExchange = listArr[i];
                    listArr[i] = listArr[j];
                    listArr[j] = arrExchange;
                }
            }
        }
        return listArr
    }

    //初始化时获取用户信息
    _getUserInfo(){
        this.cid = db.get('cid');
        this.deviceid = UserSerivice.getDeviceID(this.cid);
    }

    /*
    获取蓝牙状态
     */
    async _getBluetoothStatus(data){
        if (data == 'init') {
            try{
                const result = await PaiBandService.getBluetoothStatus(this.deviceid);
                this.BluetoothStatus = result&&result.status;
                return result
            }catch(err){
                throw new Error(err)
            }
        }else{
            console.log(data)
            // this.BluetoothStatus = 1;
            this.BluetoothStatus = data&&data.status;
        }
    }

    /*
    获取蓝牙状态
     */
    _dealBlueStatus(){
        switch(this.BluetoothStatus){
            case 0: 
                Alert.alert(this.i18n('common_bluetooth_status2')); 
                return false;
            case 1: 
                return true;
            case 2: 
                Alert.alert(this.i18n('common_bluetooth_status3'));  
                return false;
            case 3:
                Alert.alert(this.i18n('common_bluetooth_status4'));  
                return false;
            default: 
                Alert.alert(this.i18n('common_bluetooth_status1'));  
                return false;
        }
    }

    componentDidMount() {
        //因为获取用户信息是异步的过程，所以可能会导致获取的 deviceid 为undefind
        this._getUserInfo();
        this._getBluetoothStatus('init');
        this.addSubscriber(ServiceNotice.PAIBAND_SERVICE_BLUETOOTHSTATUS, this._getBluetoothStatus)

        heartclockService.getHeartClockList().then(res => {
            console.log('后台数据',res)
            if (res.http_code == 200) {
                this._initData(res.data.list);
            }else{
                console.log('获取心率闹钟失败');
            }
        }).catch(err => {
            Alert.alert(this.i18n('common_net_disconnect'), this.i18n('heartclock_tip_errorGetData'));
        })
        //this._initData(testData);
    }
    componentWillUnmount(){
        this.removeSubscriber(ServiceNotice.PAIBAND_SERVICE_BLUETOOTHSTATUS, this._getBluetoothStatus);
        this.didUnmount = true;
    }
    componentDidUpdate(prevProps, prevState) {
        if (this.editFailed) {
            setTimeout(() => {
                if(this.editFailedText) Alert.alert(this.editFailedText);
                this.editFailed = false;
                this.editFailedText = '';
            }, 500)
        }
        if (this.avoidModel) {
            setTimeout(() => {
                switch(this.BluetoothStatus){
                    case 0: Alert.alert(this.i18n('common_bluetooth_status2')); break;
                    case 2: Alert.alert(this.i18n('common_bluetooth_status3'));  break;
                    case 3: Alert.alert(this.i18n('common_bluetooth_status4'));  break;
                    default: Alert.alert(this.i18n('common_bluetooth_status1'));  break;
                }
                this.avoidModel = false;
            }, 500)
        }
    }
    render() {
        return (
            <View style={styles.heartSetContainer}>
                <ScrollView>
                    <View style={styles.clockListContainer}>
                        {
                            this.state.clockSets.map((item, index) => {
                                return <View style={[styles.listItemStyle, StylesCommon.common_card]} key={index}>
                                    <TouchableOpacity style={styles.listItemRight} onPress={this._editClock.bind(this, item, index)}>
                                            <Text style={[styles.listItemText, item.status? null:{color: '#c2c2c2'}]}>{this.translateTime(item.time)}</Text>

                                    </TouchableOpacity>
                                    <View style={styles.SwitchContainer}>
                                        <SwitchCross style={styles.listItemSwitch} value={item.status} onValueChange={this._changeStatus.bind(this, index)}></SwitchCross>
                                    </View>
                                </View>
                            })
                        }
                    </View>
                    <View style={styles.descriptionView}>
                        <View style={styles.detailStyle}>
                            <Text style={styles.detailText}>{this.i18n('heartClock_tip_explain')}</Text>
                        </View>
                    </View>
                    <Picker status={this.state.pickerVisible} selectHouer={this.state.pickerHourSelected} selectMinute={this.state.pickerMinuteSelected} cancle={this.cancelPicker} confirm={this.savePicker}/>
                </ScrollView>
            </View>
        )
    }
}
