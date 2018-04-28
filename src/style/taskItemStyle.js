import { StyleSheet, PixelRatio } from 'react-native'
import Dimensions from 'Dimensions'
const {width, height} = Dimensions.get('window');
const scale = width/414;
export default StyleSheet.create({
	/*
	日期
	 */
	dateTip: {
		backgroundColor: '#fff',
		borderRadius: 12,
		marginBottom: 12,
		marginLeft: 12,
		marginRight: 12,
	},
	dateTipText: {
		backgroundColor: 'rgba(255,255,255,0)',
		paddingTop: 8,
		paddingBottom: 8,
		fontSize: 12,
		marginLeft: 16,
	},
	/*
	当日可以获取小花数量
	 */
	dayNumTip: {
		backgroundColor: '#fff',
		flexDirection: 'row',
		height: 32,
		borderRadius: 4,
		alignItems: 'center',
		justifyContent: 'center',
		marginBottom: 12,
		marginLeft: 12,
		marginRight: 12,
	},
	dayNumTipText: {
		fontSize: 12,
	},
	dayNumTipData: {
		fontSize: 12,
		fontFamily: 'PingFangSC-Medium',
		marginRight: 8,
	},
	dayNumTipImg: {
		height: 15,
		width: 15,
	},
	/*
	任务样式
	 */
	taskList: {
		
	},	
	taskItemContainer: {
		marginBottom: 12,
		padding: 16,
	},
	taskCommonStyle: {
		flexDirection: 'row',
		justifyContent: 'space-between',
	},
	taskHeaderStyle: {
		flexDirection: 'row',
		alignItems: 'center',
	},
	taskName: {
		fontSize: 16,
		opacity: 0.8,
		marginRight: 8,
		width: width - 150,
	},
	asyncStatus: {
		height: 8,
		width: 8,
		backgroundColor: '#F2253E',
		borderRadius: 4,
	},
	awardFlower: {
		fontSize: 16,
		fontFamily: 'PingFangSC-Medium',
		marginRight: 10,
	},
	taskFlowerImg: {
		height: 18,
		width: 18,
	},
	taskSetsStatus: {
		marginTop: 20,
	},
	taskSets: {
		height: 40,
		justifyContent: 'flex-end',
	},
	taskSetsCommon: {
		flexDirection: 'row',
		alignItems: 'center',
		marginTop: 6,
	},
	taskSetsImg: {
		width: 12,
		height: 12,
		marginRight: 10,
	},
	taskSetsText: {
		fontSize: 12,
		opacity: 0.5,
	},
	submitContainer: {
		alignItems: 'flex-end',
	},
	submitTask: {
		fontSize: 12*scale,
		fontFamily: 'PingFangSC-Medium',
		color: '#F2253E',
		textAlign: 'center',
		height: 40*scale,
		width: 80*scale,
		borderWidth: 1,
		borderColor: '#F2253E',
		borderRadius: 6,
		marginLeft: 12,
		paddingTop: 13*scale,
		paddingBottom: 13*scale,
	},
	/*
	已完成任务样式
	 */
	finishTaskItem: {
		marginTop: 20,
	},
	finishTaskItemLeft: {
		fontSize: 12,
		opacity: 0.5,
	},
	finishTaskItemRight: {
		fontSize: 12,
		fontFamily: 'PingFangSC-Medium',
	},
	//查看更多按钮
	showMore: {
		height: 48,
		justifyContent: 'center',
		alignItems: 'center',
		marginBottom: 40,
	},
	showMoreText: {
		fontSize: 14,
		opacity: 0.68,
	},
})	