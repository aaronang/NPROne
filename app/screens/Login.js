import React from 'react'
import { WebView, Text, View } from 'react-native';
import { generateAuthUri, exchangeToken, setAccessToken, signIn } from '../lib/auth'
import { NavigationActions } from 'react-navigation'

export default class Login extends React.Component {
  constructor(props) {
    super(props)
    this.state = { visited: false }
  }

  async _onNavigationStateChange(state) {
    if (state.url.includes('com.nprone://authorize') && !this.state.visited) {
      this.setState({ visited: true })
      try {
        const token = await exchangeToken(state.url)
        setAccessToken(token)
        signIn()
        this.props.screenProps.checkAuth()
      } catch (err) {
        console.error(err)
      }
    }
  }

  render() {
    return (
      <WebView source={{ uri: generateAuthUri() }} onNavigationStateChange={(s) => this._onNavigationStateChange(s)} />
    );
  }
}