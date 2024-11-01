export enum BoardSquareState {
  EMPTY = " ",
  X = "X",
  O = "O",
}

export enum WinningStatus {
  DRAW = "DRAW",
  X = "X",
  O = "O",
  NO_WINNER = " ",
}

export interface BoardSquare {
  state: BoardSquareState;
  id: number;
}

enum Direction {
  Vertical = 1,
  Horizontal = 2,
  DiagonalLeftToRight = 3,
  DiagonalRightToLeft = 4,
}

const NoCoordinate: number = -1;
interface Coordinates {
  x: number;
  y: number;
}

interface CountResults {
  emptySquareCount: number;
  markCount: number;
}

const intitialBoardState: BoardSquare[][] = [
  [
    { state: BoardSquareState.EMPTY, id: 1 },
    { state: BoardSquareState.EMPTY, id: 2 },
    { state: BoardSquareState.EMPTY, id: 3 },
  ],
  [
    { state: BoardSquareState.EMPTY, id: 4 },
    { state: BoardSquareState.EMPTY, id: 5 },
    { state: BoardSquareState.EMPTY, id: 6 },
  ],
  [
    { state: BoardSquareState.EMPTY, id: 7 },
    { state: BoardSquareState.EMPTY, id: 8 },
    { state: BoardSquareState.EMPTY, id: 9 },
  ],
];

export class Board {
  private _board: BoardSquare[][];
  private _playerMark: BoardSquareState;
  private _programMark: BoardSquareState;
  private _turnCount: number;
  private _turn: BoardSquareState;
  private _programMoveId: number;
  private _horizontalCoordinates: Coordinates[];
  private _verticalCoordinates: Coordinates[];
  private _diagonalLeftToRightCoordinates: Coordinates[];
  private _diagonalRightToLeftCoordinates: Coordinates[];
  private _winner: WinningStatus;

  constructor() {
    this._board = intitialBoardState;
    this._playerMark = BoardSquareState.EMPTY;
    this._programMark = BoardSquareState.EMPTY;
    this._turnCount = 0;
    this._turn = BoardSquareState.EMPTY;
    this._programMoveId = 0;
    this._horizontalCoordinates = [];
    this._verticalCoordinates = [];
    this._diagonalLeftToRightCoordinates = [];
    this._diagonalRightToLeftCoordinates = [];
    this._winner = WinningStatus.NO_WINNER;
  }

  public set playerMark(playerMark: BoardSquareState) {
    this._playerMark = playerMark;
  }

  public set programMark(programMark: BoardSquareState) {
    this._programMark = programMark;
  }

  public set turn(turn: BoardSquareState) {
    this._turn = turn;
  }

  public get board() {
    return this._board;
  }

  public get turn() {
    return this._turn;
  }

  public get winner() {
    return this._winner;
  }

  public getTurnCount() {
    return this._turnCount;
  }

  public updateBoardWithId(id: number) {
    this._board.forEach((column) => {
      column.forEach((row) => {
        if (row.state === BoardSquareState.EMPTY && row.id === id)
          row.state = this._turn;
      });
    });
  }

  public programMove() {
    if (this._turnCount <= 1) {
      this.firstTurn();
      this.updateBoardWithId(this._programMoveId);
      return;
    }

    //Second turn and above
    this.secondTurn();
    this.updateBoardWithId(this._programMoveId);
  }

  public resetBoard() {
    this._board = this._board.map((column: BoardSquare[]) => {
      return column.map((square: BoardSquare) => {
        square.state = BoardSquareState.EMPTY;
        return square;
      });
    });
    this._playerMark = BoardSquareState.EMPTY;
    this._programMark = BoardSquareState.EMPTY;
    this._turnCount = 0;
    this._turn = BoardSquareState.EMPTY;
    this._programMoveId = 0;
    this._horizontalCoordinates = [];
    this._verticalCoordinates = [];
    this._diagonalLeftToRightCoordinates = [];
    this._diagonalRightToLeftCoordinates = [];
    this._winner = WinningStatus.NO_WINNER;
  }

  public switchTurn() {
    this._turn =
      this._turn === BoardSquareState.X
        ? BoardSquareState.O
        : BoardSquareState.X;
    this.incrementTurnCount(1);
  }

