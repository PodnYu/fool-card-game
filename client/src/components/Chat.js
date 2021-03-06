import React, { useState, useEffect } from 'react';
import socketio from 'socket.io-client';
import '../css/Chat.css';

import ChatInput from './ChatInput';
import Messages from './Messages';

import { useParams } from 'react-router-dom';

import { Container, Dropdown } from 'react-bootstrap';

let io;
export default function Chat(props) {

    let user = props.user;

    const [messages, setMessages] = useState([]);

    const [participants, setParticipants] = useState([]);

    const { room } = useParams();

    useEffect(() => {

        // io = socketio('http://localhost:5000');
        io = socketio('http://192.168.1.3:5000');

        io.emit('join', { user, room });

        io.on('controlMessage', message => {
            console.log('controlMessage: ' + message.text);
        });

        io.on('message', message => {
            setMessages(m => [...m, message]);
            console.log('message: ', message);
        });

        io.on('controlMessage', message => {
            setMessages(m => [...m, message]);
        });

        io.on('users', ({ users }) => {
            console.log(users);
            setParticipants(users);
        });

        io.on('userJoined', ({ user }) => {
            console.log('User joined', user);
            setParticipants(p => [...p, user]);
        });

        io.on('userLeft', ({ user }) => {
            console.log('User left', user);
            setParticipants(p => p.filter(participant => participant.userName !== user.userName));
        });

        return () => {
            console.log('chat unmounted');
            io.emit('goingToDisconnect', { user, room });
            io.disconnect();
        }

    }, []);

    return (

        <Container id='chatContainer'>
            <Dropdown align='center' className='mb-2'>
                <Dropdown.Toggle>
                    {room}
                </Dropdown.Toggle>

                {participants.length > 0 &&
                    <Dropdown.Menu>
                        {
                            participants.map((p, i) =>
                                <Dropdown.Item key={i}>{p.userName}</Dropdown.Item>
                            )
                        }
                    </Dropdown.Menu>
                }
            </Dropdown>
            <div id='chatView'>
                <Messages messages={messages} user={user} />

                <ChatInput handleSend={handleSend} />
            </div>
        </Container>
    );

    function handleSend(text) {

        let data = {
            user,
            text,
            room
        }

        io.emit('message', data);

        setMessages([...messages, { user: user, text: data.text }]);
    }

}