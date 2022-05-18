import React, { useState } from "react";
import { useModalState } from "../../misc/custom-hooks";
import { Button, Modal, Alert } from "rsuite";
import AvatarEditor from "react-avatar-editor";

const fileInputTypes = ".png, .jpeg, .jpg";
const acceptedFileTypes = ["image/png", "image/jpg", "image/jpeg"];
const isValidFile = (file) => acceptedFileTypes.includes(file.type);

const AvatarUploadBtn = () => {
  const [img, setImg] = useState(null);
  const { isOpen, open, close } = useModalState();
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
  return (
    <div className="mt-3 text-center">
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
                <AvatarEditor
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
            <Button block appearance="ghost">
              Upload New Avatar
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </div>
  );
};

export default AvatarUploadBtn;
