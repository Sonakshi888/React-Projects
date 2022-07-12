import React from "react";
import { Button, Modal } from "rsuite";
import { useModalState } from "../../../misc/custom-hooks";
import ProfileAvatar from "../../ProfileAvatar";

const ProfileInfoBtnModal = ({ profile, children, ...btnProps }) => {
  const { isOpen, close, open } = useModalState();
  const { name, avatar, createdAt } = profile;
  const shortName = name.split(" ")[0];
  const memberSince = new Date(createdAt).toLocaleDateString();

  return (
    <>
      <Button {...btnProps} onClick={open}>
        {shortName}
      </Button>
      <Modal show={isOpen} isHide={close}>
        <Modal.Header>
          <Modal.Title>{shortName} Profile</Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center">
          <ProfileAvatar
            className="width-200 height-200 img-fullsize font-huge"
            src={avatar}
            name={name}
          />
          <h4 className="mt-2">{name}</h4>
          <p>Member Since {memberSince}</p>
        </Modal.Body>
        <Modal.Footer>
          {children}
          <Button block onClick={close}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default ProfileInfoBtnModal;
