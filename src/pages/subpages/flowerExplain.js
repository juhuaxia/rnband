import React from 'react';
import {StyleSheet, View, Dimensions, Image,} from 'react-native';
import IComponent from 'PaiBandRN/src/components/icomponent';
import Swiper from 'react-native-swiper';
const windowWidth = Dimensions.get('window').width;

//什么是小花
export default class FlowerExplain extends IComponent{
    state = {
       
    }

    componentDidMount(){
        
    }

    componentWillUnmount(){
        
    }

    render() {
        return (
            <View style={styles.container}>
                <Swiper style={styles.wrapper} paginationStyle={styles.pagination} activeDotColor={'#F2253E'} width={windowWidth - 40} height={(windowWidth - 24)*1.33 + 70}showsPagination={true} loop={false}>
                    <View style={styles.slide}>
                        <Image style={styles.pop} source = {require('PaiBandRN/res/images/flower_explain_1.png')}/>
                    </View>
                    <View style={styles.slide}>
                        <Image style={styles.pop} source = {require('PaiBandRN/res/images/flower_explain_2.png')}/>
                    </View>
                    <View style={styles.slide}>
                        <Image style={styles.pop} source = {require('PaiBandRN/res/images/flower_explain_3.png')}/>
                    </View>
                </Swiper>
            </View> 
        );
    }
};

var styles = StyleSheet.create({
    container:{
        flex:1,
        alignItems:"center",
        justifyContent:"center",
        paddingTop: 77,
        backgroundColor: '#f5f5f5',
    },
    wrapper: {

    },
    slide: {
     
    },
    pagination: {
       
    },
    pop: {
        borderRadius: 8,
        width: windowWidth - 40,
        height: (windowWidth - 24)*1.33,
    },
});

