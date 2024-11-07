import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { messageType } from '../types';

const Chat = () => {
    const { socket, user } = useSelector((states: RootState) => states);
    const [newMessage, setNewMessage] = useState<string>('');
    const [messages, setMessages] = useState<messageType[]>([]);

    useEffect(() => {
        if (socket) {
            const handleRecieveMessage = (data: messageType) => {
                setMessages((prevMessages) => [...prevMessages, data]);
            }
            socket.on('recieve-message', handleRecieveMessage);

            return () => {
                socket.off('recieve-message', handleRecieveMessage);
            };
        }
    }, [socket])

    const sendNewMessage = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            if (socket) {
                socket.emit('send-message', { username: user.username, usertype: user.usertype, message: newMessage });
                setMessages((prevMessages) => [...prevMessages, { username: user.username, usertype: user.usertype, message: newMessage }]);
                setNewMessage('');
            }
        }
    }

    return (
        <div className='ms-4 p-2 d-flex flex-column align-items-center justify-content-between chat-container'>
            <div className='m-2 p-2 d-flex flex-column align-items-left justify-content-start overflow-y-auto chat-messages-container'>
                {messages.map(message => {
                    return <p className='m-2 p-2 text-wrap text-break chat-message-paragraph'>{message.username + (message.usertype === 'player' ? '(P)' : '(S)') + ' : ' + message.message}</p>
                })}
            </div>
            <input type="text" value={newMessage} onChange={(e) => { setNewMessage(e.target.value) }} onKeyDown={sendNewMessage} placeholder='Type your message...' className='m-2 p-2 my-input chat-message-input-container' />
        </div>
    )
}

export default Chat