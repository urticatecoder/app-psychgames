import React from "react";
import { useSpring, animated } from "react-spring";
import PlayerButton from "../../icons/components/PlayerButton.js";

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
    <animated.div style={{ ...spring, display: "inline-block" }}>
      <PlayerButton
        player={props.player}
        onSelect={props.onSelect}
        double={props.double}
        triple={props.triple}
        selected={props.selected}
      />
    </animated.div>
  );
}

export default PlayerColumn;
