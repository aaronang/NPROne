import React from 'react'
import { Text, View, Button } from 'react-native';
import { signOut } from '../lib/auth'

export default class HomeScreen extends React.Component {
  render() {
    const { navigate } = this.props.navigation;    
    return (
      <View>
        <Text>Home</Text>
        <Button title="Sign out" onPress={() => signOut().then(() => navigate('SignedOut'))} />
      </View>
    )
  }
}