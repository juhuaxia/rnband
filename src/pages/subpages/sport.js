import React from 'react';
//import SportCricle from 'PaiBandRN/src/components/sport/sportcricle';
import SportCricle from 'PaiBandRN/src/components/charts/circle';
import SportSetPop from 'PaiBandRN/src/components/sport/sportsetpop';
import Calendar from 'PaiBandRN/src/components/calendar/index';
//import SportChart from 'PaiBandRN/src/components/sport/sportchart';
import SportChart from 'PaiBandRN/src/components/charts/bar1';
import { StyleSheet,Animated,Easing, Text, View ,Image,Dimensions,Modal,TouchableOpacity,ListView,ScrollView} from 'react-native';
import Svg,{ Circle,} from 'react-native-svg';
import Calendarl from 'react-native-calendar';
import stylesC from './styles';
import StylesCommon from 'PaiBandRN/src/style/common';
import PageNotice from 'PaiBandRN/src/notice/page';
import IComponent from 'PaiBandRN/src/components/icomponent';
import DescriptionBox from 'PaiBandRN/src/components/descriptionBox';
import Recommend from 'PaiBandRN/src/components/recommend';
import sportService from 'PaiBandRN/src/services/sport';
import Utils from 'PaiBandRN/src/utils';

const winWidth = Dimensions.get('window').width;

export default class Sport extends IComponent {
    constructor(props){
        super(props);

        const d = new Date();
        const sportData = {
            "data":(() => {
                const arr = [];
                for(let i = 3000; i <= 30000; i+= 1000) {
                    if(i == 6000) {
                        arr.push(i + '(' + this.i18n('sport_target_recommend') + ')');
                        continue;
                    }
                    arr.push(i + '');
                }
                return arr;
            })(),
            "chartData":{
                "data":[
                    {
                        date: "2017-02-27",
                        steps: 0,
                        utime: 1488153600
                    },
                    {
                        date: "2017-02-28",
                        steps: 0,
                        utime: 1488240000
                    },
                    {
                        date: "2017-03-01",
                        steps: 2713,
                        utime: 1488326400
                    },
                    {
                        date: "2017-03-02",
                        steps: 204,
                        utime: 1488412800
                    }
                ],
                lingLength: [1, 2, 3,],
                chartLeftTet: ['3000', '6000', '9000'],
                walkPoint: [
                    3000,
                    4000,
                    5000,
                    3000,
                    6000,
                    3000,
                    7000,
                ],
                runPoint: [
                    4000,
                    5000,
                    6000,
                    5000,
                    8000,
                    5000,
                    9000,
                ]
            }
        };
        this.state={
            orderStatuts:sportData,
            setSport:false,
            calendarPop:false,
            modalVisible: false,//控制遮罩层是否显示
            transparent: true,
            animationType: "fade",
            currentDayVal:null,//日历
            selectedDate: [d.getFullYear(), ('0' + (d.getMonth()+1)).substr(-2), ('0' + d.getDate()).substr(-2)].join('-'),//日历
            eventDates: [],
            fadeAnim: new Animated.Value(0),//日历
            todayData:{},//今天的数据
            chartData:[],
            today_summary:{},
            last_update_text:'',
            consume_food:'今天还没有任何消息',
            active_tips:'No summary',
            motion_tips:{},
            lingLength:[1, 2, 3,],//图表线
        }
    }

    //日历
    componentDidMount() {
        this._animate();
        const d = new Date();
        const today = [d.getFullYear(), ('0' + (d.getMonth()+1)).substr(-2), ('0' + d.getDate()).substr(-2)].join('-');
        this._getData(today);
        this._getMonthDataDate(d.getFullYear(), d.getMonth() + 1);
    }

    _getData(date){
        sportService.getToday(date).then(data => {
            // if(data.http_code == 200){
                console.log('sportService data', data);
                if(data) {
                    this.setState({
                        eventDates: this.state.eventDates.concat([date]),
                        todayData:data.today,
                        chartData:data.data,
                        today_summary:data.today_summary,
                        last_update_text:data.last_update_text,
                        active_tips:data.today_summary?data.today_summary.active_tips :'No summary',
                        motion_tips:data.motion_tips
                    })
                }
            // }
            
        }).catch(e => {
            console.log('sportService getToday error', e);
        });
    }

