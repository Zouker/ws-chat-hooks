import React, {ChangeEvent, useEffect, useRef, useState} from 'react';
import './App.css';

type UserType = {
    userId: number
    userName: string
    photo: string
    message: string
}

function App() {

    let messagesBlockRef = useRef<any>();

    const [messageText, setMessageText] = useState('')
    const [ws, setWS] = useState<any>(null)
    const [users, setUsers] = useState<UserType[]>([])
    if (ws) {
        ws.onmessage = (messageEvent: any) => {
            let messages = JSON.parse(messageEvent.data)
            setUsers([...users, ...messages])
            messagesBlockRef.current.scrollTo(0, messagesBlockRef.current.scrollHeight)
        }
    }

    useEffect(() => {
        let localWS = new WebSocket('wss://social-network.samuraijs.com/handlers/ChatHandler.ashx')
        setWS(localWS)
    }, [])

    const onMessageChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
        setMessageText(e.currentTarget.value)
    }

    const sendMessage = () => {
        ws.send(messageText)
        setMessageText('')
    }

    return (
        <div className="App">
            <div className="chat">
                <div className="messages" ref={messagesBlockRef}>
                    {users.map((u, index) => <div key={index} className="message">
                        <img src={u.photo} alt={'user avatar'}/>
                        <b>{u.userName}</b> <span>{u.message}</span>
                    </div>)}
                </div>
            </div>
            <div className="footer">
                <textarea value={messageText}
                          onChange={onMessageChange}>{messageText}</textarea>
                <button onClick={sendMessage}>Send</button>
            </div>
        </div>
    );
}

export default App;
