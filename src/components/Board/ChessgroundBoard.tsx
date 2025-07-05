"use client";

import React, { useEffect, useRef, useCallback } from 'react';
import { Chessground } from 'chessground';
import type { Api } from 'chessground/api';
import type { Key } from 'chessground/types';
import 'chessground/assets/chessground.base.css';
import 'chessground/assets/chessground.brown.css';
import 'chessground/assets/chessground.cburnett.css';

interface ChessgroundBoardProps {
  fen: string;
  orientation?: 'white' | 'black';
  bestMoveArrow?: string; // UCI format, e.g., "e2e4"
  lastMove?: string; // UCI format for the last move made
  allowArrows?: boolean;
}

const ChessgroundBoard: React.FC<ChessgroundBoardProps> = ({
  fen,
  orientation = 'white',
  bestMoveArrow,
  lastMove,
}) => {
  const cgRef = useRef<HTMLDivElement>(null);
  const cgApi = useRef<Api | null>(null);
  const previousFen = useRef<string>('');
  const previousLastMove = useRef<string>('');

  // Convert UCI move to chessground format
  const uciToMove = useCallback((uci: string): [Key, Key] | null => {
    if (!uci || uci.length < 4) return null;
    const from = uci.slice(0, 2) as Key;
    const to = uci.slice(2, 4) as Key;
    return [from, to];
  }, []);

  // Initialize the board
  useEffect(() => {
    if (cgRef.current && !cgApi.current) {
      cgApi.current = Chessground(cgRef.current, {
        fen,
        orientation,
        viewOnly: true, // Keep view-only for review
        drawable: {
          enabled: true,
          visible: true,
          eraseOnClick: false,
          brushes: {
            green: { key: 'g', color: '#15781B', opacity: 1, lineWidth: 10 },
            red: { key: 'r', color: '#882020', opacity: 1, lineWidth: 10 },
            blue: { key: 'b', color: '#003088', opacity: 1, lineWidth: 10 },
            yellow: { key: 'y', color: '#e68f00', opacity: 1, lineWidth: 10 },
          },
        },
      });

      previousFen.current = fen;
      previousLastMove.current = lastMove || '';
    }

    return () => {
      if (cgApi.current) {
        cgApi.current.destroy();
        cgApi.current = null;
      }
    };
  }, []); // Only run once on mount

  // Update board position and animations
  useEffect(() => {
    if (!cgApi.current) return;

    const hasPositionChanged = previousFen.current !== fen;
    const hasMoveChanged = previousLastMove.current !== lastMove;

    if (hasPositionChanged || hasMoveChanged) {
      // Clear previous arrows
      cgApi.current.setAutoShapes([]);

      // If we have a last move, animate it
      if (lastMove && hasMoveChanged) {
        const move = uciToMove(lastMove);
        if (move) {
          const [from, to] = move;
          
          // Set the position and animate the move
          cgApi.current.set({
            fen,
            lastMove: [from, to],
            check: false, // Will be determined by the FEN
          });

          // Add move animation
          cgApi.current.move(from, to);
        }
      } else {
        // Just update the position without animation
        cgApi.current.set({
          fen,
          lastMove: undefined,
        });
      }

      previousFen.current = fen;
      previousLastMove.current = lastMove || '';
    }
  }, [fen, lastMove, uciToMove]);

  // Handle best move arrow
  useEffect(() => {
    if (!cgApi.current) return;

    const currentAutoShapes = cgApi.current.state.drawable.autoShapes || [];
    
    // Remove previous best move arrows
    const filteredShapes = currentAutoShapes.filter(
      (shape) => shape.brush !== 'blue' || !shape.dest
    );

    if (bestMoveArrow) {
      const move = uciToMove(bestMoveArrow);
      if (move) {
        const [from, to] = move;
        
        // Add best move arrow in blue
        filteredShapes.push({
          orig: from,
          dest: to,
          brush: 'blue',
        });
      }
    }

    cgApi.current.setAutoShapes(filteredShapes);
  }, [bestMoveArrow, uciToMove]);

  // Handle orientation changes
  useEffect(() => {
    if (cgApi.current) {
      cgApi.current.set({ orientation });
    }
  }, [orientation]);

  return (
    <div 
      ref={cgRef} 
      style={{ 
        width: '100%', 
        height: '100%',
        maxWidth: '500px',
        maxHeight: '500px',
        aspectRatio: '1/1'
      }} 
      className="chess-board"
    />
  );
};

export default ChessgroundBoard;
