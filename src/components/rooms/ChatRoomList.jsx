import React from "react";
import RoomItem from "./RoomItem";
import { Nav } from "rsuite";
import NavItem from "rsuite/lib/Nav/NavItem";

const ChatRoomList = ({ aboveElHeight }) => {
  return (
    <Nav
      appearance="subtle"
      vertical
      reversed
      className="overflow-y-scroll custom-scroll"
      style={{
        height: `calc(100% - ${aboveElHeight})px`,
      }}
    >
      <NavItem>
        <RoomItem />
      </NavItem>
    </Nav>
  );
};

export default ChatRoomList;
