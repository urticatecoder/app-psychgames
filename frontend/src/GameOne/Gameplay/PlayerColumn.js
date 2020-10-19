import React from 'react';
import PlayerProfile from '../../Avatars/Components/PlayerProfile.js';
import { useSpring, animated } from 'react-spring';

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
            <PlayerProfile player={props.player}/>
        </animated.div>
    )
}

export default (PlayerColumn);