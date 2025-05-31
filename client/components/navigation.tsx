"use client";

import { Home, Trophy } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Account } from "./account";
import { useAccount } from "wagmi";

export default function Navigation() {
  const pathname = usePathname();

  const { isConnected } = useAccount();

  return (
    <nav className="bg-gradient-to-r from-purple-600 via-pink-500 to-cyan-400 shadow-lg border-b-4 border-yellow-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-white drop-shadow-lg">
              YETRIS
            </span>
          </div>

          <div className="flex space-x-4 items-center">
            {pathname !== "/" && (
              <Link
                href="/"
                className="flex items-center space-x-2 px-4 py-2 rounded-lg font-semibold transition-all duration-200 text-white hover:bg-white/20 hover:scale-105"
              >
                <Home className="h-5 w-5" />
                <span>Play</span>
              </Link>
            )}

            {pathname !== "/leaderboard" && (
              <Link
                href="/leaderboard"
                className="flex items-center space-x-2 px-4 py-2 rounded-lg font-semibold transition-all duration-200 text-white hover:bg-white/20 hover:scale-105"
              >
                <Trophy className="h-5 w-5" />
                <span>Leaderboard</span>
              </Link>
            )}

            {isConnected && <Account />}
          </div>
        </div>
      </div>
    </nav>
  );
}
