import React, {
    Component
} from 'react';
import { StyleSheet, Text, View,Dimensions } from 'react-native';
import Svg, { Line, Path, Ellipse,Defs,G,Use,Circle,Rect} from 'react-native-svg';
import { Text as SvgText } from 'react-native-svg';

let windowWidth = Dimensions.get('window').width;
import IComponent from 'PaiBandRN/src/components/icomponent';
import COMNotice from 'PaiBandRN/src/notice/component';

let walkPosition = [];
let runPosition = [];

export default class SportChart extends IComponent {
    Proptypes:{
        lingLength:React.Proptypes.Array,
        chartLeftTet:React.Proptypes.Array,
        walkPoint:React.Proptypes.Array,
        runPoint:React.Proptypes.Array,
    }

    constructor(props) {
        super(props);
        this.state = {
            showTarget: props.showTarget || props.showTarget == undefined,
            lingLength:[1,2,3],
            chartLeftTet:[],
            // chartBottom:['周一', '周二', '周三', '周四','周五','周六','周日'],
            chartBottom:['0:00', '6:00', '12:00', '18:00','24:00'],
            walkPoint:[],
            runPoint:[],
            tet_max:0,
        }

        this._pathClickHandler = this._pathClickHandler.bind(this);
    }

    carculateChartLeftTet(){
        // console.log(this.props.chartData);
        //计算纵坐标刻度
        let tet_data = [],walkPoint = [],runPoint=[];
        const target = this.props.target_steps;
        this.props.chartData.map((item)=>{
            if(item){
                tet_data.push(item.steps);
                walkPoint.push({
                    date:parseInt(item.hour),
                    step:item.stepsDetail?item.stepsDetail[1]:0
                });
                runPoint.push({
                    date:parseInt(item.hour),
                    step:item.stepsDetail?item.stepsDetail[2]:0
                })
            }
        });
        
        let tet_min = (()=>{
            const min = Math.min.apply(Math,tet_data)
            if(min < 100 || tet_data.length <= 1){
                return 0
            }
            const tmin = Math.min(min);
            if(tmin >2000){
                return Math.floor(tmin*0.001)*1000 - 1000;
            }
            return Math.floor(tmin*0.01)*100;
        })();
        tet_min = Math.floor(tet_min/300)*300;
        tet_min = 0;

        let tet_max = (()=>{
            const max = Math.max.apply(Math,tet_data)
            // console.log('target_steps',this.props.target_steps);
            //if(tet_data.length == 0 && target > 500){
                //return parseInt(target) + 1000;
            //}
            const tmax = Math.max(max);
            if(tmax < 100){
                return 300
            }
            if(tmax >2000){
                return Math.ceil(tmax*0.001)*1000+1000
            }
            return Math.ceil(tmax*0.01)*100+100;
        })();
        tet_max = Math.ceil(tet_max/300)*300;
        //let tet_min = (()=>{
            //const min = Math.min.apply(Math,tet_data)
            //if(min < 100 || tet_data.length <= 1){
                //return 0
            //}
            //if(min >2000){
                //return Math.floor(min*0.001)*1000
            //}
            //return Math.ceil(min*0.001)*100;
        //})();

        //let tet_max = (()=>{
            //const max = Math.max.apply(Math,tet_data)
            //// console.log('max',max);
            //if(tet_data.length == 0 && this.props.target_steps > 500){
                //return parseInt(this.props.target_steps) + 1000;
            //}
            //if(max < 100){
                //return 500
            //}
            //if(max >2000){
                //return Math.ceil(max*0.001)*1000+1000
            //}
            //return Math.ceil(max*0.001)*100+100;
        //})();

        let tet_mid = (()=>{
            return Math.ceil((tet_max+tet_min)/2);
        })()

        //let chartLeftTet = new Array(tet_min,tet_mid,(tet_max<=this.props.target_steps?this.props.target_steps:tet_max));
        
        let chartLeftTet = new Array(tet_min,tet_mid,tet_max);

        this.setState({
            walkPoint:walkPoint,
            runPoint:runPoint,
            chartLeftTet:chartLeftTet,
            tet_max:tet_max
        }, () => {
            this.drawChart({tet_max,tet_mid,tet_min});
            this.forceUpdate();
        })
        
    }

