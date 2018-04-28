'use strict'

import React, { Component } from 'react'
import {Text, View, Image, ListView, TouchableOpacity, Animated, Alert, PickerIOS, Platform, Dimensions} from 'react-native'
import Svg, {Circle} from 'react-native-svg';
import styles from 'PaiBandRN/src/style/clockStyles'
import ClockService from 'PaiBandRN/src/services/clock'
import IComponent from 'PaiBandRN/src/components/icomponent';
import ServiceNotice from 'PaiBandRN/src/notice/service';
import PaiBandService from 'PaiBandRN/src/services/paiband'
import UserSerivice from 'PaiBandRN/src/services/user'
import db from 'PaiBandRN/src/dbs/hashmap';
import PickerAndroid from 'PaiBandRN/src/components/PickerAndroid';
const Picker = Platform.OS === 'ios' ? PickerIOS : PickerAndroid;
// const Picker = PickerAndroid;
let windowHeight = Dimensions.get('window').height;


const ds = new ListView.DataSource({
    rowHasChanged: (r1, r2) => r1 !== r2
});


export default class SetClock extends IComponent {
    constructor(props) {
        super(props);
        const clockListArr = [{
                title: '起床',
                category: 0,
                type: 'getup',
                imgPath: require('PaiBandRN/res/images/icon_12_12.png'),
                TimeTypeList: []
            }, {
                title: '学习',
                category: 1,
                type: 'study',
                imgPath: require('PaiBandRN/res/images/icon_20_57.png'),
                TimeTypeList: []
            }, {
                title: '运动',
                category: 2,
                type: 'motion',
                imgPath: require('PaiBandRN/res/images/icon_20_58.png'),
                TimeTypeList: []
            }, {
                title: '睡觉',
                category: 3,
                type: 'sleep',
                imgPath: require('PaiBandRN/res/images/icon_20_59.png'),
                TimeTypeList: []
            }, {
                title: '其他',
                category: 4,
                type: 'other',
                imgPath: require('PaiBandRN/res/images/icon_20_60.png'),
                TimeTypeList: []
            },

        ];
        this.state = {
            maxNum: 8, // 最大闹钟数
            tataolNum: null, // 当前闹钟数量
            selectOptionStatus: false, //修改，删除，取消选项，是否显示
            selectrowID: null, //当前选择的rowId
            selectrowIndex: null, //当前选择的闹钟索引
            showMaxWarn: false, //当当前闹钟数量等于最大数量时，点击添加按钮跳出提示框
            clockList: ds.cloneWithRows(clockListArr),
            pickerName: ['起床', '学习', '运动', '睡觉', '其他'],
            pickerHour: ['00', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23'],
            pickerMinute: ['00', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31', '32', '33', '34', '35', '36', '37', '38', '39', '40', '41', '42', '43', '44', '45', '46', '47', '48', '49', '50', '51', '52', '53', '54', '55', '56', '57', '58', '59'],
            repeatType: ['每周一、二、三、四、五', '周末', '每天'],
            changeType: 'change', //判断是修改还是添加
            changeTargetObj: {}, //修改，删除，取消页面，页面显示出来时，记录当前闹钟信息，以备修改用
            clockIndex: null, //选择修改后保存时需要知道clockListArr的子级索引，添加则不需要
            choseRepeatType: '每周一、二、三、四、五', //编辑页面，重复类型
            choseRepeatTypeIndex: 0, //编辑页面，重复类型索引，控制右侧勾号是否显示
            pickerNameSelected: '起床', //编辑页面，类型
            pickerNameSelectedIndex: 0, //编辑页面，类型索引，也是clockListArr的索引
            pickerHourSelected: '00', //编辑页面，小时
            pickerMinuteSelected: '00', //编辑页面，分钟
            decayValue: new Animated.Value(0), //提示闹钟数量已经达到上限的运动
            editPageMove: new Animated.Value(windowHeight), //编辑页面的运动数据
            pickerMove: new Animated.Value(windowHeight), //picker页面的运动
            chooseMove: new Animated.Value(windowHeight + 50), //picker页面的运动
            preventRepeat: false, //因为于后台异步交互，需要防止重复添加闹钟
            deviceid: null, //设备id
            cid: null, //孩子id
            asyncClock: [], //需要同步至手环的闹钟
            asyncType: ['getup', 'study', 'motion', 'sleep', 'other'], //同步类型
            BluetoothStatus: null, //蓝牙状态
            didUnmount: false, //解决组件卸载与异步请求冲突的bug
        }
        /**
         * 选择修改当前闹钟页面，点击取消按钮
         */
        this.selectEditCancel = () => {
            Animated.spring(
                this.state.chooseMove, {
                    toValue: windowHeight + 50,
                    velocity: 10,
                }
            ).start()
        }

        /**
         * 编辑已经存在的闹钟，并选择修改当前闹钟，将储存的信息传入编辑页面
         */
        this.selectChangeClock = () => {
            let targetObj = this.state.changeTargetObj;
             Animated.spring(
                this.state.chooseMove, {
                    toValue: windowHeight + 50,
                    velocity: 10,
                }
            ).start()
            this.setState({
                changeType: 'change',
                choseRepeatType: targetObj.repeatType,
                choseRepeatTypeIndex: targetObj.repeatTypeIndex,
                pickerNameSelected: targetObj.title,
                pickerNameSelectedIndex: targetObj.typeIndex,
                clockIndex: targetObj.clockIndex,
                pickerHourSelected: targetObj.hour,
                pickerMinuteSelected: targetObj.minute,
                clock_id: targetObj.clock_id,
            })
            Animated.spring(
                this.state.editPageMove, {
                    toValue: 0,
                    velocity: 10,
                }
            ).start()
        }
        /**
         * 初始化数据
         */
        this.initData = async () => {
            let data;
            try{
                data = await ClockService.getClock();
            }catch(err){
                data = null;
                Alert.alert('网络出错', '获取闹钟数据失败');
            }
            if (this.state.didUnmount) return;
            if (data) {
                const {max_clock_count = 8, list = []} = data;
                console.log('后台数据', data)
                let aysncStatus = true;
                list.forEach(item => {
                    const hour = item.time.split(':')[0];
                    const minute = item.time.split(':')[1];
                    const repeatType = this.state.repeatType[item.cycle - 1];
                    const repeatTypeIndex = item.cycle -1;  
                    //上面4条信息是展示所用
                    const clock_id = item.clock_id;
                    const category = item.category;
                    const time = hour + ':' + minute;
                    const repeat = item.repeat;
                    const is_sync = item.is_sync;
                    const cycle = item.cycle;
                    //上面6条信息是后台传递过来的信息，也是需要传递给后台的数据
                    clockListArr[item.category].TimeTypeList.push({hour, minute, repeatType, repeatTypeIndex, clock_id, category, time, repeat, is_sync, cycle});
                    //如果有未同步的闹钟，则进行同步
                    if (!is_sync) {
                        aysncStatus = false;
                    }
                });
                this.state.maxNum = max_clock_count;
                this.sortClock();
                this.computedNumber();
                //如果有未同步的闹钟，则进行同步
                this.getAsyncClock();
                if (!aysncStatus) {
                    try{
                        const clockAsync = await this.asyncNative();
                        if(clockAsync.status == 0){
                            this.asyncApi();
                        }
                    }catch(err){
                        console.log(err);
                    }
                }
            }
        }
        /**
         * 计算当前已经存在的闹钟数，只会在组件初始化的时候加载一次
         */
        this.computedNumber = () => {
            let number = 0;
            clockListArr.forEach(item => {
                number += item['TimeTypeList'].length;
            })
            this.setState({
                tataolNum: number,
                clockList: ds.cloneWithRows(clockListArr),
            })
        }

        /**
         * 修改已经存在的闹钟，将闹钟数据放入一个对象，预先储存数据，如果点击修改则将此对象信息传入编辑页面
         */
        this.selecteditType = (rowID, index) => {
            const clockObj = clockListArr[rowID]['TimeTypeList'][index];
            this.state.changeTargetObj = {
                typeIndex: rowID,
                clockIndex: index,
                title: clockListArr[rowID]['title'],
                hour: clockObj['hour'],
                minute: clockObj['minute'],
                repeatType: clockObj['repeatType'],
                repeatTypeIndex: clockObj['repeatTypeIndex'],
                clock_id: clockObj['clock_id'],
            }
            this.setState({
                selectrowID: rowID,
                selectrowIndex: index,
                changeTargetObj: this.state.changeTargetObj,
            })
            Animated.spring(
                this.state.chooseMove, {
                    toValue: 0,
                    velocity: 10,
                }
            ).start()
        }
        
        /**
         * 选择修改当前闹钟页面，点击删除，删掉当前闹钟
         */
        this.selectEditDelete = async () => {
            Animated.spring(
                this.state.chooseMove, {
                    toValue: windowHeight + 50,
                    velocity: 10,
                }
            ).start()
            if (!this.state.deviceid || this.state.BluetoothStatus == null) {
                this.getUserInfo();
                await this.getBluetoothStatus('init');
            }
            if (this.state.BluetoothStatus == 1) {
                const buffClock = [...clockListArr[this.state.selectrowID].TimeTypeList];
                const deletItem = clockListArr[this.state.selectrowID].TimeTypeList.splice(this.state.selectrowIndex, 1);
                this.getAsyncClock();
                clockListArr[this.state.selectrowID].TimeTypeList = buffClock;
                let clockAsync;
                try{
                    clockAsync = await this.asyncNative();
                }catch(err){
                    if (this.state.didUnmount) return;
                    console.log('同步至手环失败')
                }
                
                if(clockAsync&&clockAsync.status == 0){
                    ClockService.deleteClock(deletItem[0].clock_id).then(result => {
                        if (this.state.didUnmount) return;
                        if (result.http_code == 200) {
                            clockListArr[this.state.selectrowID].TimeTypeList.splice(this.state.selectrowIndex, 1);
                            this.setState({
                                selectrowID: null,
                                selectrowIndex: null,
                                tataolNum: --this.state.tataolNum,
                                clockList: ds.cloneWithRows(clockListArr)
                            });
                        }else{
                            this.setState({
                                selectrowID: null,
                                selectrowIndex: null,
                                clockList: ds.cloneWithRows(clockListArr)
                            });
                            Alert.alert('删除闹钟失败');
                        }
                    }).catch(err => {
                        if (this.state.didUnmount) return;
                        this.setState({
                            selectrowID: null,
                            selectrowIndex: null,
                            clockList: ds.cloneWithRows(clockListArr)
                        });
                        Alert.alert('网络出错', '删除闹钟失败');
                    })
                }else{
                    if (this.state.didUnmount) return;
                    this.setState({
                        selectrowID: null,
                        selectrowIndex: null,
                        clockList: ds.cloneWithRows(clockListArr)
                    });
                    Alert.alert('同步至手环失败');
                }
            }else{
                switch(this.state.BluetoothStatus){
                    case 0: Alert.alert('未连接手环蓝牙，请开启手机蓝牙'); break;
                    case 2: Alert.alert('蓝牙连接中，请稍后再试'); break;
                    case 3: Alert.alert('未找到指定设备'); break;
                    default: Alert.alert('获取蓝牙状态失败，请确保手机蓝牙已打开并连接到手环'); 
                }
            }
        }
        

        /**
         * 点击添加闹钟按钮，判断是否超过最大可设置数量，如果超过显示提示，如果没有则显示编辑页面
         */
        this.showEditPage = () => {
            if (this.state.tataolNum < this.state.maxNum) {
                this.setState({
                    changeType: 'add'
                })
                Animated.spring(
                    this.state.editPageMove, {
                        toValue: 0,
                        velocity: 10,
                    }
                ).start()
            } else {
                //this.state.decayValue.setValue(1);     
                this.setState({
                    showMaxWarn: true
                })
                Animated.spring(
                    this.state.decayValue, {
                        toValue: -140,
                        velocity: 5,
                    }
                ).start(() => {
                    setTimeout(() => {
                        Animated.spring(
                            this.state.decayValue, {
                                toValue: 0,
                                velocity: 5,
                            }
                        ).start()
                    }, 3000)
                });
            }
        }


        /**
         * 编辑页面，选择不同的重复类型，记录当前的重复类型的索引值
         */
        this.chooseRepeatType = (index) => {
            this.setState({
                choseRepeatTypeIndex: index,
                choseRepeatType: this.state.repeatType[index],
            })
        }


        /**
         * picker页面，点击保存
         */
        this.savePicker = () => {
            Animated.spring(
                this.state.pickerMove, {
                    toValue: windowHeight,
                    velocity: 10,
                }
            ).start()
        }


        /**
         * picker页面，点击取消按钮，重置初始值
         */
        this.cancelPicker = () => {
            this.setState({
                pickerNameSelected: '起床',
                pickerNameSelectedIndex: 0,
                pickerHourSelected: '00',
                pickerMinuteSelected: '00',
            })
            Animated.spring(
                this.state.pickerMove, {
                    toValue: windowHeight,
                    velocity: 10,
                }
            ).start()
        }

        /**
         * 点击时间选项，调出picker选择页面
         */
        this.showPickerOption = () => {
            Animated.spring(
                this.state.pickerMove, {
                    toValue: 0,
                    velocity: 10,
                }
            ).start()
        }


        /**
         * 编辑页面，点击取消，重置信息
         */
        this.cancelEdit = () => {
            this.setState({
                choseRepeatType: '每周一、二、三、四、五',
                choseRepeatTypeIndex: 0,
                pickerNameSelected: '起床',
                pickerNameSelectedIndex: 0,
                pickerHourSelected: '00',
                pickerMinuteSelected: '00',
            })
            Animated.spring(
                this.state.editPageMove, {
                    toValue: windowHeight,
                    velocity: 10,
                }
            ).start()
        }


        /**
         * 编辑页面，点击保存，判断是否是新增闹钟还是修改闹钟，并返回一个新的闹钟，重置所有编辑页面数据
         */
        this.saveEdit = async () => {
            //防止连续点击导致重复添加闹钟
            if (this.state.preventRepeat) {
                return
            }
            this.state.preventRepeat = true;
            if (!this.state.deviceid || this.state.BluetoothStatus == null) {
                this.getUserInfo();
                await this.getBluetoothStatus('init');
            }
            switch(this.state.BluetoothStatus){
                case undefined: 
                    Alert.alert('获取蓝牙状态失败，请确保手机蓝牙已打开并连接到手环'); 
                    this.cancelEdit();
                    this.state.preventRepeat = false
                    return;
                case null: 
                    Alert.alert('获取蓝牙状态失败，请确保手机蓝牙已打开并连接到手环'); 
                    this.cancelEdit();
                    this.state.preventRepeat = false
                    return;
                case 0: 
                    Alert.alert('未连接手环蓝牙，请开启手机蓝牙'); 
                    this.cancelEdit();
                    this.state.preventRepeat = false
                    return;
                case 2: 
                    Alert.alert('蓝牙连接中，请稍后再试');
                    this.cancelEdit();
                    this.state.preventRepeat = false 
                    return;
                case 3: 
                    Alert.alert('未找到指定设备');
                    this.cancelEdit();
                    this.state.preventRepeat = false 
                    return;
            }
            this.setClock();
        }

        this.setClock = async () => {
            Animated.spring(
                this.state.editPageMove, {
                    toValue: windowHeight,
                    velocity: 10,
                }
            //运动结束后设置preventRepeat为false
            ).start(() => this.state.preventRepeat = false);

            let repeatType;
            /**
             * 同协议二进制
             */
            switch(this.state.choseRepeatTypeIndex){
                case 0: 
                    repeatType = '11111000';
                    break;
                case 1:
                    repeatType = '00000110';
                    break;
                case 2:
                    repeatType = '11111110';
                    break;
            }
            /**
             * 添加闹钟和修改闹钟处理的方式虽然不同，但是他们所保存的数据是相同的，只不过修改多一个闹钟id
             */
            let repeatTips = ''; //添加或者修改闹钟发生重复时的提示；
             /**
             * 本地展示所需要的数据
             */
            const localSets = {
                hour: this.state.pickerHourSelected,
                minute: this.state.pickerMinuteSelected,
                repeatType: this.state.choseRepeatType,
                repeatTypeIndex: this.state.choseRepeatTypeIndex,
            }
             /**
             * 发送给后台的数据
             */
            const clockSets = {
                cycle: this.state.choseRepeatTypeIndex + 1,
                category: this.state.pickerNameSelectedIndex,
                time: this.state.pickerHourSelected + ':' + this.state.pickerMinuteSelected,
                repeat: repeatType,
                is_sync: 0,
            }
            const newClock = {
                time: clockSets.time,
                type: clockListArr[this.state.pickerNameSelectedIndex].type,
                repeat: parseInt(repeatType, 2)
            }
            if (this.state.changeType === 'add') {
                const repeatStatus = this.preventRepeatClock(newClock);
                //不重复时进行后续操作
                if (!repeatStatus) {
                    clockListArr[this.state.pickerNameSelectedIndex]['TimeTypeList'].push({
                        ...localSets,
                        ...clockSets,
                    })
                    this.getAsyncClock();
                    let clockAsync
                    try{
                        clockAsync = await this.asyncNative();
                    }catch(err){
                        if (this.state.didUnmount) return;
                        console.log('同步至手环失败');
                    }
                    if(clockAsync&&clockAsync.status == 0){
                        clockSets.is_sync = 1;
                        let result
                        try{
                            result = await ClockService.addClock(clockSets);
                        }catch(err){
                            if (this.state.didUnmount) return;
                            result = null;
                            console.log('同步至服务器失败');
                        }
                        if (this.state.didUnmount) return;
                        if (result&&result.http_code == 200) {
                            clockListArr[this.state.pickerNameSelectedIndex]['TimeTypeList'][clockListArr[this.state.pickerNameSelectedIndex]['TimeTypeList'].length - 1] = {
                                ...localSets,
                                ...clockSets,
                                ...{clock_id: result.data.clock_id}
                            }
                            this.state.tataolNum ++;
                            this.sortClock();
                        }else{
                             /*
                            添加失败，返回原来的值
                             */
                            clockListArr[this.state.pickerNameSelectedIndex]['TimeTypeList'].pop();
                            Alert.alert('网络出错', '添加闹钟失败');
                        }
                    }else{
                        if (this.state.didUnmount) return;
                        clockListArr[this.state.pickerNameSelectedIndex]['TimeTypeList'].pop();
                        Alert.alert('同步到手环失败');
                    }
                }else{
                    repeatTips = '闹钟不能重复添加'
                }
            } else if (this.state.changeType === 'change') {
                const repeatStatus = this.preventRepeatClock({...newClock, ...{clock_id: this.state.changeTargetObj.clock_id}});
                //不重复时进行后续操作
                if (!repeatStatus) {
                    let targetObj = this.state.changeTargetObj;
                    //修改闹钟比添加闹钟需要多传一个闹钟id参数
                    const sendConfig = {
                        ...clockSets,
                        ...{clock_id: targetObj.clock_id}
                    }
                    
                    /**
                     * 如果修改后的闹钟和以前闹钟属于同种类型，则直接替换
                     */
                    const editItem = clockListArr[targetObj.typeIndex]['TimeTypeList'][targetObj.clockIndex];
                    let spliceItem;
                    if (this.state.pickerNameSelectedIndex === targetObj.typeIndex) {
                        clockListArr[targetObj.typeIndex]['TimeTypeList'][targetObj.clockIndex] = {
                            ...localSets,
                            ...sendConfig
                        }
                    } else {
                        /**
                         * 如果修改后的闹钟和以前闹钟属于不同类型，则先删除以前的闹钟，然后添加新的闹钟
                         */
                        spliceItem = clockListArr[targetObj.typeIndex]['TimeTypeList'].splice(targetObj.clockIndex, 1);
                        clockListArr[this.state.pickerNameSelectedIndex]['TimeTypeList'].push({
                            ...localSets,
                            ...sendConfig
                        })
                    }
                    this.getAsyncClock();
                    let clockAsync;
                    try{
                        clockAsync = await this.asyncNative();
                    }catch(err){
                        if (this.state.didUnmount) return;
                        console.log('同步至手环失败');
                    }
                    if(clockAsync&&clockAsync.status == 0){
                        sendConfig.is_sync = 1;
                        let result;
                        try{
                            result = await ClockService.editClock(sendConfig);
                        }catch(err){
                            if (this.state.didUnmount) return;
                            result = null;
                            console.log('添加至服务器失败');
                        }
                        if (this.state.didUnmount) return;
                        if (result&&result.http_code == 200) {
                            this.sortClock();
                        }else{
                            /*
                            修改失败，返回原来的值
                             */
                            if (this.state.pickerNameSelectedIndex === targetObj.typeIndex) {
                                clockListArr[targetObj.typeIndex]['TimeTypeList'][targetObj.clockIndex] = editItem;
                            }else{
                                clockListArr[targetObj.typeIndex]['TimeTypeList'].push(spliceItem[0]);
                                clockListArr[this.state.pickerNameSelectedIndex]['TimeTypeList'].pop();
                            }
                            Alert.alert('网络出错', '修改闹钟失败');
                        }
                    }else{
                        if (this.state.didUnmount) return;
                        if (this.state.pickerNameSelectedIndex === targetObj.typeIndex) {
                            clockListArr[targetObj.typeIndex]['TimeTypeList'][targetObj.clockIndex] = editItem;
                        }else{
                            clockListArr[targetObj.typeIndex]['TimeTypeList'].push(spliceItem[0]);
                            clockListArr[this.state.pickerNameSelectedIndex]['TimeTypeList'].pop();
                        }
                        Alert.alert('同步到手环失败');
                    }
                }else{
                    repeatTips = '已存在此闹钟'
                }
            }
            /**
             * 保存信息，并且重置所有数据
             */
            this.setState({
                clockList: ds.cloneWithRows(clockListArr),
                choseRepeatType: '每周一、二、三、四、五',
                choseRepeatTypeIndex: 0,
                pickerNameSelected: '起床',
                pickerNameSelectedIndex: 0,
                pickerHourSelected: '00',
                pickerMinuteSelected: '00',
                tataolNum: this.state.tataolNum,
            })
            
            //如果闹钟重复，则弹出提示
            if (repeatTips) {
                Alert.alert(repeatTips);
            }
        }
        //判读新添加的闹钟或者修改后的闹钟是否和已存在的 闹钟冲突
        this.preventRepeatClock = (newClock) => {
            //添加失败时，再次添加闹钟，需要重新获取数据，因为添加失败后并没有重新获取
            this.getAsyncClock();
            let repeatStatus = false;
            //不同类型的闹钟是否可以重叠？，目前是不可以重叠 item.type == newClock.type && 
            this.state.asyncClock.forEach(item => { 
                //添加闹钟循环对比所有闹钟，修改闹钟分两种对比：其他闹钟的对比和当前闹钟与自身以前状态的对比。
                if (this.state.changeType === 'change' && newClock.clock_id == item.clock_id) {
                    if (item.time == newClock.time && item.repeat == newClock.repeat && item.type == newClock.type) {
                        repeatStatus = true;
                    }
                }else {
                    if (item.time == newClock.time && (item.repeat == 254 || newClock.repeat == 254 || item.repeat == newClock.repeat)) {
                        repeatStatus = true;
                    }
                }
                
            })
            return repeatStatus;
        }
        //获取同步所需数据并调用同步函数
        this.getAsyncClock = () => {
            this.state.asyncClock = [];
            clockListArr.forEach(item => {
                item['TimeTypeList'].forEach(clockitem => {
                    this.state.asyncClock.push({
                        time: clockitem.time,
                        type: item.type,
                        repeat: parseInt(clockitem.repeat, 2),
                        clock_id: clockitem.clock_id, //闹钟id为了对比闹钟是否重复，不是原生需要的
                    });
                })
            })
        }
        //同步数据，并返回同步信息
        this.asyncNative = async () => {
            if (!this.state.deviceid) {
                this.getUserInfo();
            }
            try{
                const clockAsync = await PaiBandService.syncWriteClock(this.state.deviceid, this.state.cid, this.state.asyncClock);
                return clockAsync
            }catch(err){
                console.log(err);
            }
        }
        /*
        获取蓝牙状态
         */
        this.getBluetoothStatus = async (data) => {
            if (data == 'init') {
                try{
                    const result = await PaiBandService.getBluetoothStatus(this.state.deviceid);
                    this.state.BluetoothStatus = result&&result.status;
                    return result
                }catch(err){
                    console.error(err)
                }
            }else{
                // console.log(data)
                // this.state.BluetoothStatus = 1;
                this.state.BluetoothStatus = data.status;
            }
        }
        /*
        同步数据到paiband后，发送信息给后台
         */
        this.asyncApi = () => {
            clockListArr.forEach((item, index) => {
                item['TimeTypeList'].forEach((clockitem, clockindex) => {
                    /*
                    遍历所有数据，将is_sync为0的数据发送服务器，同时修改is_sync为1
                     */
                    if (clockitem.is_sync == 0) {
                        const clockSets = {
                            clock_id: clockitem.clock_id,
                            cycle: clockitem.cycle,
                            category: clockitem.category,
                            time: clockitem.time,
                            repeat: clockitem.repeat,
                            is_sync: 1,
                        }
                        clockListArr[index]['TimeTypeList'][clockindex].is_sync = 1;
                        ClockService.editClock(clockSets).then(res => {
                            if (res.http_code == 200) {
                                console.log(res)
                            }else{
                                console.log(res)
                            }
                        }).catch(err => {
                            console.log(err)
                            Alert.alert('网络出错', '修改闹钟失败');
                        })
                    }
                })
            })
        }
        /*
        对闹钟进行排序
         */
        this.sortClock = () => {
            let buffClock;
            clockListArr.map(item => {
                for (let i = 0; i < item['TimeTypeList'].length; i++) {
                    let timeoutside = Number(item['TimeTypeList'][i].time.split(':').join(''))
                    for (let j = 0; j < item['TimeTypeList'].length; j++) {
                        let timeinside = Number(item['TimeTypeList'][j].time.split(':').join(''))
                        if (timeoutside < timeinside) {
                            buffClock = item['TimeTypeList'][i];
                            item['TimeTypeList'][i] = item['TimeTypeList'][j];
                            item['TimeTypeList'][j] = buffClock;
                        }
                    }
                }
                return item
            })
        }
        //初始化时获取用户信息
        this.getUserInfo = () => {
            this.state.cid = db.get('cid');
            this.state.deviceid = UserSerivice.getDeviceID(this.state.cid);
        }
    }


    componentDidMount() {
        this.initData();
        this.getUserInfo();
        this.getBluetoothStatus('init');
        this.addSubscriber(ServiceNotice.PAIBAND_SERVICE_BLUETOOTHSTATUS, this.getBluetoothStatus)
    }

    componentWillUnmount(){
        this.removeSubscriber(ServiceNotice.PAIBAND_SERVICE_BLUETOOTHSTATUS, this.getBluetoothStatus);
        clearInterval(this.timer);
        this.state.didUnmount = true;
    }
    render() {

        /**
         * 当tataolNum不为空且为0时，说明已成功获取数据且数据为空
         */
        let HasNoClocks = null;
        if (this.state.tataolNum !== null && this.state.tataolNum == 0) {
            HasNoClocks = <View style={styles.emptyTip}>
                <Image source={require('PaiBandRN/res/images/clock_empty_tip.png')} style={styles.emptyTipImg}/>
                <Text style={styles.emptyTipText}>点击添加按钮可以新建一个闹钟</Text>
            </View>
        }
        

        /**
         * 是否显示闹钟数量达到上限提示框
         * 
         */
        let maxNumberWarn = null;
        if (this.state.showMaxWarn) {
            maxNumberWarn = <Animated.View style={[styles.maxWarnContainer,{transform: [{translateY: this.state.decayValue}]}]}>
                    <View style={[styles.maxWarnContent]}>
                        <Text style={[styles.warnText, styles.warnTextHeader]}>闹钟数量已达到上限</Text>
                        <Text style={styles.warnText}>请删除一些闹钟再尝试添加新闹钟</Text>
                    </View>
                </Animated.View>
        }
        return (
            <View style={styles.setClockContainer}>
                {HasNoClocks}
                {/*加载所有信息，只有TimeTypeList不为空的闹钟设置才显示*/}
                <ListView
                    dataSource={this.state.clockList}
                    style={styles.clockListView}
                    renderRow={(rowData, sectionID, rowID) => {
                        let ListViewDom = null;
                        if (rowData.TimeTypeList.length) {
                            ListViewDom = (<View style={styles.ListViewSection}>
                                <View style={styles.ViewSectionHeader}>
                                    <Image source={rowData.imgPath} style={styles.SectionHeaderImg}/>
                                    <Text style={styles.SectionHeaderTitle}>{rowData.title}</Text>
                                </View>
                                <View style={styles.clockDetailContainer}>
                                    {
                                        rowData.TimeTypeList.map((item, index) => {
                                            return <View key={index} style={[styles.clockDetailItem, {borderBottomWidth: (rowData.TimeTypeList.length - 1) == index? 0: 1}]}>
                                                <View style={styles.DetailItemLeft}>
                                                    <Text style={styles.clockTime}>{item.hour} : {item.minute}</Text>
                                                    <Text style={styles.repeatType}>{item.repeatType}</Text>
                                                </View>
                                                <TouchableOpacity onPress={this.selecteditType.bind(this, rowID, index)} style={styles.DetailItemRight}>
                                                    <Svg 
                                                    height="32"
                                                    width='40'>
                                                        <Circle
                                                        cx={15}
                                                        cy={19}
                                                        r="2"
                                                        fill="#c2c2c2"/>
                                                        <Circle
                                                        cx={22}
                                                        cy={19}
                                                        r="2"
                                                        fill="#c2c2c2"/>
                                                        <Circle
                                                        cx={29}
                                                        cy={19}
                                                        r="2"
                                                        fill="#c2c2c2"/>
                                                    </Svg>
                                                </TouchableOpacity>
                                            </View>
                                        })
                                    }
                                </View>
                            </View>)
                        }
                        return ListViewDom
                    } 
                  }
                />
                {/*编辑已存在的闹钟*/}
                <Animated.View style={[styles.selectAction, {transform: [{translateY: this.state.chooseMove}]}]}>
                    <TouchableOpacity style={[styles.selectCommonType, styles.selectEdit]} onPress={this.selectChangeClock}>
                        <View style={[styles.selectViewCommon]}>
                            <Text style={[styles.selectTextCommon]}>修改</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.selectCommonType, styles.selectDelete]} onPress={this.selectEditDelete}>
                        <View style={styles.selectViewCommon}>
                            <Text style={[styles.selectTextCommon, styles.textDelete]}>删除</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.selectCommonType, styles.selectCancel]} onPress={this.selectEditCancel}>
                        <View style={styles.selectViewCommon}>
                            <Text style={[styles.selectTextCommon]}>取消</Text>
                        </View>
                    </TouchableOpacity>
                </Animated.View>
                {/*添加编辑闹钟页面*/}
                <Animated.View style={[styles.editPageContainer,{transform: [{translateY: this.state.editPageMove}]}]}>
                    <View style={styles.editPageTextContainer}>
                        <View style={styles.editPageTitle}>
                            <Text style={styles.cancelEdit} onPress={this.cancelEdit}>取消</Text>
                            <TouchableOpacity style={styles.saveEdit} onPress={this.saveEdit}>
                                <Text style={styles.saveEditText}>保存</Text>
                            </TouchableOpacity>
                        </View>
                        <Text style={styles.clockTitleStyle}>闹钟时间</Text>
                        <TouchableOpacity onPress={this.showPickerOption}>
                            <View style={[styles.editTextContainer, styles.editTextTimeContainer]}>
                                <Text style={[styles.editTextStyle]}>{this.state.pickerNameSelected}，{this.state.pickerHourSelected} : {this.state.pickerMinuteSelected}</Text>
                                <Image source={require('PaiBandRN/res/images/btn_arrow_down.png')}/>
                            </View>
                        </TouchableOpacity>
                        <Text style={styles.clockTitleStyle}>重复</Text>
                        <View style={[styles.editTextContainer, styles.editTextRepeatContainer]}>
                            {
                                this.state.repeatType.length > 0? this.state.repeatType.map((item,index) => {
                                    return <TouchableOpacity onPress={this.chooseRepeatType.bind(this,index)} key={index} >
                                    <View style={[styles.editTextItem]}>
                                        <Text style={[styles.editTextStyle, styles.editRepeatType]}>{item}</Text>
                                        {
                                            this.state.choseRepeatTypeIndex == index ? <Image source={require('PaiBandRN/res/images/icon_20_13.png')} style={styles.repeatImg}/> : null
                                        }
                                    </View>
                                </TouchableOpacity>
                            }):null
                            }
                            
