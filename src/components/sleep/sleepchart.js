import React, {
    Component
} from 'react';
import { StyleSheet, Text, View,Dimensions } from 'react-native';
import Svg, { Line, Path, Ellipse,Defs,G,Use,Circle,Rect} from 'react-native-svg';
import { Text as SvgText } from 'react-native-svg';

import styles from 'PaiBandRN/src/style/sleepchart'

let windowWidth = Dimensions.get('window').width;
import IComponent from 'PaiBandRN/src/components/icomponent';
import COMNotice from 'PaiBandRN/src/notice/component';




//每日睡眠统计
let shallowSleep = [];//浅睡
let deepSleep = [];//深睡
let awakeSleep = [];//辗转反侧

//每周睡眠统计
let shallowSleepWeekPosition = [];
let deepSleepWeekPosition = [];
let shallowSleepWeekPoint = [];
let deepSleepWeekPoint = [];

//每月睡眠统计
let chartMonthBottom = [];
let shallowSleepMonthPosition = [];
let deepSleepMonthPosition = [];
let shallowSleepMonthPoint = [];
let deepSleepMonthPoint = [];

//每年睡眠统计
let chartYearBottom = ["01月","","03月","","","06月","","","09月","","","12月"];
let shallowSleepYearPosition = [];
let deepSleepYearPosition = [];
let shallowSleepYearPoint = [];
let deepSleepYearPoint = [];

export default class SleepChart extends IComponent {
    Proptypes:{
        sleepTypes:React.Proptypes.String,
        sleepDayPoint:React.Proptypes.Array,
        sleepWeekPoint:React.Proptypes.Array,
        sleepMonthPoint:React.Proptypes.Array,
        sleepYearPoint:React.Proptypes.Array,
    }

    constructor(props) {
        super(props);
        this.state = {
            chartDayBottom: ['20:00', '22:00', '24:00', '02:00','04:00','06:00','08:00'],
            sleepDayPoint:this.props.sleepDayPoint,
            chartWeekBottom:['周一', '周二', '周三', '周四','周五','周六','周日'],
            lingWeekLength:[1, 2, 3,],
            sleepWeekPoint:this.props.sleepWeekPoint,
            chartWeekLeftTet:['4h', '8h', '12h'],//Y轴刻度
            chartYearLeftTet:['130h', '260h', '390h'],//Y轴刻度
            sleepMonthPoint:this.props.sleepMonthPoint,
            sleepYearPoint:this.props.sleepYearPoint,
        }
    }

    startEndW(_startinfo,_endInfo){
        let defaultM = 20*60;
        let starttotalM = null;
        let oneM = ((windowWidth-56)/(12*60)).toFixed(3);
        //start end  总分钟数
        if(parseInt(_startinfo.split(":")[0]) < 20){
            starttotalM = (parseInt(_startinfo.split(":")[0]) + 24)*60 + parseInt(_startinfo.split(":")[1]);
        }else{
            starttotalM = parseInt(_startinfo.split(":")[0])*60 + parseInt(_startinfo.split(":")[1]);
        }
        let endtotalM = null;
        if(parseInt(_endInfo.split(":")[0]) < 20){
            endtotalM = (parseInt(_endInfo.split(":")[0]) + 24)*60 + parseInt(_endInfo.split(":")[1]);
        }else{
            endtotalM = parseInt(_endInfo.split(":")[0])*60 + parseInt(_endInfo.split(":")[1]);
        }
        //开始的时间 以及结束的时间
        let startM = starttotalM - defaultM;
        let endM = endtotalM - defaultM;
        //x轴开始x坐标 以及到结束点之间的距离
        let startW = startM*oneM+28;
        let endW = endM*oneM -startW+28;
        return{
            startW:startW,
            endW:endW,
        }
    }

