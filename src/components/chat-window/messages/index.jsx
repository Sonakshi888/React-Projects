import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { useParams } from "react-router";
import { database } from "../../../misc/firebase";
import { transformToArrayWithId } from "../../../misc/helpers";
import MessageItem from "./MessageItem";

const Messages = () => {
  const { chatId } = useParams();
  const [messages, setMessages] = useState(null);
  const isChatEmpty = messages && messages.length === 0;
  const canShowMessage = messages && messages.length > 0;

  useEffect(() => {
    const messagesRef = database.ref("/messages"); //getting ref of messages from database

    // adding realtime listener on value which gives snapshot of the whole data present in the room where room id is equal to chat id
    //adding msg data to messages
    messagesRef
      .orderByChild("roomId")
      .equalTo(chatId)
      .on("value", (snap) => {
        const data = transformToArrayWithId(snap.val());
        setMessages(data);
      });

    // unsubscribing to the subscription using clean up function for useEffect
    return () => {
      messagesRef.off("value");
    };
  }, [chatId]);

  return (
    <ul className="msg-list custom-scroll">
      {isChatEmpty && <li>No messages yet!</li>}
      {canShowMessage &&
        messages.map((msg) => <MessageItem key={msg.id} message={msg} />)}
    </ul>
  );
};

export default Messages;
