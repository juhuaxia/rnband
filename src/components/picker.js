import React from 'react';
import {StyleSheet, Text, View, Image, TouchableOpacity, Modal, Platform, PickerIOS} from 'react-native';
import IComponent from 'PaiBandRN/src/components/icomponent';
import PickerAndroid from 'PaiBandRN/src/components/PickerAndroid';
const Picker = Platform.OS === 'ios' ? PickerIOS : PickerAndroid;
// const Picker = PickerAndroid;
/**
 * 说明：所有的时间底层传递方式都是24小时制
 * 如果是英文版只有在最后一步渲染时转换为上下午制
 */
export default class PickerCross extends IComponent {
    static propTypes = {
        selectMinute: React.PropTypes.any,
        selectHouer: React.PropTypes.any,
        status: React.PropTypes.bool.isRequired,
        confirm: React.PropTypes.func.isRequired,
        cancle: React.PropTypes.func.isRequired,
    };
    
    _timeType = ['AM', 'PM']; //上下午
    _pickerHour = this._initClock(this.i18nLang == 'en' ? 13 : 24);
    _pickerMinute = this._initClock(60);

    state = {
        pickerHourSelected: '00', //已选择的小时
        pickerMinuteSelected: '00', //已选择的分钟
        pickerTypeSelected: 'AM', //已选上下午
    }

    /**
     * [_confirm 点击确定，调用父级传递过来的毁掉函数，将小时，分钟传递]
     * @return {[null]} [null]
     */
    _confirm = () => {
        
        let hour;
        if (this.i18nLang == 'en' && this.state.pickerTypeSelected == 'PM') {
            hour = parseInt(this.state.pickerHourSelected) + 12;
        }else{
            hour = this.state.pickerHourSelected;
        }
        this.props.confirm(hour,this.state.pickerMinuteSelected);
    }
    /**
     * [_initClock 初始化闹钟信息，小时、分钟]
     * @param {[int]} length [参数为整数类型]
     * @return {[array]} [返回0 - length 字符串组成的数组]
     */
    _initClock(length){
        const timeArr = [];
        for (let i = 0; i < length; i++) {
            const item = i < 10 ? '0' + i : i.toString();
            timeArr.push(item)
        }
        return timeArr;
    }

    componentWillReceiveProps(nextProps){
        let hour = nextProps.selectHouer || '00';  //父级传递过来的小时
        let minute = nextProps.selectMinute || '00'; //父级传递过来的分钟
        let type = 'AM';
        if(this.i18nLang == 'en'){
            /*
            英文模式下，下午时间需要减去12小时，同时时间类型为PM
             */
            if (parseInt(hour) > 12) {
                hour = ('0' + (parseInt(hour) - 12)).substr(-2);
                type = 'PM';
            }
        }
        this.setState({
            pickerHourSelected: hour,
            pickerMinuteSelected: minute,
            pickerTypeSelected: type,
        })
    }
    render() {

        return (
            <View style={styles.container}>
                <Modal
                    animationType = {'fade'}
                    transparent={true}
                    onRequestClose={() => {}}
                    visible={this.props.status}>
                    <View style={styles.pickerBack}>
                        <View style={styles.pickerContainer}>
                            <View style={styles.pickerHeader}>
                                <TouchableOpacity onPress={this.props.cancle}>
                                    <Text style={styles.commonStyle}>{this.i18n('btn_name_cancel')}</Text>
                                </TouchableOpacity>
                                <Text style={styles.commonStyle}>{this.i18n('heartClock_tip_setting')}</Text>
                                <TouchableOpacity onPress={this._confirm}>
                                    <Text style={styles.complite}>{this.i18n('btn_name_ok')}</Text>
                                </TouchableOpacity>
                            </View>
                            <View style={styles.pickerList}>
                                {/*小时*/}
                                <Picker
                                    selectedValue={this.state.pickerHourSelected}
                                    mode={'dropdown'}
                                    onValueChange={(itemValue) => this.setState({pickerHourSelected: itemValue})}
                                    style={styles.picker}>
                                    {
                                        this._pickerHour.map((item, index) => {
                                            return <Picker.Item label={item} value={item} key={index} />
                                        })
                                    }
                                </Picker>
                                {/*分钟*/}
                                <Picker
                                    selectedValue={this.state.pickerMinuteSelected}
                                    mode={'dropdown'}
                                    onValueChange={(itemValue) => this.setState({pickerMinuteSelected: itemValue})}
                                    style={styles.picker}>
                                    {
                                        this._pickerMinute.map((item, index) => {
                                            return <Picker.Item label={item} value={item} key={index} />
                                        })
                                    }
                                </Picker>
                                {
                                    this.i18nLang == 'en' ? <Picker
                                        selectedValue={this.state.pickerTypeSelected}
                                        mode={'dropdown'}
                                        onValueChange={(itemValue) => this.setState({pickerTypeSelected: itemValue})}
                                        style={styles.picker}>
                                        {
                                            this._timeType.map((item, index) => {
                                                return <Picker.Item label={item} value={item} key={index} />
                                            })
                                        }
                                    </Picker> :null
                                }
                            </View>
                        </View>
                    </View>
                </Modal>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    pickerBack: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    pickerHeader: {
        height: 40,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingLeft: 20,
        paddingRight: 20,
    },
    commonStyle: {
        fontSize: 15,
        opacity: 0.8,
        height: 40,
        lineHeight: 40,
    },
    complite: {
        fontSize: 15,
        color: '#F2253E',
        fontFamily: 'PingFangSC-Medium',
        height: 40,
        lineHeight: 40,
    },
    pickerContainer: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        height: 260,
        backgroundColor: '#fff',
    },
    pickerList: {
        flexDirection: 'row',
    },
    picker: {
        flex: 1,
        backgroundColor: '#fff',
    },
});
