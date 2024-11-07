import { RootState } from '../redux/store';
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { moveType, playerType } from '../types';
import "../../node_modules/bootstrap/dist/css/bootstrap.min.css";

const GameBoard = () => {
    const [gameArray, setGameArray] = useState<number[][]>([[-1, -1, -1], [-1, -1, -1], [-1, -1, -1]]);
    const [gameStatus, setGameStatus] = useState<{ completed: boolean, status?: 'won' | 'draw', winner?: 'O' | 'X' }>({ completed: false });
    const { socket, user, matches } = useSelector((states: RootState) => states);

    useEffect(() => {
        if (socket && user.usertype === 'player') {
            if (gameStatus.completed && user.usermark === gameStatus.winner) {
                if (gameStatus.status === 'won') {
                    socket.emit('update-players-matches-data-won');
                } else if (gameStatus.status === 'draw') {
                    socket.emit('update-players-matches-data-draw');
                }
            }
        }
    }, [socket, gameStatus])


    useEffect(() => {
        if (socket) {
            const handleRecieveMove = (data: moveType) => {
                console.log(gameStatus)
                let player = matches.find((player: playerType) => {
                    return player.userSocketID === data.playerSocketID
                });
                setGameArray(prevGameArray => {
                    const newGameArray = prevGameArray.map((row, a) => {
                        return row.map((cell, b) => {
                            if (a === data.x && b === data.y) return player.usermark === 'O' ? 0 : 1;
                            else return cell;
                        })
                    });
                    evaluateGame(newGameArray);
                    return newGameArray;
                });
                if (user.usertype === 'player' && user.usermark === 'O') {
                    socket.emit('update-players-turns');
                }
            }

            socket.on('recieve-move', handleRecieveMove);

            return () => {
                socket.off('recieve-move', handleRecieveMove);
            };
        }
    }, [socket])

    const evaluateGame = (gameArray: number[][]) => {
        for (let i = 0; i < 3; i++) {
            if (gameArray[i][0] === gameArray[i][1] && gameArray[i][1] === gameArray[i][2]) {
                if (gameArray[i][0] === 0) {
                    setGameStatus(() => ({ completed: true, status: 'won', winner: 'O' }));
                    return;
                }
                if (gameArray[i][0] === 1) {
                    setGameStatus(() => ({ completed: true, status: 'won', winner: 'X' }));
                    return;
                }
            }
        }

        for (let j = 0; j < 3; j++) {
            if (gameArray[0][j] === gameArray[1][j] && gameArray[1][j] === gameArray[2][j]) {
                if (gameArray[0][j] === 0) {
                    setGameStatus(() => ({ completed: true, status: 'won', winner: 'O' }));
                    return;
                }
                if (gameArray[0][j] === 1) {
                    setGameStatus(() => ({ completed: true, status: 'won', winner: 'X' }));
                    return;
                }
            }
        }

        if (gameArray[0][0] === gameArray[1][1] && gameArray[1][1] === gameArray[2][2]) {
            if (gameArray[0][0] === 0) {
                setGameStatus(() => ({ completed: true, status: 'won', winner: 'O' }));
                return;
            }
            if (gameArray[0][0] === 1) {
                setGameStatus(() => ({ completed: true, status: 'won', winner: 'X' }));
                return;
            }
        }

        if (gameArray[0][2] === gameArray[1][1] && gameArray[1][1] === gameArray[2][0]) {
            if (gameArray[0][2] === 0) {
                setGameStatus(() => ({ completed: true, status: 'won', winner: 'O' }));
                return;
            }
            if (gameArray[0][2] === 1) {
                setGameStatus(() => ({ completed: true, status: 'won', winner: 'X' }));
                return;
            }
        }

        let noOfNegativeOnes = 0;
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (gameArray[i][j] === -1) noOfNegativeOnes += 1;
            }
        }
        if (noOfNegativeOnes === 0) {
            setGameStatus(() => ({ completed: true, status: 'draw', winner: 'O' }));
        }
    }

    const updateCell = (x: number, y: number) => {
        if (socket && (matches.filter((player: playerType) => player.userSocketID === socket.id))[0]['userturn']) {
            socket.emit('send-move', { playerSocketID: socket.id, x, y });
        } else {
            alert("Hang tight! It's not your time to shine... yet.");
        }
    }

    const backToLobby = () => {
        if (socket) {
            socket.emit('update-is-game-active-false');
        }
    }

    return (
        <div className='me-4 d-flex flex-column align-items-center justify-content-center game-lobby-and-board-container'>
            {gameStatus.completed && gameStatus.status === 'won' ? <>{matches.filter((player: playerType) => player.usermark === gameStatus.winner).map((winner: playerType) => <div className='m-2 d-flex flex-column align-items-center justify-content-center'><p className='m-1 my-paragraph winner-paragraph'>{winner.username + ' (' + winner.usermark + ')'} Won</p><p className='m-1 my-paragraph congrats-paragraph'>Congratulations on your well-deserved victory!</p></div>)}</> : <></>}
            {gameStatus.completed && gameStatus.status === 'draw' ? <div className='m-2 d-flex flex-column align-items-center justify-content-center'><p className='m-1 my-paragraph winner-paragraph'>Match Draws</p><p className='m-1 my-paragraph congrats-paragraph'>Draw, but not a snooze.</p></div> : <></>}
            {gameArray.map((row, x) => {
                return <div className='row m-2 game-board-row'>{
                    row.map((cell, y) => {
                        if (cell === 0) return <div id='' className='col m-1 d-flex justify-content-center align-items-center game-board-cell'>O</div>;
                        else if (cell === 1) return <div className='col m-1 d-flex justify-content-center align-items-center game-board-cell'>X</div>;
                        else return <div onClick={() => { if (user.usertype === 'player' && !gameStatus.completed) updateCell(x, y) }} className='col m-1 d-flex justify-content-center align-items-center game-board-cell'></div>;
                    })}
                </div>
            })}
            {gameStatus.completed && user.usertype === 'player' ? <button type="button" onClick={backToLobby} className='p-2 my-btn'>Back to the Lobby</button> : <></>}
        </div>
    )
}

export default GameBoard