import React,{Component} from 'react';
import {View,Picker,StyleSheet,Text,Image} from 'react-native';

class Calendar extends Component {

    static propTypes = {
        startY: React.PropTypes.number.isRequired,
        startM: React.PropTypes.number.isRequired,
        startD: React.PropTypes.number.isRequired,
        endY: React.PropTypes.number.isRequired,
        pickerKey: React.PropTypes.string,
        onCallback: React.PropTypes.func.isRequired,
    };
    constructor(props) {
        super(props);
        // 可选年
        let years = [];
        for(let i = this.props.startY;i <= this.props.endY; i++){
            years.push(i)
        }
        // 可选月
        let months = [];
        for(let i = this.props.startM;i <= 12; i++){
            months.push(i)
        }
        // 可选日
        let days = [];
        let Tdays = this.getDays(new Date(this.props.startY + '/' + this.props.startM +'/0'));
        for(let i = this.props.startD;i <= Tdays; i++){
            days.push(i)
        }
        this.state = {
            years,
            months,
            days,
            selY:this.props.startY,
            selM:this.props.startM,
            selD:this.props.startD
        }
    }
    // 获取当前月总共天数
    getDays(date){
        date.setMonth(date.getMonth() + 1);
        date.setDate(0);
        return date.getDate();
    }

    render(){
        return (
            <View style={styles.wrap}>
                <View style={styles.container}>
                    <View style={styles.years}>
                        <View style={styles.canWrap}><Text style={styles.canText}>年</Text></View>
                        <Picker
                            selectedValue={this.state.selY}
                            onValueChange={(v) => {
                                // 当前选择时间
                                let selDate = new Date(v + '/' + this.state.selM + '/0');

                                // 起始月份,起始第几天,选择月份,选择第几天
                                let i = 1,j = 1,selM = this.state.selM,selD = this.state.selD;
                                // 当前年份 <= 起始年份，如果小于起始年份，重置数据
                                if(v <= this.props.startY){
                                    selDate = new Date(this.props.startY+'/'+this.props.startM+'/'+this.props.startD);
                                    i = this.props.startM;
                                    j = this.props.startD;
                                    selM = this.props.startM;
                                    selD = this.props.startD;
                                }
                                // 生成月份数组
                                let months = [];
                                for(;i <= 12; i++){
                                    months.push(i);
                                }
                                // 获取选择月份总共天数
                                let Tdays = this.getDays(selDate);
                                // 生成天数数组
                                let days = [];
                                for(;j <= Tdays; j++){
                                    days.push(j);
                                }
                                // 设置当前选中时间，对应月份，和天数进行更新
                                this.setState({
                                    selY: v,
                                    selM,
                                    selD,
                                    months,
                                    days
                                });
                                // 返回当前选择的时间
                                this.props.onCallback && this.props.onCallback({
                                    key:this.props.pickerKey,
                                    selY:v,
                                    selM,
                                    selD
                                })
                            }
                        }>
                            {
                            this.state.years.map((year)=>{
                                return <Picker.Item label={'' + year} value={year} key={year}/>
                            })
                            }
                        </Picker>
                    </View>
                    <View style={styles.months}>
                        <View style={styles.canWrap}><Text style={styles.canText}>月</Text></View>
                        <Picker
                            selectedValue={this.state.selM}
                            onValueChange={(v) => {
                                // 已选年份，当前选择月份，已选天数
                                let selY = this.state.selY,selM = v ,selD = this.state.selD;
                                // 开始时间
                                let startDate = new Date(this.props.startY+'/'+this.props.startM + '/0');
                                // 当前选择时间
                                let selDate = new Date(selY + '/' + selM  + '/0');
                                // 选择时间小于开始时间，则重置选择时间
                                let i = 1;
                                if(selDate <= startDate) {
                                    selDate = startDate;
                                    i = this.props.startD;
                                    selD = this.props.startD;
                                }
                                // 获取当前月份对应总共天数
                                let Tdays = this.getDays(selDate);
                                let days = [];
                                for(;i <= Tdays; i++){
                                    days.push(i)
                                }
                                // 设置选择时间
                                this.setState({
                                    selM: v,
                                    selD,
                                    days
                                });
                                // 返回选择时间
                                this.props.onCallback && this.props.onCallback({
                                    key:this.props.pickerKey,
                                    selY,
                                    selM:v,
                                    selD,
                                })
                            }
                        }>
                            {
                            this.state.months.map((month)=>{
                                return <Picker.Item label={'' + month} value={month} key={month}/>
                            })
                            }
                        </Picker>
                    </View>
                    <View style={styles.days}>
                        <View style={styles.canWrap}><Text style={styles.canText}>日</Text></View>
                        <Picker
                            selectedValue={this.state.selD}
                            onValueChange={(v) => {
                                this.setState({selD: v});
                                let date = this.state.selY+ '/' + this.state.selM + '/' + v;
                                this.props.onCallback && this.props.onCallback({
                                    key:this.props.pickerKey,
                                    selY:this.state.selY,
                                    selM:this.state.selM,
                                    selD:v
                                })
                            }}>
                            {
                            this.state.days.map((day)=>{
                                return <Picker.Item label={'' + day} value={day} key={day}/>
                            })
                            }
                        </Picker>
                    </View>
                </View>
                <View style={styles.lookInfo}><Image source={require('PaiBandRN/res/images/icon_20_89@2x.png')}></Image><Text style={styles.lookInfoText}>查看统计分析</Text></View>
            </View>
        )
    }
}
const styles = StyleSheet.create({
    wrap:{
        position:"absolute",
        top:64,
        left:0,
        right:0,
        backgroundColor:'#fff',
    },
    container:{
        flex:1,
        flexDirection:'row',
    },
    years:{
        flex:1,
    },
    months:{
        flex:1
    },
    days:{
        flex:1
    },
    canWrap:{
        alignItems:"center",
        justifyContent:"center",
        borderTopWidth:1,
        borderBottomWidth:1,
        borderColor:"#e1e1e1",
        paddingTop:10,
        paddingBottom:10,
        backgroundColor:"#f5f5f5"
    },
    canText:{
        fontSize:16,
    },
    lookInfo:{
        paddingBottom:15,
        paddingTop:15,
        borderTopWidth:1,
        borderColor:"#e1e1e1",
        alignItems:"center",
        justifyContent:"center",
        flexDirection:"row",
    },
    lookInfoText:{
        fontSize:16,
        paddingLeft:5,
        color:"#8b49f6",
    },
})


export default Calendar;