  public readWinningStatus(): WinningStatus {
    this.readAllDirections(3, 0, this._programMark);

    if (this._winner === WinningStatus.O) {
      console.log(`Winner is ${WinningStatus.O}`);
      return WinningStatus.O;
    }

    this.readAllDirections(3, 0, this._playerMark);

    if (this._winner === WinningStatus.X) {
      console.log(`Winner is ${WinningStatus.X}`);
      return WinningStatus.O;
    }

    if (this._winner === WinningStatus.NO_WINNER && this.readDraw() === 9) {
      console.log("DRAW");
      this._winner = WinningStatus.DRAW;
      return WinningStatus.DRAW;
    }
    return WinningStatus.NO_WINNER;
  }

  private readDraw() {
    let emptySquareCount = 0;
    for (let column = 0; column < this._board.length; column++) {
      for (let row = 0; row < this._board[column].length; row++) {
        if (this._board[column][row].state !== BoardSquareState.EMPTY)
          emptySquareCount++;
      }
    }
    return emptySquareCount;
  }

  private printReadCoordinates() {
    console.log("horizontalCoordinates: ", this._horizontalCoordinates);
    console.log("verticalCoordinates: ", this._verticalCoordinates);
    console.log("diagonalLeftToRight: ", this._diagonalLeftToRightCoordinates);
    console.log("diagonalRightToLeft: ", this._diagonalRightToLeftCoordinates);
  }

  private getAllReadCoordinates() {
    return [
      ...this._horizontalCoordinates,
      ...this._verticalCoordinates,
      ...this._diagonalLeftToRightCoordinates,
      ...this._diagonalRightToLeftCoordinates,
    ];
  }

  private firstTurn() {
    if (this._board[1][1].state === BoardSquareState.EMPTY) {
      this._programMoveId = this._board[1][1].id;
    } else {
      for (let column = 0; column < this._board.length; column++) {
        for (let row = 0; row < this._board[column].length; row++) {
          if (
            this._board[column][row].state === BoardSquareState.EMPTY &&
            column !== 1 &&
            row !== 1
          ) {
            this._programMoveId = this._board[column][row].id;
          }
        }
      }
    }
  }

  private secondTurn() {
    this.readAllDirections(2, 1, this._playerMark);
    const firstCoordinates: Coordinates[] = this.getAllReadCoordinates();
    if (firstCoordinates.length > 0) {
      this.setProgramMoveId(firstCoordinates);
      return;
    }

    this.readAllDirections(1, 2, this._programMark);
    const secondaryCoordinates: Coordinates[] = this.getAllReadCoordinates();
    if (secondaryCoordinates.length > 0) {
      this.setProgramMoveId(secondaryCoordinates);
      return;
    }

    this.readAllDirections(2, 1, this._programMark);
    const thirdCoordinates: Coordinates[] = this.getAllReadCoordinates();
    if (thirdCoordinates.length > 0) {
      this.setProgramMoveId(thirdCoordinates);
      return;
    }
  }

  private setProgramMoveId(allCoordinates: Coordinates[]) {
    allCoordinates.forEach(({ x, y }: Coordinates) => {
      if (this._board[y][x].state === BoardSquareState.EMPTY)
        this._programMoveId = this._board[y][x].id;
    });
  }

  private readAllDirections(
    markLimit: number,
    emptySquareLimit: number,
    readMarkType: BoardSquareState,
  ) {
    this.readDirection(
      Direction.Horizontal,
      markLimit,
      emptySquareLimit,
      readMarkType,
    );
    this.readDirection(
      Direction.Vertical,
      markLimit,
      emptySquareLimit,
      readMarkType,
    );
    this.readDirection(
      Direction.DiagonalLeftToRight,
      markLimit,
      emptySquareLimit,
      readMarkType,
    );
    this.readDirection(
      Direction.DiagonalRightToLeft,
      markLimit,
      emptySquareLimit,
      readMarkType,
    );
  }

  //Read Board Vertical or Horizontal direction
  private readDirection(
    direction: Direction,
    markLimit: number,
    emptySquareLimit: number,
    readMarkType: BoardSquareState,
  ): void {
    if (
      direction === Direction.DiagonalLeftToRight ||
      direction === Direction.DiagonalRightToLeft
    ) {
      this.readDiagonalDirection(
        direction,
        markLimit,
        emptySquareLimit,
        readMarkType,
      );
      return;
    }
    if (direction === Direction.Horizontal) this._horizontalCoordinates = [];
    if (direction === Direction.Vertical) this._verticalCoordinates = [];

    for (let column = 0; column < this._board.length; column++) {
      const { emptySquareCount, markCount }: CountResults =
        this.countSquaresByStateInDirection(column, direction, readMarkType);

      if (markCount === markLimit && emptySquareCount === emptySquareLimit) {
        if (this.readWinner(markLimit, emptySquareLimit)) return;
        this.readCoordinates(direction, column);
      }
    }
  }

