import React, { useState, useEffect } from 'react';
import { View, Text , StyleSheet, Animated, Easing } from 'react-native';
import GameButton from './GameButton';

type GameBoardProps = {
    onGameOver: (winner: 'X' | 'O' | 'Draw' | null) => void;
    // onGameOver: (winner: string) => void;
    gameOver: boolean;
};

const GameBoard: React.FC<GameBoardProps> = ({ onGameOver, gameOver }) => {
  const [opacity] = useState(new Animated.Value(1));
  const [board, setBoard] = useState(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState(true);
  const [winningSquares, setWinningSquares] = useState<number[]>([]);

  useEffect(() => {
    if (!gameOver) {
      // Start the animation
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 0,
          duration: 500,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 500,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
      ]).start();
  
      setBoard(Array(9).fill(null));
      setXIsNext(true);
      setWinningSquares([]);
    }
  }, [gameOver]);

  const handleClick = (i: number) => {
    const newBoard = board.slice();
    if (newBoard[i]) return;
    newBoard[i] = xIsNext ? 'X' : 'O';
    setBoard(newBoard);
    setXIsNext(!xIsNext);

    const result = calculateWinner(newBoard);
    if (result.winner) {
        setWinningSquares(result.line);
        onGameOver(result.winner as 'X' | 'O' | 'Draw' | null);
    }
  };

  const renderSquare = (i: number) => (
    <View style={styles.buttonWrapper}>
        <GameButton value={board[i]} command={() => handleClick(i)} isWinning={winningSquares.includes(i)} gameOver={gameOver}/>
    </View>
  );

  return (
    <Animated.View style={{ opacity: opacity }}>
      <View style={{ alignItems: 'center' }}>
        <Text>Player {xIsNext ? 'X' : 'O'}'s turn</Text>
      </View>
      <View style={styles.board}>
        <View>{renderSquare(0)}{renderSquare(1)}{renderSquare(2)}</View>
        <View>{renderSquare(3)}{renderSquare(4)}{renderSquare(5)}</View>
        <View>{renderSquare(6)}{renderSquare(7)}{renderSquare(8)}</View>
      </View>
    </Animated.View>
  );
};

function calculateWinner(board: ('X' | 'O' | null)[]) {
  const lines = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (board[a] && board[a] === board[b] && board[a] === board[c]) return { winner: board[a], line: [a, b, c] };
  }
  if (board.every(square => square !== null)) return { winner: 'Draw', line: [] };
  return { winner: null, line: [] };
}

const styles = StyleSheet.create({
    board: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      width: 300,
      justifyContent: 'center',
      alignItems: 'center',
      color: 'blue',
    },
    buttonWrapper: {
      margin: 5,
    },
});

export default GameBoard;