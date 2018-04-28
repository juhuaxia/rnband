import { StyleSheet, PixelRatio } from 'react-native'
import Dimensions from 'Dimensions'

const { width, height} = Dimensions.get('window');

export default StyleSheet.create({
    common_gap: {
        height: 12
    },
    common_card: {
        backgroundColor: '#FFF',
        borderRadius: 8,
        marginLeft: 12,
        marginRight: 12,
    }
});