    componentWillReceiveProps(nextprops) {
        this.props = nextprops;
        this.carculateChartLeftTet();
        //走路跑步的数据转化为path路径，X轴坐标为总宽度除以7乘以数据索引，Y轴坐标为9000-数据(svg坐标原点为左上角) windowWidth-25(左边留出25pt的距离)
        // let gap = this.state.walkPoint.length;
        // this.state.walkPoint.forEach((item, index) => {
        //     walkPosition.push('M' + (((windowWidth-25)/gap)*(index+1)).toFixed(0) + ' '+ '150' +' ' + 'L'+ (((windowWidth-25)/gap)*(index+1)).toFixed(0) +' '+ ((9000-item)*50/3000).toFixed(0) + ' ');
        // // console.log(walkPosition);
        // })
        // this.state.runPoint.forEach((item, index) => {
        //     runPosition.push('M' + (((windowWidth-25)/gap)*(index+1)).toFixed(0)+ ' '+ '150' +' ' + 'L'+ (((windowWidth-25)/gap)*(index+1)).toFixed(0) +' '+ ((9000-item)*50/3000).toFixed(0) + ' ');
        // })
    }

    drawChart(o){
        let {tet_max,tet_min} = o,
            gap = 24;
        
        walkPosition = [];
        this.state.walkPoint.forEach((item, index) => {
            let {step} = item;
            let pos = this.conculatePos(item, gap);
            walkPosition.push({
                path: 'M' + pos + ' '+ '150' +' ' + 'L'+ pos +' '+ (150-step/tet_max*150).toFixed(0) + ' ',
                data: item
            });
            // walkPosition.push('M' + (((windowWidth-25)/walkgap)*(index+1)).toFixed(0) + ' '+ '150' +' ' + 'L'+ (((windowWidth-25)/walkgap)*(index+1)).toFixed(0) +' '+ 37 + ' ');
        // console.log(walkPosition);
        })
        runPosition = [];
        this.state.runPoint.forEach((item, index) => {
            let {step} = item;
            let pos = this.conculatePos(item, gap);
            let c_step = step + this.state.walkPoint[index].step
            runPosition.push({
                path: 'M' + pos+ ' '+ '150' +' ' + 'L'+ pos +' '+ (150-c_step/tet_max*150).toFixed(0) + ' ',
                data: item
            });
        })
    }

    conculatePos(item, gap){
        let date = item.date;
        return (((windowWidth-55)/gap)*date + 55).toFixed(0)
    }

    _pathClickHandler(type, d) {
        //console.log(type, d);
    }

    // renderBaseLine(){
    //     return this.props.target_steps==0?''::
    // }

