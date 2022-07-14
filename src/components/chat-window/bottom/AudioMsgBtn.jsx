import React, { useCallback, useState } from "react";
import { InputGroup, Icon, Alert } from "rsuite";
import { ReactMic } from "react-mic";
import { storage } from "../../../misc/firebase";
import { useParams } from "react-router";

const AudioMsgBtn = ({ afterUpload }) => {
  const { chatId } = useParams();
  const [isRecording, setIsRecording] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  /** function to upload the audio */
  const onUpload = useCallback(
    async (data) => {
      try {
        setIsUploading(true);
        const snap = await storage
          .ref(`/chat/${chatId}`)
          .child(`audio_${Date.now()}.mp3`)
          .put(data.blob, {
            cacheControl: `public, max-age=${3600 * 24 * 3}`,
          });

        /** object to be stored in the database */
        const file = {
          contentType: snap.metadata.contentType,
          name: snap.metadata.name,
          url: await snap.ref.getDownloadURL(),
        };

        /** calling after upload to upload the file to database */
        afterUpload([file]);

        /** when uploading is finished */
        setIsUploading(false);
      } catch (err) {
        setIsUploading(false);
        Alert.error(err.message);
      }
    },
    [afterUpload, chatId]
  );

  /** function to run when the mic is clicked */
  const onClick = useCallback(() => {
    setIsRecording((p) => !p);
  }, []);

  return (
    <>
      <InputGroup.Button
        onClick={onClick}
        disabled={isUploading}
        className={isRecording ? "animate-blink" : ""}
      >
        <Icon icon="microphone" />
        <ReactMic
          record={isRecording}
          className="d-none"
          /** onStop property gives us the recorded data */
          onStop={onUpload}
          mimeType="audio/mp3"
        />
      </InputGroup.Button>
    </>
  );
};

export default AudioMsgBtn;