    _getMonthDataDate(year, month) {
        sportService.getMonthSportData(year, month).then(data => {
            console.log('获取当月的运动数据',data)
            if(data) {
                const dates = [];
                for(let i = 0; i < data.data.length; i++) {
                    if(data.data[i]['steps'] > 0) {
                        dates.push(data.data[i]['date']);
                    }
                }
                console.log('get month', data, dates);
                this.setState({
                    eventDates: dates.concat(this.state.eventDates)
                });
            }
        });
    }

    //日历
    _animate() {
        Animated.timing(this.state.fadeAnim, {
            toValue: 1,
            duration: 1000,
            // delay: 1000,
            easing: Easing.ease
        }).start()
    }

    //sportChart(){
        //this.sendNotification(PageNotice.PAGE_SPORTCHARTPAGE);
        //this._setModalVisible(false);
    //}

    _setModalVisible(visible) {
        this.setState({
            modalVisible: visible,
            setSport:visible,
            calendarPop:visible,
        });
    }

    _setTargetStep(steps){
        this.setState({
            modalVisible: false,
            setSport:false,
            calendarPop:false,
        });

        //let todayData = this.state.todayData;
        //todayData.target_steps = steps
        sportService.setTarget(steps).then(data => {
            // if(data.http_code == 200){
                //this.setState({
                    //todayData:todayData
                //})
                const now = new Date();
                let today = [now.getFullYear(), now.getMonth() + 1, now.getDate()].join('-');
                // today = '2016-12-19'
                this._getData(today);
            // }
            
        }).catch(e => {
            console.log('sportService getToday error', e);
        });
    }

    _showSportSet(){
        this.setState({
            modalVisible: true,
            setSport:true,
        });
    }

    _showCalendarInfo(){
        this.setState({
            modalVisible: true,
            calendarPop:true,
        });
    }

    //onCallback(arg){
        //setTimeout(()=>{
            //let winger = [];
            //winger.push(arg.selY);
            //winger.push(arg.selM);
            //winger.push(arg.selD);
        //},1000);
    //}

    _dateSelectHandler(date){
        date = [date.getFullYear(), date.getMonth() + 1, date.getDate()].join('-');
        this.setState({
            selectedDate: date,
            calendarPop:false,
            modalVisible: false
        });
        this._getData(date);
    }

    _dateChangeHandler(date) {
        this._getMonthDataDate(date.getFullYear(), date.getMonth() + 1);
    }

    _showAnalysis(){
        this.setState({
            calendarPop:false,
            modalVisible: false,
        })
        this.sendNotification(PageNotice.PAGE_SELECT_SUBPAGE, {
            title: this.i18n('sport_title_statistics'),
            name: 'sportChart',
            data:{
                month:this.state.selectedDate.split('-')[1],
                date:this.state.selectedDate
            }
        })
    }

    _getChartData() {
        const datas = [];
        const xScales = [];
        for(let i = 0; i <= 24; i++) {
            datas.push([0, 0]);
            if(this.i18nLang == 'en') {
                if(i % 6 == 0) {
                    if(i == 0 || i == 24) {
                        xScales.push('12:00AM');
                    } else if(i < 12) {
                        xScales.push(i +':00AM');
                    } else if(i == 12) {
                        xScales.push('12:00PM');
                    } else {
                        xScales.push(i - 12 + ':00PM');
                    }
                } else {
                    if(i < 12) {
                        xScales.push({title: i + ':00AM', show: false});
                    } else {
                        xScales.push({title: i - 12 + ':00PM', show: false});
                    }
                }
            }
        }
        for(let i = 0; i < this.state.chartData.length; i++) {
            const item = this.state.chartData[i];
            datas[parseInt(item['hour'])] = [item.stepsDetail['1'], item.stepsDetail['2']];
        }
        let target = null;
        if(this.state.todayData && this.state.todayData.target_steps) {
            target = { data: this.state.todayData.target_steps };
        }
        return { datas, xScales, target };
    }

