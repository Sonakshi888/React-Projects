import React from "react";
import { useCallback } from "react";
import { useState } from "react";
import { InputGroup, Input, Icon, Alert } from "rsuite";
import firebase from "firebase/compat/app";
import { useParams } from "react-router";
import { useProfile } from "../../../context/profile.context";
import { database } from "../../../misc/firebase";
import AttachmentBtnModal from "./AttachmentBtnModal";
import AudioMsgBtn from "./AudioMsgBtn";

/** function to assemble the messages */
function assembleMessage(profile, chatId) {
  return {
    roomId: chatId,
    createdAt: firebase.database.ServerValue.TIMESTAMP,
    author: {
      name: profile.name,
      uid: profile.uid,
      createdAt: profile.createdAt,
      ...(profile.avatar ? { avatar: profile.avatar } : {}),
    },
    likeCount: 0,
  };
}

const Bottom = () => {
  const { chatId } = useParams(); //get chat id from parameters
  const { profile } = useProfile(); //get profile data using useProfile context provider
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  /** input change hanler */
  const onInputChange = useCallback((value) => {
    setInput(value);
  }, []);

  /**  send button handler */
  const onSendClick = async () => {
    if (input.trim() === "") {
      return;
    }
    const msgData = assembleMessage(profile, chatId); //first get the earlier msgs data
    msgData.text = input; //second, append new message to the already existing msgs

    const updates = {}; //an empty object

    const messageId = database.ref("messages").push().key; //getting the unique key for new message
    updates[`messages/${messageId}`] = msgData; //setting the object with the message

    updates[`rooms/${chatId}/lastMessage`] = {
      //setting the object with room's new data i,e. last message
      ...msgData,
      msgId: messageId,
    };

    setIsLoading(true);

    // saving message to the realtime firebase database
    try {
      await database.ref().update(updates);
      setInput("");
      setIsLoading(false);
    } catch (err) {
      Alert.error(err.message);
      setIsLoading(false);
    }
  };

  /** function to call onsendclick when enter is pressed to send the message */
  const onKeyDown = (ev) => {
    if (ev.keyCode === 13) {
      ev.preventDefault();
      onSendClick();
    }
  };

  /** function to handle after file upload */
  const afterUpload = useCallback(
    async (files) => {
      setIsLoading(true);
      const updates = {};

      /** assembling msg for each file from files array */
      files.forEach((file) => {
        const msgData = assembleMessage(profile, chatId); //first get the earlier msgs data
        msgData.file = file;

        const messageId = database.ref("messages").push().key; //getting the unique key for new message
        updates[`messages/${messageId}`] = msgData; //setting the object with the message
      });

      /** getting the last message */
      const lastMsgId = Object.keys(updates).pop();

      updates[`rooms/${chatId}/lastMessage`] = {
        //setting the object with room's new data i,e. last message
        ...updates[lastMsgId],
        msgId: lastMsgId,
      };

      try {
        await database.ref().update(updates);
        setIsLoading(false);
      } catch (err) {
        Alert.error(err.message);
        setIsLoading(false);
      }
    },
    [chatId, profile]
  );

  return (
    <div>
      <InputGroup>
        <AttachmentBtnModal afterUpload={afterUpload} />
        <AudioMsgBtn afterUpload={afterUpload} />
        <Input
          placeholder="Write a new message here..."
          value={input}
          onChange={onInputChange}
          onKeyDown={onKeyDown}
        />
        <InputGroup.Button
          color="blue"
          appearance="primary"
          onClick={onSendClick}
          disabled={isLoading}
        >
          <Icon icon="send" />
        </InputGroup.Button>
      </InputGroup>
    </div>
  );
};

export default Bottom;
