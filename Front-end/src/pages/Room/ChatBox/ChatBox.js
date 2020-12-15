import React, { useEffect } from "react";
import "./ChatBox.css";

const ChatBox = () => {
  //const [chats, setChats] = useState([]);
  
  //get user context

  useEffect(() => { 
    //socket.on('eventname',(data) => {
    //  setChats
    //})
  }, []);

  return (
    <div className="chatBox">
      {
        // chats.map(chat =>
        //     user.user === chat.user ?
        //     (
        //         <div key={chat.id} className='chatBox__right'>
        //             <p className="chatBox__right--chat">{chat.mess}</p>
        //         </div>
        //     ) :
        //     (
        //         <div key={chat.id} className='chatBox__left'>
        //             <Avatar src={chat.avatar}/>
        //             <div>
        //                 <p className='chatBox__left--name'>{chat.username}</p>
        //                 <p className="chatBox__left--chat">{chat.mess}</p>
        //             </div>
        //         </div>
        //     )
        // )
      }
    </div>
  );
};

export default ChatBox;
