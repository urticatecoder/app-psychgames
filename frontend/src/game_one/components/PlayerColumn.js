import React from "react";
import { useSpring, animated } from "react-spring";
import PlayerButton from "../../icons/components/PlayerButton.js";

const IN_LINE = "inline-block";
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
  return (
    <animated.div style={{ ...spring, display: IN_LINE}}>
      <PlayerButton
        player={props.player}
        onSelect={props.onSelect}
        double={props.double}
        triple={props.triple}
        selected={props.selected}
        disabled={props.disabled}
        selectedIndex={props.selectedIndex}
      />
    </animated.div>
  );
}

export default PlayerColumn;
