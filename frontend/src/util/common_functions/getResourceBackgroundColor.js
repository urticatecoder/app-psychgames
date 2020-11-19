import {
  ResourceNames,
  ResourceColors,
} from "../common_constants/game_two/GameTwoBundler";

/**
 * Function used in Game Two to get the background color associated with various resources.
 * This is used in the buttons and vertical bars dispalyed in Game Two.
 *
 * @author Eric Doppelt
 */
function getResourceBackgroundColor(resource) {
  switch (resource) {
    case ResourceNames.KEEP:
      return ResourceColors.KEEP;
    case ResourceNames.INVEST:
      return ResourceColors.INVEST;
    case ResourceNames.COMPETE:
      return ResourceColors.COMPETE;
    default:
      return ResourceColors.DEFAULT;
  }
}

export default getResourceBackgroundColor;