                        </View>
                    </View>
                    {/*闹钟选择器*/}
                    <Animated.View style={[styles.pickerCover,{transform: [{translateY: this.state.pickerMove}]}]}>
                        <View style={styles.pickerContainer}>
                            <View style={styles.pickerTitle}>
                                <Text style={styles.pickerTitleText} onPress={this.cancelPicker}>取消</Text>
                                <Text style={[styles.pickerTitleText, {fontWeight: 'bold'}]} onPress={this.savePicker}>保存</Text>
                            </View>
                            <View style={styles.pickerSection}>
                                {/*种类*/}
                                <Picker
                                    selectedValue={this.state.pickerNameSelected}
                                    onValueChange={(itemValue, itemPosition) => this.setState({pickerNameSelected: itemValue, pickerNameSelectedIndex: itemPosition})
                                    } 
                                    style={styles.pickerList}>
                                    {
                                        this.state.pickerName.map((item, index) => {
                                            return <Picker.Item style={styles.pickerItem} label={item} value={item} key={index} />
                                        })
                                    }
                                </Picker>
                                <Picker
                                    selectedValue={this.state.pickerHourSelected}
                                    onValueChange={(itemValue) => this.setState({pickerHourSelected: itemValue})}
                                    style={styles.pickerList}>
                                    {
                                        this.state.pickerHour.map((item, index) => {
                                            return <Picker.Item style={styles.pickerItem} label={item} value={item} key={index} />
                                        })
                                    }
                                </Picker>
                                <Picker
                                    selectedValue={this.state.pickerMinuteSelected}
                                    onValueChange={(itemValue) => this.setState({pickerMinuteSelected: itemValue})}
                                    style={styles.pickerList}>
                                    {
                                        this.state.pickerMinute.map((item, index) => {
                                            return <Picker.Item style={styles.pickerItem} label={item} value={item} key={index} />
                                        })
                                    }
                                </Picker>
                            </View>
                        </View>
                    </Animated.View>
                </Animated.View>
                {/* 底部添加闹钟 */}
                <View style={styles.addFooter}>
                    <Text style={styles.FooterLeft}>闹钟个数 {this.state.tataolNum||0} / {this.state.maxNum}</Text>
                    <TouchableOpacity 
                        style={styles.FooterRight} 
                       
                        onPress={this.showEditPage}
                    >
                        <View style={this.state.tataolNum < this.state.maxNum? styles.FooterRightTextContainer:styles.FooterRightMax}>
                            <Text style={styles.FooterRightText}>添加闹钟</Text>
                        </View>
                    </TouchableOpacity>
                    
                </View>
                {maxNumberWarn}
            </View>
        )
    }
}

