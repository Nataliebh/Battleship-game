import { Component, OnInit, HostListener} from '@angular/core';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss']
})
export class BoardComponent implements OnInit {
  title = 'Battleship Game';
  board: (any)[][] = [];
  boardSize: number = 10;
  ships: number = 10;
  letters: Array<string> = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j'];
  gameOver: boolean = false;
  hitCounter: number = 0;
  shipsArray: Array<number> = [];
  isCellEmpty: boolean = false;
  sumArrayShips: number = 0;
  row: number = 0;
  col: number = 0;

  ngOnInit() {
    this.startGame();
  }

  @HostListener('window:keyup', ['$event'])
  keyEvent(event: KeyboardEvent) {
    this.board[this.row][this.col].hover = false;
    this.board[this.row][this.col];
    if (event.key == 'ArrowDown') {
      if (this.row === this.boardSize - 1) {
        this.row = 0;
      } else {
        this.row++;
      }
      this.board[this.row][this.col].hover = true;
    }
    if (event.key == 'ArrowUp') {
      if (this.row === 0) {
        this.row = this.boardSize - 1;
      } else {
        this.row--;
      }
      this.board[this.row][this.col].hover = true;
    }
    if (event.key == 'ArrowRight') {
      if (this.col === this.boardSize - 1) {
        this.col = 0;
      } else {
        this.col++;
      }
      this.board[this.row][this.col].hover = true;
    }
    if (event.key == 'ArrowLeft') {
      if (this.col === 0) {
        this.col = this.boardSize - 1;
      } else {
        this.col--;
      }
      this.board[this.row][this.col].hover = true;
    }
    if (event.key == 'Enter') {
      this.clickCell(this.row, this.col);
    }
  }

  // Building the board
  startGame() {
    this.board = [];
    this.gameOver = false;
    this.hitCounter = 0;

    this.addRandomShipsArray();

    for (let i = 0; i < this.boardSize; i++) {
      let row: (object)[] = [];
      for (let j = 0; j < this.boardSize; j++) {
        row[j] = { used: false, value: 0, status: '', hover: false, shipBorderLocation: '' };
      }
      this.board.push(row);

    }
    // count ship cells
    this.sumArrayShips = this.shipsArray.reduce((accumulator, currentValue) => {
      return accumulator + currentValue;
    }, 0);
    this.findRandomDots();
  }

  addRandomShipsArray() {
    for (let i = 0; i < this.ships; i++) {
      let randShip = Math.floor(Math.random() * 5) + 1;
      this.shipsArray.push(randShip);
    }
    return this.shipsArray;
  }

  //  Placing the ships randomly on the board
  // placeShips() {
  findRandomDots() {
    let randomStartIndex = Math.floor(Math.random() * this.boardSize);
    this.shipsArray.forEach((ship) => {
      let validColStart = randomStartIndex <= this.boardSize - ship;
      if (validColStart) {
        let row = Math.floor(Math.random() * 10);
        this.checkEmptyCell(row, randomStartIndex, ship);
      } else {
        this.findRandomDots();
      }
    });
  }

  checkEmptyCell(row: number, validColStart: number, ship: number) {
    for (let i = 0; i < ship; i++) {
      if (this.board[row][validColStart + i].value === 1) {
        this.isCellEmpty = false;
      }
    }
    if (this.isCellEmpty) {
      this.placeOneShip(row, validColStart, ship);
    }
    else {
      this.isCellEmpty = true;
      this.findRandomDots();
    }
  }

  placeOneShip(row: number, validColStart: number, ship: number) {
    // adding ship
    for (let i = 0; i < ship; i++) {
      this.board[row][validColStart + i].value = 1;

      // adding different border:
      if (ship === 1) {
        this.board[row][validColStart + i].shipBorderLocation = 'oneShip';
      } else {
        if (i === 0) {
          this.board[row][validColStart + i].shipBorderLocation = 'start';
        }
        if (i === ship - 1) {
          this.board[row][validColStart + i].shipBorderLocation = 'end';

        }
      }
    }
    // remove ship from shipsArray after placing it on board
    let shipIndex = this.shipsArray.indexOf(ship);
    this.shipsArray.splice(shipIndex, 1);
    if (this.shipsArray.length !== 0) {
      this.findRandomDots();
    }
  }

  // clicking on cell
  clickCell(i: number, j: number) {
    // checking the game is not over and cell isnt clicked
    if (this.gameOver || this.board[i][j].used === true) {
      return;
    }
    // checking if cell is with ship
    if (!this.gameOver) {
      this.board[i][j].used = true;
      if (this.board[i][j].value === 1) {
        this.board[i][j].status = 'hit';
        this.hitCounter++;
        this.checkGameOver();
      } else {
        this.board[i][j].status = 'miss';
      }
    }
  }

  // after hitting a ship, checking if the game is over
  checkGameOver() {
    if (this.hitCounter === this.sumArrayShips) {
      this.gameOver = true;
    }
  }
}
