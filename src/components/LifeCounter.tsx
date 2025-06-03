
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Plus, Minus, RotateCcw, Settings } from 'lucide-react';

interface Player {
  id: number;
  name: string;
  life: number;
}

const LifeCounter = () => {
  const [players, setPlayers] = useState<Player[]>([
    { id: 1, name: 'Jogador 1', life: 20 },
    { id: 2, name: 'Jogador 2', life: 20 }
  ]);

  const updateLife = (playerId: number, change: number) => {
    setPlayers(prev => 
      prev.map(player => 
        player.id === playerId 
          ? { ...player, life: Math.max(0, player.life + change) }
          : player
      )
    );
  };

  const resetGame = () => {
    setPlayers(prev => 
      prev.map(player => ({ ...player, life: 20 }))
    );
  };

  const addPlayer = () => {
    if (players.length < 4) {
      const newPlayer = {
        id: players.length + 1,
        name: `Jogador ${players.length + 1}`,
        life: 20
      };
      setPlayers(prev => [...prev, newPlayer]);
    }
  };

  const removePlayer = () => {
    if (players.length > 2) {
      setPlayers(prev => prev.slice(0, -1));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-4">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-white mb-2">Magic Life Counter</h1>
          <div className="flex justify-center gap-2">
            <Button 
              onClick={resetGame}
              variant="outline"
              size="sm"
              className="bg-white/10 border-white/20 text-white hover:bg-white/20"
            >
              <RotateCcw className="w-4 h-4 mr-1" />
              Reset
            </Button>
            <Button 
              onClick={addPlayer}
              disabled={players.length >= 4}
              variant="outline"
              size="sm"
              className="bg-white/10 border-white/20 text-white hover:bg-white/20"
            >
              <Plus className="w-4 h-4 mr-1" />
              Jogador
            </Button>
            <Button 
              onClick={removePlayer}
              disabled={players.length <= 2}
              variant="outline"
              size="sm"
              className="bg-white/10 border-white/20 text-white hover:bg-white/20"
            >
              <Minus className="w-4 h-4 mr-1" />
              Jogador
            </Button>
          </div>
        </div>

        {/* Players Grid */}
        <div className={`grid gap-4 ${players.length <= 2 ? 'grid-cols-1' : 'grid-cols-2'}`}>
          {players.map((player) => (
            <Card key={player.id} className="bg-white/10 border-white/20 backdrop-blur-sm">
              <CardContent className="p-4">
                <div className="text-center">
                  <h3 className="text-lg font-semibold text-white mb-2">{player.name}</h3>
                  
                  {/* Life Display */}
                  <div className="bg-black/30 rounded-lg p-4 mb-4">
                    <div className="text-5xl font-bold text-white">{player.life}</div>
                  </div>

                  {/* Control Buttons */}
                  <div className="grid grid-cols-3 gap-2">
                    <Button
                      onClick={() => updateLife(player.id, -5)}
                      variant="destructive"
                      size="lg"
                      className="h-12 text-lg font-bold"
                    >
                      -5
                    </Button>
                    <Button
                      onClick={() => updateLife(player.id, -1)}
                      variant="destructive"
                      size="lg"
                      className="h-12 text-lg font-bold"
                    >
                      -1
                    </Button>
                    <Button
                      onClick={() => updateLife(player.id, 1)}
                      variant="default"
                      size="lg"
                      className="h-12 text-lg font-bold bg-green-600 hover:bg-green-700"
                    >
                      +1
                    </Button>
                  </div>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    <Button
                      onClick={() => updateLife(player.id, -10)}
                      variant="destructive"
                      size="lg"
                      className="h-10 text-sm font-bold"
                    >
                      -10
                    </Button>
                    <Button
                      onClick={() => updateLife(player.id, 5)}
                      variant="default"
                      size="lg"
                      className="h-10 text-sm font-bold bg-green-600 hover:bg-green-700"
                    >
                      +5
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Game Status */}
        <div className="mt-6 text-center">
          <div className="text-white/70 text-sm">
            {players.filter(p => p.life > 0).length} jogador(es) vivo(s)
          </div>
          {players.some(p => p.life <= 0) && (
            <div className="text-red-400 font-bold mt-2">
              Jogo terminado!
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LifeCounter;
