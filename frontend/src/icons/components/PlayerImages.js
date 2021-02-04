import React from "react";

import GameImage from './GameImage';

import Arrow from "../images/shapes/arrow.png";
import Cross from "../images/shapes/cross.png";
import Headset from "../images/shapes/headset.png";
import Leaves from "../images/shapes/leaves.png";
import Triangle from "../images/shapes/triangle.png";

const IMAGE_HEIGHT = "85vh";
const IMAGE_WIDTH = "85vw";

const ARROW_ID = "arrow";
const CROSS_ID = "cross";
const HEADSET_ID = "headset";
const LEAVES_ID = "leaves";
const TRIANGLE_ID = "triangle";

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

const PlayerInfo = {
  image1: Triangle,
  name1: TRIANGLE_ID,
  label1: TRIANGLE_LABEL,
  image2: Cross,
  name2: CROSS_ID,
  label2: CROSS_LABEL,
  image3: Arrow,
  name3: ARROW_ID,
  label3: ARROW_LABEL,
  image4: Headset,
  name4: HEADSET_ID,
  label4: HEADSET_LABEL,
  image5: Leaves,
  name5: LEAVES_ID,
  label5: LEAVES_LABEL,
};

export default PlayerInfo;
