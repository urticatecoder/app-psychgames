import React from 'react';
import { useSpring, animated } from 'react-spring';
import PlayerButton from '../../icons/components/PlayerButton.js';

function PlayerColumn(props) {
    const spring = useSpring({
        from: {
          marginTop: props.from + 'vh',
        },
        to: {
          marginTop: props.to + 'vh',
        },
        config: {
          mass: 8,
        },
      });
    return (
        <animated.div style={{ ...spring, display: 'inline-block' }}>
            <PlayerButton player={props.player} onSelect={props.onSelect} double={props.double} triple={props.triple} selected={props.selected} />
        </animated.div>
    )
}

export default (PlayerColumn);