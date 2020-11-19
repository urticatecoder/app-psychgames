import "../../common/common_stylings/FullScreenDiv.css";
import ColumnController from "./ColumnController";
import React from "react";

const FULL_DIV = "fullDiv";

function GameOne(props) {
  return (
    <div className={FULL_DIV}>
      <ColumnController
        setWinners={props.setWinners}
        setLosers={props.setLosers}
        loginCode={props.loginCode}
        allLoginCodes={props.allLoginCodes}
      />
    </div>
  );
}

export default GameOne;
