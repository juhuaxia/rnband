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
  ScrollView,
} from 'react-native';
import Swiper from 'react-native-swiper';

const windowWidth = Dimensions.get('window').width;
const IMGS = [
    require('PaiBandRN/res/images/110-band-1910_05.png'),
    require('PaiBandRN/res/images/110-band-1910_08.png'),
    require('PaiBandRN/res/images/110-band-1910_11.png')
];
var count = 0;
//点击什么是小花弹窗
class FlowerPop extends IComponent{

    constructor(props) {
        super(props);
        //var bs = new ViewPager.DataSource({
            //pageHasChanged: (p1, p2) => p1 !== p2,
        //});
        //this.state = {
            //dataSource:bs.cloneWithPages(IMGS),
        //}
    }

    goToPage(){
        alert(123);
    }

    render() {
        return (
            <View style={styles.popCon}>
                <Swiper style={styles.wrapper} width={290} height={340} showsButtons={false} loop={false}>
                    <View style={styles.slide}>
                        <Image style={styles.pop} resizeMode={'contain'} source = {require('PaiBandRN/res/images/110-band-1910_05.png')}/>
                    </View>
                    <View style={styles.slide}>
                        <Image style={styles.pop} resizeMode={'contain'} source = {require('PaiBandRN/res/images/110-band-1910_08.png')}/>
                    </View>
                    <View style={styles.slide}>
                        <Image style={styles.pop} resizeMode={'contain'} source = {require('PaiBandRN/res/images/110-band-1910_11.png')}/>
                    </View>
                </Swiper>
            </View>
        );
    }

    renderPage(data, pageID) {
        return (
            <View style={{flex: 1, backgroundColor: 'rgba(0, 0, 0, 0)', alignItems: 'center', justifyContent: 'flex-start', width: 300, height: 350}}>
                <View style={{flex: 0, borderRadius: 10, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center', width: 280, height: 300}}>
                  <Image
                    source={data}
                    resizeMode='contain'
                    style={{backgroundColor: '#fff', width: 280, height: 280}} />
                </View>
            </View>
        );
    }

    _onChangePage(page) {
        console.log('Current page: ' + page);
    }
};

var styles = StyleSheet.create({
    popCon:{
        flex:1,
        alignItems:"center",
        justifyContent:"center",
        position:"absolute",
        top:150,
        left:parseInt((windowWidth - 300) * 0.5),
    },
    pop:{
        width:200,
        height:330,
    },
    wrapper:{
        // borderRadius:10,
    },
    slide:{
        // padding:20
        alignItems:"center",
        justifyContent:"center",
        backgroundColor:'#fff'
    }
});

export default FlowerPop;
