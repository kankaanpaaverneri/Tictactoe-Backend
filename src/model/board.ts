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
  emptyMarkCount: number;
  playerMarkCount: number;
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
  //private _programMark: BoardSquareState;
  private _horizontalCoordinates: Coordinates[];
  private _verticalCoordinates: Coordinates[];
  private _diagonalLeftToRightCoordinates: Coordinates[];
  private _diagonalRightToLeftCoordinates: Coordinates[];

  constructor(playerMark: BoardSquareState, programMark: BoardSquareState) {
    this._board = intitialBoardState;
    this._playerMark = playerMark;
    //this._programMark = programMark;
    this._horizontalCoordinates = [];
    this._verticalCoordinates = [];
    this._diagonalLeftToRightCoordinates = [];
    this._diagonalRightToLeftCoordinates = [];
  }

  public get board() {
    return this._board;
  }

  public updateBoard(id: number) {
    this._board.forEach((column) => {
      column.forEach((row) => {
        if (row.state === BoardSquareState.EMPTY && row.id === id)
          row.state = this._playerMark;
      });
    });
  }

  public programMove() {
    this.readDirection(Direction.Horizontal);
    this.readDirection(Direction.Vertical);
    this.readDirection(Direction.DiagonalLeftToRight);
    this.readDirection(Direction.DiagonalRightToLeft);
    console.log("horizontalCoordinates: ", this._horizontalCoordinates);
    console.log("verticalCoordinates: ", this._verticalCoordinates);
    console.log("diagonalLeftToRight: ", this._diagonalLeftToRightCoordinates);
    console.log("diagonalRightToLeft: ", this._diagonalRightToLeftCoordinates);
  }

  resetBoard() {
    this._board = this._board.map((column: BoardSquare[]) => {
      return column.map((square: BoardSquare) => {
        square.state = BoardSquareState.EMPTY;
        return square;
      });
    });
  }

  //Read Board Vertical or Horizontal direction
  private readDirection(direction: Direction): void {
    if (
      direction === Direction.DiagonalLeftToRight ||
      direction === Direction.DiagonalRightToLeft
    ) {
      this.readDiagonalDirection(direction);
      return;
    }
    if (direction === Direction.Horizontal) this._horizontalCoordinates = [];
    if (direction === Direction.Vertical) this._verticalCoordinates = [];

    for (let column = 0; column < this._board.length; column++) {
      const { emptyMarkCount, playerMarkCount }: CountResults =
        this.countSquaresByStateInDirection(column, direction);

      if (playerMarkCount === 2 && emptyMarkCount === 1) {
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

  private readDiagonalDirection(direction: Direction): void {
    const { emptyMarkCount, playerMarkCount }: CountResults =
      this.countSquaresByStateInDirection(0, direction);

    if (direction === Direction.DiagonalLeftToRight)
      this._diagonalLeftToRightCoordinates = [];

    if (direction === Direction.DiagonalRightToLeft)
      this._diagonalRightToLeftCoordinates = [];

    if (playerMarkCount === 2 && emptyMarkCount === 1) {
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
  ): CountResults {
    let playerMarkCount: number = 0;
    let emptyMarkCount: number = 0;
    for (let row = 0; row < this._board.length; row++) {
      const currentSquare: BoardSquare = this.getSquareAtCoordinates(
        direction,
        column,
        row,
      );

      if (currentSquare.state === BoardSquareState.EMPTY) emptyMarkCount++;
      if (currentSquare.state === this._playerMark) playerMarkCount++;
    }
    return { emptyMarkCount, playerMarkCount };
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
