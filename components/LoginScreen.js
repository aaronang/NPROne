import React from 'react'
import qs from 'query-string'
import { WebView, Text, View, AsyncStorage } from 'react-native';

export default class LoginScreen extends React.Component {
  constructor(props) {
    super(props)
    this.state = { loading: true }
  }

  async componentDidMount() {
    try {
      const value = await AsyncStorage.getItem('@NPROneStore:CSRF_TOKEN');
      if (value !== null) {
        this.setState({ csrfToken: value, loading: false })
      }
    } catch (error) {
      console.error(error)
    }
  }

  generateAuthUri() {
    const params = qs.stringify({
      client_id: 'nprone_trial_NDez2fJ7qASv',
      state: this.state.csrfToken,
      redirect_uri: 'nprone://authorize',
      response_type: 'code',
      scope: 'listening.readonly'
    })
    return `https://api.npr.org/authorization/v2/authorize?${params}`
  }

  render() {
    if (this.state.loading) {
      return <View><Text>Loading...</Text></View>
    } else {
      return (
        <WebView source={{ uri: this.generateAuthUri() }} />
      );
    }
  }
}