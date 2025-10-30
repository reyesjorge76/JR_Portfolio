import React, { useState } from 'react';
import { Gamepad2, Grid3x3, Brain } from 'lucide-react';
import GameModal from './GameModal';

const GamesSection: React.FC = () => {
  const [selectedGame, setSelectedGame] = useState<string | null>(null);

  const games = [
    {
      id: 'snake',
      title: 'AI Snake Game',
      description: 'Classic snake game with AI pathfinding algorithm demonstration',
      icon: <Gamepad2 className="w-8 h-8 text-green-400" />,
      image: 'https://d64gsuwffb70l.cloudfront.net/690275a5aa72d84bb39d4ca3_1761768943447_d523c5f0.webp',
      type: 'snake' as const
    },
    {
      id: 'tictactoe',
      title: 'Tic-Tac-Toe AI',
      description: 'Play against an AI opponent using minimax algorithm',
      icon: <Grid3x3 className="w-8 h-8 text-blue-400" />,
      image: 'https://d64gsuwffb70l.cloudfront.net/690275a5aa72d84bb39d4ca3_1761768945284_a414a0fe.webp',
      type: 'tictactoe' as const
    },
    {
      id: 'memory',
      title: 'Memory Game',
      description: 'Test your memory with this card matching game featuring difficulty levels',
      icon: <Brain className="w-8 h-8 text-purple-400" />,
      image: 'https://d64gsuwffb70l.cloudfront.net/690275a5aa72d84bb39d4ca3_1761768947113_be1b75b2.webp',
      type: 'memory' as const
    }
  ];

  return (
    <section id="games" className="py-20 bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">
            <span className="bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
              Python Games Portfolio
            </span>
          </h2>
          <p className="text-gray-400 text-lg max-w-3xl mx-auto">
            Interactive browser-based games showcasing algorithmic thinking and game development skills
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {games.map((game) => (
            <div
              key={game.id}
              className="group relative bg-gray-800/50 border border-green-500/20 rounded-xl overflow-hidden hover:border-green-400/50 transition-all duration-300"
            >
              <div className="aspect-video relative overflow-hidden">
                <img 
                  src={game.image} 
                  alt={game.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/50 to-transparent" />
              </div>
              
              <div className="p-6">
                <div className="flex items-center gap-3 mb-3">
                  {game.icon}
                  <h3 className="text-xl font-semibold text-green-400">{game.title}</h3>
                </div>
                <p className="text-gray-400 mb-4">{game.description}</p>
                
                <button
                  onClick={() => setSelectedGame(game.id)}
                  className="w-full bg-gradient-to-r from-green-600 to-blue-600 text-white py-3 rounded-lg font-semibold hover:shadow-lg hover:shadow-green-500/25 transform hover:-translate-y-1 transition-all duration-200"
                >
                  Play Game
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {games.map((game) => (
        <GameModal
          key={game.id}
          isOpen={selectedGame === game.id}
          onClose={() => setSelectedGame(null)}
          title={game.title}
          type={game.type}
        />
      ))}
    </section>
  );
};

export default GamesSection;