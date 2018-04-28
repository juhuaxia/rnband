import React from 'react';
import IComponent from 'PaiBandRN/src/components/icomponent';
import COMNotice from 'PaiBandRN/src/notice/component';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Dimensions,
  Image,
  PickerIOS,
  ListView,
  TouchableOpacity,
  Platform,
} from 'react-native';
import PickerAndroid from 'PaiBandRN/src/components/PickerAndroid';
const Picker = Platform.OS === 'ios' ? PickerIOS : PickerAndroid;
// const Picker = PickerAndroid;

const windowWidth = Dimensions.get('window').width;

//点击什么是小花弹窗
class SportSetPop extends IComponent{
    Proptypes:{
        orderStatuts:React.Proptypes.Object,
        dataSource:React.Proptypes.Function,
    }


    constructor(props) {
        super(props);
        this.state = {
            targetValue:"6000(" + this.i18n('sport_target_recommend') + ")",
            itemPosition:"",
        }
    }

    onFinish(){
        let targetValue = this.state.targetValue;
        this.props.onFinish && this.props.onFinish(targetValue);
    }

    render() {
        return (
            <View style={styles.popCon}>
                <View style={styles.pop}>
                    <View style={{flexDirection:"row",marginTop:20,marginRight:15,borderBottomWidth:1,borderColor:"#e1e1e1"}}>
                        <View style={{flex:1,}}>
                            <Image source={require('PaiBandRN/res/images/img_band_modal_dialogue_60_02.png')} />
                        </View>
                        <View style={{flex:3,alignItems:"flex-end"}}>
                            <Text style={{fontSize:18,color:"#313131",paddingTop:5,}}>{this.i18n('sport_target_title1')}</Text>
                            {
                                this.i18nLang == 'en' ? null : (
                                    <Text style={{fontSize:12,color:"#959595",paddingTop:10,}}>根据中国孩子日常所需运动量推荐</Text>
                                )
                            }
                        </View>
                    </View>
                    <View style={{height:180,overflow:"hidden"}}>
                        <Picker
                            selectedValue={this.state.targetValue}
                            onValueChange={(lang,posi) => {
                                console.log(lang);
                                this.setState({
                                    targetValue: lang,
                                    itemPosition:posi
                                })
                            }}>
                            {this.props.orderStatuts.data.map((aOption) =>  <Picker.Item  label={aOption} value={aOption} key={aOption} /> )} 
                        </Picker>
                    </View>
                    <TouchableOpacity onPress = {()=>this.onFinish()} style={styles.btnWarp}>
                        <Text style = {styles.btnText}>{this.i18n('btn_complete')}</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
     }

};

var styles = StyleSheet.create({
    page: {
        width: 270,
    },
    popCon:{
        flex:1,
        alignItems:"center",
        justifyContent:"center",
        position:"absolute",
        top:150,
        left:(windowWidth - 270) * 0.5,
    },
    pop:{
        width:270,
        height:350,
        backgroundColor:"#fff",
        borderRadius:10,
        zIndex:15,
        overflow:"hidden",
    },
    btnWarp:{
        marginRight:25,
        alignItems:"center",
        justifyContent:"center",
        backgroundColor:"#8b49f6",
        marginLeft:25,
        height:45,
        borderRadius:25,
        marginTop:25,
    },
    btnText:{
        color:"#fff",
        fontSize:16,
    },
});

export default SportSetPop;
