import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";

interface GameOverDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onPlayAgain: () => void;
  score: number;
  isNewChamp?: boolean;
  coronationHash?: string;
}

export function GameOverDialog({
  isOpen,
  onClose,
  onPlayAgain,
  score,
  isNewChamp,
  coronationHash,
}: GameOverDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          {isNewChamp ? (
            <>
              <DialogTitle className="text-center text-2xl font-bold text-transparent bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text">
                🎉 Congratulations! 🎉
              </DialogTitle>
              <DialogDescription className="text-center text-lg">
                You are the new champion! Your coronation has been recorded
                on-chain!
              </DialogDescription>
            </>
          ) : (
            <>
              <DialogTitle className="text-center text-2xl font-bold text-transparent bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text">
                Game Over
              </DialogTitle>
              <DialogDescription className="text-center text-lg">
                Well played, but not quite a championship performance.
              </DialogDescription>
            </>
          )}
        </DialogHeader>

        <div className="text-center py-4">
          <div className="text-3xl font-bold text-transparent bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text">
            Final Score: {score.toLocaleString()}
          </div>

          {coronationHash && (
            <div className="mt-4 p-3 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
              <div className="text-sm font-medium text-yellow-800 dark:text-yellow-200 mb-2">
                Coronation Transaction
              </div>
              <div className="text-xs font-mono text-gray-600 dark:text-gray-400 break-all mb-2">
                {coronationHash}
              </div>
              <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={() =>
                  window.open(
                    `https://polygonscan.com/tx/${coronationHash}`,
                    "_blank",
                  )
                }
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                View on Polygonscan
              </Button>
            </div>
          )}
        </div>

        <DialogFooter className="flex gap-2 sm:gap-2">
          <Button variant="outline" onClick={onClose} className="flex-1">
            Close
          </Button>
          <Button
            onClick={onPlayAgain}
            className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
          >
            Play Again
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
