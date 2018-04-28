import React from 'react';
import {
    StyleSheet, View, ListView, ScrollView, Text, Dimensions
} from 'react-native';

import jutils from 'jutils';

import IComponent from 'PaiBandRN/src/components/icomponent';
import COMNotice from 'PaiBandRN/src/notice/component';
import PageNotice from 'PaiBandRN/src/notice/page';
import ServiceNotice from 'PaiBandRN/src/notice/service';

import IconButton from 'PaiBandRN/src/components/icon-button';

import userService from 'PaiBandRN/src/services/user';
import paibandService from 'PaiBandRN/src/services/paiband';

import db from 'PaiBandRN/src/dbs/hashmap';

const {width, height} = Dimensions.get('window');

//---------------------class-----------------------
class Test extends IComponent {
    constructor(props) {
        super(props);

        this.state = {
            result: 'result',
            send: 'send',
            listen: 'listen',
            menuList: [
                { 'title': 't系统信息' },
                { 'title': 't安全距离' },
                { 'title': 't获取IP' },
                { 'title': 't写入身高' },
                { 'title': 't写入体重' },
                { 'title': 't抬腕亮屏' },
                { 'title': 't小红花' },
                { 'title': 't保存二维码' },
                { 'title': 't蓝牙状态' },
                { 'title': 't打开蓝牙' },
                { 'title': 't测量心率' },
                { 'title': 't打开通知' },
                { 'title': 't同步闹钟' },
                { 'title': 't心率时钟' }
            ]
        };
        this.init();
    }

    init() {
        this.addSubscriber(COMNotice.ICONBUTTON_CLICK, this._funcSelectHandler);

        this.addSubscriber(ServiceNotice.PAIBAND_SERVICE_BLUETOOTHSTATUS, this._bluetoothStatusChangeHandler);
        this.addSubscriber(ServiceNotice.PAIBAND_SERVICE_APPAWAKEN, this._appAwakenHandler);
    }

    update() {
    }

    _funcSelectHandler(title) {
        switch(title) {
            case 't系统信息':
                this._testSystemInfo();
                break;
            case 't安全距离':
                this._testSecurityStatus();
                break;
            case 't获取IP':
                this._testGetIP();
                break;
            case 't写入身高':
                this._testWriteHeight();
                break;
            case 't写入体重':
                this._testWriteWeight();
                break;
            case 't抬腕亮屏':
                this._testBrightScreen();
                break;
            case 't小红花':
                this._testFlowers();
                break;
            case 't保存二维码':
                this._testSaveQCode();
                break;
            case 't蓝牙状态':
                this._testBluetoothStatus();
                break;
            case 't打开蓝牙':
                this._testOpenBluetooth();
                break;
            case 't测量心率':
                this._testDetermineHeartRate();
                break;
            case 't打开通知':
                this._testOpenNotification();
                break;
            case 't同步闹钟':
                this._testWriteClock();
                break;
            case 't心率时钟':
                this._testWriteHeartClock();
                break;
        }
    }

    _testSystemInfo() {
        const cid = db.get('cid');
        const deviceid = userService.getDeviceID(cid);
        const requestid = jutils.makeSimpleGUID();
        this._printSend({
            type: 'system-info',
            data: {
                request_id: requestid,
                device_id: deviceid
            }
        });
        paibandService.getSystemInfo(deviceid).then(data => {
            this._printResult({
                type: 'system-info',
                data: data
            });
        }).catch(error => {
            console.log(error);
        });
    }

    _testSecurityStatus() {
        const status = Math.random() < 0.5;
        const requestid = jutils.makeSimpleGUID();
        this._printSend({
            type: 'out-safeDistance',
            data: {
                request_id: requestid,
                status: status
            }
        });
        paibandService.syncWriteSecurity(status).then(data => {
            this._printResult({
                type: 'out-safeDistance',
                data: data
            });
        }).catch(error => {
            console.log(error);
        });
    }

    _testGetIP() {
        this._printSend({
            type: 'get-ip',
            data: { }
        });
        paibandService.getClientIP().then(data => {
            this._printResult({
                type: 'get-ip',
                data: data
            });
        }).catch(error => {
            console.log(error);
        });
    }

