import { StyleSheet, PixelRatio } from 'react-native'
import Dimensions from 'Dimensions'
let windowWidth = Dimensions.get('window').width;


export default StyleSheet.create({
    growthContainer: {
        flex: 1,
        paddingTop: 64,
        backgroundColor: '#f5f5f5',
    },
    scrollViewStyle: {
        paddingTop: 12,
    },
    /**
     * 头部样式
     */
    headerContainer: {
        alignItems: 'center',
    },
    EnTopImg: {
        marginTop: 30,
        marginBottom: 10,
    },  
    bmiContainer: {
        alignItems: 'center',
    },
    svgContainer: {
        width: 220,
        height: 220,
        backgroundColor: '#f8f8f8',
        margin: 22,
        borderRadius: 110,
        alignItems: 'center',
        justifyContent: 'center',
    },  
    svgRadius: {
        overflow: 'hidden',
        height: 200,
        width: 200,
        borderRadius: 100,
    },
    tipContainer: {
        height: 200,
        width: 200,
        backgroundColor: 'rgba(0,0,0,0)',
        position: 'absolute',
        top: 0,
        left: 0,
        justifyContent: 'center',
        alignItems: 'center',
    },
    tipTop: {
        color: '#fff',
        fontSize: 20,
        fontFamily: "PingFangSC-Semibold",

    },
    tipBmi: {
        color: '#fff',
        fontSize: 12,
        marginTop: 5,
    },
    bmiComputedContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
       
    },
    bmiComputed: {
        fontSize: 16,
        color: '#000',
    },
    bmiNumber: {
        marginTop: -8,
        color: '#000',
        fontSize: 9,
        fontWeight: 'bold',
    },
    /**
     * BMI描述样式
     */
    BMIDescription: {
        color: '#646464',
        fontSize: 12,
        lineHeight: 17,
        marginTop: 10,
        marginLeft: 16,
        marginRight: 16,
    },
    /**
     * 成长记录，成长曲线链接样式
     */
    LinkContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: 14,
        marginBottom: 20,

    },
    LinkTextStyle: {
        margin: 8,
        borderColor: '#6735A5',
        borderWidth: 1,
        borderRadius: 6,
        width: 124,
        paddingTop: 11,
        paddingBottom: 11,
        textAlign: 'center',
        fontSize: 15,
        color: '#6735A5',
        fontFamily: 'PingFangSC-Medium',
    },
    /**
     * 最近记录
     */
    recentlyRecord: {
        marginTop: 12,
        marginBottom: 12,
    },
    recentlyList: {
        borderTopWidth: 1,
        borderTopColor: '#f5f5f5',
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingTop: 15,
        paddingBottom: 15,
        paddingLeft: 20,
    },
    timeText: {
        color: '#000',
        fontSize: 12,
        opacity: 0.64,
    },
    heightWeight: {
        marginRight: 20,
        marginLeft: 25,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    heightWeightStyle: {
        color: '#000',
        fontSize: 12,
        minWidth: 60,
        textAlign: 'right',
    },
    heightStyle: {
        marginRight: 30,
    },
    showAllList: {
        borderTopWidth: 1,
        borderTopColor: '#f5f5f5',
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 15,
        paddingBottom: 15,
        flexDirection: 'row',
    },
    showAllListText: {
        color: '#000',
        fontSize: 12,
        opacity: 0.64,
    },
});
