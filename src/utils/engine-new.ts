import Worker from "web-worker";

export interface Evaluation {
  type: "cp" | "mate";
  value: number;
}

export interface Line {
  id: number;
  depth: number;
  evaluation: Evaluation;
  moveUCI: string;
}

export class Stockfish {
  depth = 0;
  private worker: Worker;
  private ready: boolean = false;
  private onReadyPromise: Promise<void>;
  private resolveReady!: () => void;

  constructor() {
    console.log("A new worker was created");
    this.worker = new Worker("./stockfish-17-lite.js");

    this.onReadyPromise = new Promise((resolve) => {
      this.resolveReady = resolve;
    });

    this.initEngine();
  }

  private initEngine() {
    this.worker.postMessage("uci");

    this.worker.addEventListener("message", (event: MessageEvent) => {
      const message = event.data;

      // Notify when engine is ready
      if (message === "uciok" && !this.ready) {
        this.ready = true;
        this.worker.postMessage("setoption name MultiPV value 2");
        this.resolveReady(); // Engine ready to use
        console.log("Stockfish is ready.");
      }
    });

    this.worker.addEventListener("error", () => {
      this.worker.terminate();
      this.worker = new Worker("./stockfish.js");
      this.initEngine(); // Retry
    });
  }

  async waitUntilReady() {
    await this.onReadyPromise;
  }

  async evaluate(
    fen: string,
    targetDepth: number,
    verbose = false
  ): Promise<Line[]> {
    await this.waitUntilReady(); // No evaluation until loading is successfull

    this.worker.postMessage("position fen " + fen);
    this.worker.postMessage("go depth " + targetDepth);

    const messages: string[] = [];
    const lines: Line[] = [];

    return new Promise((resolve) => {
      this.worker.addEventListener("message", (event: MessageEvent) => {
        const message: string = event.data;
        messages.unshift(message);

        if (verbose) console.log(message);

        // Get latest depth for progress monitoring
        const depthMatch = message.match(/(?:depth )(\d+)/);
        const latestDepth = depthMatch ? parseInt(depthMatch[1], 10) : 0;
        this.depth = Math.max(latestDepth, this.depth);

        // Best move or checkmate log indicates end of search
        if (message.startsWith("bestmove") || message.includes("depth 0")) {
          const searchMessages = messages.filter((msg) =>
            msg.startsWith("info depth")
          );

          for (const searchMessage of searchMessages) {
            // Extract depth, MultiPV line ID and evaluation from search message
            const idString = searchMessage.match(/(?:multipv )(\d+)/)?.[1];
            const depthString = searchMessage.match(/(?:depth )(\d+)/)?.[1];
            const moveUCI = searchMessage.match(/(?: pv )(.+?)(?= |$)/)?.[1];

            const evaluation: Evaluation = {
              type: searchMessage.includes(" cp ") ? "cp" : "mate",
              value: parseInt(
                searchMessage.match(/(?:(?:cp )|(?:mate ))([\d-]+)/)?.[1] ||
                  "0",
                10
              ),
            };

            // Invert evaluation if black to play since scores are from black perspective
            // and we want them always from the perspective of white
            if (fen.includes(" b ")) {
              evaluation.value *= -1;
            }

            // If any piece of data from message is missing, discard message
            if (!idString || !depthString || !moveUCI) continue;

            const id = parseInt(idString, 10);
            const depth = parseInt(depthString, 10);

            // Discard if target depth not reached or lineID already present
            if (depth != targetDepth || lines.some((line) => line.id === id))
              continue;

            lines.push({
              id,
              depth,
              evaluation,
              moveUCI,
            });
          }
          resolve(lines);
        }
      });
    });
  }

  terminate() {
    this.worker.terminate();
  }
}