    render() {
        // console.log('compolete',this.state.todayData);
        let setSportPop = null;
        if(this.state.setSport == true){
            setSportPop = <SportSetPop orderStatuts = {this.state.orderStatuts}  onFinish = {this._setTargetStep.bind(this)}/>;
        }
        let calendarContent = null;
        if(this.state.calendarPop == true){
            calendarContent = <Calendar selectedDate={this.state.selectedDate} eventDates={this.state.eventDates} onDateSelect={(date)=>this._dateSelectHandler(date)} onDateChange={date=>this._dateChangeHandler(date)} onAnalysis={()=>this._showAnalysis()}></Calendar>
        }
        let showSelectDate = this.state.selectedDate.split('-');
        showSelectDate.push(showSelectDate.shift());
        if(this.i18nLang == 'en') {
            const customMonthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May','Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            showSelectDate[0] = customMonthNames[Number(showSelectDate[0]) - 1];
            showSelectDate = `${showSelectDate[0]} ${Number(showSelectDate[1])}, ${showSelectDate[2]}`;
        } else {
            showSelectDate = showSelectDate.join('-');
        }
        const chartData = this._getChartData();
        return (
            <ScrollView style={styles.container}>
                {/*头部*/}
                <View style={StylesCommon.common_gap}/>
                <View style={[StylesCommon.common_card, styles.sportTopWrap]}>
                    <TouchableOpacity onPress = {this._showCalendarInfo.bind(this)} style={styles.sportTopDateWrap}>
                        <Image  source={require('PaiBandRN/res/images/calendar_purple_icon_n.png')}/>
                        <Text style={styles.sportTopDateText}>{showSelectDate}</Text>
                    </TouchableOpacity>
                    <View style={styles.cricleWrap}>
                        <SportCricle radius={100} percent={this.state.todayData.target_complete/100||0}/>
                        <View style={styles.cricleTextWrap}>
                            <View style={styles.setWrap}>
                                <Text style={styles.setText}>{this.i18n('sport_data_target')}:{this.state.todayData.target_steps || 0}</Text>
                                {
                                    ((new Date() - new Date(this.state.selectedDate))/(24*60*60*1000)).toString().substr(0, 2) == '0.' ? (<TouchableOpacity onPress={this._showSportSet.bind(this)}>
                                        <Image style={{marginLeft: 10}}source={require('PaiBandRN/res/images/sportsdata_edit_icon.png')}></Image>
                                    </TouchableOpacity>) : null
                                }
                            </View>
                            <View style={styles.targetStep}>
                                <Text style={styles.targetStepText}>{this.state.todayData.steps || 0}</Text>
                            </View>
                            <View style={[styles.targetStep, {marginTop: 10}]}>
                                <Text style={[styles.setText, {backgroundColor: 'transparent', fontSize: 10, color: "#624A81"}]}>{this.state.last_update_text}</Text>
                                <Text style={[styles.setText, {fontSize: 10, marginTop: 5}]}>{this.i18n('sport_data_sync')}</Text>
                            </View>
                        </View>
                    </View>
                </View>
                <View style={StylesCommon.common_gap}/>
                <View style={[StylesCommon.common_card, styles.chart]}>
                    <View style={styles.detailsStepWrap}>
                        <View style={{flex: 3, marginLeft: 20, flexDirection: "row"}}></View>
                        <View style={{flex: 1, marginRight: 20, flexDirection: "row", justifyContent: "flex-end"}}>
                            <Text style={styles.detailsStepText}>{this.i18n('sport_chart_distance')}</Text>
                            <Text style={[styles.detailsStepText, {
                                marginLeft: 5, marginRight: 5
                            }]}>{Number((this.i18nLang == 'en' ? Utils.km2mi(Number(this.state.todayData.distance * 0.001)) : Number(this.state.todayData.distance * 0.001)).toFixed(2)) || 0}</Text>
                            <Text style={styles.detailsStepText}>{this.i18nLang == 'en' ? 'mi' : 'km'}</Text>
                        </View>
                    </View>
                    <SportChart
                        width={winWidth-24}
                        data={chartData.datas}
                        xScales={chartData.xScales}
                        yScaleCount={5}
                        //markArea={{range: [100, 300], color: 'rgba(79,176,198,0.1)'}}
                        legend={[{color: '#C2AEDB', title: this.i18n('sport_chart_walk')}, {color: '#6735A5', title: this.i18n('sport_chart_run')}]}
                        target={chartData.target}
                        indicator={{title: this.i18n('sport_chart_indicator'), data: 0}}
                        //barWidth={10}
                        >
                    </SportChart>
                </View>
                <View style={StylesCommon.common_gap}/>
                <Modal
                    animationType = {this.state.animationType}
                    transparent={this.state.transparent}
                    visible={this.state.modalVisible}
                    onRequestClose={() => {this._setModalVisible.bind(this, false)}}>
                    <View style={styles.mark}>
                        <TouchableOpacity style={styles.mark} onPress={this._setModalVisible.bind(this, false)}></TouchableOpacity>
                    </View>
                    {setSportPop}
                    {calendarContent}
                </Modal>
                {/*运动数据统计分析*/}
                {/*<SportChart
                    chartData={this.state.chartData}
                    target_steps={this.state.todayData.target_steps || 0}
                    showTarget={false}
                    >
                </SportChart>*/}
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex:1,
        backgroundColor:'#ebebeb'
    },
    sportTopWrap:{
        flex: 1,
        marginTop:64,
        alignItems:"center",
        justifyContent:"center",
        paddingBottom: 20
    },
    sportTopBg:{
        flex:1,
        height:300,
    },
    sportTopDateWrap:{
        height:50,
        marginRight:30,
        marginLeft:30,
        alignItems:"center",
        justifyContent:"center",
        flexDirection:"row",
    },
    sportTopDateText:{
        fontSize:16,
        color:"#000",
        marginLeft:10,
    },
    cricleWrap:{
        flex: 1,
        alignItems:"center",
        justifyContent:"center",
        position:"relative",
    },
    cricleTextWrap:{
        position:"absolute",
        left:0,
        top:0,
        zIndex:4,
        width:200,
    },
    setWrap:{
        flexDirection:"row",
        marginTop:40,
        alignItems:"center",
        justifyContent:"center",
    },
    setText:{
        color:"rgba(0,0,0,0.38)",
        fontSize:12,
    },
    chart: {
        flex: 1,
        paddingBottom: 10
    },
    targetStep:{
        alignItems:"center",
    },
    targetStepText:{
        marginTop: 10,
        fontSize:46,
        color:"rgba(0,0,0,0.88)",
    },
    detailsStepWrap:{
        flex: 1,
        flexDirection:"row",
        marginTop: 18,
        marginBottom: 18
    },
    detailsStep:{
        flex:1,
        alignItems:"center",
        paddingTop:15,
        paddingBottom:15,
    },
    detailsStepText:{
        fontSize: 12,
        color:"#121212",
        opacity: 0.8
    },
    detailsStepTextDown:{
        fontSize:12,
        color:"#959595"
    },
    detailsStepTip:{
        paddingTop:16,
        paddingBottom:16,
        borderTopWidth:1,
        borderColor:"#e1e1e1",
        flexDirection:"row",
        alignItems:"center",
        justifyContent:"center",
        backgroundColor: '#FFF'
    },
    mark:{
        backgroundColor:"#000",
        opacity:0.5,
        flex:1,
        marginTop:64,
    },
});

const customStyle = {
    calendarContainer: {
      backgroundColor: '#fff',
    },
    dayButton:{
        borderTopColor:'transparent'
    },
    dayHeading:{
        color:'#959595',
    },
    weekendHeading:{
        color:'#959595',
    },
    calendarHeading:{
        borderTopWidth:0,
        borderBottomWidth:0,
        backgroundColor:'#f5f5f5',
        height:32,
        alignItems: 'center',
    },
    selectedDayCircle:{
        backgroundColor:'#f3ecfe',
        borderRadius:4
    },
    selectedDayText: {
        color: '#8b49f6',
        fontWeight: 'bold'
    },
    currentDayCircle:{
        backgroundColor:'transparent',
        borderBottomColor:'#8b49f6',
        borderBottomWidth:1,
        borderStyle:'solid',
        borderRadius:0
    },
    currentDayText:{
        color: '#8b49f6',
        borderBottomColor:'#8b49f6',
        borderBottomWidth:1,
        borderStyle:'solid',
        borderRadius:0
    },
    controlButtonText:{
        color:'#8b49f6'
    }
}

