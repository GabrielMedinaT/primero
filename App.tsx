import React, {useState} from 'react';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

const Board = ({
  playerX,
  playerO,
  onWin,
  onRestart,
}: {
  playerX: string;
  playerO: string;
  onWin: (winner: string) => void;
  onRestart: () => void;
}): React.JSX.Element => {
  const [board, setBoard] = useState(Array(9).fill(''));
  const [isXNext, setIsXNext] = useState(true);
  const [winner, setWinner] = useState<string | null>(null);

  const handlePress = (index: number) => {
    if (board[index] !== '' || winner) {
      return;
    }

    const newBoard = [...board];
    newBoard[index] = isXNext ? 'X' : 'O';
    setBoard(newBoard);
    setIsXNext(!isXNext);
    const checkWinner = calculateWinner(newBoard);
    if (checkWinner) {
      setWinner(checkWinner);
      onWin(checkWinner); // Actualizar el contador de victorias
    }
  };

  const calculateWinner = (squares: string[]) => {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (
        squares[a] &&
        squares[a] === squares[b] &&
        squares[a] === squares[c]
      ) {
        return squares[a];
      }
    }
    return null;
  };

  const handleReset = () => {
    setBoard(Array(9).fill(''));
    setIsXNext(true);
    setWinner(null);
  };

  const handleRestart = () => {
    handleReset();
    onRestart(); // Volver a la pantalla de inicio
  };

  const renderSquare = (index: number) => {
    return (
      <TouchableOpacity
        style={styles.square}
        onPress={() => handlePress(index)}>
        <Text style={styles.squareText}>{board[index]}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View>
      <View style={styles.boardRow}>
        {renderSquare(0)}
        {renderSquare(1)}
        {renderSquare(2)}
      </View>
      <View style={styles.boardRow}>
        {renderSquare(3)}
        {renderSquare(4)}
        {renderSquare(5)}
      </View>
      <View style={styles.boardRow}>
        {renderSquare(6)}
        {renderSquare(7)}
        {renderSquare(8)}
      </View>

      {winner && (
        <>
          <Text style={styles.winnerText}>
            ¡Ganador: {winner === 'X' ? playerX : playerO}!
          </Text>
          <TouchableOpacity style={styles.resetButton} onPress={handleReset}>
            <Text style={styles.resetButtonText}>Otra vez!!!</Text>
          </TouchableOpacity>
        </>
      )}
      <TouchableOpacity style={styles.resetButton} onPress={handleRestart}>
        <Text style={styles.resetButtonText}>Ir al inicio</Text>
      </TouchableOpacity>
    </View>
  );
};

function App(): React.JSX.Element {
  const [playerX, setPlayerX] = useState('');
  const [playerO, setPlayerO] = useState('');
  const [gameStarted, setGameStarted] = useState(false);
  const [winsX, setWinsX] = useState(0);
  const [winsO, setWinsO] = useState(0);

  const handleStartGame = () => {
    if (playerX !== '' && playerO !== '') {
      setGameStarted(true);
    } else {
      alert('¡Ambos jugadores deben ingresar sus nombres!');
    }
  };

  const handleWin = (winner: string) => {
    if (winner === 'X') {
      setWinsX(winsX + 1);
    } else if (winner === 'O') {
      setWinsO(winsO + 1);
    }
  };

  const handleRestart = () => {
    setPlayerX('');
    setPlayerO('');
    setGameStarted(false);
    setWinsX(0);
    setWinsO(0);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <Text style={styles.title}>Tres en Raya</Text>
      {!gameStarted ? (
        <View>
          <TextInput
            style={styles.input}
            placeholder="Nombre del Jugador X"
            value={playerX}
            onChangeText={setPlayerX}
          />
          <TextInput
            style={styles.input}
            placeholder="Nombre del Jugador O"
            value={playerO}
            onChangeText={setPlayerO}
          />
          <TouchableOpacity
            style={styles.startButton}
            onPress={handleStartGame}>
            <Text style={styles.startButtonText}>Comenzar Juego</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View>
          <Text style={styles.scoreboard}>
            X = {playerX} (Victorias: {winsX})
          </Text>
          <Text style={styles.scoreboard}>
            O = {playerO} (Victorias: {winsO})
          </Text>
          <Board
            playerX={playerX}
            playerO={playerO}
            onWin={handleWin}
            onRestart={handleRestart}
          />
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  boardRow: {
    flexDirection: 'row',
  },
  square: {
    width: 100,
    height: 100,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    margin: 5,
    borderWidth: 1,
    borderColor: '#000',
  },
  squareText: {
    fontSize: 36,
    fontWeight: 'bold',
  },
  winnerText: {
    fontSize: 24,
    marginTop: 20,
    fontWeight: 'bold',
    color: 'green',
  },
  resetButton: {
    marginTop: 20,
    backgroundColor: '#2196F3',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  resetButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  input: {
    height: 40,
    borderColor: '#000',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    width: 250,
    textAlign: 'center',
  },
  startButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  startButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  scoreboard: {
    fontSize: 18,
    marginBottom: 27,
    fontWeight: 'bold',
  },
});

export default App;
