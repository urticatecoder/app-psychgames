import React from 'react';
import '../../CommonStylings/FullScreenDiv.css'
import { Spring } from "react-spring/renderprops";

const GROUP_ONE = 1
const GROUP_TWO = 2
function ResourceBar(props) {
    
    const FULL_DIV = 'fullDiv';
    let resourcePercent = (props.amount / props.total)

    return (
        <Spring from={{ percent: 0 }} to={{ percent: resourcePercent}}>
          {({ percent }) => (
            <div className="progress vertical">
              <div style={{ height: `${percent}%` }} className="progress-bar">
                <span className="sr-only">{`${resourcePercent}%`}</span>
              </div>
            </div>
          )}
        </Spring>
      );
}

export default (ResourceBar);