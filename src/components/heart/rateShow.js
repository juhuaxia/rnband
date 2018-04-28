import React from 'react';
import {StyleSheet, Text, View, Dimensions, PanResponder} from 'react-native';
import StylesCommon from 'PaiBandRN/src/style/common';
import IComponent from 'PaiBandRN/src/components/icomponent';
import {is, fromJS} from 'immutable';
import HeartChart from 'PaiBandRN/src/components/heart/heartChart';
const windowWidth = Dimensions.get('window').width;

export default class RateShow extends IComponent {
    static propTypes = {
        allHeartLog: React.PropTypes.any,
        timingHeartLog: React.PropTypes.array.isRequired,
        handHeartLog: React.PropTypes.array.isRequired,
        xscale: React.PropTypes.number.isRequired,
        excu: React.PropTypes.number.isRequired,
        leftexcu: React.PropTypes.number.isRequired,
        weekDay: React.PropTypes.string.isRequired,
    }
    timeText = ['0:00 AM', '6:00 AM', '12:00 AM', '6:00 PM', '12:00 PM']; //心率时间
    state = {
        selected: this._getToadyLastData(this.props),
    }
    
    constructor(props){
        super(props);

    }

    selectData = (selected) => {
        this.setState({selected})
    }

    _getToadyLastData(data){
        let todayData = [...data.timingHeartLog, ...data.handHeartLog];
        if (todayData.length) {
            todayData.sort((a, b) => {
                return b.xlocation - a.xlocation;
            })
            return todayData[0];
        }else{
            return {rate:0}
        }
    }

    componentWillMount() {
       
    }
    componentDidMount() {
       
        
    }
    componentWillReceiveProps(nextProps) {
        if (!is(fromJS(this.props), fromJS(nextProps))) {
            this.setState({
                selected: this._getToadyLastData(nextProps),
            })
        }
    }
    shouldComponentUpdate(nextProps, nextState) {
        return !is(fromJS(this.props), fromJS(nextProps)) || !is(fromJS(this.state),fromJS(nextState))
    }

    componentWillUnmount() {
        
    }
    render() {
        return (
            <View style={[styles.svgContainer, StylesCommon.common_card]}>
                <Text style={styles.heartTips}>
                   {this.i18n('heart_tip_range')} （50-110）
                </Text>
                <View style={styles.detailDateContainer}>
                    <View style={styles.selectedHeart}>
                        <Text style={styles.selectedHeartRate}>{this.state.selected.rate}</Text>
                        <Text style={styles.heartunit}>{this.i18n('heart_unit_result')}</Text>
                    </View>
                    <Text style={styles.weekDay}>{this.props.weekDay}</Text>
                </View>
                <HeartChart 
                    allHeartLog={this.props.allHeartLog} 
                    timingHeartLog={this.props.timingHeartLog}
                    handHeartLog={this.props.handHeartLog}
                    xscale={this.props.xscale}
                    excu={this.props.excu}
                    leftexcu={this.props.leftexcu}
                    selectData={this.selectData}
                />
                <View style={styles.timeTipStyle}>
                    {
                        this.timeText.map((item, index) => {
                            return <Text style={styles.timeTextContainer} key={index}>{item}</Text>
                        })
                    }
                </View>
                <View style={styles.heartDecsription}>
                    <View style={styles.descContainer}>
                        <View style={[styles.descCircle, {backgroundColor: '#ed5564'}]}></View>
                        <Text style={styles.descText}>{this.i18n('heart_tip_timed')}</Text>
                    </View>
                    <View style={styles.descContainer}>
                        <View style={[styles.descCircle, {backgroundColor: '#ffd505'}]}></View>
                        <Text style={styles.descText}>{this.i18n('heart_tip_manual')}</Text>
                    </View>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    svgContainer: {
        alignItems: 'center',
        marginTop: 12,
        paddingLeft: 8,
        paddingRight: 8,
    },
    heartTips: {
        padding: 16,
        marginBottom: 10,
        width: windowWidth - 24,
        fontSize: 10,
        color: '#121212',
        opacity: 0.8,
        backgroundColor: 'rgba(0,0,0,0)',
    },
    detailDateContainer: {
        width: windowWidth - 40,
        alignItems: 'center',
    },
    selectedHeart: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 20,
    },
    selectedHeartRate: {
        fontSize: 36,
        fontFamily: 'DINCondensed-Bold',
        marginRight: 4,
    },
    heartunit: {
        fontSize: 12,
        fontFamily: 'PingFangSC-Semibold',
    },
    weekDay: {
        fontSize: 14,
        color: '#C3C3C3',
        marginBottom: 40,
    },
    timeTipStyle: {
        marginTop: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: windowWidth - 40,
        backgroundColor: 'rgba(0,0,0,0)',

    },
    timeTextContainer: {
        fontSize: 10,
        color: "#c2c2c2",
        textAlign: 'center',
        fontFamily: 'PingFangSC-Regular',

    },
    heartDecsription: {
        flexDirection: 'row',
        marginTop: 12,
        marginBottom: 20,
        marginLeft: 40,
        width: windowWidth - 24,
    },
    descContainer: {
        flexDirection: 'row',
        alignItems: "center",
        justifyContent: 'flex-start',
        marginRight: 14,
    },
    descCircle: {
        height: 8,
        width: 8,
        marginRight: 8,
    },
    descText: {
        fontSize: 10,
        color: '#121212',
        opacity: 0.8,
    },
})