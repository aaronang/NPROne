import React from 'react'
import { WebView, Text, View } from 'react-native';
import { generateAuthUri, exchangeToken, setAccessToken, signIn } from '../lib/auth'
import { NavigationActions } from 'react-navigation'

export default class LoginScreen extends React.Component {
  async onNavigationStateChange(state) {
    if (state.url.includes('com.nprone://authorize')) {
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
      <WebView source={{ uri: generateAuthUri() }} onNavigationStateChange={(s) => this.onNavigationStateChange(s)} />
    );
  }
}