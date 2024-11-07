import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { nanoid } from 'nanoid';
import { useNavigate } from 'react-router-dom';
import { playerType, userType } from '../types';
import "../../node_modules/bootstrap/dist/css/bootstrap.min.css";

const Register = () => {
    const [username, setUsername] = useState<string>('');
    const [roomID, setRoomID] = useState<string>(nanoid(8));
    const { socket } = useSelector((states: RootState) => states);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        if (socket) {
            const handleJoinRoomSuccess = (userData: userType, playersData: playerType[]) => {
                dispatch({
                    type: 'CREATE_USER',
                    payload: userData
                })
                dispatch({
                    type: 'UPDATE_MATCHES',
                    payload: playersData
                })
                navigate(`/${userData.roomID}/${userData.usertype}`);
            }
            const handleJoinRoomError = (data: userType) => {
                if (data.errortype) {
                    alert("We're so sorry, it seems there's a little hiccup. Give it another shot!")
                } else {
                    if (data.usertype === 'player') {
                        alert("This room's full of players, but you can still chill and watch the action by joining as a spectator!")
                    }
                }
            }

            socket.on('join-room-success', handleJoinRoomSuccess);
            socket.on('join-room-error', handleJoinRoomError);

            return () => {
                socket.off('join-room-success', handleJoinRoomSuccess);
                socket.off('join-room-error', handleJoinRoomError);

            };
        }
    }, [socket])


    const joinAsPlayer = () => {
        if (username && roomID && socket) {
            if (socket) {
                socket.emit('join-room', { username, usertype: 'player', roomID });
            }
        }
    }

    const joinAsSpectator = () => {
        if (username && roomID && socket) {
            socket.emit('join-room', { username, usertype: 'spectator', roomID });
        }
    }

    return (
        <div className='p-4 d-flex flex-column align-items-center justify-content-center register-container'>
            <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder='Enter your name here...' className='my-2 p-2 my-input' />
            <input type="text" value={roomID} onChange={(e) => setRoomID(e.target.value)} placeholder='Enter room ID here...' className='my-2 p-2 my-input' />
            <div className='container p-2 d-flex justify-content-around align-items-center'>
                <button type="button" onClick={joinAsPlayer} className='p-2 my-btn join-room-btn'>Play Now</button>
                <button type="button" onClick={joinAsSpectator} className='p-2 my-btn join-room-btn'>Observe the Match</button>
            </div>
        </div>
    )
}

export default Register