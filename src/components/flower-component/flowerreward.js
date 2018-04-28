import React from 'react';
import IComponent from 'PaiBandRN/src/components/icomponent';
import COMNotice from 'PaiBandRN/src/notice/component';
import paibandService from 'PaiBandRN/src/services/paiband';
import flowersService from 'PaiBandRN/src/services/flowers';
import UserSerivice from 'PaiBandRN/src/services/user';
import db from 'PaiBandRN/src/dbs/hashmap';

import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    Modal,
    TouchableWithoutFeedback,
    TouchableOpacity,
    Dimensions,
    TextInput,
    Keyboard,
    Button,
    Alert,
    Image,
} from 'react-native';

const winWidth = Dimensions.get('window').width;

//奖励小花弹窗
class FlowerReward extends IComponent{
    //关闭弹窗统一在主页flower关闭
    Proptypes:{
        onPress:React.Proptypes.Function,
        flowersNumInfo:React.Proptypes.Object,
    }

    constructor(props) {
        super(props);
        this.state = {
            txtNum:"",
            txtText:"",
            isRed:false,
            flowersNum:this.props.flowersNumInfo,
        }

        this._awardPlaceholder = '约定达成，奖励小红花';
        this._numInput = null;
        this._txtInput = null;
    }

    componentWillReceiveProps(nextProps){
        this.state.flowersNum = nextProps.flowersNumInfo;
    }

    componentDidMount(){
        this.getUserInfo();
    }

    // 获取用户信息
    getUserInfo(){
        this.state.cid = db.get('cid');
        this.state.deviceid = UserSerivice.getDeviceID(this.state.cid);
        this.state.Nickname =  UserSerivice.getNickname(this.state.cid) || '孩子';//获取当前孩子姓名
    }

    //点击奖励小花
    submitReward(){
        if(this.state.isRed == true){
            let config = {
                cur_num:this.state.flowersNum.current_num,
                num:this.state.txtNum,
                action:'add_num',
            };
            let deviceid = this.state.deviceid;
            this.props.onPress();//关闭奖励小花弹窗
            setTimeout(() => {
                paibandService.getBluetoothStatus(deviceid).then(s => {
                    if(s.status == 1) {
                        paibandService.syncWriteFlowers(deviceid,config).then(data => {
                            console.log('paibandService syncWriteFlowers data', data);
                            if(data.status == 0){
                                const txtText = this.state.txtText || this._awardPlaceholder;
                                flowersService.settingsFlowers("1",this.state.txtNum,txtText,).then(data=>{
                                    console.log('flowersService settingsFlowers', data);
                                    Alert.alert(
                                        "小花奖励成功",
                                        txtText,
                                        [
                                            {text: '确定'},
                                        ]
                                    )
                                    this.sendNotification(COMNotice.FLOWERSCHANGE,data.current_num);
                                }).catch(e=>{
                                    console.log('flowersService settingsFlowers error', e);
                                    Alert.alert(
                                        "小花奖励失败",
                                        '服务异常，稍后再试',
                                        [
                                            {text: '确定'},
                                        ]
                                    )
                                });
                            } else {
                                console.log('paibandService syncWriteFlowers error');
                                Alert.alert(
                                    '小花奖励失败',
                                    '写入手环失败',
                                    [
                                        {text: '确定'},
                                    ]
                                )
                            }
                        }).catch(e => {
                            console.log('paibandService syncWriteFlowers error', e);
                            Alert.alert(
                                '小花奖励失败',
                                '无法与手环通讯',
                                [
                                    {text: '确定'},
                                ]
                            )
                        });
                    } else {
                        console.log('paibandService getBluetooth error');
                        Alert.alert(
                            '蓝牙异常',
                            '蓝牙未正常连接',
                            [
                                {text: '确定'},
                            ]
                        )
                    }
                }).catch(e => {
                    console.log('paibandService getBluetooth error', e);
                    Alert.alert(
                        '蓝牙状态获取失败',
                        JSON.stringify(e),
                        [
                            {text: '确定'},
                        ]
                    )
                });
            }, 100);
        }
    }