  private readWinner(markLimit: number, emptySquareLimit: number): boolean {
    if (markLimit === 3 && emptySquareLimit === 0) {
      if (this._turn === BoardSquareState.X) this._winner = WinningStatus.X;

      if (this._turn === BoardSquareState.O) this._winner = WinningStatus.O;

      return true;
    }

    return false;
  }

  private readCoordinates(direction: Direction, column: number) {
    const coordinates = this.getPotentialCoordinates(column, direction);

    if (direction === Direction.Horizontal) {
      this._horizontalCoordinates.push({
        ...coordinates,
      });
    }
    if (direction === Direction.Vertical) {
      this._verticalCoordinates.push({ ...coordinates });
    }

    if (direction === Direction.DiagonalLeftToRight) {
      this._diagonalLeftToRightCoordinates.push({ ...coordinates });
    }

    if (direction === Direction.DiagonalRightToLeft) {
      this._diagonalRightToLeftCoordinates.push({ ...coordinates });
    }
  }

  private readDiagonalDirection(
    direction: Direction,
    markLimit: number,
    emptySquareLimit: number,
    readMarkType: BoardSquareState,
  ): void {
    const { emptySquareCount, markCount }: CountResults =
      this.countSquaresByStateInDirection(0, direction, readMarkType);

    if (direction === Direction.DiagonalLeftToRight)
      this._diagonalLeftToRightCoordinates = [];

    if (direction === Direction.DiagonalRightToLeft)
      this._diagonalRightToLeftCoordinates = [];

    if (markCount === markLimit && emptySquareCount === emptySquareLimit) {
      if (this.readWinner(markLimit, emptySquareLimit)) return;
      this.readCoordinates(direction, 0);
    }
  }

  private countSquaresByStateInDirection(
    column: number,
    direction: Direction,
    readMarkType: BoardSquareState,
  ): CountResults {
    let markCount: number = 0;
    let emptySquareCount: number = 0;
    for (let row = 0; row < this._board.length; row++) {
      const currentSquare: BoardSquare = this.getSquareAtCoordinates(
        direction,
        column,
        row,
      );

      if (currentSquare.state === BoardSquareState.EMPTY) emptySquareCount++;
      if (currentSquare.state === readMarkType) markCount++;
    }
    return { emptySquareCount, markCount };
  }

  getPotentialCoordinates(column: number, direction: Direction): Coordinates {
    const coordinates: Coordinates = this.getEmptyCoordinates();

    for (let row = 0; row < this._board[column].length; row++) {
      const currentSquare: BoardSquare = this.getSquareAtCoordinates(
        direction,
        column,
        row,
      );

      if (currentSquare.state === BoardSquareState.EMPTY) {
        if (direction === Direction.Horizontal) {
          coordinates.y = column;
          coordinates.x = row;
        }

        if (direction === Direction.Vertical) {
          coordinates.y = row;
          coordinates.x = column;
        }

        if (direction === Direction.DiagonalLeftToRight) {
          coordinates.y = column + row;
          coordinates.x = row;
        }

        if (direction === Direction.DiagonalRightToLeft) {
          coordinates.y = row;
          coordinates.x = 2 - row;
        }
      }
    }
    return coordinates;
  }

  private getSquareAtCoordinates(
    direction: Direction,
    column: number,
    row: number,
  ): BoardSquare {
    if (direction === Direction.Horizontal) return this._board[column][row];

    if (direction === Direction.Vertical) return this._board[row][column];

    if (direction === Direction.DiagonalLeftToRight)
      return this._board[column + row][row];

    if (direction === Direction.DiagonalRightToLeft)
      return this._board[row][2 - row];

    return this._board[NoCoordinate][NoCoordinate];
  }

  private getEmptyCoordinates(): Coordinates {
    return {
      x: NoCoordinate,
      y: NoCoordinate,
    };
  }
  private incrementTurnCount(amount: number) {
    this._turnCount += amount;
  }
}

export const board: Board = new Board();
