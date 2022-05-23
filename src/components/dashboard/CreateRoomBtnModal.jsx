import React, { useCallback, useRef, useState } from "react";
import {
  Button,
  Modal,
  Icon,
  Form,
  FormGroup,
  ControlLabel,
  FormControl,
  Schema,
  Alert,
} from "rsuite";
import { useModalState } from "../../misc/custom-hooks";
import firebase from "firebase/compat/app";
import { database } from "../../misc/firebase";

/** setting validation schema rules to validate form */
const { StringType } = Schema.Types;
const model = Schema.Model({
  name: StringType().isRequired("Chat name is required"),
  description: StringType().isRequired("Description is required"),
});

/** initial values for the form */
const INITIAL_FORM = {
  name: "",
  description: "",
};

const CreateRoomBtnModal = () => {
  const { isOpen, open, close } = useModalState();
  const [formValue, setFormValue] = useState(INITIAL_FORM);
  // console.log("formValue", formValue);
  const [isLoading, setIsLoading] = useState(false);
  const formRef = useRef();

  /** when an rsuite form is changed, it gives the value of the entire form */
  const onFormChange = useCallback((value) => {
    setFormValue(value);
  }, []);

  /** when the form is submitted */
  const onSubmit = async () => {
    /** if validation is false, check is the function of rsuite function */
    if (!formRef.current.check()) {
      return;
    }
    /** performing database operation */
    setIsLoading(true);
    const newRoomdata = {
      ...formValue,
      createdAt: firebase.database.ServerValue.TIMESTAMP,
    };
    try {
      await database.ref("rooms").push(newRoomdata);
      setIsLoading(false);
      setFormValue(INITIAL_FORM);
      Alert.info(`${formValue.name} has been created`, 4000);
      close();
    } catch (err) {
      setIsLoading(true);
      Alert.error(err.message, 4000);
    }
  };

  return (
    <div className="mt-1">
      <Button block color="green" onClick={open}>
        <Icon icon="creative" /> Create New Room Modal
      </Button>
      <Modal show={isOpen} onHide={close}>
        <Modal.Header>
          <Modal.Title>New Chat Room</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form
            fluid
            onChange={onFormChange}
            formValue={formValue}
            model={model}
            ref={formRef}
            disabled={isLoading}
          >
            <FormGroup>
              <ControlLabel>Room Name</ControlLabel>
              <FormControl name="name" placeholder="Enter chat room name..." />
            </FormGroup>
            <FormGroup>
              <ControlLabel>Description</ControlLabel>
              <FormControl
                componentClass="textarea"
                rows={5}
                name="description"
                placeholder="Enter room description..."
              />
            </FormGroup>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button block appearance="primary" onClick={onSubmit}>
            Create New Chat Room
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default CreateRoomBtnModal;
