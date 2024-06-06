import React, { useState, useEffect } from 'react';
import { View, Text , StyleSheet, Animated, Easing } from 'react-native';
import GameButton from './GameButton';

type ComputerGameBoardProps = {
    onGameOver: (winner: 'X' | 'O' | 'Draw' | null) => void;
    gameOver: boolean;
};

const ComputerGameBoard: React.FC<ComputerGameBoardProps> = ({ onGameOver, gameOver }) => {
  const [opacity] = useState(new Animated.Value(1));
  const [board, setBoard] = useState(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState(true);
  const [winningSquares, setWinningSquares] = useState<number[]>([]);
  const [isComputerTurn, setIsComputerTurn] = useState(false);

  useEffect(() => {
    if (!gameOver) {
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

  useEffect(() => {
    if (!xIsNext && !gameOver) {
      setIsComputerTurn(true); // Disable the buttons
      setTimeout(() => {
        const result = minimax(board, 'O');
        if (result && 'index' in result) {
            const move = result.index;
            handleClick(move);
        }
        setIsComputerTurn(false); // Enable the buttons
      }, 1000); // Wait for 1 second
    }
  }, [xIsNext]);

  const handleClick = (i: number) => {
    if (isComputerTurn) return; // Ignore the click if it's the computer's turn
  
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
        <GameButton value={board[i]} command={() => handleClick(i)} isWinning={winningSquares.includes(i)} gameOver={gameOver || isComputerTurn}/>
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

function minimax(newBoard: ('X' | 'O' | null)[], player: 'X' | 'O') {
  const availSpots = emptyIndexies(newBoard);

  if (calculateWinner(newBoard).winner === 'X') {
    return { score: -10 };
  } else if (calculateWinner(newBoard).winner === 'O') {
    return { score: 10 };
  } else if (availSpots.length === 0) {
    return { score: 0 };
  }

  const moves = availSpots.map((spot) => {
    const move: { index: number; score: number } = { index: spot, score: 0 };
    newBoard[spot] = player;

    if (player === 'O') {
        const result = minimax(newBoard, 'X');
        if (result) {
        move.score = result.score;
        } 
    } else {
        const result = minimax(newBoard, 'O');
        if (result) {
            move.score = result.score;
        }
    }

    newBoard[spot] = null;

    return move;
  });

  let bestMove = 0;
  if (player === 'O') {
    let bestScore = -10000;
    for (let i = 0; i < moves.length; i++) {
      if (moves[i].score > bestScore) {
        bestScore = moves[i].score;
        bestMove = i;
      }
    }
  } else {
    let bestScore = 10000;
    for (let i = 0; i < moves.length; i++) {
      if (moves[i].score < bestScore) {
        bestScore = moves[i].score;
        bestMove = i;
      }
    }
  }

  if (typeof bestMove === 'number') {
    return moves[bestMove];
  }
}

function emptyIndexies(board: ('X' | 'O' | null)[]) {
  return board.reduce((result, square, index) => (square === null ? result.concat(index) : result), [] as number[]);
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

export default ComputerGameBoard;