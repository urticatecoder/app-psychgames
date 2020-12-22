import React from 'react';
import getImage from './getImage';
const LABEL = 'label'

/**
 * Component used to visualize avatars with a label indicating the avatar's name beneath it.
 * This is used in the PlayerGroup, VerticalPlayerGroup, and MainAvatar files.
 * @param {*} props tells the player to visualize based on its index.
 * 
 * @author Eric Doppelt
 */
function PlayerProfile(props) {
    return(
        <div>
        {getImage(props.player, props.selectedIndex)}
        </div>
    )
}


export default (PlayerProfile);