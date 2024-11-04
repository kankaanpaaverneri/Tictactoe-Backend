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

interface ReadDirections {
  readHorizontal: boolean;
  readVertical: boolean;
  readDiagonalLeftToRight: boolean;
  readDiagonalRightToLeft: boolean;
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
  private _winner: WinningStatus;

  constructor() {
    this._board = intitialBoardState;
    this._playerMark = BoardSquareState.EMPTY;
    this._programMark = BoardSquareState.EMPTY;
    this._turnCount = 0;
    this._turn = BoardSquareState.EMPTY;
    this._programMoveId = 0;
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

  public get board(): BoardSquare[][] {
    return this._board;
  }

  public get turn(): BoardSquareState {
    return this._turn;
  }

  public get winner(): WinningStatus {
    return this._winner;
  }

  public getTurnCount(): number {
    return this._turnCount;
  }

  public updateBoardWithId(id: number): void {
    this._board.forEach((column) => {
      column.forEach((row) => {
        if (row.state === BoardSquareState.EMPTY && row.id === id)
          row.state = this._turn;
      });
    });
  }

  public programMove(playerMoveId: number): void {
    if (this._turnCount <= 1) {
      const programMoveId: number = this.firstTurn();
      if (programMoveId !== 0) this.updateBoardWithId(programMoveId);
      return;
    }

    //Second turn
    if (this._turnCount === 3) {
      const programMoveId: number = this.secondTurn(playerMoveId);
      if (programMoveId !== 0) this.updateBoardWithId(programMoveId);
      return;
    }

    if (this._turnCount > 3) {
      const programMoveId: number = this.restOfTheTurns();
      if (programMoveId !== 0) this.updateBoardWithId(programMoveId);
      return;
    }
  }

  public resetBoard(): void {
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
    this._winner = WinningStatus.NO_WINNER;
  }

  public switchTurn(): void {
    this._turn =
      this._turn === BoardSquareState.X
        ? BoardSquareState.O
        : BoardSquareState.X;
    this.incrementTurnCount(1);
  }

  public readWinningStatus(): WinningStatus {
    this.readSpecifiedDirections(3, 0, this._programMark, {
      readVertical: false,
      readHorizontal: false,
      readDiagonalLeftToRight: false,
      readDiagonalRightToLeft: false,
    });

    if (this._winner === WinningStatus.O) {
      return WinningStatus.O;
    }

    this.readSpecifiedDirections(3, 0, this._playerMark, {
      readVertical: false,
      readHorizontal: false,
      readDiagonalLeftToRight: false,
      readDiagonalRightToLeft: false,
    });

    if (this._winner === WinningStatus.X) {
      return WinningStatus.O;
    }

    if (this._winner === WinningStatus.NO_WINNER && this.readDraw() === 9) {
      this._winner = WinningStatus.DRAW;
      return WinningStatus.DRAW;
    }
    return WinningStatus.NO_WINNER;
  }

  private readDraw(): number {
    let emptySquareCount = 0;
    for (let column = 0; column < this._board.length; column++) {
      for (let row = 0; row < this._board[column].length; row++) {
        if (this._board[column][row].state !== BoardSquareState.EMPTY)
          emptySquareCount++;
      }
    }
    return emptySquareCount;
  }

  private firstTurn(): number {
    let programMoveId: number = 0;
    if (this._board[1][1].state === BoardSquareState.EMPTY) programMoveId = 5;
    else {
      for (let column = 0; column < this._board.length; column++) {
        for (let row = 0; row < this._board[column].length; column++) {
          const currentSquare = this._board[column][row];
          if (
            currentSquare.state === BoardSquareState.EMPTY &&
            column !== 1 &&
            row !== 1
          ) {
            return currentSquare.id;
          }
        }
      }
    }
    return programMoveId;
  }

  private secondTurn(secondPlayerMoveId: number): number {
    //Prevent player from winning
    const preventPlayerFromWinning: Coordinates[] = this.readAllDirections(
      2,
      1,
      this._playerMark,
    );
    if (preventPlayerFromWinning.length > 0)
      return this.getProgramMoveId(preventPlayerFromWinning);

    //Player is not winning

    const playerSecondMoveCoordinates: Coordinates = this.getCoordinatesById(
      this._playerMark,
      secondPlayerMoveId,
    );

    const programMoveId: number = this.blockOptionsForCoordinates(
      playerSecondMoveCoordinates,
    );

    if (programMoveId !== 0) return programMoveId;

    return 0; // Don't know
  }

  private blockOptionsForCoordinates(coordinates: Coordinates): number {
    const blockOptionsHorizontal: Coordinates =
      this.getBlockOptionsHorizontal(coordinates);

    let programMoveId: number = 0;

    if (this.coordinatesEqual(blockOptionsHorizontal, coordinates)) {
      console.log("Didn't find any horizontal block options");
    } else {
      console.log("blockOptionsHorizontal: ", blockOptionsHorizontal);
      programMoveId = this.getProgramMoveId([blockOptionsHorizontal]);
    }

    const blockOptionsVertical: Coordinates =
      this.getBlockOptionsVertical(coordinates);

    if (this.coordinatesEqual(blockOptionsVertical, coordinates)) {
      console.log("Didn't find any vertical block options");
    } else {
      console.log("blockOptionsVertical: ", blockOptionsVertical);
      programMoveId = this.getProgramMoveId([blockOptionsVertical]);
    }

    return programMoveId;
  }

  private coordinatesEqual(
    coordinatesA: Coordinates,
    coordinatesB: Coordinates,
  ): boolean {
    return coordinatesA.x === coordinatesB.x &&
      coordinatesA.y === coordinatesB.y
      ? true
      : false;
  }

  private getBlockOptionsHorizontal({ x, y }: Coordinates): Coordinates {
    const maxCoordinate: number = 2;
    const middleCoordinate: number = 1;
    const minCoordinate: number = 0;

    //playerMovementCoordinates
    const blockOptions: Coordinates = {
      x: x,
      y: y,
    };
    // Check horizontaly
    if (x === maxCoordinate && this.isSquareEmpty({ x: x - 1, y: y })) {
      blockOptions.x -= 1;
      return blockOptions;
    }

    if (x === minCoordinate && this.isSquareEmpty({ x: x + 1, y: y })) {
      blockOptions.x += 1;
      return blockOptions;
    }

    if (x === middleCoordinate) {
      if (this.isSquareEmpty({ x: x + 1, y: y })) {
        blockOptions.x += 1;
        return blockOptions;
      }

      if (this.isSquareEmpty({ x: x - 1, y: y })) {
        blockOptions.x -= 1;
        return blockOptions;
      }
    }

    return blockOptions;
  }

  private getBlockOptionsVertical({ x, y }: Coordinates) {
    const maxCoordinate: number = 2;
    const middleCoordinate: number = 1;
    const minCoordinate: number = 0;

    //playerMovementCoordinates
    const blockOptions: Coordinates = {
      x: x,
      y: y,
    };
    // Check horizontaly
    if (y === maxCoordinate && this.isSquareEmpty({ x: x, y: y - 1 })) {
      blockOptions.y -= 1;
      return blockOptions;
    }

    if (y === minCoordinate && this.isSquareEmpty({ x: x, y: y + 1 })) {
      blockOptions.y += 1;
      return blockOptions;
    }

    if (y === middleCoordinate) {
      if (this.isSquareEmpty({ x: x, y: y + 1 })) {
        blockOptions.y += 1;
        return blockOptions;
      }

      if (this.isSquareEmpty({ x: x, y: y - 1 })) {
        blockOptions.y -= 1;
        return blockOptions;
      }
    }

    return blockOptions;
  }

  private isSquareEmpty(coordinates: Coordinates): boolean {
    const { x, y }: Coordinates = coordinates;

    const currentSquare: BoardSquare = this._board[y][x];
    if (currentSquare.state === BoardSquareState.EMPTY) return true;

    return false;
  }

  private getCoordinatesById(
    readMarkType: BoardSquareState,
    playerMoveId: number,
  ): Coordinates {
    const playerOccupiedSquare: Coordinates = this.getEmptyCoordinates();
    for (let column = 0; column < this._board.length; column++) {
      for (let row = 0; row < this._board[column].length; row++) {
        const currentSquare = this._board[column][row];
        if (
          currentSquare.id === playerMoveId &&
          currentSquare.state === readMarkType
        ) {
          playerOccupiedSquare.x = row;
          playerOccupiedSquare.y = column;
        }
      }
    }
    return playerOccupiedSquare;
  }

  private restOfTheTurns(): number {
    const programWinCoordinates: Coordinates[] = this.readAllDirections(
      2,
      1,
      this._programMark,
    );

    if (programWinCoordinates.length > 0) {
      return this.getProgramMoveId(programWinCoordinates);
    }

    const preventPlayerFromWinning: Coordinates[] = this.readAllDirections(
      2,
      1,
      this._playerMark,
    );

    if (preventPlayerFromWinning.length > 0) {
      return this.getProgramMoveId(preventPlayerFromWinning);
    }

    const placeMarkToEmptyColumn: Coordinates[] = this.readDirection(
      Direction.Vertical,
      1,
      2,
      this._playerMark,
    );

    if (placeMarkToEmptyColumn.length > 0)
      return this.getProgramMoveId(placeMarkToEmptyColumn);

    const placeMarkToEmptyRow: Coordinates[] = this.readDirection(
      Direction.Horizontal,
      1,
      2,
      this._playerMark,
    );

    if (placeMarkToEmptyRow.length > 0)
      return this.getProgramMoveId(placeMarkToEmptyRow);

    const programProgressCoordinates: Coordinates[] = this.readAllDirections(
      1,
      2,
      this._programMark,
    );

    if (programProgressCoordinates.length > 0) {
      return this.getProgramMoveId(programProgressCoordinates);
    }

    const lastProgramProgressCoordinates: Coordinates[] =
      this.readAllDirections(1, 2, this._playerMark);

    if (lastProgramProgressCoordinates.length > 0)
      return this.getProgramMoveId(lastProgramProgressCoordinates);

    return 0;
  }

  private getProgramMoveId(allCoordinates: Coordinates[]): number {
    let programMoveId: number = 0;
    for (let i = 0; i < allCoordinates.length; i++) {
      const { y, x } = allCoordinates[i];
      if (this._board[y][x].state === BoardSquareState.EMPTY)
        return this._board[y][x].id;
    }
    return programMoveId;
  }

  private readAllDirections(
    readMarkLimit: number,
    readEmptySquareLimit: number,
    readMarkType: BoardSquareState,
  ): Coordinates[] {
    const horizontalCoordinates: Coordinates[] = this.readDirection(
      Direction.Horizontal,
      readMarkLimit,
      readEmptySquareLimit,
      readMarkType,
    );
    const verticalCoordinates: Coordinates[] = this.readDirection(
      Direction.Vertical,
      readMarkLimit,
      readEmptySquareLimit,
      readMarkType,
    );
    const diagonalLeftToRightCoordinates: Coordinates[] = this.readDirection(
      Direction.DiagonalLeftToRight,
      readMarkLimit,
      readEmptySquareLimit,
      readMarkType,
    );
    const diagonalRightToLeftCoordinates: Coordinates[] = this.readDirection(
      Direction.DiagonalRightToLeft,
      readMarkLimit,
      readEmptySquareLimit,
      readMarkType,
    );

    const allCoordinatesArray: Coordinates[] = [
      ...horizontalCoordinates,
      ...verticalCoordinates,
      ...diagonalLeftToRightCoordinates,
      ...diagonalRightToLeftCoordinates,
    ];

    return allCoordinatesArray;
  }

  private readSpecifiedDirections(
    readMarkLimit: number,
    readEmptySquareLimit: number,
    readMarkType: BoardSquareState,
    directions: ReadDirections,
  ): Coordinates[] {
    const {
      readHorizontal,
      readVertical,
      readDiagonalLeftToRight,
      readDiagonalRightToLeft,
    }: ReadDirections = directions;

    const horizontalCoordinates: Coordinates[] = this.readDirection(
      Direction.Horizontal,
      readMarkLimit,
      readEmptySquareLimit,
      readMarkType,
    );
    const verticalCoordinates: Coordinates[] = this.readDirection(
      Direction.Vertical,
      readMarkLimit,
      readEmptySquareLimit,
      readMarkType,
    );
    const diagonalLeftToRightCoordinates: Coordinates[] = this.readDirection(
      Direction.DiagonalLeftToRight,
      readMarkLimit,
      readEmptySquareLimit,
      readMarkType,
    );
    const diagonalRightToLeftCoordinates: Coordinates[] = this.readDirection(
      Direction.DiagonalRightToLeft,
      readMarkLimit,
      readEmptySquareLimit,
      readMarkType,
    );

    const allCoordinatesArray: Coordinates[] = [];

    if (readHorizontal) allCoordinatesArray.push(...horizontalCoordinates);
    if (readVertical) allCoordinatesArray.push(...verticalCoordinates);
    if (readDiagonalLeftToRight)
      allCoordinatesArray.push(...diagonalLeftToRightCoordinates);
    if (readDiagonalRightToLeft)
      allCoordinatesArray.push(...diagonalRightToLeftCoordinates);
    return allCoordinatesArray;
  }

  private printAllCoordinates(
    horizontal: Coordinates[],
    vertical: Coordinates[],
    diagonalLR: Coordinates[],
    diagonalRL: Coordinates[],
  ): void {
    console.log("horizontalCoordinates: ", horizontal);
    console.log("verticalCoordinates: ", vertical);
    console.log("diagonalLeftToRight: ", diagonalLR);
    console.log("diagonalRightToLeft: ", diagonalRL);
  }

  //Read Board Vertical or Horizontal direction
  private readDirection(
    direction: Direction,
    readMarkLimit: number,
    readEmptySquareLimit: number,
    readMarkType: BoardSquareState,
  ): Coordinates[] {
    const coordinatesArray: Coordinates[] = [];

    if (
      direction === Direction.DiagonalLeftToRight ||
      direction === Direction.DiagonalRightToLeft
    ) {
      return this.readDiagonalDirection(
        direction,
        readMarkLimit,
        readEmptySquareLimit,
        readMarkType,
      );
    }

    for (let column = 0; column < this._board.length; column++) {
      const { emptySquareCount, markCount }: CountResults =
        this.countSquaresByStateInDirection(column, direction, readMarkType);

      if (
        markCount === readMarkLimit &&
        emptySquareCount === readEmptySquareLimit
      ) {
        if (this.readWinner(readMarkLimit, readEmptySquareLimit)) return [];

        const coordinates: Coordinates[] = this.getCoordinates(
          column,
          direction,
        );
        coordinatesArray.push(...coordinates);
      }
    }
    return coordinatesArray;
  }

  private readWinner(markLimit: number, emptySquareLimit: number): boolean {
    if (markLimit === 3 && emptySquareLimit === 0) {
      if (this._turn === BoardSquareState.X) this._winner = WinningStatus.X;

      if (this._turn === BoardSquareState.O) this._winner = WinningStatus.O;

      return true;
    }

    return false;
  }

  private readDiagonalDirection(
    direction: Direction,
    readMarkLimit: number,
    readEmptySquareLimit: number,
    readMarkType: BoardSquareState,
  ): Coordinates[] {
    const coordinatesArray: Coordinates[] = [];
    const { emptySquareCount, markCount }: CountResults =
      this.countSquaresByStateInDirection(0, direction, readMarkType);
    if (
      markCount === readMarkLimit &&
      emptySquareCount === readEmptySquareLimit
    ) {
      if (this.readWinner(readMarkLimit, readEmptySquareLimit)) return [];
      const coordinates: Coordinates[] = this.getCoordinates(0, direction);
      coordinatesArray.push(...coordinates);
    }
    return coordinatesArray;
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

  getCoordinates(column: number, direction: Direction): Coordinates[] {
    const coordinatesArray: Coordinates[] = [];

    for (let row = 0; row < this._board[column].length; row++) {
      const currentSquare: BoardSquare = this.getSquareAtCoordinates(
        direction,
        column,
        row,
      );

      if (currentSquare.state === BoardSquareState.EMPTY) {
        const coordinates: Coordinates = this.getEmptyCoordinates();
        if (direction === Direction.Horizontal) {
          coordinates.y = column;
          coordinates.x = row;
          coordinatesArray.push(coordinates);
        }

        if (direction === Direction.Vertical) {
          coordinates.y = row;
          coordinates.x = column;
          coordinatesArray.push(coordinates);
        }

        if (direction === Direction.DiagonalLeftToRight) {
          coordinates.y = column + row;
          coordinates.x = row;
          coordinatesArray.push(coordinates);
        }

        if (direction === Direction.DiagonalRightToLeft) {
          coordinates.y = row;
          coordinates.x = 2 - row;
          coordinatesArray.push(coordinates);
        }
      }
    }
    return coordinatesArray;
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
  private incrementTurnCount(amount: number): void {
    this._turnCount += amount;
  }
}

export const board: Board = new Board();
