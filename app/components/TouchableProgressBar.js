import React from 'react';
import PropTypes from 'prop-types';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import * as Progress from 'react-native-progress';

const TouchableProgressBar = ({ onProgressPress, progress }) => (
  <View style={styles.progress}>
    <TouchableOpacity
      onPress={onProgressPress}
      activeOpacity={1}
      style={styles.touchBar}
    >
      <Progress.Bar progress={progress} width={null} animated={false} />
    </TouchableOpacity>
  </View>
);

TouchableProgressBar.propTypes = {
  onProgressPress: PropTypes.func.isRequired,
  progress: PropTypes.number.isRequired
};

const styles = StyleSheet.create({
  progress: {
    flex: 1
  },
  touchBar: {
    height: 12
  }
});

export default TouchableProgressBar;
