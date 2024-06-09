import React, { useState, useEffect } from 'react';
import { SafeAreaView, StatusBar, StyleSheet, TouchableOpacity, Text, View, Animated, Image } from 'react-native';
import GameBoard from './src/Components/GameBoard';
import ComputerGameBoard from './src/Components/ComputerGameBoard';
import home from './src/assets/home.png';


const App: React.FC = () => {
  const [mode, serMode] = useState<'1v1' | '1vComputer'>('1v1'); // '1v1' or '1vComputer
  const [gameOver, setGameOver] = useState(false);
  const [winner, setWinner] = useState<'X' | 'O' | 'Draw' | null>(null);
  const [showIntro, setShowIntro] = useState(true);
  const [opacity] = useState(new Animated.Value(0));


  useEffect(() => {
    Animated.timing(opacity, {
      toValue: 1,
      duration: 2000,
      useNativeDriver: true,
    }).start();
  }, []);

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

  const hide = () => {setShowIntro(false)}
  const show = () => {setShowIntro(true)}

  if (showIntro === true) { // New intro screen
    return (
      <Animated.View style={styles.introContainer}>
        <Text style={styles.introTitle}>Welcome to <Text style={styles.gameTitle}>TicTacToe!</Text></Text>
        <TouchableOpacity style={styles.startButton} onPress={hide}>
            <Text style={styles.startButtonText}>Start Game</Text>
        </TouchableOpacity>

        <Text style={styles.instructionsTitle}>Instructions:</Text>
        <Text style={styles.instructionsText}>1. Click on any cell to place your mark</Text>
        <Text style={styles.instructionsText}>2. First player to get 3 marks in a row wins</Text>
        <Text style={styles.instructionsText}>3. Click restart to play again</Text>

        <Text style={styles.gameModesTitle}>Game Modes:</Text>
        <Text style={styles.gameModesText}>1. 1v1: Play against a friend</Text>
        <Text style={styles.gameModesText}>2. 1vComputer: Play against the computer</Text>

        <Text style={styles.authorText}>By <Text style={styles.authorName}>Abdullah</Text></Text>
      </Animated.View>
    );
  }

  if (showIntro === false) { // Main game screen
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle={'dark-content'} />
      <Text style={styles.title}>TicTacToe</Text>

      <TouchableOpacity style={styles.switchButton} onPress={switchMode}>
        <Text>Switch to {mode === '1v1' ? '1vComputer' : '1v1'}</Text>
      </TouchableOpacity>

      <View style={styles.homeIconContainer}>
        <TouchableOpacity onPress={show}>
          <Image source={home} style={{ width: 30, height: 30, tintColor: '#841584', borderColor: '#F9F9E0' }} />
          <Text style={styles.homeIconText}>Home</Text>
        </TouchableOpacity>
      </View>

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
  }
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
  introContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  introTitle: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  gameTitle: {
    color: '#841584',
  },
  startButton: {
    backgroundColor: '#841584',
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
  },
  startButtonText: {
    color: 'white',
    fontSize: 20,
  },
  instructionsTitle: {
    fontSize: 20,
    marginBottom: 10,
    color: '#333',
  },
  instructionsText: {
    fontSize: 16,
    marginBottom: 5,
    color: '#666',
  },
  gameModesTitle: {
    fontSize: 20,
    marginBottom: 10,
    color: '#333',
  },
  gameModesText: {
    fontSize: 16,
    marginBottom: 5,
    color: '#666',
  },
  authorText: {
    fontSize: 20,
    marginTop: 20,
    color: '#333',
  },
  authorName: {
    color: '#841584',
  },
  homeIconContainer: {
    position: 'absolute',
    top: 10,
    right: 10,
    alignItems: 'center',
  },
  homeIconText: {
    fontSize: 10,
  },
});

export default App;
