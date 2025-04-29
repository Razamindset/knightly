import React, { useState, useRef } from "react";
import {
  classificationIcons,
  pieceSymbols,
  ClassificationConfig,
} from "./board-icons";
import { FiRefreshCw } from "react-icons/fi";
import Image from "next/image";

interface Move {
  from: string;
  to: string;
}

interface BoardProps {
  fen: string;
  lastMove?: Move | null;
  moveClassification?: keyof ClassificationConfig;
  boardSize?: number;
}

const Board: React.FC<BoardProps> = ({
  fen,
  lastMove,
  moveClassification,
  boardSize = 500,
}) => {
  const [orientation, setOrientation] = useState("white");
  const boardRef = useRef(null);
  const squareSize = boardSize / 8;

  const flipBoard = () => {
    setOrientation(orientation === "white" ? "black" : "white");
  };

  const getRankFile = (index: number) => {
    const rank = 8 - Math.floor(index / 8);
    const file = String.fromCharCode(97 + (index % 8));
    return `${file}${rank}`;
  };

  const getSquareIndex = (rankFile: string) => {
    const file = rankFile.charCodeAt(0) - 97;
    const rank = 8 - parseInt(rankFile.charAt(1));
    return rank * 8 + file;
  };

  const getPiece = (square: string) => {
    const squareIndex = getSquareIndex(square);
    const rows = fen.split(" ")[0].split("/");
    const row = Math.floor(squareIndex / 8);
    const col = squareIndex % 8;

    let pieceCounter = 0;
    for (const char of rows[row]) {
      if (pieceCounter === col) {
        return char;
      }
      if (isNaN(parseInt(char))) {
        pieceCounter++;
      } else {
        pieceCounter += parseInt(char);
      }
    }
    return "";
  };

  const renderSquares = () => {
    const squares = [];

    const boardOrder =
      orientation === "white"
        ? Array.from({ length: 64 }, (_, i) => i)
        : Array.from({ length: 64 }, (_, i) => 63 - i);

    for (const i of boardOrder) {
      const rankFile = getRankFile(i);

      const isLight = (Math.floor(i / 8) + (i % 8)) % 2 === 0;
      const bgColorClass = isLight ? "bg-white" : "bg-[#bd7e57]";

      const piece = getPiece(rankFile);

      const pieceImage = pieceSymbols[piece];

      const isLastMoveSquare =
        lastMove && (rankFile === lastMove.from || rankFile === lastMove.to);

      // Get the last move color according to the last move classification
      let classificationData;
      if (moveClassification) {
        classificationData = classificationIcons[moveClassification] || null;
      }

      const lastMoveColor =
        classificationData?.color || classificationIcons.null.color;

      const isToSquare = rankFile === lastMove?.to || null;

      const isBrilliant = moveClassification === "brilliant";
      const isGreat = moveClassification === "great";

      squares.push(
        <div
          key={i}
          className={`relative w-16 h-16 flex items-center justify-center ${bgColorClass} relative`}
          style={{ width: squareSize, height: squareSize }}
        >
          <div
            className="classification-feedback z-15"
            style={{
              backgroundColor: isLastMoveSquare ? lastMoveColor : "transparent",
              opacity: isLastMoveSquare ? 20 : 100,
              width: squareSize,
              height: squareSize,
            }}
          >
            {pieceImage ? (
              <Image
                src={pieceImage}
                alt={piece}
                height={50}
                width={50}
                className="w-16 h-16 z-20"
                style={{ width: squareSize, height: squareSize }}
              />
            ) : isLastMoveSquare ? (
              <div className="w-16 h-16 z-20" />
            ) : (
              ""
            )}
          </div>

          {/* This div will render classification emojis */}
          {/* For great and brill we will do some animation */}
          {isLastMoveSquare &&
          isToSquare &&
          !isBrilliant &&
          !isGreat &&
          classificationData ? (
            <Image
              src={classificationData.emoji}
              height={30}
              width={30}
              alt="E"
              className="absolute z-50 h-7 top-0"
              style={{
                transform: "translate(111%, -50%)",
              }}
            />
          ) : (
            isLastMoveSquare &&
            isToSquare &&
            !isBrilliant &&
            !isGreat && (
              // incase of incorrect classifiction render an errror icon
              <div
                className="absolute z-50 h-7 top-0"
                style={{
                  transform: "translate(111%, -50%)",
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className=""
                  width="100%"
                  height="100%"
                  viewBox="0 0 18 19"
                >
                  <g id="warning">
                    <g>
                      <g className="icon-shadow" opacity="0.3">
                        <path d="M.32,14.3,6.94,2.83a2.37,2.37,0,0,1,4.11,0L17.68,14.3a2.38,2.38,0,0,1-2.06,3.56H2.38A2.38,2.38,0,0,1,.32,14.3Z"></path>
                      </g>
                      <path
                        className="icon-background"
                        fill="#ec6250"
                        d="M.32,13.8,6.94,2.33a2.37,2.37,0,0,1,4.11,0L17.68,13.8a2.38,2.38,0,0,1-2.06,3.56H2.38A2.38,2.38,0,0,1,.32,13.8Z"
                      ></path>
                    </g>
                    <g>
                      <g className="icon-component-shadow" opacity="0.2">
                        <path d="M10.21,15.19a.5.5,0,0,1,0,.12.26.26,0,0,1-.07.1.31.31,0,0,1-.22.09H8.1a.25.25,0,0,1-.12,0,.31.31,0,0,1-.09-.07.35.35,0,0,1-.08-.22V13.45a.29.29,0,0,1,.09-.21A.22.22,0,0,1,8,13.17l.11,0H9.9a.31.31,0,0,1,.22.09.27.27,0,0,1,.09.21ZM10.1,11.6a.22.22,0,0,1,0,.11.23.23,0,0,1-.07.1.27.27,0,0,1-.21.07H8.18a.29.29,0,0,1-.31-.28L7.73,5.41a.35.35,0,0,1,.08-.22.23.23,0,0,1,.1-.07A.25.25,0,0,1,8,5.1H10a.32.32,0,0,1,.23.09.35.35,0,0,1,.08.22Z"></path>
                      </g>
                      <path
                        className="icon-component"
                        fill="#fff"
                        d="M10.21,14.69a.5.5,0,0,1,0,.12.26.26,0,0,1-.07.1A.31.31,0,0,1,9.9,15H8.1A.25.25,0,0,1,8,15a.31.31,0,0,1-.09-.07.35.35,0,0,1-.08-.22V13a.29.29,0,0,1,.09-.21A.22.22,0,0,1,8,12.67l.11,0H9.9a.31.31,0,0,1,.22.09.27.27,0,0,1,.09.21ZM10.1,11.1a.22.22,0,0,1,0,.11.23.23,0,0,1-.07.1.27.27,0,0,1-.21.07H8.18a.29.29,0,0,1-.31-.28L7.73,4.91a.35.35,0,0,1,.08-.22.23.23,0,0,1,.1-.07A.25.25,0,0,1,8,4.6H10a.32.32,0,0,1,.23.09.35.35,0,0,1,.08.22Z"
                      ></path>
                    </g>
                  </g>
                </svg>
              </div>
            )
          )}

          {/* brliinat move animations */}
          {isLastMoveSquare && isToSquare && isBrilliant && (
            <>
              {/* Initial brilliant icon covering the piece with lightning animation */}
              <div className="absolute inset-0 z-30 flex items-center justify-center">
                <div className="absolute">
                  {/* Animated light ring effect */}
                  <div className="b-light absolute inset-0 rounded-full animate-ping bg-teal-200 opacity-70"></div>

                  <span className="b-icon h-full w-full flex items-center justify-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className=""
                      width="95%"
                      height="95%"
                      viewBox="0 0 18 19"
                    >
                      <g id="Brilliant">
                        <path
                          className="icon-shadow"
                          opacity="0.3"
                          d="M9,.5a9,9,0,1,0,9,9A9,9,0,0,0,9,.5Z"
                        ></path>
                        <path
                          className="icon-background"
                          fill="#26c2a3"
                          d="M9,0a9,9,0,1,0,9,9A9,9,0,0,0,9,0Z"
                        ></path>
                        <g className="icon-component-shadow" opacity="0.2">
                          <path d="M12.57,14.6a.51.51,0,0,1,0,.13.44.44,0,0,1-.08.11l-.11.08-.13,0h-2l-.13,0L10,14.84A.41.41,0,0,1,10,14.6V12.7a.32.32,0,0,1,.09-.23.39.39,0,0,1,.1-.08l.13,0h2a.31.31,0,0,1,.24.1.39.39,0,0,1,.08.1.51.51,0,0,1,0,.13Zm-.12-3.93a.17.17,0,0,1,0,.12.41.41,0,0,1-.07.11.4.4,0,0,1-.23.08H10.35a.31.31,0,0,1-.34-.31L9.86,3.9A.36.36,0,0,1,10,3.66a.23.23,0,0,1,.11-.08.27.27,0,0,1,.13,0H12.3a.32.32,0,0,1,.25.1.36.36,0,0,1,.09.24Z"></path>
                          <path d="M8.07,14.6a.51.51,0,0,1,0,.13.44.44,0,0,1-.08.11l-.11.08-.13,0h-2l-.13,0-.11-.08a.41.41,0,0,1-.08-.24V12.7a.27.27,0,0,1,0-.13.36.36,0,0,1,.07-.1.39.39,0,0,1,.1-.08l.13,0h2a.31.31,0,0,1,.24.1.39.39,0,0,1,.08.1.51.51,0,0,1,0,.13ZM8,10.67a.17.17,0,0,1,0,.12.41.41,0,0,1-.07.11.4.4,0,0,1-.23.08H5.85a.31.31,0,0,1-.34-.31L5.36,3.9a.36.36,0,0,1,.09-.24.23.23,0,0,1,.11-.08.27.27,0,0,1,.13,0H7.8a.35.35,0,0,1,.25.1.36.36,0,0,1,.09.24Z"></path>
                        </g>
                        <g>
                          <path
                            className="icon-component"
                            fill="#fff"
                            d="M12.57,14.1a.51.51,0,0,1,0,.13.44.44,0,0,1-.08.11l-.11.08-.13,0h-2l-.13,0L10,14.34A.41.41,0,0,1,10,14.1V12.2A.32.32,0,0,1,10,12a.39.39,0,0,1,.1-.08l.13,0h2a.31.31,0,0,1,.24.1.39.39,0,0,1,.08.1.51.51,0,0,1,0,.13Zm-.12-3.93a.17.17,0,0,1,0,.12.41.41,0,0,1-.07.11.4.4,0,0,1-.23.08H10.35a.31.31,0,0,1-.34-.31L9.86,3.4A.36.36,0,0,1,10,3.16a.23.23,0,0,1,.11-.08.27.27,0,0,1,.13,0H12.3a.32.32,0,0,1,.25.1.36.36,0,0,1,.09.24Z"
                          ></path>
                          <path
                            className="icon-component"
                            fill="#fff"
                            d="M8.07,14.1a.51.51,0,0,1,0,.13.44.44,0,0,1-.08.11l-.11.08-.13,0h-2l-.13,0-.11-.08a.41.41,0,0,1-.08-.24V12.2a.27.27,0,0,1,0-.13.36.36,0,0,1,.07-.1.39.39,0,0,1,.1-.08l.13,0h2A.31.31,0,0,1,8,12a.39.39,0,0,1,.08.1.51.51,0,0,1,0,.13ZM8,10.17a.17.17,0,0,1,0,.12.41.41,0,0,1-.07.11.4.4,0,0,1-.23.08H5.85a.31.31,0,0,1-.34-.31L5.36,3.4a.36.36,0,0,1,.09-.24.23.23,0,0,1,.11-.08.27.27,0,0,1,.13,0H7.8a.35.35,0,0,1,.25.1.36.36,0,0,1,.09.24Z"
                          ></path>
                        </g>
                      </g>
                    </svg>
                  </span>
                </div>
              </div>

              {/* "Brilliant" text that appears and fades */}
              <span className="b-text px-1 font-extrabold text-[9px] text-[#035652] absolute -top-2 -right-2 z-40 bg-white rounded-xl">
                BRILLIANT!
              </span>
            </>
          )}

          {/* Great moves */}
          {isLastMoveSquare && isToSquare && isGreat && (
            <>
              {/* Initial brilliant icon covering the piece with lightning animation */}
              <div className="absolute inset-0 z-30 flex items-center justify-center">
                <div className="absolute">
                  <span className="g-icon h-full w-full flex items-center justify-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className=""
                      width="95%"
                      height="95%"
                      viewBox="0 0 18 19"
                    >
                      <g id="great_find">
                        <path
                          className="icon-shadow"
                          opacity="0.3"
                          d="M9,.5a9,9,0,1,0,9,9A9,9,0,0,0,9,.5Z"
                        ></path>
                        <path
                          className="icon-background"
                          fill="#749BBF"
                          d="M9,0a9,9,0,1,0,9,9A9,9,0,0,0,9,0Z"
                        ></path>
                        <g>
                          <g className="icon-component-shadow" opacity="0.2">
                            <path d="M10.32,14.6a.27.27,0,0,1,0,.13.44.44,0,0,1-.08.11l-.11.08-.13,0H8l-.13,0-.11-.08a.41.41,0,0,1-.08-.24V12.7a.27.27,0,0,1,0-.13.36.36,0,0,1,.07-.1.39.39,0,0,1,.1-.08l.13,0h2a.31.31,0,0,1,.24.1.39.39,0,0,1,.08.1.51.51,0,0,1,0,.13Zm-.12-3.93a.17.17,0,0,1,0,.12.41.41,0,0,1-.07.11.4.4,0,0,1-.23.08H8.1a.31.31,0,0,1-.34-.31L7.61,3.9a.36.36,0,0,1,.09-.24.23.23,0,0,1,.11-.08.27.27,0,0,1,.13,0h2.11a.32.32,0,0,1,.25.1.36.36,0,0,1,.09.24Z"></path>
                          </g>
                          <path
                            className="icon-component"
                            fill="#fff"
                            d="M10.32,14.1a.27.27,0,0,1,0,.13.44.44,0,0,1-.08.11l-.11.08-.13,0H8l-.13,0-.11-.08a.41.41,0,0,1-.08-.24V12.2a.27.27,0,0,1,0-.13.36.36,0,0,1,.07-.1.39.39,0,0,1,.1-.08l.13,0h2a.31.31,0,0,1,.24.1.39.39,0,0,1,.08.1.51.51,0,0,1,0,.13Zm-.12-3.93a.17.17,0,0,1,0,.12.41.41,0,0,1-.07.11.4.4,0,0,1-.23.08H8.1a.31.31,0,0,1-.34-.31L7.61,3.4a.36.36,0,0,1,.09-.24.23.23,0,0,1,.11-.08.27.27,0,0,1,.13,0h2.11a.32.32,0,0,1,.25.1.36.36,0,0,1,.09.24Z"
                          ></path>
                        </g>
                      </g>
                    </svg>
                  </span>
                </div>
              </div>

              {/* "Brilliant" text that appears and fades */}
              <span className="g-text px-1 font-extrabold text-[9px] text-[#035652] absolute -top-2 -right-2 z-40 bg-white rounded-xl">
                Great!
              </span>
            </>
          )}
        </div>
      );
    }
    return squares;
  };

  return (
    <div ref={boardRef} className="grid grid-cols-8 gap-0 w-max h-max relative">
      {renderSquares()}
      <button
        className="absolute top-2 -right-8 cursor-pointer text-gray-400 hover:text-gray-300 hover:scale-110 transition-all"
        onClick={flipBoard}
      >
        <FiRefreshCw size={25} />
      </button>
    </div>
  );
};

export default Board;
