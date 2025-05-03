import { useCallback, useEffect, useMemo } from "react";
import { Chess } from "chess.js";

const useChessSounds = () => {
  const chess = useMemo(() => new Chess(), []);
  const sounds: Record<string, HTMLAudioElement> = {
    movePiece: new Audio("/sounds/move.mp3"),
    capturePiece: new Audio("/sounds/capture.mp3"),
    check: new Audio("/sounds/check.mp3"),
    castle: new Audio("/sounds/castle.mp3"),
    promote: new Audio("/sounds/promote.mp3"),
    gameStart: new Audio("/sounds/ping.mp3"),
    gameEnd: new Audio("/sounds/game_end.mp3"),
  };

  useEffect(() => {
    Object.values(sounds).forEach((sound) => {
      sound.load();
    });
  }, []);

  const playSound = useCallback((soundName: keyof typeof sounds) => {
    const sound = sounds[soundName];
    if (sound) {
      sound.currentTime = 0;
      sound.play().catch((error) => {
        console.error(`Error playing sound "${soundName}":`, error);
      });
    } else {
      console.error(`Sound "${soundName}" not found.`);
    }
  }, []);

  const handleMoveSounds = useCallback(
    (currMove: string | undefined, fen: string | undefined) => {
      if (!currMove || !fen) {
        console.error("Move null");
        return;
      }

      chess.load(fen);
      const move = chess.move(currMove);

      if (!move) {
        console.error("Invalid move:", currMove);
        return;
      }

      if (move.captured && !move.promotion && !chess.isGameOver()) {
        playSound(chess.isCheck() ? "check" : "capturePiece");
      } else if (move.san.includes("+")) {
        playSound("check");
      } else if (chess.isGameOver()) {
        playSound("gameEnd");
      } else if (move.san === "O-O" || move.san === "O-O-O") {
        playSound("castle");
      } else if (move.promotion) {
        playSound("promote");
      } else {
        playSound("movePiece");
      }
    },
    [chess, playSound]
  );

  return { playSound, handleMoveSounds };
};

export default useChessSounds;
