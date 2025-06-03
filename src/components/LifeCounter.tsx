
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Settings, Sword, Zap, Skull, Target } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

interface Player {
  id: number;
  name: string;
  life: number;
  commanderDamage: number;
  poison: number;
  energy: number;
}

const LifeCounter = () => {
  const [players, setPlayers] = useState<Player[]>([
    { id: 1, name: 'Jogador 1', life: 20, commanderDamage: 0, poison: 0, energy: 0 },
    { id: 2, name: 'Jogador 2', life: 20, commanderDamage: 0, poison: 0, energy: 0 }
  ]);

  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [selectedPlayerId, setSelectedPlayerId] = useState<number | null>(null);
  const [isPlayerCountersOpen, setIsPlayerCountersOpen] = useState(false);
  const dragStartY = useRef<number>(0);
  const isDragging = useRef<boolean>(false);
  const dragStartLife = useRef<number>(0);

  const updateLife = (playerId: number, change: number) => {
    setPlayers(prev => 
      prev.map(player => 
        player.id === playerId 
          ? { ...player, life: Math.max(0, player.life + change) }
          : player
      )
    );
  };

  const updateCounter = (playerId: number, counterType: keyof Player, change: number) => {
    setPlayers(prev => 
      prev.map(player => {
        if (player.id === playerId) {
          const newValue = Math.max(0, (player[counterType] as number) + change);
          let updatedPlayer = { ...player, [counterType]: newValue };
          
          // Se for dano de comandante, também reduz a vida
          if (counterType === 'commanderDamage' && change > 0) {
            updatedPlayer.life = Math.max(0, updatedPlayer.life - change);
          }
          
          return updatedPlayer;
        }
        return player;
      })
    );
  };

  const resetGame = () => {
    setPlayers(prev => 
      prev.map(player => ({ 
        ...player, 
        life: 20, 
        commanderDamage: 0, 
        poison: 0, 
        energy: 0 
      }))
    );
    setIsSheetOpen(false);
  };

  const addPlayer = () => {
    if (players.length < 4) {
      const newPlayer = {
        id: players.length + 1,
        name: `Jogador ${players.length + 1}`,
        life: 20,
        commanderDamage: 0,
        poison: 0,
        energy: 0
      };
      setPlayers(prev => [...prev, newPlayer]);
    }
    setIsSheetOpen(false);
  };

  const removePlayer = () => {
    if (players.length > 2) {
      setPlayers(prev => prev.slice(0, -1));
    }
    setIsSheetOpen(false);
  };

  const handleTouchStart = (e: React.TouchEvent, playerId: number, side: 'left' | 'right' | 'center') => {
    e.preventDefault();
    
    if (side === 'center') {
      setSelectedPlayerId(playerId);
      setIsPlayerCountersOpen(true);
      return;
    }

    const touch = e.touches[0];
    dragStartY.current = touch.clientY;
    isDragging.current = false;
    
    const player = players.find(p => p.id === playerId);
    if (player) {
      dragStartLife.current = player.life;
    }
  };

  const handleTouchMove = (e: React.TouchEvent, playerId: number, side: 'left' | 'right' | 'center') => {
    e.preventDefault();
    
    if (side === 'center') return;

    const touch = e.touches[0];
    const deltaY = dragStartY.current - touch.clientY;
    
    if (Math.abs(deltaY) > 10) {
      isDragging.current = true;
      const change = Math.floor(deltaY / 10) * (side === 'right' ? 1 : -1);
      const newLife = Math.max(0, dragStartLife.current + change);
      
      setPlayers(prev => 
        prev.map(player => 
          player.id === playerId 
            ? { ...player, life: newLife }
            : player
        )
      );
    }
  };

  const handleTouchEnd = (e: React.TouchEvent, playerId: number, side: 'left' | 'right' | 'center') => {
    e.preventDefault();
    
    if (side === 'center') return;

    if (!isDragging.current) {
      // Toque simples
      const change = side === 'right' ? 1 : -1;
      updateLife(playerId, change);
    }
    isDragging.current = false;
  };

  const selectedPlayer = players.find(p => p.id === selectedPlayerId);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-4">
      <div className="max-w-md mx-auto">
        {/* Header com menu central */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-white mb-4">Magic Life Counter</h1>
          
          <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
            <SheetTrigger asChild>
              <Button 
                variant="outline"
                size="lg"
                className="bg-white/10 border-white/20 text-white hover:bg-white/20"
              >
                <Settings className="w-5 h-5 mr-2" />
                Menu
              </Button>
            </SheetTrigger>
            <SheetContent side="bottom" className="h-[60vh]">
              <SheetHeader>
                <SheetTitle>Configurações do Jogo</SheetTitle>
                <SheetDescription>
                  Gerencie jogadores
                </SheetDescription>
              </SheetHeader>
              
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold">Jogadores</h3>
                  <div className="flex gap-2">
                    <Button 
                      onClick={addPlayer}
                      disabled={players.length >= 4}
                      className="flex-1"
                    >
                      Adicionar Jogador
                    </Button>
                    <Button 
                      onClick={removePlayer}
                      disabled={players.length <= 2}
                      variant="outline"
                      className="flex-1"
                    >
                      Remover Jogador
                    </Button>
                  </div>
                </div>

                <Button 
                  onClick={resetGame}
                  variant="destructive"
                  className="w-full"
                >
                  Reset do Jogo
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>

        {/* Players Grid */}
        <div className={`grid gap-4 ${players.length <= 2 ? 'grid-cols-1' : 'grid-cols-2'}`}>
          {players.map((player) => (
            <Card key={player.id} className="bg-white/10 border-white/20 backdrop-blur-sm">
              <CardContent className="p-4">
                <div className="text-center">
                  <h3 className="text-lg font-semibold text-white mb-2">{player.name}</h3>
                  
                  {/* Life Display with Touch Areas */}
                  <div className="bg-black/30 rounded-lg mb-4 relative overflow-hidden">
                    {/* Left side - decrease */}
                    <div 
                      className="absolute left-0 top-0 w-1/3 h-full z-10 flex items-center justify-center cursor-pointer hover:bg-red-500/20 transition-colors"
                      onTouchStart={(e) => handleTouchStart(e, player.id, 'left')}
                      onTouchMove={(e) => handleTouchMove(e, player.id, 'left')}
                      onTouchEnd={(e) => handleTouchEnd(e, player.id, 'left')}
                    >
                      <span className="text-red-400 text-2xl font-bold opacity-50">-</span>
                    </div>
                    
                    {/* Center - counters */}
                    <div 
                      className="absolute left-1/3 top-0 w-1/3 h-full z-10 flex items-center justify-center cursor-pointer hover:bg-blue-500/20 transition-colors"
                      onTouchStart={(e) => handleTouchStart(e, player.id, 'center')}
                      onTouchMove={(e) => handleTouchMove(e, player.id, 'center')}
                      onTouchEnd={(e) => handleTouchEnd(e, player.id, 'center')}
                    >
                      <Target className="text-blue-400 opacity-50" size={20} />
                    </div>
                    
                    {/* Right side - increase */}
                    <div 
                      className="absolute right-0 top-0 w-1/3 h-full z-10 flex items-center justify-center cursor-pointer hover:bg-green-500/20 transition-colors"
                      onTouchStart={(e) => handleTouchStart(e, player.id, 'right')}
                      onTouchMove={(e) => handleTouchMove(e, player.id, 'right')}
                      onTouchEnd={(e) => handleTouchEnd(e, player.id, 'right')}
                    >
                      <span className="text-green-400 text-2xl font-bold opacity-50">+</span>
                    </div>

                    {/* Life number */}
                    <div className="p-6 relative z-0">
                      <div className="text-6xl font-bold text-white">{player.life}</div>
                    </div>
                  </div>

                  {/* Counters Display */}
                  {(player.commanderDamage > 0 || player.poison > 0 || player.energy > 0) && (
                    <div className="flex justify-center gap-4 text-sm text-white/80">
                      {player.commanderDamage > 0 && (
                        <div className="flex items-center gap-1">
                          <Sword className="w-3 h-3" />
                          <span>{player.commanderDamage}</span>
                        </div>
                      )}
                      {player.poison > 0 && (
                        <div className="flex items-center gap-1">
                          <Skull className="w-3 h-3" />
                          <span>{player.poison}</span>
                        </div>
                      )}
                      {player.energy > 0 && (
                        <div className="flex items-center gap-1">
                          <Zap className="w-3 h-3" />
                          <span>{player.energy}</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Player Counters Sheet */}
        <Sheet open={isPlayerCountersOpen} onOpenChange={setIsPlayerCountersOpen}>
          <SheetContent side="bottom" className="h-[50vh]">
            <SheetHeader>
              <SheetTitle>Contadores - {selectedPlayer?.name}</SheetTitle>
              <SheetDescription>
                Gerencie os contadores do jogador
              </SheetDescription>
            </SheetHeader>
            
            {selectedPlayer && (
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-1 gap-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Sword className="w-4 h-4" />
                      <span className="text-sm">Comandante: {selectedPlayer.commanderDamage}</span>
                    </div>
                    <div className="flex gap-1">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => updateCounter(selectedPlayer.id, 'commanderDamage', -1)}
                      >
                        -
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => updateCounter(selectedPlayer.id, 'commanderDamage', 1)}
                      >
                        +
                      </Button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Skull className="w-4 h-4" />
                      <span className="text-sm">Veneno: {selectedPlayer.poison}</span>
                    </div>
                    <div className="flex gap-1">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => updateCounter(selectedPlayer.id, 'poison', -1)}
                      >
                        -
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => updateCounter(selectedPlayer.id, 'poison', 1)}
                      >
                        +
                      </Button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Zap className="w-4 h-4" />
                      <span className="text-sm">Energia: {selectedPlayer.energy}</span>
                    </div>
                    <div className="flex gap-1">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => updateCounter(selectedPlayer.id, 'energy', -1)}
                      >
                        -
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => updateCounter(selectedPlayer.id, 'energy', 1)}
                      >
                        +
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </SheetContent>
        </Sheet>

        {/* Game Status */}
        <div className="mt-6 text-center">
          <div className="text-white/70 text-sm">
            {players.filter(p => p.life > 0).length} jogador(es) vivo(s)
          </div>
          {players.some(p => p.life <= 0 || p.poison >= 10) && (
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
