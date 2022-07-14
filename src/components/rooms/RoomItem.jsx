import React from "react";
import TimeAgo from "react-timeago";
import ProfileAvatar from "../ProfileAvatar";

const RoomItem = ({ room }) => {
  const { createdAt, name, lastMessage } = room;  //getting all the data from room
  return (
    <div>
      <div className="d-flex justify-content-between align-items-center">
        <h3 className="text-disappear">{name}</h3>
        <TimeAgo
          className="font-normal text-black-45"
          date={
            lastMessage ? new Date(lastMessage.createdAt) : new Date(createdAt)
          }
        />{" "}
      </div>
      <div className="d-flex align-items-center text-black-70">
        {lastMessage ? (
          <>
            <div className="d-flex align-items-center">
              <ProfileAvatar
                src={lastMessage.author.avatar}
                name={lastMessage.author.name}
                size="sm"
              />
            </div>
            <div className="text-disappeat ml-2">
              <div className="italic">{lastMessage.author.name}</div>
              <span>{lastMessage.text || lastMessage.file.name}</span>
            </div>
          </>
        ) : (
          <span>No messages yet...</span>
        )}
      </div>
    </div>
  );
};

export default RoomItem;