    changePoistion(_deepPoint,_shallowPoint,X,typeDeepPosition,typeshallowPosition){
        let H = 12;
        if(this.props.sleepTypes == "Year") {
            H = 390;
        }
        let arr = [];
        _deepPoint.forEach((item, index) => {
            typeDeepPosition.push('M' + (((windowWidth-80)/(X-1))*(index)+40).toFixed(0)+ ' '+ '150' +' ' + 'L'+
                (((windowWidth-80)/(X-1))*(index)+40).toFixed(0) +' '+ (150-(150*item/(60*H)).toFixed(0)) + ' ');
            arr[index]=(150-(150*item/(60*H)).toFixed(0));
        })
        _shallowPoint.forEach((item, index) => {
            typeshallowPosition.push('M' + (((windowWidth-80)/(X-1))*(index)+40).toFixed(0)+ ' '+ arr[index] +' ' + 'L'+
                (((windowWidth-80)/(X-1))*(index)+40).toFixed(0) +' '+ (150-(150*item/(60*H)).toFixed(0)-(150-arr[index])) + ' ');
        })
        return {
            typeDeepPosition:typeDeepPosition,
            typeshallowPosition:typeshallowPosition,
        }
    }

    componentWillReceiveProps(nextprops) {

        this.props.sleepTypes = nextprops.sleepTypes;
        this.setState({
            sleepDayPoint: nextprops.sleepDayPoint,
            sleepWeekPoint: nextprops.sleepWeekPoint,
            sleepMonthPoint: nextprops.sleepMonthPoint,
            sleepYearPoint: nextprops.sleepYearPoint,
        }, () => {
            this._updateData();
        });
    }

