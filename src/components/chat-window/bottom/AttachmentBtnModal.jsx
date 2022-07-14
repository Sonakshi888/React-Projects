import React from "react";
import { useState } from "react";
import { useParams } from "react-router";
import { Icon, InputGroup, Modal, Button, Uploader, Alert } from "rsuite";
import { useModalState } from "../../../misc/custom-hooks";
import { storage } from "../../../misc/firebase";

const AttachmentBtnModal = ({ afterUpload }) => {
  const MAX_FILE_SIZE = 1000 * 1024 * 5; //byte * 1024 = 1MB

  const { chatId } = useParams();

  const { isOpen, open, close } = useModalState();

  const [isLoading, setIsLoading] = useState(false);

  const [fileList, setFileList] = useState([]);

  /** function to handle the selection of files */
  const onChange = (fileArr) => {
    /** filtering the fileArr by finding the actual size of file using blobFile and comparing it to max file size and then slicing them as we want 5 as maximum number of files being uploaded  */
    const filtered = fileArr
      .filter((el) => el.blobFile.size <= MAX_FILE_SIZE)
      .slice(0, 5);
    setFileList(filtered);
  };

  /** function to handle file upload */
  const onUpload = async () => {
    try {
      const uploadPromises = fileList.map((f) => {
        /** put is used for uploading to the storage */
        return storage
          .ref(`/chat/${chatId}`)
          .child(Date.now() + f.name)
          .put(f.blobFile, {
            cacheControl: `public, max-age=${3600 * 24 * 3}`,
          });
      }); //map function ended

      const uploadSnapshots = await Promise.all(uploadPromises); //getting snapshot of uploaded promises

      /** mapping the snapshots to get proper needed data to be saved in to the database */
      const shapePromises = uploadSnapshots.map(async (snap) => {
        return {
          contentType: snap.metadata.contentType,
          name: snap.metadata.name,
          url: await snap.ref.getDownloadURL(),
        };
      });

      const files = await Promise.all(shapePromises); //files that will be set to database

      await afterUpload(files);

      setIsLoading(false);
      close();
    } catch (err) {
      setIsLoading(false);
      Alert.error(err.message);
    }
  };

  return (
    <>
      <InputGroup.Button onClick={open}>
        <Icon icon="attachment" />
      </InputGroup.Button>
      <Modal show={isOpen} onHide={close}>
        <Modal.Header>
          <Modal.Title>Upload Files</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Uploader
            autoUpload={false}
            action=""
            fileList={fileList}
            onChange={onChange}
            multiple
            listType="picture-text"
            className="w-100"
            disabled={isLoading}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button block disabled={isLoading} onClick={onUpload}>
            Send to chat
          </Button>
          <div className="text-right mt-2">
            <small>*only files less than 5MB are allowed</small>
          </div>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default AttachmentBtnModal;
