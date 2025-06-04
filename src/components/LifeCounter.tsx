import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Settings, Sword, Zap, Skull, Target } from 'lucide-react';
import { FaUser, FaUsers } from 'react-icons/fa';
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

  const setPlayerCount = (count: number) => {
    const newPlayers = Array.from({ length: count }, (_, i) => ({
      id: i + 1,
      name: `Jogador ${i + 1}`,
      life: 20,
      commanderDamage: 0,
      poison: 0,
      energy: 0
    }));
    setPlayers(newPlayers);
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

  // Função para determinar o layout baseado no número de jogadores
  const getPlayerLayout = () => {
    const count = players.length;
    
    switch (count) {
      case 2:
        return 'grid-rows-2 h-screen';
      case 3:
        return 'grid-cols-2 grid-rows-2 h-screen';
      case 4:
        return 'grid-cols-2 grid-rows-2 h-screen';
      case 5:
        return 'grid-cols-2 grid-rows-3 h-screen';
      case 6:
        return 'grid-cols-2 grid-rows-3 h-screen';
      case 7:
        return 'grid-cols-2 grid-rows-4 h-screen';
      case 8:
        return 'grid-cols-2 grid-rows-4 h-screen';
      default:
        return 'grid-rows-2 h-screen';
    }
  };

  // Função para determinar rotação e posicionamento do jogador
  const getPlayerRotation = (index: number) => {
    const count = players.length;
    
    if (count === 2) {
      return index === 0 ? 'transform rotate-180' : '';
    }
    
    if (count === 3) {
      if (index === 0) return 'col-span-2';
      return index === 1 ? 'transform rotate-180' : '';
    }
    
    if (count === 4) {
      return (index === 0 || index === 1) ? 'transform rotate-180' : '';
    }
    
    if (count === 5) {
      if (index === 0) return 'col-span-2';
      return (index === 1 || index === 2) ? 'transform rotate-180' : '';
    }
    
    if (count === 6) {
      return (index === 0 || index === 1 || index === 2) ? 'transform rotate-180' : '';
    }
    
    if (count === 7) {
      if (index === 0) return 'col-span-2';
      return (index === 1 || index === 2 || index === 3) ? 'transform rotate-180' : '';
    }
    
    if (count === 8) {
      return (index === 0 || index === 1 || index === 2 || index === 3) ? 'transform rotate-180' : '';
    }
    
    return '';
  };

  const selectedPlayer = players.find(p => p.id === selectedPlayerId);

  const getPlayerIcons = (count: number) => {
    const icons = [];
    for (let i = 0; i < count; i++) {
      icons.push(i < 4 ? <FaUser key={i} className="w-3 h-3" /> : null);
    }
    if (count > 4) {
      return <FaUsers className="w-4 h-4" />;
    }
    return <div className="flex gap-1">{icons}</div>;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 relative overflow-hidden">
      <div className="h-screen w-full relative">
        {/* Players Grid - Ocupa toda a tela */}
        <div className={`grid gap-1 p-1 ${getPlayerLayout()}`}>
          {players.map((player, index) => (
            <Card 
              key={player.id} 
              className={`bg-white/10 border-white/20 backdrop-blur-sm h-full ${getPlayerRotation(index)}`}
            >
              <CardContent className="p-2 h-full">
                <div className="text-center h-full">
                  
                  {/* Life Display with Touch Areas - Maximizado para ocupar toda a altura */}
                  <div className="bg-black/30 rounded-lg relative overflow-hidden h-full flex flex-col">
                    {/* Touch Areas */}
                    <div className="absolute inset-0 z-10 flex">
                      {/* Left side - decrease */}
                      <div 
                        className="w-1/3 h-full flex items-center justify-center cursor-pointer hover:bg-red-500/20 transition-colors"
                        onTouchStart={(e) => handleTouchStart(e, player.id, 'left')}
                        onTouchMove={(e) => handleTouchMove(e, player.id, 'left')}
                        onTouchEnd={(e) => handleTouchEnd(e, player.id, 'left')}
                      >
                        <span className="text-red-400 text-xl font-bold opacity-50">-</span>
                      </div>
                      
                      {/* Center - counters */}
                      <div 
                        className="w-1/3 h-full flex items-center justify-center cursor-pointer hover:bg-blue-500/20 transition-colors"
                        onTouchStart={(e) => handleTouchStart(e, player.id, 'center')}
                        onTouchMove={(e) => handleTouchMove(e, player.id, 'center')}
                        onTouchEnd={(e) => handleTouchEnd(e, player.id, 'center')}
                      >
                        <Target className="text-blue-400 opacity-50" size={16} />
                      </div>
                      
                      {/* Right side - increase */}
                      <div 
                        className="w-1/3 h-full flex items-center justify-center cursor-pointer hover:bg-green-500/20 transition-colors"
                        onTouchStart={(e) => handleTouchStart(e, player.id, 'right')}
                        onTouchMove={(e) => handleTouchMove(e, player.id, 'right')}
                        onTouchEnd={(e) => handleTouchEnd(e, player.id, 'right')}
                      >
                        <span className="text-green-400 text-xl font-bold opacity-50">+</span>
                      </div>
                    </div>

                    {/* Life number - Centralizado e maximizado */}
                    <div className="flex-1 flex items-center justify-center relative z-0">
                      <div className="text-8xl md:text-9xl font-bold text-white">{player.life}</div>
                    </div>

                    {/* Counters Display */}
                    {(player.commanderDamage > 0 || player.poison > 0 || player.energy > 0) && (
                      <div className="absolute bottom-2 left-2 right-2 flex justify-center gap-3 text-xs text-white/80 z-20">
                        {player.commanderDamage > 0 && (
                          <div className="flex items-center gap-1 bg-black/50 rounded px-2 py-1">
                            <Sword className="w-3 h-3" />
                            <span>{player.commanderDamage}</span>
                          </div>
                        )}
                        {player.poison > 0 && (
                          <div className="flex items-center gap-1 bg-black/50 rounded px-2 py-1">
                            <Skull className="w-3 h-3" />
                            <span>{player.poison}</span>
                          </div>
                        )}
                        {player.energy > 0 && (
                          <div className="flex items-center gap-1 bg-black/50 rounded px-2 py-1">
                            <Zap className="w-3 h-3" />
                            <span>{player.energy}</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Menu Button - Centralizado na tela */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-30">
          <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
            <SheetTrigger asChild>
              <Button 
                variant="outline"
                size="sm"
                className="bg-black/80 border-white/20 text-white hover:bg-black/90 backdrop-blur-sm"
              >
                <Settings className="w-4 h-4 mr-2" />
                Menu
              </Button>
            </SheetTrigger>
            <SheetContent side="bottom" className="h-[60vh]">
              <SheetHeader>
                <SheetTitle>Configurações do Jogo</SheetTitle>
                <SheetDescription>
                  Escolha o número de jogadores
                </SheetDescription>
              </SheetHeader>
              
              <div className="grid gap-4 py-4">
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold">Número de Jogadores</h3>
                  <div className="grid grid-cols-4 gap-2">
                    {[2, 3, 4, 5, 6, 7, 8].map(count => (
                      <Button 
                        key={count}
                        onClick={() => setPlayerCount(count)}
                        variant={players.length === count ? "default" : "outline"}
                        className="h-12 flex flex-col items-center justify-center gap-1 text-xs"
                      >
                        {getPlayerIcons(count)}
                        <span>{count}</span>
                      </Button>
                    ))}
                  </div>
                </div>

                <Button 
                  onClick={resetGame}
                  variant="destructive"
                  className="w-full mt-4"
                >
                  Reset do Jogo
                </Button>
              </div>
            </SheetContent>
          </Sheet>
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
      </div>
    </div>
  );
};

export default LifeCounter;