    _updateData() {
        shallowSleep = [];//浅睡
        deepSleep = [];//深睡
        awakeSleep = [];//辗转反侧
        console.log('this.state.sleepDayPoint', this.state.sleepDayPoint)
        //走路跑步的数据转化为柱状图坐标
        if(this.state.sleepDayPoint && this.props.sleepTypes == "Day"){
            //一分钟所占x轴距离
            for(var i = 0; i<this.state.sleepDayPoint.length; i++){
                if(this.state.sleepDayPoint[i].status === 1){
                    //浅睡
                    let startinfo = this.state.sleepDayPoint[i].start;
                    let endinfo = this.state.sleepDayPoint[i].end;
                    //x轴开始x坐标 以及到结束点之间的距离
                    let W = this.startEndW(startinfo,endinfo);
                    shallowSleep.push({X:(W.startW).toFixed(0),Y:"0",width:(W.endW).toFixed(0)});
                }else if(this.state.sleepDayPoint[i].status === 0){
                    //深睡
                    let startinfo = this.state.sleepDayPoint[i].start;
                    let endinfo = this.state.sleepDayPoint[i].end;
                    //x轴开始x坐标 以及到结束点之间的距离
                    let W = this.startEndW(startinfo,endinfo);
                    deepSleep.push({X:(W.startW).toFixed(0),Y:"0",width:(W.endW).toFixed(0)});
                }else if(this.state.sleepDayPoint[i].status === 2){
                    //醒着 辗转反侧
                    let startinfo = this.state.sleepDayPoint[i].start;
                    let endinfo = this.state.sleepDayPoint[i].end;
                    //x轴开始x坐标 以及到结束点之间的距离
                    let W = this.startEndW(startinfo,endinfo);
                    awakeSleep.push({X:(W.startW).toFixed(0),Y:"50",width:(W.endW).toFixed(0)});
                }
            }
        }else if(this.props.sleepTypes == "Week" && this.state.sleepWeekPoint){
            let weekdate = this.state.sleepWeekPoint;
            for(var i = 0; i<weekdate.length; i++){
                deepSleepWeekPoint[weekdate[i].date-1] = weekdate[i].sleepDetail[0];
                shallowSleepWeekPoint[weekdate[i].date-1] = weekdate[i].sleepDetail[1];
            }
            //走路跑步的数据转化为path路径，X轴坐标为总宽度除以6乘以数据索引，Y轴坐标为(svg坐标原点为左上角) windowWidth-80(左边留出40pt的距离)
            this.changePoistion(deepSleepWeekPoint,shallowSleepWeekPoint,7,deepSleepWeekPosition,shallowSleepWeekPosition);
        }else if(this.props.sleepTypes == "Month" && this.state.sleepMonthPoint){
            let monthdate = this.state.sleepMonthPoint;
            //let month = parseInt(monthdate[0].date.split("-")[1]);
            //let year  = parseInt(monthdate[0].date.split("-")[0]);
            const now = new Date();
            let month = now.getMonth() + 1;
            let year  = now.getFullYear();
            let d= new Date(year, month, 0);
            let monthday = d.getDate();//获取一个月有多少天
            //根据多少天显示x轴数据
            if(monthday == 29){
                for(var i=1;i<=monthday;i=i+4){
                    chartMonthBottom.push(month+"/"+("0"+i).substr(-2));
                }
            }else if(monthday == 28){
                for(var i=1; i<=monthday; i=i+7){
                    chartMonthBottom.push(month+"/"+("0"+i).substr(-2));
                }
                chartMonthBottom.push(month+"/28");
            }else if(monthday == 30){
                chartMonthBottom[0]=(month+"/01");
                for(var i=5;i<=monthday;i=i+5){
                    chartMonthBottom[i]=(month+"/"+("0"+i).substr(-2));
                }
                chartMonthBottom[30]=(month+"/30");
            }else if(monthday == 31){
                for(var i=1;i<=monthday;i=i+5){
                    chartMonthBottom[i] = (month+"/"+("0"+i).substr(-2));
                }
            }

            for(var i = 0; i<monthdate.length; i++){
                deepSleepMonthPoint[parseInt(monthdate[i].date.split("-")[2])-1] = monthdate[i].sleepDetail[0];
                shallowSleepMonthPoint[parseInt(monthdate[i].date.split("-")[2])-1] = monthdate[i].sleepDetail[1];
            }

            //走路跑步的数据转化为path路径，X轴坐标为总宽度除以天数乘以数据索引，Y轴坐标为(svg坐标原点为左上角) windowWidth-80(左边留出40pt的距离)
            this.changePoistion(deepSleepMonthPoint,shallowSleepMonthPoint,monthday,deepSleepMonthPosition,shallowSleepMonthPosition);
        }else if(this.props.sleepTypes == "Year" && this.state.sleepYearPoint){
            let yeardate = this.state.sleepYearPoint;
            for(var i = 0; i<yeardate.length; i++){
                deepSleepYearPoint[parseInt(yeardate[i].date.split("-")[1])-1] = yeardate[i].sleepDetail[0];
                shallowSleepYearPoint[parseInt(yeardate[i].date.split("-")[1])-1] = yeardate[i].sleepDetail[1];
            }
            //走路跑步的数据转化为path路径，X轴坐标为总宽度除以天数乘以数据索引，Y轴坐标为(svg坐标原点为左上角) windowWidth-80(左边留出40pt的距离)
            this.changePoistion(deepSleepYearPoint,shallowSleepYearPoint,12,deepSleepYearPosition,shallowSleepYearPosition);
        }

        this.forceUpdate();
    }