    //奖励数量填写时触发
    ChangeNum(text){
        text = text.replace('.', '');
        this.setState({
            txtNum:text,
        },()=>{
            this.setState({
                isRed: Number(this.state.txtNum) > 0
            });
            if(this.state.txtNum.length>2){
                this.setState({
                    // txtNum:this.state.txtNum.substr(0,2),
                    txtNum:'',
                    isRed: false
                });
                Alert.alert(
                    "最多奖励99朵小红花哦!",
                    "",
                    [
                        {text: '确定'},
                    ]
                )
            }
        });
    }

    //奖励数量备注填写时触发
    ChangeText(text){
        this.setState({
            txtText:text
        });
    }

    render() {
        return (
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style={styles.popCon} >
                <View style={styles.pop}>
                    <View style = {styles.bg}>
                        <Image source = {require('PaiBandRN/res/images/img_band_flower_modal_dialogue_01.png')} />
                        <TouchableOpacity style={styles.closeIcon}  onPress = {this.props.onPress}>
                            <Image source = {require('PaiBandRN/res/images/btn_20_close_g_nor.png')}/>
                        </TouchableOpacity>
                    </View>
                    <View>
                        <View style = {styles.numWrap}>
                            <TextInput
                            ref={com => {this._numInput = com;}}
                            style={styles.numInput}
                            maxLength = {3}
                            onChangeText = {(text) => this.ChangeNum(text)}
                            value = {this.state.txtNum}
                            placeholder = "奖励数量"
                            keyboardType = {"numeric"}/>
                            <Text style={{
                                position: 'absolute',
                                right: 10,
                                top: 10
                            }}>朵</Text>
                        </View>
                        <View style = {styles.textWarp}>
                            <TextInput
                            ref={com => {this._txtInput = com;}}
                            style={styles.textInput}
                            onChangeText = {(text) => this.ChangeText(text)}
                            value = {this.state.txtText}
                            onChange = {this.ChangeText.bind(this)}
                            placeholder = {this._awardPlaceholder}
                            multiline = {true}
                            maxLength = {120}
                            numberOfLines = {3}/>
                        </View>
                        <TouchableOpacity onPress = {this.submitReward.bind(this)} style={[styles.btnWarp,{backgroundColor:this.state.isRed?'#f06e7b':'#ccc'}]}>
                            <Text style = {styles.btnText}>
                                奖励小花
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
                </View>
            </TouchableWithoutFeedback>
        );
    }
};

var styles = StyleSheet.create({
    popCon:{
        flex:1,
        alignItems:"center",
        justifyContent:"center",
        position:"absolute",
        top:150,
        left:(winWidth - 300) * 0.5,
    },
    pop:{
        width:300,
        height:300,
        backgroundColor:"#fff",
        borderRadius:10,
        zIndex:15,
        overflow:"hidden",
    },
    bg:{
        alignItems:"center",
        position:"relative"
    },
    closeIcon:{
        position:"absolute",
        right:15,
        top:15,
    },
    numWrap:{
        marginLeft:25,
        marginRight:25,
        borderTopLeftRadius:5,
        borderTopRightRadius:5,
        borderWidth:1,
        borderColor:"#e1e1e1",
    },
    numInput:{
        height:40,
        paddingLeft:10,
        borderBottomWidth:1,
        borderColor:"#e1e1e1",
        paddingRight:10,
        fontSize:16,
        color:"#313131",
    },
    textWarp:{
        marginLeft:25,
        marginTop:-1,
        marginRight:25,
        borderBottomLeftRadius:5,
        borderBottomRightRadius:5,
        borderWidth:1,
        borderColor:"#e1e1e1",
    },
    textInput:{
        height:70,
        paddingLeft:10,
        borderBottomWidth:1,
        borderColor:"#e1e1e1",
        paddingRight:10,
        fontSize:16,
        color:"#313131",
    },
    btnWarp:{
        marginRight:25,
        alignItems:"center",
        justifyContent:"center",
        marginLeft:25,
        height:40,
        borderRadius:25,
        marginTop:25,
        backgroundColor:"#ccc",
    },
    btnText:{
        color:"#fff",
        fontSize:16,
    },
});

export default FlowerReward;
