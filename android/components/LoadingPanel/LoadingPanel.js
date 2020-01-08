import React from 'react'
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native'
export default class LoadingPanel extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <Text>Loading</Text>
        <ActivityIndicator size="large" color="#3385ff"/>
      </View>
    )
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  }
})