    _testWriteHeight() {
        const cid = db.get('cid');
        const height = parseInt((Math.random() * 180));
        const requestid = jutils.makeSimpleGUID();
        this._printSend({
            type: 'update-height',
            data: {
                request_id: requestid,
                cid: cid,
                height: height
            }
        });
        paibandService.syncWriteHeight(cid, height, requestid).then(data => {
            this._printResult({
                type: 'update-height',
                data: data
            });
        }).catch(error => {
            console.log(error);
        });
    }

    _testWriteWeight() {
        const cid = db.get('cid');
        const weight = parseInt((30 + Math.random() * 70));
        const requestid = jutils.makeSimpleGUID();
        this._printSend({
            type: 'update-weight',
            data: {
                request_id: requestid,
                cid: cid,
                weight: weight
            }
        });
        paibandService.syncWriteWeight(cid, weight, requestid).then(data => {
            this._printResult({
                type: 'update-weight',
                data: data
            });
        }).catch(error => {
            console.log(error);
        });
    }

    _testBrightScreen() {
        const cid = db.get('cid');
        const deviceid = userService.getDeviceID(cid);
        const begin_h = parseInt(Math.random() * 12);
        const begin_m = parseInt(Math.random() * 60);
        const end_h = parseInt(12 + Math.random() * 12);
        const end_m = parseInt(Math.random() * 60);
        const close = Math.random < 0.5;
        const requestid = jutils.makeSimpleGUID();
        this._printSend({
            type: 'bright-screen',
            data: {
                request_id: requestid,
                device_id: deviceid,
                begin_hour: begin_h,
                begin_minute: begin_m,
                end_hour: end_h,
                end_minute: end_m,
                close: close
            }
        });
        paibandService.syncWriteBrightScreen(deviceid, {
            begin_hour: begin_h,
            begin_minute: begin_m,
            end_hour: end_h,
            end_minute: end_m,
            close: close
        }, requestid).then(data => {
            this._printResult({
                type: 'bright-screen',
                data: data
            });
        }).catch(error => {
            console.log(error);
        });
    }

    _testFlowers() {
        const cid = db.get('cid');
        const deviceid = userService.getDeviceID(cid);
        const cur_num = parseInt(12 + Math.random() * 12);
        const num = parseInt(1 + Math.random() * 3);
        const action = Math.random < 0.5 ? 'add_num' : 'minus_num';
        const requestid = jutils.makeSimpleGUID();
        this._printSend({
            type: 'flowers',
            data: {
                request_id: requestid,
                device_id: deviceid,
                current_num: cur_num,
                num_info: num,
                action: action
            }
        });
        paibandService.syncWriteFlowers(deviceid, {
            current_num: cur_num,
            num_info: num,
            action: action
        }, requestid).then(data => {
            this._printResult({
                type: 'flowers',
                data: data
            });
        }).catch(error => {
            console.log(error);
        });
    }

    _testSaveQCode() {
        this._printSend({
            type: 'save-pic',
            data: { }
        });
        paibandService.saveQCodePic().then(data => {
            this._printResult({
                type: 'save-pic',
                data: data
            });
        }).catch(error => {
            console.log(error);
        });
    }

    _testBluetoothStatus() {
        const cid = db.get('cid');
        const deviceid = userService.getDeviceID(cid);
        const requestid = jutils.makeSimpleGUID();
        this._printSend({
            type: 'bluetooth-status',
            data: {
                request_id: requestid,
                device_id: deviceid
            }
        });
        paibandService.getBluetoothStatus(deviceid, requestid).then(data => {
            this._printResult({
                type: 'bluetooth-status',
                data: data
            });
        }).catch(error => {
            console.log(error);
        });
    }

    _testOpenBluetooth() {
        const requestid = jutils.makeSimpleGUID();
        this._printSend({
            type: 'bluetooth-open',
            data: {
                request_id: requestid
            }
        });
        paibandService.openBluetoothSetting(requestid).then(data => {
            this._printResult({
                type: 'bluetooth-open',
                data: data
            });
        }).catch(error => {
            console.log(error);
        });
    }

    _testDetermineHeartRate() {
        const cid = db.get('cid');
        const deviceid = userService.getDeviceID(cid);
        const requestid = jutils.makeSimpleGUID();
        this._printSend({
            type: 'heartrate-determine',
            data: {
                request_id: requestid,
                device_id: deviceid,
                cid: cid
            }
        });
        paibandService.determineHeartRate(deviceid, cid, requestid).then(data => {
            this._printResult({
                type: 'heartrate-determine',
                data: data
            });
        }).catch(error => {
            console.log(error);
        });
    }

