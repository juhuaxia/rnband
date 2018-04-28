import { StyleSheet, PixelRatio } from 'react-native'
import Dimensions from 'Dimensions'
const {width, height, scale} = Dimensions.get('window');

export default StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#f5f5f5',
		paddingTop: 64,
	},
	/*
	奖励事件
	 */
	inputTask: {
		height: 101,
	},
	scrollViewStyle: {
		paddingTop: 12,
	},
	inputComponent: {
		fontSize: 16,
		color: '#000',
		opacity: 0.8,
		marginTop: 10,
		marginRight: 16,
		marginLeft: 16,
	},
	inputTaskDetail: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		paddingLeft: 16,
		paddingRight: 16,
	},
	recommendContainer: {
		flexDirection: 'row',
	},
	recommendTask: {
		justifyContent: 'center',
		height: 28,
		minWidth: 50,
		maxWidth: (width-88)/2,
		borderWidth: 1,
		borderColor: '#F2253E',
		borderRadius: 14,
		alignItems: 'center',
		marginRight: 12,
		paddingRight: 12,
		paddingLeft: 12,
	},
	recommendTaskText: {
		backgroundColor: 'rgba(255,255,255,0)',
		fontSize: 12,
		textAlign: 'center',
		color: '#F2253E',
	},
	showTaskTypes: {
		width: 44,
		borderWidth: 1,
		borderColor: '#F2253E',
		borderRadius: 14,
		alignItems: 'center',
		justifyContent: 'center',
		height: 28,
	},
	showTypesButton: {
		width: 20,

	},
	commonTextStyle: {
		fontSize: 16,
		opacity: 0.8,
		backgroundColor: 'rgba(255,255,255,0)',
	},
	/*
	奖励小花
	 */
	selectNumber: {
		height: 52,
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		paddingRight: 16,
		paddingLeft: 16,
		marginTop: 12,
	},
	awardView: {
		flexDirection: 'row',
		alignItems: 'center',
	},
	awardNum: {
		fontFamily: 'PingFangSC-Medium',
		width:width-24,
		height: 52,
		textAlign: 'right',
		position: 'absolute',
		left: 0,
		right: 0,
		paddingRight: 40,
		backgroundColor: 'rgba(0,0,0,0)',
	},
	awardImg: {
		width: 19,
		height: 19,
		marginLeft: 10,
	},
	/*
	重复类型
	 */
	repeatContainer: {
		marginTop: 12,
	},
	repeatItem: {
		paddingLeft: 16,
		paddingRight: 16,
		height: 46,
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		borderBottomWidth: 1,
		borderColor: '#f5f5f5',
	},
	simpleRepeat: {
		fontSize: 10,
		color: '#B5B5B5',
	},
	selectRepeatImg: {

	},
	/*
	闹钟设置
	 */
	clockContainer: {
		height: 56,
		marginTop: 12,
	},
	selectTime: {
		paddingLeft: 16,
		flexDirection: 'row',
		alignItems: 'center',
		width: width - 24,
		height: 56,
	},
	timeText: {
		fontSize: 20,
		marginLeft: 18,
		color: '#121212',
	},
	clockSwitch: {
		position: 'absolute',
		right: 0,
		height: 56,
		paddingRight: 20,
		paddingLeft: 20,
		justifyContent: 'center',
	},
	/*
	底部保存，删除按钮
	 */
	footerContainer: {
		marginLeft: 20,
		marginRight: 20,
		marginTop: 40,
		marginBottom: 40,
		flexDirection: 'row',
	},
	deleteTask: {
		flex: 5,
		height: 44,
		justifyContent: 'center',
		alignItems: 'center',
		marginRight: 16,
		borderRadius: 22,
		borderWidth: 1,
		borderColor: '#F2253E',
	},
	deleteTaskText: {
		fontSize: 16,
		color: '#F2253E',
	},
	saveEdit: {
		flex: 9,
		height: 44,
		backgroundColor: '#F2253E',
		borderRadius: 22,
		justifyContent: 'center',
		alignItems: 'center',
	},
	saveEditText: {
		fontSize: 16,
		color: '#fff',
	},
})	