import React, { useState, useEffect } from 'react';
import { X, RotateCcw, Trophy, Gamepad2 } from 'lucide-react';

interface GameModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  type: 'tictactoe' | 'memory' | 'snake';
}

const GameModal: React.FC<GameModalProps> = ({ isOpen, onClose, title, type }) => {
  // Tic Tac Toe State
  const [board, setBoard] = useState(Array(9).fill(null));
  const [isXNext, setIsXNext] = useState(true);
  const [winner, setWinner] = useState<string | null>(null);

  // Memory Game State
  const [cards, setCards] = useState<{ id: number; value: string; flipped: boolean; matched: boolean }[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [memoryWon, setMemoryWon] = useState(false);

  // Snake Game State
  const [snake, setSnake] = useState([{ x: 10, y: 10 }]);
  const [food, setFood] = useState({ x: 15, y: 15 });
  const [direction, setDirection] = useState({ x: 1, y: 0 });
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);

  // Initialize games
  useEffect(() => {
    if (isOpen) {
      if (type === 'memory') {
        initMemoryGame();
      } else if (type === 'snake') {
        initSnakeGame();
      }
    }
  }, [isOpen, type]);

  // Snake game loop
  useEffect(() => {
    if (type === 'snake' && isOpen && !gameOver) {
      const interval = setInterval(() => {
        moveSnake();
      }, 200);
      return () => clearInterval(interval);
    }
  }, [snake, direction, gameOver, type, isOpen]);

  const initMemoryGame = () => {
    const symbols = ['🎮', '🎯', '🎨', '🎭', '🎪', '🎲'];
    const gameCards = [...symbols, ...symbols].map((value, index) => ({
      id: index,
      value,
      flipped: false,
      matched: false
    })).sort(() => Math.random() - 0.5);
    setCards(gameCards);
    setFlippedCards([]);
    setMoves(0);
    setMemoryWon(false);
  };

  const initSnakeGame = () => {
    setSnake([{ x: 10, y: 10 }]);
    setFood({ x: 15, y: 15 });
    setDirection({ x: 1, y: 0 });
    setGameOver(false);
    setScore(0);
  };

  const checkWinner = (squares: (string | null)[]) => {
    const lines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8],
      [0, 3, 6], [1, 4, 7], [2, 5, 8],
      [0, 4, 8], [2, 4, 6]
    ];
    for (let line of lines) {
      const [a, b, c] = line;
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a];
      }
    }
    return squares.every(s => s !== null) ? 'Draw' : null;
  };

  const handleTicTacToeClick = (i: number) => {
    if (board[i] || winner) return;
    const newBoard = [...board];
    newBoard[i] = isXNext ? 'X' : 'O';
    setBoard(newBoard);
    setIsXNext(!isXNext);
    const gameWinner = checkWinner(newBoard);
    if (gameWinner) setWinner(gameWinner);
  };

  const handleCardClick = (id: number) => {
    const card = cards.find(c => c.id === id);
    if (!card || card.matched || card.flipped || flippedCards.length >= 2) return;

    const newCards = cards.map(c => c.id === id ? { ...c, flipped: true } : c);
    setCards(newCards);
    const newFlipped = [...flippedCards, id];
    setFlippedCards(newFlipped);
    setMoves(moves + 1);

    if (newFlipped.length === 2) {
      const [first, second] = newFlipped;
      const firstCard = cards.find(c => c.id === first);
      const secondCard = cards.find(c => c.id === second);
      
      if (firstCard?.value === secondCard?.value) {
        setTimeout(() => {
          setCards(prev => prev.map(c => 
            c.id === first || c.id === second ? { ...c, matched: true } : c
          ));
          setFlippedCards([]);
          if (newCards.filter(c => !c.matched).length === 2) {
            setMemoryWon(true);
          }
        }, 500);
      } else {
        setTimeout(() => {
          setCards(prev => prev.map(c => 
            c.id === first || c.id === second ? { ...c, flipped: false } : c
          ));
          setFlippedCards([]);
        }, 1000);
      }
    }
  };

  const moveSnake = () => {
    setSnake(prev => {
      const newSnake = [...prev];
      const head = { ...newSnake[0] };
      head.x += direction.x;
      head.y += direction.y;

      if (head.x < 0 || head.x >= 20 || head.y < 0 || head.y >= 20) {
        setGameOver(true);
        return prev;
      }

      if (newSnake.some(segment => segment.x === head.x && segment.y === head.y)) {
        setGameOver(true);
        return prev;
      }

      newSnake.unshift(head);

      if (head.x === food.x && head.y === food.y) {
        setFood({
          x: Math.floor(Math.random() * 20),
          y: Math.floor(Math.random() * 20)
        });
        setScore(s => s + 10);
      } else {
        newSnake.pop();
      }

      return newSnake;
    });
  };

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (type !== 'snake' || !isOpen) return;
      
      switch(e.key) {
        case 'ArrowUp':
          if (direction.y === 0) setDirection({ x: 0, y: -1 });
          break;
        case 'ArrowDown':
          if (direction.y === 0) setDirection({ x: 0, y: 1 });
          break;
        case 'ArrowLeft':
          if (direction.x === 0) setDirection({ x: -1, y: 0 });
          break;
        case 'ArrowRight':
          if (direction.x === 0) setDirection({ x: 1, y: 0 });
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [direction, type, isOpen]);

  if (!isOpen) return null;

  const resetGame = () => {
    if (type === 'tictactoe') {
      setBoard(Array(9).fill(null));
      setIsXNext(true);
      setWinner(null);
    } else if (type === 'memory') {
      initMemoryGame();
    } else if (type === 'snake') {
      initSnakeGame();
    }
  };

  return (
    <div 
      className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div 
        className="bg-gray-900 border border-cyan-500/30 rounded-2xl w-full max-w-3xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-gradient-to-r from-cyan-600/20 to-purple-600/20 p-4 border-b border-cyan-500/30 flex justify-between items-center relative">
          <div className="flex items-center gap-3">
            <Gamepad2 className="w-6 h-6 text-cyan-400" />
            <h2 className="text-2xl font-bold text-cyan-400">{title}</h2>
          </div>
          <button 
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              onClose();
            }} 
            className="relative z-20 text-gray-400 hover:text-cyan-400 transition-colors p-2 hover:bg-white/10 rounded-lg cursor-pointer flex-shrink-0"
            type="button"
            aria-label="Close modal"
            style={{ pointerEvents: 'auto' }}
          >
            <X size={24} />
          </button>
        </div>
        
        <div className="p-6">
          {/* Tic Tac Toe */}
          {type === 'tictactoe' && (
            <div className="flex flex-col items-center">
              <div className="mb-4 text-center">
                {winner ? (
                  <div className="text-2xl font-bold text-cyan-400">
                    {winner === 'Draw' ? "It's a Draw!" : `${winner} Wins!`}
                  </div>
                ) : (
                  <div className="text-xl text-gray-300">
                    Current Player: <span className="text-cyan-400 font-bold">{isXNext ? 'X' : 'O'}</span>
                  </div>
                )}
              </div>
              
              <div className="grid grid-cols-3 gap-2 mb-6">
                {board.map((cell, i) => (
                  <button
                    key={i}
                    onClick={() => handleTicTacToeClick(i)}
                    className="w-24 h-24 bg-gray-800 border-2 border-cyan-500/30 rounded-lg text-4xl font-bold text-cyan-400 hover:bg-gray-700 transition-all"
                  >
                    {cell}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Memory Game */}
          {type === 'memory' && (
            <div className="flex flex-col items-center">
              <div className="mb-4 text-center">
                <div className="text-xl text-gray-300">
                  Moves: <span className="text-cyan-400 font-bold">{moves}</span>
                </div>
                {memoryWon && (
                  <div className="text-2xl font-bold text-green-400 mt-2">
                    <Trophy className="inline w-6 h-6 mr-2" />
                    You Won!
                  </div>
                )}
              </div>
              
              <div className="grid grid-cols-4 gap-3 mb-6">
                {cards.map(card => (
                  <button
                    key={card.id}
                    onClick={() => handleCardClick(card.id)}
                    className={`w-20 h-20 rounded-lg text-3xl transition-all transform ${
                      card.flipped || card.matched
                        ? 'bg-cyan-600 rotate-0'
                        : 'bg-gray-700 hover:bg-gray-600'
                    }`}
                  >
                    {(card.flipped || card.matched) ? card.value : '?'}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Snake Game */}
          {type === 'snake' && (
            <div className="flex flex-col items-center">
              <div className="mb-4 text-center">
                <div className="text-xl text-gray-300">
                  Score: <span className="text-cyan-400 font-bold">{score}</span>
                </div>
                {gameOver && (
                  <div className="text-2xl font-bold text-red-400 mt-2">Game Over!</div>
                )}
                <div className="text-sm text-gray-500 mt-2">Use arrow keys to move</div>
              </div>
              
              <div className="relative bg-gray-800 border-2 border-cyan-500/30 rounded-lg" style={{ width: '400px', height: '400px' }}>
                {/* Snake */}
                {snake.map((segment, i) => (
                  <div
                    key={i}
                    className={`absolute ${i === 0 ? 'bg-cyan-400' : 'bg-cyan-600'}`}
                    style={{
                      left: `${segment.x * 20}px`,
                      top: `${segment.y * 20}px`,
                      width: '20px',
                      height: '20px'
                    }}
                  />
                ))}
                
                {/* Food */}
                <div
                  className="absolute bg-purple-500 rounded-full"
                  style={{
                    left: `${food.x * 20}px`,
                    top: `${food.y * 20}px`,
                    width: '20px',
                    height: '20px'
                  }}
                />
              </div>
            </div>
          )}

          <div className="flex justify-center mt-6">
            <button
              onClick={resetGame}
              className="bg-gradient-to-r from-cyan-600 to-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg hover:shadow-cyan-500/25 transition-all flex items-center gap-2"
            >
              <RotateCcw className="w-5 h-5" />
              Reset Game
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameModal;