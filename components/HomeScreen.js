import React from 'react';
import {
  Linking,
  View,
  Button
} from 'react-native';
import qs from 'query-string';

export default class HomeScreen extends React.Component {
  static navigationOptions = {
    header: null
  };

  async componentDidMount() {
    const url = await Linking.getInitialURL()
    if (url) this.getAccessToken(url)
  }

  async getAccessToken(url) {
    const params = qs.parse(url.split('?')[1])
    const code = params.code
    const state = params.state
    const body = qs.stringify({
      grant_type: 'authorization_code',
      client_id: 'nprone_trial_NDez2fJ7qASv',
      client_secret: '3Qcafw9osRpK8Rf6sgAvhl9xlYFm4269VlkxGUn1',
      code: code,
      redirect_uri: 'nprone://authorize'
    })

    try {
      const response = await fetch('https://api.npr.org/authorization/v2/token', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: body
      })
      const token = await response.json();
      this.setState({ token: token })
    } catch (error) {
      console.error(error)
    }
  }

  render() {
    const { navigate } = this.props.navigation;
    return (
      <View>
        <Button
          onPress={() => navigate('Login')}
          title="Login"
        />
      </View>
    )
  }
}