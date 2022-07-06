import React, { useState, useRef } from "react";
import { useModalState } from "../../misc/custom-hooks";
import { Button, Modal, Alert } from "rsuite";
import AvatarEditor from "react-avatar-editor";
import { database, storage } from "../../misc/firebase";
import { useProfile } from "../../context/profile.context";
import ProfileAvatar from "../ProfileAvatar";
import { getUserUpdates } from "../../misc/helpers";

const fileInputTypes = ".png, .jpeg, .jpg";
const acceptedFileTypes = ["image/png", "image/jpg", "image/jpeg"];
const isValidFile = (file) => acceptedFileTypes.includes(file.type);

/** function to change canvas to blob type */
const getBlob = (canvas) => {
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) {
        resolve(blob);
      } else {
        reject(new Error("File Process Error!"));
      }
    });
  });
};

/** function to run when to upload a file */
const AvatarUploadBtn = () => {
  const [img, setImg] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { profile } = useProfile();
  const { isOpen, open, close } = useModalState();
  const avatarEditorRef = useRef();

  /** getting file */
  const onFileInputChange = (ev) => {
    const currFiles = ev.target.files;
    if (currFiles.length === 1) {
      const file = currFiles[0];
      if (isValidFile(file)) {
        setImg(file);
        open();
      } else {
        Alert.warning(`Wrong file type ${file.type}`, 4000);
      }
    }
  };

  /** function to upload the file to firebase storage */
  const onUploadClick = async () => {
    const canvas = avatarEditorRef.current.getImageScaledToCanvas(); //we cannot work directly with canvas
    setIsLoading(true);
    try {
      const blob = await getBlob(canvas); //calling getBlob function

      /** storing avatar in "Storage" */
      const avatarFileRef = storage
        .ref(`/profile/${profile.uid}`)
        .child("avatar");
      const uploadAvatarResult = await avatarFileRef.put(blob, {
        cacheControl: `public, max-age=${3600 * 24 * 3}`,
      });

      const downloadUrl = await uploadAvatarResult.ref.getDownloadURL();

      /** storing avatar in database */

      const updates = await getUserUpdates(
        profile.uid,
        "avatar",
        downloadUrl,
        database
      );
      await database.ref().update(updates);

      setIsLoading(false);
      Alert.info("Avatar has been updated!", 4000);
    } catch (err) {
      setIsLoading(false);
      Alert.error(err.message, 4000);
    }
  };

  return (
    <div className="mt-3 text-center">
      <ProfileAvatar
        className="width-200 height-200 img-fullsize font-huge"
        src={profile.avatar}
        name={profile.name}
      />
      <div>
        <label
          htmlFor="avatar-upload"
          className="d-block cursor-pointer padded"
        >
          Select new avatar
          <input
            id="avatar-upload"
            type="file"
            className="d-none"
            accept={fileInputTypes}
            onChange={onFileInputChange}
          />
        </label>
        <Modal show={isOpen} onHide={close}>
          <Modal.Header>
            <Modal.Title>Adjust and Upload New Avatar</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="d-flex justify-content-center align-items-center h-100">
              {img && (
                <AvatarEditor //using imported component
                  ref={avatarEditorRef}
                  image={img}
                  width={200}
                  height={200}
                  border={10}
                  rotate={0}
                  borderRadius={100}
                />
              )}
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button
              block
              appearance="ghost"
              onClick={onUploadClick}
              disable={isLoading}
            >
              Upload New Avatar
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </div>
  );
};

export default AvatarUploadBtn;
