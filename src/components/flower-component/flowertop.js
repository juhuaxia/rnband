
import React from 'react';
import IComponent from 'PaiBandRN/src/components/icomponent';
import COMNotice from 'PaiBandRN/src/notice/component';
import {
    StyleSheet, Text, View, Image,TouchableOpacity,Dimensions
} from 'react-native';
import flowersService from 'PaiBandRN/src/services/flowers';
const winWidth = Dimensions.get('window').width;
//头部
class FlowerTop extends IComponent{
    Proptypes:{
        flowersNumInfo:React.Proptypes.Object,
    }

    constructor(props){
        super(props);
        this.state={
            flowersNum:this.props.flowersNumInfo,
        }
    }

    componentWillReceiveProps(nextProps){
            this.state.flowersNum = nextProps.flowersNumInfo;
    }

    componentDidMount(){
        this.addSubscriber(COMNotice.FLOWERSCHANGE, this.changeFlowersNum)
    }

    componentWillUnmount(){
        this.removeSubscriber(COMNotice.FLOWERSCHANGE, this.changeFlowersNum)
    }

    changeFlowersNum(cur_num){
        this.setState({
            flowersNum:{
                current_num:cur_num
            }
        });
    }

    render(){
        let dataIsNull = null;
        console.log(this.state.flowersNum, this.state.flowersNum.current_num );
        if(this.state.flowersNum !== null && this.state.flowersNum.current_num > 0){
            dataIsNull = <Image  style={styles.flowerye} source = {require('PaiBandRN/res/images/img_band_flower_petal.png')} />;
        }
	    return (
            <View style={{alignItems:"center"}}>
                <Image source = {require('PaiBandRN/res/images/img_band_floewe_cover.png')} style = {styles.topImage}>
                    <View style = {styles.flowerNumWarp}>
                        <Text  style={styles.flowerNum}>{this.state.flowersNum.current_num || 0}</Text>
                    </View>
                    <View style = {styles.flowerBottom}>
                        <View style = {styles.flowerWarp}>
                            <Image source = {require('PaiBandRN/res/images/img_band_flower_sapling.png')}>
                            </Image>
                            {dataIsNull}
                        </View>
                        <View style={styles.flowerTipContainer}>
                            <TouchableOpacity style={styles.flowerTip} onPress = {this.props.onPress} >
                                <Image source = {require('PaiBandRN/res/images/icon_16_26.png')} />
                                <Text style = {styles.flowerTipText}>什么是小花</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Image>
            </View>
	    )
    }
}

const styles = StyleSheet.create({
    flowerTopWrap:{
        alignItems:"center",
    },
    flowerBottom:{
        flex:1,
        flexDirection:"row",
    },
    topImage:{
        width:winWidth
    },
    flowerye:{
        position:"absolute",
        left:20,
        bottom:6,
    },
    flowerNum:{
        color:"#fff",
        fontSize:46,
        paddingTop:51,
        // fontFamily:"AkzidenzGroteskLightCond",
    },
    flowerNumWarp:{
        alignItems:"center",
        flex:1,
    },
    flowerTipContainer: {
        flex:2.5,
        marginTop:15,
        flexDirection: 'row',
        alignItems:"flex-start",
        justifyContent:"flex-start",
    },
    flowerTip:{
        flexDirection: 'row',
        alignItems:"flex-start",
        justifyContent:"flex-start",
        paddingTop: 10,
        paddingBottom:10,
        paddingRight: 10,
    },
    flowerTipText:{
        fontSize:16,
        color:"#fff",
        paddingLeft:5,
    },
    flowerWarp:{
        flex:1,
        alignItems:"flex-start",
        justifyContent:"flex-end",
        paddingLeft:30,
        position:"relative",
    },
});

export default FlowerTop;
