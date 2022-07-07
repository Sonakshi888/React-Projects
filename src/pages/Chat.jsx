import React from "react";
import Message from "../components/chat-window/messages";
import ChatTop from "../components/chat-window/top";
import ChatBottom from "../components/chat-window/bottom";
import { useParams } from "react-router";
import { useRooms } from "../context/rooms.context";
import { Loader } from "rsuite";
import { CurrentRoomRovider } from "../context/current-room.context";
import { transformToArray } from "../misc/helpers";
import { auth } from "../misc/firebase";

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

  const { name, description } = currentRoom; //destructring
  const admins = transformToArray(currentRoom.admins); //calling transformToArray to get admin outside of an object
  const isAdmin = admins.includes(auth.currentUser.uid); //checking if the current user is an admin
  const currentRoomData = {
    name,
    description,
    admins,
    isAdmin,
  };

  return (
    <CurrentRoomRovider data={currentRoomData}>
      <div className="chat-top">
        <ChatTop />
      </div>
      <div className="chat-middle">
        <Message />
      </div>
      <div className="chat-bottom">
        <ChatBottom />
      </div>
    </CurrentRoomRovider>
  );
}

export default Chat;
