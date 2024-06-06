import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

type Props = {
  value: 'X' | 'O' | null;
  command: () => void;
  isWinning: boolean;
  gameOver: boolean;
}

const styles = StyleSheet.create({
  button: {
    width: 80,
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'blue',
    borderRadius: 25,
  },
  text: {
    fontSize: 24,
    color: 'white',
  },
});

const GameButton: React.FC<Props> = ({ value, command, isWinning, gameOver }) => {
  const buttonStyle = isWinning ? { ...styles.button, backgroundColor: 'green' } : styles.button;

  return(
    <TouchableOpacity style={buttonStyle} onPress={command} disabled={gameOver}>
      <Text style={styles.text}>{value || null}</Text>
    </TouchableOpacity>
  );
};

export default GameButton;