import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss']
})
export class BoardComponent implements OnInit {
  title = 'Battleship Game';
  board: (number | string)[][] = []; 
  boardSize: number = 10;
  ships: number = 10;
  letters = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j'];
  gameOver: boolean = false;
  hitCounter: number = 0;

  ngOnInit() {
    this.startGame();
  }

  // Building the board
  startGame() {
    this.board = [];
    this.gameOver = false;
    this.hitCounter = 0;
    for (let i = 0; i < this.boardSize; i++) {
      let row: (number | string)[] = [];
      for (let j = 0; j < this.boardSize; j++) {
        row.push("");
      }
      this.board.push(row);
    }
    this.placeShips();
  }

  //  Placing the ships randomly on the board
  placeShips() {
    let counter = 0;
    while (this.ships > counter) {
      let row = Math.floor(Math.random() * 10);
      let col = Math.floor(Math.random() * 10);
      // check duplicates:
      if (this.board[row][col] !== 1) {         //1=ship in cell
        this.board[row][col] = 1;
        counter++;
      }
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
      if (this.board[i][j] === 1) {
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
    if (this.hitCounter === this.ships) {
      this.gameOver = true;
    }
  }

}
