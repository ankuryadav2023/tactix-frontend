import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../redux/store'
import GameBoard from './GameBoard';
import GameLobby from './GameLobby';
import Chat from './Chat';
import { playerType } from '../types';
import "../../node_modules/bootstrap/dist/css/bootstrap.min.css";

const Game = () => {
    const { socket, isGameActive } = useSelector((states: RootState) => states);
    const dispatch = useDispatch();

    useEffect(() => {
        if (socket) {
            const handleUpdateIsGameActiveTrue = () => {
                dispatch({
                    type: 'UPDATE_GAME_ACTIVE_STATUS_TRUE'
                })
            }
            const handleUpdateIsGameActiveFalse = () => {
                dispatch({
                    type: 'UPDATE_GAME_ACTIVE_STATUS_FALSE'
                })
            }
            const handleUpdatePlayersMatchesData = (playersData: playerType[]) => {
                console.log(playersData)
                dispatch({
                    type: 'UPDATE_MATCHES',
                    payload: playersData
                })
            }
            socket.on('update-is-game-active-true', handleUpdateIsGameActiveTrue);
            socket.on('update-is-game-active-false', handleUpdateIsGameActiveFalse);
            socket.on('update-players-matches-data', handleUpdatePlayersMatchesData);

            return () => {
                socket.off('update-is-game-active-true', handleUpdateIsGameActiveTrue);
                socket.off('update-is-game-active-false', handleUpdateIsGameActiveFalse);
                socket.off('update-players-matches-data', handleUpdatePlayersMatchesData);
            };
        }
    }, [socket])


    return (
        <div className='m-4 d-flex justify-content-center align-items-center game-container'>
            {isGameActive ? <GameBoard /> : <GameLobby />}
            <Chat />
        </div>
    )
}

export default Game