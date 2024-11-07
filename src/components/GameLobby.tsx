import { useSelector } from 'react-redux'
import { RootState } from '../redux/store'
import "../../node_modules/bootstrap/dist/css/bootstrap.min.css";

const GameLobby = () => {
    const { socket, user, matches } = useSelector((states: RootState) => states);

    const play = () => {
        if (socket) {
            socket.emit('update-is-game-active-true');
        }
    }

    return (
        <div className='me-4 d-flex flex-column align-items-center justify-content-center game-lobby-and-board-container'>
            {matches.length > 0 ? <>
                <p className='m-2 p-2 my-paragraph matches-played-paragraph'>Matches Played: {matches[0].matchesPlayed}</p>
                <p className='m-2 p-2 my-paragraph game-lobby-paragraph player-and-score-paragraph'>{matches[0].username}'s Score ({matches[0].usermark}): {matches[0].userscore}</p>
                {matches.length > 1 ? <>
                    <p className='m-2 p-2 my-paragraph player-and-score-paragraph'>{matches[1].username}'s Score ({matches[1].usermark}): {matches[1].userscore}</p>
                    {user.usertype === 'player' ? <button type="button" onClick={play} className='m-2 p-2 col-5 my-btn'>{matches[0].matchesPlayed === 0 ? 'Play' : 'Play Again'}</button> : <></>}
                </> : <p className='m-2 p-2 my-paragraph waiting-paragraph'>Waiting For Other Player To Join</p>
                }
            </> : <p>No Players Joined Till Now</p>
            }
        </div>
    )
}

export default GameLobby