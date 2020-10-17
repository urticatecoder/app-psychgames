import React from 'react';
import '../../CommonStylings/FullScreenDiv.css'
import PlayerProfile from '../../Avatars/Components/PlayerProfile.js';


function PlayerColumn(props) {
    return (
        <div style={{marginTop: props.height + 'vh', backgroundColor: '#ff0fff'} }>
            <PlayerProfile player={props.player}/>
        </div>
    )
}

export default (PlayerColumn);