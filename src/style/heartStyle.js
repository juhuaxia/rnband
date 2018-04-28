import { StyleSheet, PixelRatio } from 'react-native'
import Dimensions from 'Dimensions'
let windowWidth = Dimensions.get('window').width;


export default StyleSheet.create({
    heartContainer: {
        flex: 1,
        backgroundColor: '#f5f5f5',
        paddingTop: 64,
    },
    scrollViewStyle: {
        paddingTop: 12,
    },
    /*
    头部样式
     */
    heartTopWrap:{
        alignItems: 'center',
    },
    heartTopDateWrap:{
        height:44,
        flexDirection:"row",
        alignItems:"center",
        justifyContent:"center",
    },
    heartTopDateText:{
        fontSize:14,
        color:"#121212",
        marginLeft: 8,
    },
    headCenter: {
        height: 100,
        width: 100,
        backgroundColor: '#fff',
        borderRadius: 50,
        borderWidth: 5,
        borderColor: '#f9f9f9',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 15,
    },
    heartImg: {
        height: 43,
        width: 49,
    },
    heartTestView: {
        minWidth: 77,
        marginTop: 20,
        borderBottomWidth: 1/PixelRatio.get(),
        borderColor: '#D8D8D8',
        paddingBottom: 8,
    },
    heartTestText: {
        fontSize: 14,
        fontFamily: 'PingFangSC-Semibold',
        color: "#121212",
        textAlign: 'center',
    },
    lastRecordView: {
        marginTop: 8,
        flexDirection: 'row',
        marginBottom: 24,
    },
    lastRecordText: {
        fontSize: 12,
        color: '#121212',
    },
    mark:{
        backgroundColor:"#000",
        opacity:0.5,
        flex:1,
        marginTop:64,
    },
    MOdelCover: {
        backgroundColor:"rgba(0,0,0,0.5)",
        flex:1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    testAlert: {
        height: 220,
        width: 270,
        alignItems: 'center',
        justifyContent: 'center',
    },
    testAlertText: {
        fontSize: 14,
        color: '#121212',
        marginTop: 12,
        textAlign: 'center',
    },
    TestImgContiner: {
        position: 'absolute',
        height: 160,
        width: 270,
        justifyContent: 'center',
        alignItems: 'center',
    },
    heartTestImg: {

    },
    setClock: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        marginTop: 12,
        marginBottom: 50,
    },
    setClockText: {
        fontSize: 16,
        color: '#121212',
        fontFamily: 'PingFangSC-Regular',
    },
    /*
    alert 样式
     */
    alertView: {
        backgroundColor:"rgba(0,0,0,.5)",
        flex:1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    alertContainer: {
        height: 160,
        width: 270,
        backgroundColor: '#fff',
        borderRadius: 6,
    },
    headerTextContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingBottom: 35,
    },
    alertTitle: {
        fontSize: 18,
        color: '#313131',
        fontFamily: 'PingFangSC-Medium',
        textAlign: 'center',
    },
    alertTip: {
        fontSize: 14,
        color: '#313131',
        fontFamily: 'PingFangSC-Regular',
        textAlign: 'center',
    },
    confirmContainer: {
        position: 'absolute',
        height: 44,
        bottom: 0,
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        width: 270,
        borderTopWidth: 1/PixelRatio.get(),
        borderColor: '#afafbc'
    },
    conirmOpacity: {
        height: 44,
        alignItems: 'center',
        justifyContent: 'center',
        width: 270,
    },
    confirmTextStyle: {
        textAlign: 'center',
        fontSize: 18,
        color: '#157efb',
        paddingTop: 10,
        paddingBottom: 10,
        width: 130,
    },
    confirm: {
        
    },
    failed: {
        flexDirection: 'row',
        borderBottomLeftRadius: 6,
        borderBottomRightRadius: 6,
    },
    failedOpacity: {
        flex: 1,
        height: 44,
        alignItems: 'center',
        justifyContent: 'center',
    },
    cancled: {
        borderRightWidth: 1/PixelRatio.get(),
        borderColor: '#afafbc'
    }
});