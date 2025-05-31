"use client";

import Navigation from "@/components/navigation";
import { Crown } from "lucide-react";

// Mock leaderboard data
const leaderboardData = [{ rank: 1, name: "TETRIS_MASTER", score: 999999 }];

const getRankIcon = (rank: number) => {
  switch (rank) {
    case 1:
      return <Crown className="h-8 w-8 text-yellow-400" />;
  }
};

const getRankColors = (rank: number) => {
  switch (rank) {
    case 1:
      return "from-yellow-400 via-yellow-500 to-orange-500 shadow-[0_0_30px_rgba(234,179,8,0.8)]";
  }
};

export default function Leaderboard() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
      <Navigation />

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-6xl font-bold text-transparent bg-gradient-to-r from-yellow-400 via-pink-400 to-cyan-400 bg-clip-text mb-4 drop-shadow-lg">
            THE CHAMP
          </h1>
          <p className="text-xl text-gray-300">
            the undisputed, YETRIS world champion
          </p>
        </div>

        {/* Leaderboard */}
        <div className="max-w-4xl mx-auto space-y-4">
          {leaderboardData.map((player, index) => (
            <div
              key={player.rank}
              className={`relative bg-gradient-to-r ${getRankColors(
                player.rank,
              )} p-1 rounded-2xl transform hover:scale-105 transition-all duration-300`}
            >
              {/* Glow effect */}
              <div
                className={`absolute -inset-1 bg-gradient-to-r ${getRankColors(
                  player.rank,
                )} rounded-2xl blur opacity-60 animate-pulse`}
              />

              {/* Content */}
              <div className="relative bg-gray-900 rounded-xl p-6">
                <div className="flex items-center justify-between">
                  {/* Rank and Name */}
                  <div className="flex items-center gap-6">
                    <div className="flex items-center gap-3">
                      {getRankIcon(player.rank)}
                      <span className="text-4xl font-bold text-white">
                        #{player.rank}
                      </span>
                    </div>

                    <div>
                      <h3 className="text-2xl font-bold text-transparent bg-gradient-to-r from-white to-gray-300 bg-clip-text">
                        {player.name}
                      </h3>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="text-right space-y-2">
                    <div className="text-3xl font-bold text-transparent bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text">
                      {player.score.toLocaleString()}
                    </div>
                  </div>
                </div>

                {/* Special effects for top 3 */}
                {player.rank <= 3 && (
                  <div className="absolute top-0 right-0 p-2">
                    <div
                      className={`w-3 h-3 rounded-full bg-gradient-to-r ${getRankColors(
                        player.rank,
                      )} animate-ping`}
                    />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-12">
          <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 rounded-2xl p-8 border-2 border-purple-400/50 shadow-xl max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold text-transparent bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text mb-4">
              Do you have what it takes?
            </h2>
            <p className="text-gray-300 mb-6">
              Start playing now and you could take the crown.
            </p>
            <a
              href="/"
              className="inline-block bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-4 rounded-xl font-bold text-xl shadow-[0_0_20px_rgba(168,85,247,0.6)] border-2 border-purple-300 hover:scale-105 transition-all duration-200"
            >
              PLAY NOW
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
