import React from 'react';
import PropTypes from 'prop-types';
import { View, Text, StyleSheet } from 'react-native';

const Info = ({ status, title }) => (
  <View style={styles.info}>
    <Text style={styles.status}>{status}</Text>
    <Text style={styles.title}>{title}</Text>
  </View>
);

Info.propTypes = {
  status: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired
};

const styles = StyleSheet.create({
  info: {
    alignItems: 'center',
    flex: 1
  },
  status: {
    fontSize: 12
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center'
  }
});

export default Info;
