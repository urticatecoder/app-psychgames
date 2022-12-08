import React from 'react';
import getImage from './getImage';
import { withStyles } from "@material-ui/core";

const LABEL = 'label'
const SELF = "#faf3b1";
const BORDER_RADIUS = 30;

/**
 * Component used to visualize avatars with a label indicating the avatar's name beneath it.
 * This is used in the PlayerGroup, VerticalPlayerGroup, and MainAvatar files.
 * @param {*} props tells the player to visualize based on its index.
 * 
 * @author Eric Doppelt
 */
function PlayerProfile(props) {
    // find avatar index using player id and player data
    // console.log("player id: ", props.playerId);
    // console.log("player data: ", props.playerData);
    // console.log("self id: ", props.id);
    var avatarIndex = 0;
    var isSelf = false;
    for (var i = 0; i < props.playerData.length; i++) {
        if (props.playerId == props.playerData[i].id) {
            avatarIndex = props.playerData[i].avatar;
        }
    }
    if (props.playerId == props.id) {
        return(
            <div
            style={{ backgroundColor: SELF, borderRadius: BORDER_RADIUS }}
            >
                <div>
                    {getImage(avatarIndex, props.selectedIndex, props.frontendIndex, isSelf)}
                </div>
            </div>
        )
    } else {
        return(
            <div>
                {getImage(avatarIndex, props.selectedIndex, props.frontendIndex, isSelf)}
            </div>
        )
    }    
}


export default (PlayerProfile);