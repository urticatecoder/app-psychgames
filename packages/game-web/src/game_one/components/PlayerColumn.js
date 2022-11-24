import React, { useState, useEffect } from "react";
import { useSpring, animated } from "react-spring";
import PlayerButton from "../../icons/components/PlayerButton.js";
import "./PlayerColumn.css"

const IN_LINE = "inline-block";

const LARGE_WIDTH_THRESHOLD = 1275;
const MEDIUM_WIDTH_THRESHOLD = 1075;

const LARGE_SIZE = '85';
const MEDIUM_SIZE = '75';
const SMALL_SIZE = '65';

/**
 * Component used to animate an avatar up and down the screen in Game One.
 * @param {*} props tell where the avatars movement should start and where it should end.
 * 
 * @author Eric Doppelt
 */
function PlayerColumn(props) {
  const spring = useSpring({
    from: {
      marginTop: props.from + "vh",
    },
    to: {
      marginTop: props.to + "vh",
    },
    config: {
      mass: 8,
    },
  });

  const [animation, setAnimation] = useState(0);
  let doAnimate = props.doAnimate;

  useEffect(() => {
    if (doAnimate === true) {
      setAnimation(1);
    }
    const timer = setTimeout(() => {
      setAnimation(0);
    }, 1000);
  }, [props.doAnimate]);

  var size = getSize(props.windowWidth) * 0.8;
  var height = props.windowHeight * 72 / 100;

  return (
    <div className="lane-bg-container" style={{height:height}}>
      <div className="lane-bg" style={{backgroundSize: size, width: size}} animation={animation}></div>
      <animated.div className="player-icon" style={{ ...spring, display: IN_LINE}}>
        <PlayerButton
          player={props.player}
          avatar={props.avatar}
          onSelect={props.onSelect}
          single={props.single}
          double={props.double}
          triple={props.triple}
          selected={props.selected}
          disabled={props.disabled}
          selectedIndex={props.selectedIndex}
          windowWidth={props.windowWidth}
          frontendIndex={props.frontendIndex}
          isSelf={props.isSelf}
        />
      </animated.div>
    </div>
  );
}

function getSize(windowWidth) {
  if (windowWidth >= LARGE_WIDTH_THRESHOLD) return LARGE_SIZE;
  else if (windowWidth >= MEDIUM_WIDTH_THRESHOLD) return MEDIUM_SIZE;
  else return SMALL_SIZE;
}

export default PlayerColumn;
