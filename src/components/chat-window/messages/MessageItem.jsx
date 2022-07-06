import React from "react";
import ProfileAvatar from "../../ProfileAvatar";
import TimeAgo from "react-timeago";
import ProfileInfoBtnModal from "./ProfileInfoBtnModal";

const MessageItem = ({ message }) => {
  const { author, createdAt, text } = message;
  return (
    <li className="padded mb-1">
      <div className="d-flex align-items-center font-bolder mb-1">
        <ProfileAvatar
          src={author.avatar}
          name={author.name}
          size="xs"
          className="ml-1"
        />
        <ProfileInfoBtnModal
          profile={author}
          appearance="link"
          className="p-0 ml-1 text-black"
        />
        <TimeAgo date={createdAt} className="font-normal text-black-45 ml-2" />
      </div>
      <div>
        <span className="word-break-all">{text}</span>
      </div>
    </li>
  );
};

export default MessageItem;
