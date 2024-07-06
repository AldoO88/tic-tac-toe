import { useState } from 'react'
import './App.css'
import confetti from 'canvas-confetti';
import { Square } from './components/Square';
import { TURNS } from './constants';
import { checkWinnerFrom } from './logic/board';
import WinnerModal from './components/WinnerModal';
import { checkEndGame } from './logic/board';
import { saveGameToStorage, resetGameStorage } from './logic/storage';
function App() {

  const [board, setBoard] =  useState(() => {
    const boardFromStorage = window.localStorage.getItem('board');
    return boardFromStorage ? JSON.parse(boardFromStorage) : 
    Array(9).fill(null)
  
  });

  const [turn, setTurn] = useState(() => {
    const turnFromStorage = window.localStorage.getItem('turn');
    return turnFromStorage ?? TURNS.X
  });
  const [winner, setWinner] = useState(null) //null es que no hay ganador, false es que hay un empate


  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setTurn(TURNS.X);
    setWinner(null);

    resetGameStorage();
  }

  const updateBoard = (index) => { 
    //no actualizamos esta posicion si ya tiene algo
    if(board[index] || winner) return;
    //actualizar el tablero
    const newBoard = [...board];
    newBoard[index] = turn;
    setBoard(newBoard);
    //cambiar el turno
    const newTurn = turn === TURNS.X ? TURNS.O : TURNS.X;
    setTurn(newTurn); 
    saveGameToStorage ({
        board: newBoard, 
        turn:newTurn
      });
    const newWinner = checkWinnerFrom(newBoard);
    if(newWinner){
      confetti();
      setWinner(newWinner);
    }else if(checkEndGame(newBoard)){
      setWinner(false);
    }

  }

  return (
    <main className="board">
      <h1>Tic Tac Toe</h1>
      <button onClick={resetGame}>Reiniciar</button>
        <section className="game">
          {
            board.map((square, index) => {
              return(
                <Square 
                  key={index}
                  index={index}
                  updateBoard={updateBoard}
                >
                {square}
              </Square>
              )
              
            })
          }
        </section> 

        
        <section className='turn'>
          <Square isSelected={turn === TURNS.X}>
            {TURNS.X}
          </Square>
          <Square isSelected={turn === TURNS.O}>
            {TURNS.O}
          </Square>
        </section>

        <WinnerModal resetGame={resetGame} winner={winner}/>
       
    </main>
  )
}

export default App
