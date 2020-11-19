import React from "react";
import PlayerProfile from "./PlayerProfile";
import { Grid } from "@material-ui/core";

const GRID_DIRECTION = "row";
const GRID_JUSTIFY = "center";
const GRID_SPACING = 10;

/**
 * Component used in the Summary screen which visualizes multiple Player Profiles in a horizontal grid.
 * @param {} props tells which players to visualize in the Group.
 * 
 * @author Eric Doppelt
 */
function PlayerGroup(props) {
  return (
    <Grid
      container
      direction={GRID_DIRECTION}
      justify={GRID_JUSTIFY}
      spacing={GRID_SPACING}
    >
      {props.players.map((element) => {
        return (
          <Grid item>
            <PlayerProfile player={element} />
          </Grid>
        );
      })}
    </Grid>
  );
}

export default PlayerGroup;
