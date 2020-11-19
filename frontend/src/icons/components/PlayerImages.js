import React from "react";

import Flame from "../images/shapes/flame.png";
import Arrow from "../images/shapes/arrow.png";
import Cross from "../images/shapes/cross.png";
import Headset from "../images/shapes/headset.png";
import Leaves from "../images/shapes/leaves.png";
import Triangle from "../images/shapes/triangle.png";

const IMAGE_HEIGHT = "85vh";
const IMAGE_WIDTH = "85vw";

const FLAME_ID = "flame";
const ARROW_ID = "arrow";
const CROSS_ID = "cross";
const HEADSET_ID = "headset";
const LEAVES_ID = "leaves";
const TRIANGLE_ID = "triangle";

const FLAME_LABEL = "Flame";
const ARROW_LABEL = "Arrow";
const CROSS_LABEL = "Cross";
const HEADSET_LABEL = "Headset";
const LEAVES_LABEL = "Leaves";
const TRIANGLE_LABEL = "Triangle";

/**
 * Constant that holds images, names, and labels for every avatar used in both games.
 * Avatars are accessed by indices from 0 to 5, where 0 is the main player.
 *
 * @author Eric Doppelt
 */

function getPlayer(image, id) {
  return (
    <img
      src={image}
      id={id}
      alt={id}
      width={IMAGE_HEIGHT}
      height={IMAGE_WIDTH}
    />
  );
}
const PLAYER_ZERO = getPlayer(Flame, CROSS_ID);
const PLAYER_ONE = getPlayer(Triangle, FLAME_ID);
const PLAYER_TWO = getPlayer(Cross, TRIANGLE_ID);
const PLAYER_THREE = getPlayer(Arrow, ARROW_ID);
const PLAYER_FOUR = getPlayer(Headset, HEADSET_ID);
const PLAYER_FIVE = getPlayer(Leaves, LEAVES_ID);

const PlayerInfo = {
  0: PLAYER_ZERO,
  name0: FLAME_ID,
  label0: FLAME_LABEL,
  1: PLAYER_ONE,
  name1: TRIANGLE_ID,
  label1: TRIANGLE_LABEL,
  2: PLAYER_TWO,
  name2: CROSS_ID,
  label2: CROSS_LABEL,
  3: PLAYER_THREE,
  name3: ARROW_ID,
  label3: ARROW_LABEL,
  4: PLAYER_FOUR,
  name4: HEADSET_ID,
  label4: HEADSET_LABEL,
  5: PLAYER_FIVE,
  name5: LEAVES_ID,
  label5: LEAVES_LABEL,
};

export default PlayerInfo;
