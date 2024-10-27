export enum BoardSquareState {
  EMPTY = " ",
  X = "X",
  O = "O",
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

  constructor(playerMark: BoardSquareState, programMark: BoardSquareState) {
    this._board = intitialBoardState;
    this._playerMark = playerMark;
    this._programMark = programMark;
    this._turnCount = 0;
    this._turn = playerMark;
    this._programMoveId = 0;
    this._horizontalCoordinates = [];
    this._verticalCoordinates = [];
    this._diagonalLeftToRightCoordinates = [];
    this._diagonalRightToLeftCoordinates = [];
  }

  public get board() {
    return this._board;
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
    this.readDirection(Direction.Horizontal, 2, 1, this._playerMark);
    this.readDirection(Direction.Vertical, 2, 1, this._playerMark);
    this.readDirection(Direction.DiagonalLeftToRight, 2, 1, this._playerMark);
    this.readDirection(Direction.DiagonalRightToLeft, 2, 1, this._playerMark);

    console.log("horizontalCoordinates: ", this._horizontalCoordinates);
    console.log("verticalCoordinates: ", this._verticalCoordinates);
    console.log("diagonalLeftToRight: ", this._diagonalLeftToRightCoordinates);
    console.log("diagonalRightToLeft: ", this._diagonalRightToLeftCoordinates);
    this.secondTurn();
    this.updateBoardWithId(this._programMoveId);
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
    const allReadData: Coordinates[] = [
      ...this._horizontalCoordinates,
      ...this._verticalCoordinates,
      ...this._diagonalLeftToRightCoordinates,
      ...this._diagonalRightToLeftCoordinates,
    ];

    if (allReadData.length === 0) {
      this.readDirection(Direction.Horizontal, 1, 2, this._programMark);
      this.readDirection(Direction.Vertical, 1, 2, this._programMark);
      this.readDirection(
        Direction.DiagonalLeftToRight,
        1,
        2,
        this._programMark,
      );
      this.readDirection(
        Direction.DiagonalRightToLeft,
        1,
        2,
        this._programMark,
      );
      const allProgramReadData: Coordinates[] = [
        ...this._horizontalCoordinates,
        ...this._verticalCoordinates,
        ...this._diagonalLeftToRightCoordinates,
        ...this._diagonalRightToLeftCoordinates,
      ];
      allProgramReadData.forEach(({ x, y }: Coordinates) => {
        if (this._board[y][x].state === BoardSquareState.EMPTY)
          this._programMoveId = this._board[y][x].id;
      });
      return;
    }

    allReadData.forEach(({ x, y }: Coordinates) => {
      if (this._board[y][x].state === BoardSquareState.EMPTY)
        this._programMoveId = this._board[y][x].id;
    });
  }

  resetBoard() {
    this._board = this._board.map((column: BoardSquare[]) => {
      return column.map((square: BoardSquare) => {
        square.state = BoardSquareState.EMPTY;
        return square;
      });
    });
    this._turnCount = 0;
    this._turn = this._playerMark;
  }

  public switchTurn() {
    this._turn =
      this._turn === BoardSquareState.X
        ? BoardSquareState.O
        : BoardSquareState.X;
    this.incrementTurnCount(1);
  }

  private incrementTurnCount(amount: number) {
    this._turnCount += amount;
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
        const coordinates = this.getPotentialCoordinates(column, direction);

        if (direction === Direction.Horizontal) {
          this._horizontalCoordinates.push({
            ...coordinates,
          });
        }

        if (direction === Direction.Vertical) {
          this._verticalCoordinates.push({ ...coordinates });
        }
      }
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

    if (markCount === 2 && emptySquareCount === 1) {
      const coordinates = this.getPotentialCoordinates(0, direction);

      if (direction === Direction.DiagonalLeftToRight) {
        this._diagonalLeftToRightCoordinates.push({ ...coordinates });
      }

      if (direction === Direction.DiagonalRightToLeft) {
        this._diagonalRightToLeftCoordinates.push({ ...coordinates });
      }
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
}

export const board: Board = new Board(BoardSquareState.X, BoardSquareState.O);