    _testOpenNotification() {
        const requestid = jutils.makeSimpleGUID();
        this._printSend({
            type: 'notification-open',
            data: {
                request_id: requestid
            }
        });
        paibandService.openNotification(requestid).then(data => {
            this._printResult({
                type: 'notification-open',
                data: data
            });
        }).catch(error => {
            console.log(error);
        });
    }

    _testWriteClock() {
        const cid = db.get('cid');
        const deviceid = userService.getDeviceID(cid);
        const requestid = jutils.makeSimpleGUID();
        const len = parseInt(Math.random() * 6);
        const arr = [];
        for(let i = 0; i < len; i++) {
            arr.push({
                time: parseInt(Math.random() * 24) + ':' + parseInt(Math.random() * 60),
                type: ['getup', 'study', 'motion', 'sleep', 'other'][parseInt(Math.random() * 5)],
                repeat: parseInt((() => {
                    let a = '';
                    for(let i = 0; i < 7; i++) {
                        a += Math.random() < 0.5 ? '0' : '1';
                    }
                    return a + '0';
                })(), 2)
            });
        }
        this._printSend({
            type: 'bluetooth-sync',
            data: {
                request_id: requestid,
                device_id: deviceid,
                cid: cid,
                sync_type: 'write',
                data_type: 'clock',
                clock: arr
            }
        });
        paibandService.syncWriteClock(deviceid, cid, arr, requestid).then(data => {
            this._printResult({
                type: 'bluetooth-sync',
                data: data
            });
        }).catch(error => {
            console.log(error);
        });
    }

    _testWriteHeartClock() {
        const cid = db.get('cid');
        const deviceid = userService.getDeviceID(cid);
        const requestid = jutils.makeSimpleGUID();
        const len = parseInt(Math.random() * 6);
        const arr = [];
        for(let i = 0; i < len; i++) {
            arr.push(parseInt(Math.random() * 24) + ':' + parseInt(Math.random() * 60));
        }
        this._printSend({
            type: 'bluetooth-sync',
            data: {
                request_id: requestid,
                device_id: deviceid,
                cid: cid,
                sync_type: 'write',
                data_type: 'heart_clock',
                clock_list: arr
            }
        });
        paibandService.syncWriteHeartClock(deviceid, cid, arr, requestid).then(data => {
            this._printResult({
                type: 'bluetooth-sync',
                data: data
            });
        }).catch(error => {
            console.log(error);
        });
    }

    _bluetoothStatusChangeHandler(data) {
        this._printListen({
            'type': 'bluetooth-status',
            'data': data
        });
    }

    _appAwakenHandler() {
        this._printListen({
            'type': 're-awaken',
        });
    }

    _printResult(msg) {
        this.setState({
            result: JSON.stringify(msg)
        });
    }

    _printSend(msg) {
        this.setState({
            send: JSON.stringify(msg)
        });
    }

    _printListen(msg) {
        const ms = this.state.listen.split('\n');
        if(ms.length > 10) {
            ms.shift();
        }
        ms.push(new Date().toLocaleString() + ': ' + JSON.stringify(msg));
        this.setState({
            listen: ms.join('\n')
        });
    }

    _renderMenuButton(m) {
        if(m) {
            return <IconButton icon="http://weidu.file.dev.putaocloud.com/file/a98db598cd951976b9543b39108fcc65fc317755.png" name={m.title} style={styles.menu_button} />;
        }
        return null;
    }

    render() {
        const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => true});

        return (
            <View style={{marginTop:80}}>
                <ScrollView style={styles.printer}>
                    <Text>{this.state.result}</Text>
                </ScrollView>
                <ScrollView style={styles.printer}>
                    <Text>{this.state.send}</Text>
                </ScrollView>
                <ScrollView style={styles.printer}>
                    <Text>{this.state.listen}</Text>
                </ScrollView>
                <ListView contentContainerStyle={styles.menu_container} dataSource={ds.cloneWithRows(this.state.menuList)} renderRow={this._renderMenuButton} enableEmptySections={true} />
            </View>
        );
    }
}

//---------------------style-----------------------
const styles = StyleSheet.create({
    printer: {
        width: width,
        height: 100,
        borderWidth: 2,
        borderColor: 'gray'
    },
    menu_container: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginTop: 20
    },
    menu_button: {
        marginBottom: 10,
        width: width / 3,
        height: 60
    }
});

export default Test;
