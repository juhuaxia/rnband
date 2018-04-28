import { StyleSheet, PixelRatio,Dimensions } from 'react-native'
let windowWidth = Dimensions.get('window').width;
export default StyleSheet.create({
    svgContainer: {
        backgroundColor: 'white',
        paddingTop: 40,
    },
    chartBottomList: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
        paddingLeft:15,
        paddingRight:15,
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
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        paddingTop: 13,
        paddingBottom: 18,

    },
    chartTipsDotStyle: {
        height: 20,
        alignItems:"center",
        justifyContent:"center",
        flexDirection:"row",
    },
    chartTipsDotOne:{
        width:10,
        backgroundColor:'#c5a2fc',
        height:10,
        borderRadius:50,
        marginRight:5,
    },
    chartTipsDotTwo:{
        width:10,
        backgroundColor:'#e1d1fb',
        height:10,
        borderRadius:50,
    },
    chartTipsDotThree:{
        width:10,
        backgroundColor:'#ffe7ef',
        height:10,
        borderRadius:50,
    },
    chartTipsStyle: {
        fontSize: 12,
        marginLeft:5,
        marginRight:15,
        color: '#959595',
        fontFamily: 'PingFangSC-Regular',
    },
});