    render() {
        // console.log("sportchartprops:",this.props);
        //由于刻度有4分，但是区域只分为了3块，所以按照刻度线来算的话，其实真正的顶部最大值的位置，是第三条刻度线的位置，所以需要加上50
        //还是这个问题，最大值的一半，其实并非整个SVG的一半，而是3/4
        // console.log('percent',this.props.target_steps,this.state.tet_max)
        let baseLineProp = this.props.target_steps==0? {h:150,color:'#ebebeb',textBg:'transparent',textColor:'transparent'} : {h:(((100-this.props.target_steps/this.state.tet_max*100)+50).toFixed(0)),color:'#ef5361',textBg:'red',textColor:'#fff'};
        let chart = (
            <View style={styles.chartView}>
                <View style={styles.svgContainer}>
                    <Svg height="150" width={windowWidth} >
                        <Line
                        x1="15"
                        y1="150"
                        x2={windowWidth}
                        y2="150"
                        stroke="#ebebeb"
                        strokeWidth="2" />

                        {
                            /*网格三条线*/
                            (this.state.lingLength || []).map((item, index) => {
                                return  <Line
                                        x1="15"
                                        y1={150 - (index + 1) * 50}
                                        x2={windowWidth}
                                        y2={150 - (index + 1) * 50}
                                        stroke = "#ebebeb"
                                        strokeWidth={1}
                                        key={index}/>
                            })
                        }


                        {
                            /*左边y轴坐标*/
                            ((() =>{
                              const src = this.state.chartLeftTet;
                              const min = src[0];
                              const max = src[2];
                              if(min == undefined || max == undefined) {
                                return null;
                              }
                              return [min, min+parseInt((max-min)/3), min+parseInt(2*(max-min)/3)];
                            })() || []).map((item, index) => {
                                return  <SvgText
                                        stroke = "none"
                                        fontSize = "10"
                                        fill='#c2c2c2'
                                        strokeWidth="1"
                                        x="15"
                                        y={132 - (index) * 50}
                                        key={index}
                                        style={{fontFamily: 'PingFangSC-Regular'}}>{item}</SvgText>
                            })
                        }

                        {
                            /*跑步的柱状图*/
                            (runPosition || []).map((item, index) => {
                                return  <Path
                                        d={item.path}
                                        key = {index}
                                        fill="none"
                                        stroke="#ffe96c"
                                        strokeWidth="8"
                                        onPress={() => this._pathClickHandler('run', item.data)}    />

                            })
                        }

                        {
                            /*走路的柱状图*/
                            (walkPosition || []).map((item, index) => {
                                return   <Path
                                        d={item.path}
                                        key = {index}
                                        data-ooo='abc'
                                        fill="none"
                                        stroke="#ff9c0c"
                                        strokeWidth="8"
                                        onPress={() => this._pathClickHandler('walk', item.data)} />
                            })
                        }

                        {/*目标*/
                          this.state.showTarget ? [
                          <Line
                          x1="15"
                          y1={baseLineProp.h}
                          x2={windowWidth}
                          y2={baseLineProp.h}
                          strokeDasharray="5,5"
                          stroke={baseLineProp.color}
                          strokeWidth="1" />,
                          <Rect
                          x={windowWidth-38}
                          y={baseLineProp.h-10}
                          rx="10"
                          ry="10"
                          width="33"
                          height="20"
                          fill={baseLineProp.textBg}/>,
                          <SvgText
                          stroke = "none"
                          fontSize = "10"
                          fill={baseLineProp.textColor}
                          x={windowWidth-32}
                          y={baseLineProp.h-6}
                          style={{fontFamily: 'PingFangSC-Regular'}}>目标</SvgText>
                          ] : null
                        }

                        </Svg>
                        <View style={styles.chartBottomList}>
                            {
                                /*X轴坐标*/
                                (this.state.chartBottom || []).map((item, index) => {
                                    return  <Text key={index} style={styles.chartBottomText}>{item}</Text>
                                })
                            }
                        </View>
                    </View>
                    <View style={styles.chartTipsContainer}>

                        <View style={styles.chartTipsDotStyle}>
                            <View style={styles.chartTipsWalkDot}></View>
                            <Text style={styles.chartTipsStyle}>走路</Text>
                        </View>
                        <View style={styles.chartTipsDotStyle}>
                            <View style={styles.chartTipsRunDot}></View>
                            <Text style={styles.chartTipsStyle}>跑步</Text>
                        </View>
                    </View>
            </View>)

        return (
            <View>
                {chart}
            </View>
        )
    }
}

styles = StyleSheet.create({
    chartView:{
        backgroundColor:'#ebebeb',
        height:250,
    },
    /**
     * 图表样式
     */
    svgContainer: {
        backgroundColor: 'white',
        paddingTop: 40,
    },
    chart: {
        width: windowWidth,
        height: 300,
    },
    chartBottomList: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingLeft: 45,
        paddingRight:15,
        marginTop: 10,
    },
    chartBottomText: {
        fontSize: 10,
        color: "#c2c2c2",
        fontFamily: 'PingFangSC-Regular',
    },
    /**
     * 图标走路跑步提示
     */
    chartTipsContainer: {
        backgroundColor: '#fff',
        // flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        paddingTop: 13,
        paddingBottom: 18,
    },
    chartTipsDotStyle: {
        height: 20,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
    },
    chartTipsWalkDot: {
        height: 10,
        width: 10,
        borderRadius: 50,
        marginRight: 5,
        backgroundColor: '#ff9c0c',
    },
    chartTipsRunDot: {
        height: 10,
        width: 10,
        borderRadius: 5,
        marginRight: 5,
        backgroundColor: '#ffe96c',
    },
    chartTipsStyle: {
        fontSize: 12,
        marginLeft:5,
        marginRight:15,
        color: '#959595',
        fontFamily: 'PingFangSC-Regular',
    },
});