    render() {

        let chart = null;
        if(this.props.sleepTypes == "Day"){
            chart = (
                <View style={{backgroundColor: '#ebebeb',}}>
                    <View style={styles.svgContainer}>
                        <Svg height="155" width={windowWidth-15}>
                            <Line
                            x1="15"
                            y1="150"
                            x2={windowWidth-15}
                            y2="150"
                            stroke="#ebebeb"
                            strokeWidth="2" />
                            
                            {
                                /*辗转反侧睡眠柱状图*/
                                (awakeSleep || []).map((item, index) => {
                                    return  <Rect
                                                x={item.X}
                                                y={item.Y}
                                                key = {index}
                                                height="100"
                                                width={item.width}
                                                fill="#ffe7ef" />
                                })
                            }

                            {
                                /*浅度睡眠柱状图*/
                                (shallowSleep || []).map((item, index) => {
                                    return  <Rect
                                                x={item.X}
                                                y={item.Y}
                                                key = {index}
                                                width={item.width}
                                                height="150"
                                                fill="#e1d1fb" />
                                })
                            }

                            {
                                /*深度睡眠柱状图*/
                                (deepSleep || []).map((item, index) => {
                                    return  <Rect
                                                x={item.X}
                                                y={item.Y}
                                                key = {index}
                                                width={item.width}
                                                height="150"
                                                fill="#c5a2fc" />
                                })
                            }

                            {
                                //X轴数据标尺
                                this.state.chartDayBottom.map((item, index) => {
                                    return <Line
                                    x1={28 + (windowWidth-56)/6*index}
                                    y1="150"
                                    x2={28 + (windowWidth-56)/6*index}
                                    y2="155"
                                    key = {index}
                                    stroke="#ebebeb"
                                    strokeWidth="1" />
                                })
                            }
                            </Svg>
                            <View style={styles.chartBottomList}>
                                {
                                    /*X轴坐标*/
                                    (this.state.chartDayBottom || []).map((item, index) => {
                                        return  <Text key={index} style={styles.chartBottomText}>{item}</Text>
                                    })
                                }
                            </View>
                        </View>
                        <View style={styles.chartTipsContainer}>
                            <View style={styles.chartTipsDotStyle}>
                                <View style={styles.chartTipsDotOne}></View>
                                <Text style={styles.chartTipsStyle}>深睡</Text>
                            </View>
                            <View style={styles.chartTipsDotStyle}>
                                <View style={styles.chartTipsDotTwo}></View>
                                <Text style={styles.chartTipsStyle}>浅睡</Text>
                            </View>
                            <View style={styles.chartTipsDotStyle}>
                                <View style={styles.chartTipsDotThree}></View>
                                <Text style={styles.chartTipsStyle}>辗转反侧</Text>
                            </View>
                        </View>
                </View>)
        }else if(this.props.sleepTypes == "Week"){
            chart = (
                <View style={{backgroundColor: '#ebebeb',}}>
                <View style={styles.svgContainer}>
                    <Svg height="150" width={windowWidth-15}>
                        <Line
                        x1="15"
                        y1="150"
                        x2={windowWidth-15}
                        y2="150"
                        stroke="#ebebeb"
                        strokeWidth="2" />

                        {
                            /*网格三条线*/
                            (this.state.lingWeekLength || []).map((item, index) => {
                                return  <Line
                                        x1="15"
                                        y1={150 - (index + 1) * 50}
                                        x2={windowWidth-15}
                                        y2={150 - (index + 1) * 50}
                                        stroke = "#ebebeb"
                                        strokeWidth={1}
                                        key={index}/>
                            })
                        }


                        {
                            /*左边y轴坐标*/
                            (this.state.chartWeekLeftTet || []).map((item, index) => {
                                return  <SvgText
                                        stroke = "none"
                                        fontSize = "10"
                                        fill='#c2c2c2'
                                        strokeWidth="1"
                                        x="15"
                                        y={152 - (index + 1) * 50}
                                        key={index}
                                        style={{fontFamily: 'PingFangSC-Regular'}}>{item}</SvgText>
                            })
                        }


                        {
                            /*深度睡眠的柱状图*/
                            (deepSleepWeekPosition || []).map((item, index) => {
                                return   <Path
                                        d={item}
                                        key = {index}
                                        fill="none"
                                        stroke="#c5a2fc"
                                        strokeWidth="15"/>
                            })
                        }

                        {
                            /*浅度睡眠的柱状图*/
                            (shallowSleepWeekPosition || []).map((item, index) => {
                                return  <Path
                                        d={item}
                                        key = {index}
                                        fill="none"
                                        stroke="#e1d1fb"
                                        strokeWidth="15"/>

                            })
                        }

                        {/*目标*/}
                        {/*
                        <Line
                        x1="15"
                        y1="40"
                        x2={windowWidth-15}
                        y2="40"
                        strokeDasharray="5,5"
                        stroke="#ef5361"
                        strokeWidth="1" />
                        <Rect
                        x={windowWidth-48}
                        y="30"
                        rx="8"
                        ry="8"
                        width="32"
                        height="18"
                        fill="red"/>
                        <SvgText
                        stroke = "none"
                        fontSize = "10"
                        fill='#fff'
                        x={windowWidth-42}
                        y="31.5"
                        style={{fontFamily: 'PingFangSC-Regular'}}>推荐</SvgText>
                        */}

                        </Svg>
                        <View style={styles.chartBottomList}>
                            {
                                /*X轴坐标*/
                                (this.state.chartWeekBottom || []).map((item, index) => {
                                    return  <Text key={index} style={styles.chartBottomText}>{item}</Text>
                                })
                            }
                        </View>
                    </View>
                    <View style={styles.chartTipsContainer}>
                        <View style={styles.chartTipsDotStyle}>
                            <View style={styles.chartTipsDotOne}></View>
                            <Text style={styles.chartTipsStyle}>深睡</Text>
                        </View>
                        <View style={styles.chartTipsDotStyle}>
                            <View style={styles.chartTipsDotTwo}></View>
                            <Text style={styles.chartTipsStyle}>浅睡</Text>
                        </View>
                    </View>
                </View>)
        }else if(this.props.sleepTypes == "Month"){
            chart = (
                <View style={{backgroundColor: '#ebebeb',}}>
                <View style={styles.svgContainer}>
                    <Svg height="150" width={windowWidth-15}>
                        <Line
                        x1="15"
                        y1="150"
                        x2={windowWidth-15}
                        y2="150"
                        stroke="#ebebeb"
                        strokeWidth="2" />

                        {
                            /*网格三条线*/
                            (this.state.lingWeekLength || []).map((item, index) => {
                                return  <Line
                                        x1="15"
                                        y1={150 - (index + 1) * 50}
                                        x2={windowWidth-15}
                                        y2={150 - (index + 1) * 50}
                                        stroke = "#ebebeb"
                                        strokeWidth={1}
                                        key={index}/>
                            })
                        }


                        {
                            /*左边y轴坐标*/
                            (this.state.chartWeekLeftTet || []).map((item, index) => {
                                return  <SvgText
                                        stroke = "none"
                                        fontSize = "10"
                                        fill='#c2c2c2'
                                        strokeWidth="1"
                                        x="15"
                                        y={152 - (index + 1) * 50}
                                        key={index}
                                        style={{fontFamily: 'PingFangSC-Regular'}}>{item}</SvgText>
                            })
                        }

                        {
                            /*深度睡眠的柱状图*/
                            (deepSleepMonthPosition || []).map((item, index) => {
                                return   <Path
                                        d={item}
                                        key = {index}
                                        fill="none"
                                        stroke="#c5a2fc"
                                        strokeWidth="5"/>
                            })
                        }

                        {
                            /*浅度睡眠的柱状图*/
                            (shallowSleepMonthPosition || []).map((item, index) => {
                                return  <Path
                                        d={item}
                                        key = {index}
                                        fill="none"
                                        stroke="#e1d1fb"
                                        strokeWidth="5"/>

                            })
                        }

                        {/*目标*/}
                        {/*
                        <Line
                        x1="15"
                        y1="40"
                        x2={windowWidth-15}
                        y2="40"
                        strokeDasharray="5,5"
                        stroke="#ef5361"
                        strokeWidth="1" />
                        <Rect
                        x={windowWidth-48}
                        y="30"
                        rx="8"
                        ry="8"
                        width="32"
                        height="18"
                        fill="red"/>
                        <SvgText
                        stroke = "none"
                        fontSize = "10"
                        fill='#fff'
                        x={windowWidth-42}
                        y="31.5"
                        style={{fontFamily: 'PingFangSC-Regular'}}>推荐</SvgText>
                        */}

                        </Svg>
                        <View style={styles.chartBottomList}>
                            {
                                /*X轴坐标*/
                                (chartMonthBottom || []).map((item, index) => {
                                    return  <Text key={index} style={styles.chartBottomText}>{item}</Text>
                                })
                            }
                        </View>
                    </View>
                    <View style={styles.chartTipsContainer}>
                        <View style={styles.chartTipsDotStyle}>
                            <View style={styles.chartTipsDotOne}></View>
                            <Text style={styles.chartTipsStyle}>深睡</Text>
                        </View>
                        <View style={styles.chartTipsDotStyle}>
                            <View style={styles.chartTipsDotTwo}></View>
                            <Text style={styles.chartTipsStyle}>浅睡</Text>
                        </View>
                    </View>
                </View>)
        }else if(this.props.sleepTypes == "Year"){
            chart = (
                <View style={{backgroundColor: '#ebebeb',}}>
                <View style={styles.svgContainer}>
                    <Svg height="150" width={windowWidth-15}>
                        <Line
                        x1="15"
                        y1="150"
                        x2={windowWidth-15}
                        y2="150"
                        stroke="#ebebeb"
                        strokeWidth="2" />

                        {
                            /*网格三条线*/
                            (this.state.lingWeekLength || []).map((item, index) => {
                                return  <Line
                                        x1="15"
                                        y1={150 - (index + 1) * 50}
                                        x2={windowWidth-15}
                                        y2={150 - (index + 1) * 50}
                                        stroke = "#ebebeb"
                                        strokeWidth={1}
                                        key={index}/>
                            })
                        }


                        {
                            /*左边y轴坐标*/
                            (this.state.chartYearLeftTet || []).map((item, index) => {
                                return  <SvgText
                                        stroke = "none"
                                        fontSize = "10"
                                        fill='#c2c2c2'
                                        strokeWidth="1"
                                        x="15"
                                        y={152 - (index + 1) * 50}
                                        key={index}
                                        style={{fontFamily: 'PingFangSC-Regular'}}>{item}</SvgText>
                            })
                        }

                        {
                            /*深度睡眠的柱状图*/
                            (deepSleepYearPosition || []).map((item, index) => {
                                return   <Path
                                        d={item}
                                        key = {index}
                                        fill="none"
                                        stroke="#c5a2fc"
                                        strokeWidth="10"/>
                            })
                        }

                        {
                            /*浅度睡眠的柱状图*/
                            (shallowSleepYearPosition || []).map((item, index) => {
                                return  <Path
                                        d={item}
                                        key = {index}
                                        fill="none"
                                        stroke="#e1d1fb"
                                        strokeWidth="10"/>

                            })
                        }

                        {/*目标*/}
                        {/*
                        <Line
                        x1="15"
                        y1="40"
                        x2={windowWidth-15}
                        y2="40"
                        strokeDasharray="5,5"
                        stroke="#ef5361"
                        strokeWidth="1" />
                        <Rect
                        x={windowWidth-48}
                        y="30"
                        rx="8"
                        ry="8"
                        width="32"
                        height="18"
                        fill="red"/>
                        <SvgText
                        stroke = "none"
                        fontSize = "10"
                        fill='#fff'
                        x={windowWidth-42}
                        y="31.5"
                        style={{fontFamily: 'PingFangSC-Regular'}}>推荐</SvgText>
                        */}

                        </Svg>
                        <View style={styles.chartBottomList}>
                            {
                                /*X轴坐标*/
                                (chartYearBottom || []).map((item, index) => {
                                    return  <Text key={index} style={styles.chartBottomText}>{item}</Text>
                                })
                            }
                        </View>
                    </View>
                    <View style={styles.chartTipsContainer}>
                        <View style={styles.chartTipsDotStyle}>
                            <View style={styles.chartTipsDotOne}></View>
                            <Text style={styles.chartTipsStyle}>深睡</Text>
                        </View>
                        <View style={styles.chartTipsDotStyle}>
                            <View style={styles.chartTipsDotTwo}></View>
                            <Text style={styles.chartTipsStyle}>浅睡</Text>
                        </View>
                    </View>
                </View>)
        }
        return (
            <View>
                {chart}
            </View>
        )
    }
}
