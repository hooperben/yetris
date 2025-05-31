import Tetris from "@/components/tetris";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-gray-900">
      <h1 className="text-4xl font-bold text-center mb-6 text-white font-mono tracking-tight">
        Yetris
      </h1>
      <Tetris />
    </main>
  );
}
