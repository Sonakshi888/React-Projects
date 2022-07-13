import React, { memo } from "react";
import ProfileAvatar from "../../ProfileAvatar";
import TimeAgo from "react-timeago";
import ProfileInfoBtnModal from "./ProfileInfoBtnModal";
import PresenceDot from "../../PresenceDot";
import { useCurrentRoom } from "../../../context/current-room.context";
import { auth } from "../../../misc/firebase";
import { Button } from "rsuite";
import IconBtnControl from "./IconBtnControl";
import { useMediaQuery } from "../../../misc/custom-hooks";

const MessageItem = ({ message, handleAdmin, handleLike, handleDelete }) => {
  const { author, createdAt, text, likes, likeCount } = message;

  // consts to manage the grant permissions
  const isAdmin = useCurrentRoom((v) => v.isAdmin);
  const admins = useCurrentRoom((v) => v.admins);

  const isMsgAuthorAdmin = admins.includes(author.uid);

  const isAuthor = auth.currentUser.uid === author.uid;
  const canGrantAdmin = isAdmin && !isAuthor;

  // const to manage the like functionality
  const isMobile = useMediaQuery("(max-width: 992px)");
  // const [selfRef, isHovered] = useHover();
  
  //if likes exist and getting the keys of likes object and finding if current user has liked the message
  const isLiked = likes && Object.keys(likes).includes(auth.currentUser.uid);
  // const canShowIcons = isMobile || isHovered;

  return (
    // <li
    //   className={`padded mb-1 cursor-pointer ${isHovered ? "bg-black-02" : ""}`}
    //   ref={selfRef}
    // >
    <li className="padded mb-1">
      <div className="d-flex align-items-center font-bolder mb-1">
        <PresenceDot uid={author.uid} />
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
        >
          {canGrantAdmin && (
            <Button block onClick={() => handleAdmin(author.uid)} color="blue">
              {isMsgAuthorAdmin
                ? "Remove admin permissions"
                : "Give admin in this room"}
            </Button>
          )}
        </ProfileInfoBtnModal>
        <TimeAgo date={createdAt} className="font-normal text-black-45 ml-2" />
        <IconBtnControl
          {...(isLiked ? { color: "red" } : {})}
          // isVisible={canShowIcons}
          isVisible
          iconName="heart"
          tooltip="Like this message"
          onClick={() => handleLike(message.id)}
          badgeContent={likeCount}
        />
        {isAuthor && (
          <IconBtnControl
            // isVisible={canShowIcons}
            isVisible
            iconName="close"
            tooltip="Delete this message"
            onClick={() => handleDelete(message.id)}
          />
        )}
      </div>
      <div>
        <span className="word-break-all">{text}</span>
      </div>
    </li>
  );
};

export default memo(MessageItem);
