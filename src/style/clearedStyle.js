import { StyleSheet, PixelRatio } from 'react-native'
import Dimensions from 'Dimensions'
const {width, height, scale} = Dimensions.get('window');
const rate = width/320;

export default StyleSheet.create({
	container: {
		flex: 1,
		paddingTop: 64,
		backgroundColor: '#f5f5f5',
	},
	taskItemContainer: {
		marginTop: 12,
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
	showMore: {
		height: 48,
		justifyContent: 'center',
		alignItems: 'center',
		marginBottom: 40,
		marginTop: 12,
	},
	showMoreText: {
		fontSize: 14,
		opacity: 0.68,
	},
})	