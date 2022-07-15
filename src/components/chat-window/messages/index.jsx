import React from "react";
import { useCallback } from "react";
import { useEffect } from "react";
import { useState } from "react";
import { useParams } from "react-router";
import { Alert, Button } from "rsuite";
import { database, storage } from "../../../misc/firebase";
import { groupBy, transformToArrayWithId } from "../../../misc/helpers";
import MessageItem from "./MessageItem";
import { auth } from "../../../misc/firebase";

const PAGE_SIZE = 15;
const messagesRef = database.ref("/messages"); //getting ref of messages from database

const Messages = () => {
  const { chatId } = useParams();
  const [messages, setMessages] = useState(null);

  const [limit, setLimit] = useState(PAGE_SIZE);

  const isChatEmpty = messages && messages.length === 0;
  const canShowMessage = messages && messages.length > 0;

  const loadMessages = useCallback(
    (limitToLast) => {
      messagesRef.off();

      // adding realtime listener on value which gives snapshot of the whole data present in the room where room id is equal to chat id
      //adding msg data to messages
      messagesRef
        .orderByChild("roomId")
        .equalTo(chatId)
        .limitToLast(limitToLast || PAGE_SIZE)
        .on("value", (snap) => {
          const data = transformToArrayWithId(snap.val());
          setMessages(data);
        });
      setLimit((p) => p + PAGE_SIZE);
    },
    [chatId]
  );

  const onLoadMore = useCallback(() => {
    loadMessages(limit);
  }, [loadMessages, limit]);

  useEffect(() => {
    loadMessages();
    // unsubscribing to the subscription using clean up function for useEffect
    return () => {
      messagesRef.off("value");
    };
  }, [loadMessages]);

  //function to handle admin permissions
  const handleAdmin = useCallback(
    async (uid) => {
      const adminsRef = database.ref(`/rooms/${chatId}/admins`);
      let alertMsg;

      await adminsRef.transaction((admins) => {
        if (admins) {
          if (admins[uid]) {
            admins[uid] = null; //making uid null will delete the record from firebase as it does not stores null records
            alertMsg = "Admin permission removed.";
          } else {
            admins[uid] = true;
            alertMsg = "Admin permissioned granted.";
          }
        }
        return admins;
      });

      Alert.info(alertMsg, 4000);
    },
    [chatId]
  );

  const handleLike = useCallback(async (msgId) => {
    const { uid } = auth.currentUser;
    const messageRef = database.ref(`/messages/${msgId}`);
    let alertMsg;

    await messageRef.transaction((msg) => {
      if (msg) {
        // if msg.likes exist and current user has liked it
        if (msg.likes && msg.likes[uid]) {
          msg.likeCount -= 1;
          msg.likes[uid] = null; //making uid null will delete the record from firebase as it does not stores null records
          alertMsg = "Message Unliked!";
        } else {
          msg.likeCount += 1;

          // if msg.likes does not exist(no one hasliked that msg) then initialize it
          if (!msg.likes) {
            msg.likes = {};
          }

          msg.likes[uid] = true;
          alertMsg = "Message Liked!";
        }
      }
      return msg;
    });

    Alert.info(alertMsg, 4000);
  }, []);

  /** function to delete a message */
  const handleDelete = useCallback(
    async (msgId, file) => {
      if (!window.confirm("Delete this message?")) {
        return;
      }

      /** checking if msg to be deleted is last msg by getting the id of last message and comparing it with the current msg chosen to be deleted */
      const isLast = messages[messages.length - 1].id === msgId;

      //initializing an empty object to perform atomic function
      const updates = {};

      updates[`messages/${msgId}`] = null; //to delete the msg

      /** if msg is last msg and is not the only msg left */
      if (isLast && messages.length > 1) {
        updates[`/rooms/${chatId}/lastMessage`] = {
          ...messages[messages.length - 2],
          msgId: messages[messages.length - 2].id,
        };
      }

      /**if msg is last msg and is the only msg left */
      if (isLast && messages.length === 1) {
        updates[`/rooms/${chatId}/lastMessage`] = null;
      }

      /** updating the database with update method means actually deleting the msg from db */
      try {
        await database.ref().update(updates);
        Alert.info("Message Deleted!", 4000);
      } catch (err) {
        return Alert.error(err.message);
      }

      /** deleting a file from storage */
      if (file) {
        try {
          const fileRef = storage.refFromURL(file.url);
          await fileRef.delete();
        } catch (err) {
          Alert.error(err.message);
        }
      }
    },
    [chatId, messages]
  );

  /** function to render messages */
  const renderMessages = () => {
    const groups = groupBy(messages, (item) =>
      new Date(item.createdAt).toDateString()
    );

    const items = [];

    Object.keys(groups).forEach((date) => {
      items.push(
        <li key={date} className="text-center mb-1 padded">
          {date}
        </li>
      );

      const msgs = groups[date].map((msg) => (
        <MessageItem
          key={msg.id}
          message={msg}
          handleAdmin={handleAdmin}
          handleLike={handleLike}
          handleDelete={handleDelete}
        />
      ));
      items.push(...msgs);
    });
    return items;
  };

  return (
    <ul className="msg-list custom-scroll">
      {messages && messages.length >= 1 && (
        <li className="text-center mt-2 mb-2">
          <Button color="green" onClick={onLoadMore}>
            Load More
          </Button>
        </li>
      )}
      {isChatEmpty && <li>No messages yet!</li>}
      {canShowMessage && renderMessages()}
    </ul>
  );
};

export default Messages;
