import React from "react";
import Message from "../components/chat-window/messages";
import ChatTop from "../components/chat-window/top";
import ChatBottom from "../components/chat-window/bottom";
import { useParams } from "react-router";
import { useRooms } from "../context/rooms.context";
import { Loader } from "rsuite";

function Chat() {
  const { chatId } = useParams(); //extract chat id from parameters sent from Home component
  const rooms = useRooms();
  //   if rooms is empty
  if (!rooms) {
    return <Loader center vertical size="md" speed="slow" content="Loading" />;
  }
  const currentRoom = rooms.find((room) => room.id === chatId);
  if (!currentRoom) {
    return <h6 className="text-center mt-page">Chat {chatId} not found!</h6>;
  }
  return (
    <>
      <div className="chat-top">
        <ChatTop />
      </div>
      <div className="chat-middle">
        <Message />
      </div>
      <div className="chat-bottom">
        <ChatBottom />
      </div>
    </>
  );
}

export default Chat;
