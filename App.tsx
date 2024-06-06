import React, { useState } from 'react';
import { SafeAreaView, StatusBar, StyleSheet, TouchableOpacity, Text, View } from 'react-native';
import GameBoard from './src/Components/GameBoard';
import ComputerGameBoard from './src/Components/ComputerGameBoard';

const App: React.FC = () => {
  const [mode, serMode] = useState<'1v1' | '1vComputer'>('1v1'); // '1v1' or '1vComputer
  const [gameOver, setGameOver] = useState(false);
  const [winner, setWinner] = useState<'X' | 'O' | 'Draw' | null>(null);

  const handleGameOver = (winner: 'X' | 'O' | 'Draw' | null) => {
    setGameOver(true);
    setWinner(winner);
  };

  const restartGame = () => {
    setGameOver(false);
    setWinner(null);
  };

  const switchMode = () => {
    serMode(mode === '1v1' ? '1vComputer' : '1v1');
    restartGame();
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle={'dark-content'} />
      <Text style={styles.title}>TicTacToe</Text>

      <TouchableOpacity style={styles.switchButton} onPress={switchMode}>
        <Text>Switch to {mode === '1v1' ? '1vComputer' : '1v1'}</Text>
      </TouchableOpacity>


      {mode === '1v1' ? (
        <GameBoard onGameOver={handleGameOver} gameOver={gameOver} />
      ) : (
        <ComputerGameBoard onGameOver={handleGameOver} gameOver={gameOver} />
      )}

      {gameOver && (
        <View style={styles.resultContainer}>
          <Text style={styles.resultText}>{winner !== 'Draw' ? `Winner: ${winner}` : 'It`s a Draw'}</Text>
          
          <TouchableOpacity style={styles.restartButton} onPress={restartGame}>
            <Text>Restart</Text>
          </TouchableOpacity>

        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 60,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#841594',
  },
  resultContainer: {
    marginTop: 20,
  },
  resultText: {
    fontSize: 20,
    marginBottom: 10,
  },
  restartButton: {
    backgroundColor: '#841584',
    borderRadius: 5,
    padding: 10,
    color: 'white',
    alignItems: 'center',
  },
  switchButton: {
    backgroundColor: '#841584',
    borderRadius: 5,
    padding: 10,
    color: 'white',
    alignItems: 'center',
    marginBottom: 10,
  },
});

export default App;
