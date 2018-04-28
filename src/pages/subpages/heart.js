import React from 'react';
import {Text, View , Image, Dimensions, Modal, TouchableOpacity, ScrollView, Alert, AppState} from 'react-native';
import Svg,{Circle, G, Line, Path, Rect} from 'react-native-svg';
import {Text as SvgText} from 'react-native-svg';
import styles from 'PaiBandRN/src/style/heartStyle';
import StylesCommon from 'PaiBandRN/src/style/common';
import PageNotice from 'PaiBandRN/src/notice/page';
import heartService from 'PaiBandRN/src/services/heart';
import UserSerivice from 'PaiBandRN/src/services/user';
import PaiBandService from 'PaiBandRN/src/services/paiband';
import heartclockService from 'PaiBandRN/src/services/heartclock';
import IComponent from 'PaiBandRN/src/components/icomponent';
import ServiceNotice from 'PaiBandRN/src/notice/service';
import SportCricle from 'PaiBandRN/src/components/sport/sportcricle';
import Calendar from 'PaiBandRN/src/components/calendar/index';
import RateShow from 'PaiBandRN/src/components/heart/rateShow';
import db from 'PaiBandRN/src/dbs/hashmap';

const windowWidth = Dimensions.get('window').width;
const excu = 40 * windowWidth/414;
const leftexcu = 2 * windowWidth/414;
const xscale = (windowWidth - 40 - excu)/24;
const day_cn = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
const day_en = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default class Heart extends IComponent {
    allHeartLog = null; //所有数据
    lastRecord = {}; //最近一次的数据
    deviceid = null; //设备id
    cid = null; //孩子id
    BluetoothStatus = null; //蓝牙状态
    didUnmount = false; //解决组件卸载与异步请求冲突的bug
    lastTestTime = null;

    state = {
        calendarPop: false, //日历显示
        modalVisible: false,//控制遮罩层是否显示
        AlertVisible: false, // 是否显示弹出框
        timingHeartLog: [], //定时测数据
        handHeartLog: [], //手动测数据
        timeSelected: null, //当前选择的日期
        testPercent: 0, //测试心率进度
        testData: null, //测试后返回的数据
        testSuccess: false, //测试是否成功，决定alert弹出框的样式
        eventDates: [], //可选日期
    }
    
    constructor(props){
        super(props);

    }

    /*
    获取数据和选择日期后，在所有心率数据中提取出当天的记录
     */
    _onDateSelect = (date) => {
        let timinglogArr = [];
        let handlogArr = [];
        const transformDate = [
            date.getFullYear(), 
            ('0'+ (date.getMonth() + 1)).substr(-2), 
            ('0'+ date.getDate()).substr(-2)
        ].join('-');

        if (this.allHeartLog) {
            this.allHeartLog.forEach(item => {
                if (item.time.indexOf(transformDate) !== -1) {
                    item.xlocation = this._formateTime(item.time)
                    if (item.status == 3) {
                        timinglogArr.push(item)
                    }else if (item.status == 4) {
                        handlogArr.push(item)
                    }
                }
            })
        }
        this.setState({
            timeSelected: transformDate,
            timingHeartLog: timinglogArr,
            handHeartLog: handlogArr,
            calendarPop: false,
            modalVisible: false,
        })
    }

    /*
    初始化时间，按照24小时比例获取x轴位置
     */
    _formateTime(time){
        const exactTimeArr = time.split(' ')[1].split(':');
        const allTime = exactTimeArr[0]*3600 + exactTimeArr[1]*60 + parseInt(exactTimeArr[1]);
        let xlocation = (allTime/86400)*(windowWidth - 40 - excu) + excu/2 - leftexcu;
        // if (xlocation < 2) {
        //     xlocation = 2;
        // }else if(xlocation > (windowWidth - 40) - 2){
        //     xlocation = (windowWidth - 40) - 2;
        // }
        return xlocation
    }


    /*
    测试心率计时
     */
    _testHeart = async() => {
        if (new Date() - this.lastTestTime < 5000) {
            Alert.alert(this.i18n('heart_test_frequent')); 
            return
        }
        if (!this.deviceid || this.BluetoothStatus == null) {
            this._getUserInfo();
            await this._getBluetoothStatus('init');
        }
        if (this.state.AlertVisible) {
            this.setState({
                AlertVisible: false,
                testPercent: 0,
                testData: null,
            })
        }
        if (this.state.testPercent !== 0) {
            return
        }

        switch(this.BluetoothStatus){
            case null: 
                Alert.alert(this.i18n('common_bluetooth_status1')); 
                this._clearAll();
                return;
            case 0: 
                Alert.alert(this.i18n('common_bluetooth_status2')); 
                this._clearAll();
            return;
            case 2: 
                Alert.alert(this.i18n('common_bluetooth_status3')); 
                this._clearAll();
                return;
            case 3: 
                Alert.alert(this.i18n('common_bluetooth_status4')); 
                this._clearAll();
                return;
        }

        //如果deviceid 为underfind，再次获取
        if (!this.deviceid) {
            this._getUserInfo();
        }
        /*
        测试时间为30秒，返回数据则弹出提示，否则超过1分钟提示失败
         */
        PaiBandService.determineHeartRate(this.deviceid, this.cid).then(res => {
            if (this.didUnmount) return;
            this.lastTestTime = new Date().getTime();
            if (res&&res.status == 0) {
                clearInterval(this.timer);
                clearInterval(this.failedTime);
                this.lastRecord = {rate: res.heart_rate};
                this.setState({
                    testPercent: 100,
                    AlertVisible: true,
                    testSuccess: true,
                    testData: res,
                })
                this._postTestHeartRate(res.heart_rate);
            }else{
                clearInterval(this.timer);
                clearInterval(this.failedTime);
                this.setState({
                    testPercent: 0,
                    AlertVisible: true,
                    testSuccess: false,
                    testData: {},
                })
            }
            console.log(res)
        }).catch(err => {
            if (this.didUnmount) return;
            this.lastTestTime = new Date().getTime();
            clearInterval(this.timer);
            clearInterval(this.failedTime);
            this.setState({
                testPercent: 0,
                AlertVisible: true,
                testSuccess: false,
                testData: {},
            })
        })

        this._keepTiming();
    }

    _keepTiming(){
        clearInterval(this.timer);
        /*
        心率计时，间隔30毫秒，执行1000次，共30s，每次百分比增加0.1
         */
        this.timer = setInterval(() => {
            if (this.state.testPercent > 98) {
                clearInterval(this.timer);
                this._failedTestHeart();
            }
            this.setState({testPercent: this.state.testPercent + 0.1})
        }, 30)
    }

    /*
    当30秒后结束后，再过10秒仍未获取数据则报错
     */
    _failedTestHeart(){
        clearInterval(this.failedTime);
        let count = 0;
        this.failedTime = setInterval(() => {
            count ++ ;
            if (count > 10) {
                clearInterval(this.failedTime);
                if (!this.state.testData) {
                    this.setState({
                        testPercent: 0,
                        AlertVisible: true,
                        testSuccess: false,
                    })
                }
            }
        }, 1000)
    }

    _clearAll(){
        clearInterval(this.failedTime);
        clearInterval(this.timer);
        this.setState({
            testPercent: 0,
            AlertVisible: false,
            testSuccess: false,
        })
    }
    /*
    关闭弹出框
     */
    _colseAlert = () => {
        this.setState({
            AlertVisible: false,
            testPercent: 0,
            testData: null,
        })
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
                console.log('获取蓝牙状态失败');
            }
        }else{
            this.BluetoothStatus = data.status;
        }
    }

    _initData(){
         /*
        获取所有心率记录
         */
        heartService.getHeartTestRecord().then(res => {
            console.log('获取到的心率数据', res)
            if (this.didUnmount) return;
            if (res.http_code == 200) {
                if ((res.data.list instanceof Array) && res.data.list.length) {
                    this.allHeartLog = res.data.list;
                    this.lastRecord = this.allHeartLog[0];
                    this._getLocalTime();   
                    this._initEventDates();
                }else{
                    this.allHeartLog = [];
                    this.lastRecord = {empty: true};
                }
                this._onDateSelect(new Date());
            }else{
                this.allHeartLog = [];
                this.lastRecord = {empty: true};
                this._onDateSelect(new Date());
                console.log('获取心率数据失败');
            }
        }).catch(err => {
            if (this.didUnmount) return;
            console.log('获取心率数据失败')
            Alert.alert(this.i18n('common_net_disconnect'), this.i18n('heart_tip_failedGetData'));
        });
        
        // const res = {
        //     "http_code": 200,
        //     "data":
        //     {
        //         "list":
        //         [
        //             {
        //                 "time": "2017-07-24 10:31:23", //测试时间
        //                 "rate": "80",//心率
        //                 "status": 3, //3:定时心率；4：自测心率
        //                 "utime": 1500863483 //time字段对应的时间戳
        //             },
        //             {
        //                 "time": "2017-07-24 09:33:11", //测试时间
        //                 "rate": "70",//心率
        //                 "status": 4, //3:定时心率；4：自测心率
        //                 "utime": 1500859991 //time字段对应的时间戳
        //             },
        //             {
        //                 "time": "2017-07-24 12:00:00", //测试时间
        //                 "rate": "90",//心率
        //                 "status": 4, //3:定时心率；4：自测心率
        //                 "utime": 1500868800 //time字段对应的时间戳
        //             },
        //         ]
        //     }
        // }
        // this.allHeartLog = res.data.list || [];
        // this.lastRecord = this.allHeartLog[0]||{empty: true};
        // this._getLocalTime();  
        // this._initEventDates();
        // this._onDateSelect(new Date());
    }

    //计算需要显示的日期
    _initEventDates(){
        let dateArr = [];
        this.allHeartLog.forEach(item => {
            const date = item.time.split(' ')[0];
            if (!dateArr.includes(date)) {
                dateArr.push(date)
            }
        })
        this.setState({
            eventDates: dateArr
        })
    }
    //由于返回的时间戳时本地时间而不是utc时间，导致时间不准，暂时先用时间戳获取正确的时间。但是返回的数据是有问题的。
    _getLocalTime(){
        this.allHeartLog.map(item => {
            if (item.status == 3) {
                const d = new Date(item.utime*1000);
                const date = [d.getFullYear(),  ('0' + (d.getMonth() + 1)).substr(-2), ('0' + d.getDate()).substr(-2)].join('-');
                const time = [('0' + d.getHours()).substr(-2),  ('0' + d.getMinutes()).substr(-2), ('0' + d.getSeconds()).substr(-2)].join(':');
                // let time = '15:00'
                item.time = date + ' ' + time;
                return item
            }
        })
    }

    //手动测结果发给后台
    _postTestHeartRate(rate){
        let data =  {
            "heart_rate_data":
            [
                {
                    "collect_time": this.gettimestamp(),
                    "heart_rate":rate,  
                    "status":4,  
                }
            ]
        }
        data = JSON.stringify(data);
        heartService.postTestHeartRate(this.deviceid, data).then(res => {
            if (this.didUnmount) return;
            console.log('提交测试心理数据成功', res)
            this._initData()
        }).catch(err => {
            if (this.didUnmount) return;
            Alert.alert(this.i18n('common_net_disconnect'), this.i18n('heart_tip_failedGetData'));
        });
    }

    //关闭日历组件
    _setModalVisible(visible) {
            this.setState({
            modalVisible: visible,
            calendarPop: visible,
        });
    }
    //开启日历组件
    calendarInfo(){
        if (this.state.testPercent !== 0) {
            return
        }
        this.setState({
            modalVisible: true,
            calendarPop: true,
        });
    }
    /**
     * 跳转定时测设置页
     */
    _goHeartSet = () => {
        this.sendNotification(PageNotice.PAGE_SELECT_SUBPAGE, {
            title: this.i18n('heart_link_clock'),
            name: 'heartSet',
        });
    }
    //监听App变化
    _handlerAppStateChange = () => {
        console.log('APP的状态发生了变化，当前的状态是', AppState.currentState)
        if (AppState.currentState !== 'active') {
            if(this.state.testPercent!==0 && this.state.testPercent!==100){
                this._keepTiming();
            }
        }

        // if (this.state.AlertVisible && !this.state.testSuccess) {
        //     this._clearAll();
        // }
    }

    componentWillMount() {
       
    }
    componentDidMount() {
        this._getUserInfo();
        this._getBluetoothStatus('init');
        this.addSubscriber(ServiceNotice.PAIBAND_SERVICE_BLUETOOTHSTATUS, this._getBluetoothStatus)
        this._initData();
        AppState.addEventListener('change', this._handlerAppStateChange);
        
    }
    componentWillReceiveProps(nextProps) {
      
    }

    componentWillUnmount() {
        console.log('组件将要被卸载')
        this.removeSubscriber(ServiceNotice.PAIBAND_SERVICE_BLUETOOTHSTATUS, this._getBluetoothStatus)
        AppState.removeEventListener('change', this._handlerAppStateChange);
        clearInterval(this.timer);
        clearInterval(this.failedTime);
        this.didUnmount = true;
    }
    render() {
        let calendarContent = null;
        if(this.state.calendarPop == true){
            calendarContent = <Calendar eventDates={this.state.eventDates} hideAnalysis={true} onDateSelect={this._onDateSelect} selectedDate={this.state.timeSelected} onDateChange={(date) => {}}/>;
        }
        let showSelectDate;
        if(this.state.timeSelected) {
            showSelectDate = this.state.timeSelected.split('-');
        } else {
            const d = new Date();
            showSelectDate = [d.getFullYear(),  ('0' + (d.getMonth() + 1)).substr(-2), ('0' + d.getDate()).substr(-2)];
        }
        let weekDay = new Date(this.state.timeSelected).getDay();
        if (this.i18nLang == 'en') {
            weekDay = day_en[weekDay]
        }else{
            weekDay = day_cn[weekDay]
        }

        if(this.i18nLang == 'en') {
            showSelectDate.push(showSelectDate.shift());
            const customMonthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May','Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            showSelectDate[0] = customMonthNames[Number(showSelectDate[0]) - 1];
            showSelectDate = `${showSelectDate[0]} ${Number(showSelectDate[1])}, ${showSelectDate[2]}`;
        } else {
            showSelectDate = showSelectDate.join('-');
        }
        return (
            <View style={styles.heartContainer}>
                <ScrollView style={styles.scrollViewStyle}>
                    {/*设置弹窗*/}
                    <Modal
                    animationType = {'fade'}
                    transparent={true}
                    visible={this.state.modalVisible}
                    onRequestClose={() => {this._setModalVisible.bind(this, false)}}>
                        <View style={styles.mark}>
                            <TouchableOpacity style={styles.mark} onPress={this._setModalVisible.bind(this, false)}></TouchableOpacity>
                        </View>
                        {calendarContent}
                    </Modal>
                    {/*自定义Alert弹出层*/}
                    <Modal
                    animationType = {'fade'}
                    transparent={true}
                    visible={this.state.AlertVisible}
                    onRequestClose={() => {this._colseAlert.bind(this, false)}}>
                        <View style={styles.alertView}>
                            <View style={styles.alertContainer}>
                                <View style={styles.headerTextContainer}>
                                {
                                    this.state.testSuccess ? <View>
                                        <Text style={styles.alertTitle}>{this.i18n('heart_tip_testResult')}：{this.state.testData&&this.state.testData.heart_rate||0} {this.i18n('heart_unit_result')}</Text>
                                        {
                                            // <Text style={styles.alertTip}>{this.i18n('heart_tip_range')}：50-100 {this.i18n('heart_unit_result')}</Text>
                                        }
                                    </View>:<Text style={styles.alertTitle}>{this.i18n('heart_tip_testFailed')}</Text>
                                }
                                </View>
                                <View style={styles.confirmContainer}>
                                {
                                    this.state.testSuccess ? <TouchableOpacity style={styles.conirmOpacity} onPress={this._colseAlert}>
                                        <Text style={[styles.confirm, styles.confirmTextStyle]}>{this.i18n('btn_name_ok')}</Text>
                                    </TouchableOpacity>:
                                    <View style={styles.failed}>
                                        <View style={[styles.failedOpacity, styles.cancled]}>
                                            <TouchableOpacity onPress={this._colseAlert}>
                                                <Text style={[styles.confirmTextStyle]}>{this.i18n('btn_name_cancel')}</Text>
                                            </TouchableOpacity>
                                        </View>
                                        <TouchableOpacity style={styles.failedOpacity} onPress={this._testHeart}>
                                            <Text style={[styles.confirmTextStyle]}>{this.i18n('heart_btn_retest')}</Text>
                                        </TouchableOpacity>        
                                    </View>  
                                }
                                </View>
                            </View>
                        </View>
                    </Modal>
                    {/*测试弹框*/}
                    <Modal
                    animationType = {'fade'}
                    transparent={true}
                    onRequestClose={() => {}}
                    visible={this.state.testPercent!==0 && this.state.testPercent!==100}>   
                        <View style={styles.MOdelCover}>
                            <View style={[styles.testAlert, StylesCommon.common_card]}>
                                <SportCricle rotate = {"180deg"} radius={80} percent={this.state.testPercent} borderWidth={8} innerColor={"#F9F9F9"} color={"#ef5361"}/>
                                <Text style={styles.testAlertText}>{this.i18n('heart_tip_testing')}</Text>
                                <View style={styles.TestImgContiner}>
                                    <Image style={styles.heartTestImg} source={require('PaiBandRN/res/images/heartrate_img.png')}></Image>
                                </View>
                            </View>
                        </View>
                    </Modal>
                    {/*头部*/}
                    <View style={[styles.heartTopWrap, StylesCommon.common_card]}>
                        <TouchableOpacity onPress = {this.calendarInfo.bind(this)}>
                            <View style={styles.heartTopDateWrap}>
                                <Image source={require('PaiBandRN/res/images/calendar_red_icon_n.png')}/>
                                <Text style={styles.heartTopDateText}>{showSelectDate}</Text>
                            </View>
                        </TouchableOpacity>
                        <View>
                            <TouchableOpacity onPress={this._testHeart} style={styles.headCenter}>
                                <Image style={styles.heartImg} source={require('PaiBandRN/res/images/heartrate_img.png')}></Image>
                            </TouchableOpacity>
                            <View style={styles.heartTestView}>
                                <Text style={styles.heartTestText}>{this.i18n('heart_btn_test')}</Text>
                            </View>
                            <View style={styles.lastRecordView}>
                                <Text style={styles.lastRecordText}>{this.i18n('heart_tip_lastResult')}</Text>
                                <Text style={styles.lastRecordText}>{this.lastRecord.empty || !this.lastRecord.rate? this.i18n('data_status_empty') : this.lastRecord.rate + this.i18n('heart_unit_result')}</Text>
                            </View>
                        </View>
                    </View>
                    <RateShow 
                        allHeartLog={this.allHeartLog} 
                        timingHeartLog={this.state.timingHeartLog}
                        handHeartLog={this.state.handHeartLog}
                        xscale={xscale}
                        excu={excu}
                        leftexcu={leftexcu}
                        weekDay={weekDay}
                    />
                    {/*跳转定时测设置页面*/}
                    <TouchableOpacity onPress={this._goHeartSet}>
                        <View style={[styles.setClock, StylesCommon.common_card]}>
                            <Text style={styles.setClockText}>{this.i18n('heart_link_clock')}</Text>
                            <Image source={require('PaiBandRN/res/images/btn_arrow_g.png')}/>
                        </View>
                    </TouchableOpacity>
                </ScrollView>
            </View>
        );
    }
}
