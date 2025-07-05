import React, { useEffect, useRef } from 'react';
import { Chessground } from 'chessground';
import 'chessground/assets/chessground.base.css';
import 'chessground/assets/chessground.brown.css';
import 'chessground/assets/chessground.cburnett.css';

interface ChessgroundBoardProps {
  fen: string;
  orientation?: 'white' | 'black';
  bestMoveArrow?: string; // UCI format, e.g., "e2e4"
}

const ChessgroundBoard: React.FC<ChessgroundBoardProps> = ({
  fen,
  orientation = 'white',
  // bestMoveArrow,
}) => {
  const cgRef = useRef<HTMLDivElement>(null);
  const cgApi = useRef<any>(null);

  useEffect(() => {
    if (cgRef.current) {
      cgApi.current = Chessground(cgRef.current, {
        fen,
        orientation,
        // viewOnly: true, // Make the board view-only for review purposes
      });
    }

    return () => {
      if (cgApi.current) {
        cgApi.current.destroy();
      }
    };
  }, [fen, orientation]);


  return <div ref={cgRef} style={{ width: '500px', height: '500px' }} />;
};

export default ChessgroundBoard;
