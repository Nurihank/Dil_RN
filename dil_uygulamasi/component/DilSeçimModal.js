import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Modal } from 'react-native-paper'

export default function DilSeçimModal({visible}) {
    console.log("asda")
  return (
    <View>
      <Modal
        visible={visible}
      >
        <Text>selammasss</Text>
      </Modal>
    </View>
  )
}

const styles = StyleSheet.create({})