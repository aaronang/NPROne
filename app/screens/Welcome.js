import React from 'react';
import { View, Button } from 'react-native';
import PropTypes from 'prop-types';

export default class Welcome extends React.Component {
  static navigationOptions = {
    header: null
  };

  render() {
    const { navigate } = this.props.navigation;
    return (
      <View>
        <Button onPress={() => navigate('Login')} title="Sign In" />
      </View>
    );
  }
}

Welcome.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired
  }).isRequired
};
