import React from 'react';
import {
  Linking,
  View,
  Button
} from 'react-native';
import { exchangeToken, signIn, setAccessToken } from '../lib/auth'

export default class Welcome extends React.Component {
  static navigationOptions = {
    header: null
  };

  render() {
    const { navigate } = this.props.navigation;
    return (
      <View>
        <Button
          onPress={() => navigate('Login')}
          title="Sign In"
        />
      </View>
    )
  }
}