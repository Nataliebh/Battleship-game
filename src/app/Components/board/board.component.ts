import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss']
})
export class BoardComponent implements OnInit {
  title = 'Battleship Game';
  board: (string)[][] = []; 
  boardSize: number = 10;
  ships: number = 10;
  letters: Array<string> = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j'];
  gameOver: boolean = false;
  hitCounter: number = 0;
  shipsArray: Array<number> = [5, 5, 4, 4, 3, 3, 2, 2, 1, 1];
  shipsLocationArray: Array<any> = [];
  isCellEmpty: boolean = false;
  sumArrayShips: number = 0;

  ngOnInit() {
    this.startGame();
  }

  // Building the board
  startGame() {
    this.board = [];
    this.gameOver = false;
    this.hitCounter = 0;
    for (let i = 0; i < this.boardSize; i++) {
      let row: (string)[] = [];
      for (let j = 0; j < this.boardSize; j++) {
        row.push("");
      }
      this.board.push(row);
    }
    // count ship cells
    this.sumArrayShips = this.shipsArray.reduce((accumulator, currentValue) => {
      return accumulator + currentValue;
    }, 0);
    this.findRandomDots();
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
      if (this.board[row][validColStart + i].includes('ship')) {
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
      this.board[row][validColStart + i] = 'ship';

      // adding classes for different border:
      if (i === 0 || ship === 1) {
        this.board[row][validColStart + i] = 'ship ship-start';
      } else if (i === ship - 1) {
        this.board[row][validColStart + i] = 'ship ship-end';
      }
      if (ship === 1) {
        this.board[row][validColStart + i] = 'ship ship-one';
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
    if (this.gameOver || this.board[i][j] === 'hit' || this.board[i][j] === 'miss') {
      return;
    }
    // checking if cell is with ship
    if (!this.gameOver) {
      if (this.board[i][j].includes("ship")) {
        this.board[i][j] = 'hit';
        this.hitCounter++;
        this.checkGameOver();
      } else {
        this.board[i][j] = 'miss';
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
