import React, { useState } from 'react';
import { View, TextInput, StyleSheet, Text, TouchableOpacity } from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import { COLORS } from '../config/colors';

export const CustomInput = ({ 
  label, 
  iconName, 
  placeholder, 
  value, 
  onChangeText, 
  secureTextEntry, 
  keyboardType = 'default' 
}) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(!secureTextEntry);

  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View style={styles.inputWrapper}>
        {iconName && (
          <Feather name={iconName} size={20} color={COLORS.textLight} style={styles.icon} />
        )}
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          placeholderTextColor={COLORS.textLight}
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={secureTextEntry ? !isPasswordVisible : false}
          keyboardType={keyboardType}
          autoCapitalize="none"
        />
        {secureTextEntry && (
          <TouchableOpacity onPress={() => setIsPasswordVisible(!isPasswordVisible)}>
            <Feather 
              name={isPasswordVisible ? "eye" : "eye-off"} 
              size={20} 
              color={COLORS.textLight} 
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginVertical: 6,
  },
  label: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.ciruela,
    marginBottom: 8,
    marginLeft: 4,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 15,
    paddingHorizontal: 15,
    height: 55,
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    color: COLORS.textDark,
    fontSize: 15,
  },
});