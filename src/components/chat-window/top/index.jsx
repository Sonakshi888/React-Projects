import React, { memo } from "react";
import { ButtonToolbar, Icon } from "rsuite";
import { useCurrentRoom } from "../../../context/current-room.context";
import { useMediaQuery } from "../../../misc/custom-hooks";
import { Link } from "react-router-dom";
import RoomInfoBtnModal from "./RoomInfoBtnModal";

const Top = () => {
  const name = useCurrentRoom((v) => v.name); //calling useCurrentRoom context provider using name selector
  const isMobile = useMediaQuery("(max-width: 992px)");

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center">
        <h4 className="text-disappear d-flex align-items-center">
          <Icon
            icon="arrow-circle-left"
            size="2x"
            componentClass={Link}
            to="/"
            className={
              isMobile
                ? "d-inline-block p-0 mr-2 text-blue link-unstyled"
                : "d-none"
            }
          />
          <span className="text-disappear">{name}</span>
        </h4>
        <ButtonToolbar className="white-space: no-wrap;">Todo</ButtonToolbar>
      </div>
      <div className="d-flex justify-content-between align-items-center">
        <span>todo</span>
        <RoomInfoBtnModal />
      </div>
    </div>
  );
};

export default memo(Top);
