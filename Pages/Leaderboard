import React, { useState, useEffect } from 'react';
import { GameSession } from '@/entities/GameSession';
import { motion } from 'framer-motion';
import { Trophy, Medal, Star, Users, Clock, Target } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';

export default function Leaderboard() {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSessions();
  }, []);

  const loadSessions = async () => {
    try {
      const data = await GameSession.list('-created_date', 50);
      setSessions(data);
    } catch (error) {
      console.error('Error loading sessions:', error);
    } finally {
      setLoading(false);
    }
  };

  const getTopPlayersByDifficulty = (difficulty) => {
    const filteredSessions = sessions.filter(s => s.difficulty === difficulty);
    const allPlayers = [];
    
    filteredSessions.forEach(session => {
      session.players?.forEach(player => {
        allPlayers.push({
          ...player,
          difficulty: session.difficulty,
          theme: session.theme,
          date: session.created_date,
          isWinner: player.name === session.winner_name
        });
      });
    });
    
    // Group by player name and get their best score
    const playerStats = {};
    allPlayers.forEach(player => {
      if (!playerStats[player.name]) {
        playerStats[player.name] = {
          name: player.name,
          bestScore: player.score,
          totalGames: 1,
          totalWins: player.isWinner ? 1 : 0,
          avgScore: player.score,
          difficulty
        };
      } else {
        const stats = playerStats[player.name];
        stats.bestScore = Math.max(stats.bestScore, player.score);
        stats.totalGames += 1;
        stats.totalWins += player.isWinner ? 1 : 0;
        stats.avgScore = Math.round((stats.avgScore * (stats.totalGames - 1) + player.score) / stats.totalGames);
      }
    });
    
    return Object.values(playerStats)
      .sort((a, b) => b.bestScore - a.bestScore)
      .slice(0, 10);
  };

  const getAllTimePlayers = () => {
    const allPlayers = [];
    
    sessions.forEach(session => {
      session.players?.forEach(player => {
        allPlayers.push({
          ...player,
          difficulty: session.difficulty,
          theme: session.theme,
          date: session.created_date,
          isWinner: player.name === session.winner_name
        });
      });
    });
    
    const playerStats = {};
    allPlayers.forEach(player => {
      if (!playerStats[player.name]) {
        playerStats[player.name] = {
          name: player.name,
          totalScore: player.score,
          totalGames: 1,
          totalWins: player.isWinner ? 1 : 0,
          bestScore: player.score,
          avgScore: player.score
        };
      } else {
        const stats = playerStats[player.name];
        stats.totalScore += player.score;
        stats.totalGames += 1;
        stats.totalWins += player.isWinner ? 1 : 0;
        stats.bestScore = Math.max(stats.bestScore, player.score);
        stats.avgScore = Math.round(stats.totalScore / stats.totalGames);
      }
    });
    
    return Object.values(playerStats)
      .sort((a, b) => b.totalScore - a.totalScore)
      .slice(0, 10);
  };

  const getMedalIcon = (position) => {
    switch (position) {
      case 0: return <Trophy className="w-5 h-5 text-yellow-500" />;
      case 1: return <Medal className="w-5 h-5 text-gray-400" />;
      case 2: return <Star className="w-5 h-5 text-amber-600" />;
      default: return (
        <div className="w-5 h-5 rounded-full bg-gray-300 flex items-center justify-center text-xs font-bold text-gray-600">
          {position + 1}
        </div>
      );
    }
  };

  const getPositionColor = (position) => {
    switch (position) {
      case 0: return 'from-yellow-200 to-orange-200';
      case 1: return 'from-gray-200 to-gray-300';
      case 2: return 'from-amber-200 to-amber-300';
      default: return 'from-blue-100 to-blue-200';
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-700';
      case 'medium': return 'bg-yellow-100 text-yellow-700';
      case 'hard': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading leaderboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <div className="text-5xl mb-4">🏆</div>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-yellow-500 to-orange-500 bg-clip-text text-transparent mb-2">
          Leaderboard
        </h1>
        <p className="text-xl text-gray-600">Champions of Memory Match</p>
      </motion.div>

      {/* Stats Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid md:grid-cols-3 gap-6 mb-8"
      >
        <div className="clay-card p-6 text-center">
          <Users className="w-8 h-8 mx-auto mb-2 text-purple-500" />
          <div className="text-2xl font-bold text-gray-800">{sessions.length}</div>
          <div className="text-sm text-gray-600">Total Games</div>
        </div>
        <div className="clay-card p-6 text-center">
          <Target className="w-8 h-8 mx-auto mb-2 text-green-500" />
          <div className="text-2xl font-bold text-gray-800">
            {sessions.reduce((acc, s) => acc + (s.total_pairs || 0), 0)}
          </div>
          <div className="text-sm text-gray-600">Total Pairs Matched</div>
        </div>
        <div className="clay-card p-6 text-center">
          <Clock className="w-8 h-8 mx-auto mb-2 text-blue-500" />
          <div className="text-2xl font-bold text-gray-800">
            {Math.round(sessions.reduce((acc, s) => acc + (s.game_duration || 0), 0) / sessions.length || 0)}s
          </div>
          <div className="text-sm text-gray-600">Avg Game Duration</div>
        </div>
      </motion.div>

      {/* Leaderboard Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="clay-card p-8"
      >
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-8 bg-gray-100">
            <TabsTrigger value="all" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-400 data-[state=active]:to-blue-400 data-[state=active]:text-white">
              All Time
            </TabsTrigger>
            <TabsTrigger value="easy" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-400 data-[state=active]:to-green-500 data-[state=active]:text-white">
              Easy
            </TabsTrigger>
            <TabsTrigger value="medium" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-yellow-400 data-[state=active]:to-orange-500 data-[state=active]:text-white">
              Medium
            </TabsTrigger>
            <TabsTrigger value="hard" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-400 data-[state=active]:to-red-500 data-[state=active]:text-white">
              Hard
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all">
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-gray-800 mb-4">All-Time Champions</h3>
              {getAllTimePlayers().map((player, index) => (
                <motion.div
                  key={player.name}
                  initial={{ x: -50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className={`flex items-center justify-between p-6 rounded-2xl bg-gradient-to-r ${getPositionColor(index)}`}
                >
                  <div className="flex items-center gap-4">
                    {getMedalIcon(index)}
                    <div>
                      <h4 className="text-lg font-bold text-gray-800">
                        {player.name}
                        {index === 0 && <span className="ml-2">👑</span>}
                      </h4>
                      <p className="text-sm text-gray-600">
                        {player.totalGames} games • {player.totalWins} wins • {Math.round((player.totalWins / player.totalGames) * 100)}% win rate
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-bold text-gray-800">{player.totalScore}</div>
                    <div className="text-sm text-gray-600">total points</div>
                    <div className="text-xs text-gray-500">avg: {player.avgScore}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          {['easy', 'medium', 'hard'].map(difficulty => (
            <TabsContent key={difficulty} value={difficulty}>
              <div className="space-y-4">
                <div className="flex items-center gap-3 mb-4">
                  <h3 className="text-xl font-bold text-gray-800">
                    {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)} Level Champions
                  </h3>
                  <Badge className={getDifficultyColor(difficulty)}>
                    {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
                  </Badge>
                </div>
                {getTopPlayersByDifficulty(difficulty).map((player, index) => (
                  <motion.div
                    key={`${difficulty}-${player.name}`}
                    initial={{ x: -50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className={`flex items-center justify-between p-6 rounded-2xl bg-gradient-to-r ${getPositionColor(index)}`}
                  >
                    <div className="flex items-center gap-4">
                      {getMedalIcon(index)}
                      <div>
                        <h4 className="text-lg font-bold text-gray-800">
                          {player.name}
                          {index === 0 && <span className="ml-2">👑</span>}
                        </h4>
                        <p className="text-sm text-gray-600">
                          {player.totalGames} games • {player.totalWins} wins • {Math.round((player.totalWins / player.totalGames) * 100)}% win rate
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xl font-bold text-gray-800">{player.bestScore}</div>
                      <div className="text-sm text-gray-600">best score</div>
                      <div className="text-xs text-gray-500">avg: {player.avgScore}</div>
                    </div>
                  </motion.div>
                ))}
                {getTopPlayersByDifficulty(difficulty).length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <div className="text-4xl mb-2">🎮</div>
                    <p>No games played at this difficulty yet!</p>
                    <p className="text-sm">Be the first to set a record.</p>
                  </div>
                )}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </motion.div>
    </div>
  );
}
