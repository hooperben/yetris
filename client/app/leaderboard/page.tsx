"use client";

import Navigation from "@/components/navigation";
import { Crown, ExternalLink } from "lucide-react";
import Link from "next/link";
import { useReadContracts } from "wagmi";
import { Skeleton } from "@/components/ui/skeleton";

// the trophy contract address
const trophyAddress = "0x6d64b04A8ec0dceb6304CC56845C665Fd454a0F1" as const;

const trophyAbi = [
  {
    inputs: [],
    name: "highScore",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "tokenId", type: "uint256" }],
    name: "ownerOf",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
] as const;

export default function Leaderboard() {
  const { data, isLoading, error } = useReadContracts({
    contracts: [
      {
        address: trophyAddress,
        abi: trophyAbi,
        functionName: "highScore",
        chainId: 137, // Polygon
      },
      {
        address: trophyAddress,
        abi: trophyAbi,
        functionName: "ownerOf",
        args: [BigInt(1)],
        chainId: 137, // Polygon
      },
    ],
  });

  const highScore = data?.[0]?.result;
  const champion = data?.[1]?.result;

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
      <Navigation />

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8 md:mb-12">
          <h1 className="text-4xl md:text-6xl font-bold text-transparent bg-gradient-to-r from-yellow-400 via-pink-400 to-cyan-400 bg-clip-text mb-4 drop-shadow-lg">
            THE CHAMP
          </h1>
          <p className="text-lg md:text-xl text-gray-300">
            the undisputed, YETRIS world champion
          </p>
        </div>

        {/* Leaderboard */}
        <div className="max-w-4xl mx-auto space-y-4">
          <div className="relative bg-gradient-to-r from-yellow-400 via-yellow-500 to-orange-500 shadow-[0_0_30px_rgba(234,179,8,0.8)] p-1 rounded-2xl transform hover:scale-105 transition-all duration-300">
            {/* Glow effect */}
            <div className="absolute -inset-1 bg-gradient-to-r from-yellow-400 via-yellow-500 to-orange-500 rounded-2xl blur opacity-60 animate-pulse" />

            {/* Content */}
            <div className="relative bg-gray-900 rounded-xl p-4 md:p-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                {/* Rank and Name */}
                <div className="flex items-center gap-4 md:gap-6">
                  <div className="flex items-center gap-2 md:gap-3">
                    <Crown className="h-6 w-6 md:h-8 md:w-8 text-yellow-400" />
                    <span className="text-2xl md:text-4xl font-bold text-white">
                      #1
                    </span>
                  </div>

                  <div className="flex-1 min-w-0">
                    {isLoading ? (
                      <Skeleton className="h-6 md:h-8 w-32 md:w-48" />
                    ) : error ? (
                      <h3 className="text-lg md:text-2xl font-bold text-red-400">
                        Error loading champion
                      </h3>
                    ) : (
                      <div className="flex items-center gap-2">
                        <h3 className="text-lg md:text-2xl font-bold text-transparent bg-gradient-to-r from-white to-gray-300 bg-clip-text truncate">
                          {champion
                            ? formatAddress(champion as string)
                            : "No Champion"}
                        </h3>
                        {champion && (
                          <a
                            href={`https://polygonscan.com/address/${champion}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-shrink-0 p-1 rounded-md hover:bg-gray-700/50 transition-colors duration-200 group"
                            title="View on Polygonscan"
                          >
                            <ExternalLink className="h-4 w-4 md:h-5 md:w-5 text-gray-400 group-hover:text-yellow-400 transition-colors duration-200" />
                          </a>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Stats */}
                <div className="text-left md:text-right space-y-2">
                  {isLoading ? (
                    <Skeleton className="h-6 md:h-8 w-24 md:w-32 ml-auto" />
                  ) : error ? (
                    <div className="text-lg md:text-3xl font-bold text-red-400">
                      Error
                    </div>
                  ) : (
                    <div className="text-2xl md:text-3xl font-bold text-transparent bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text">
                      High Score:{" "}
                      {highScore ? Number(highScore).toLocaleString() : "0"}
                    </div>
                  )}
                </div>
              </div>

              {/* Special effects for champion */}
              <div className="absolute top-0 right-0 p-2">
                <div className="w-3 h-3 rounded-full bg-gradient-to-r from-yellow-400 via-yellow-500 to-orange-500 animate-ping" />
              </div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center mt-8 md:mt-12">
          <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 rounded-2xl p-6 md:p-8 border-2 border-purple-400/50 shadow-xl max-w-2xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-transparent bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text mb-4">
              Do you have what it takes?
            </h2>
            <p className="text-gray-300 mb-6 text-sm md:text-base">
              Start playing now and you could take the crown.
            </p>
            <Link
              href="/"
              className="inline-block bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 md:px-8 py-3 md:py-4 rounded-xl font-bold text-lg md:text-xl shadow-[0_0_20px_rgba(168,85,247,0.6)] border-2 border-purple-300 hover:scale-105 transition-all duration-200"
            >
              PLAY NOW
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
