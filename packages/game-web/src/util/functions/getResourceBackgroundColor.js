import {
  ResourceNames,
  ResourceColors,
} from "../constants/game_two/GameTwoBundler";

const BAR = "Bar"
/**
 * Function used in Game Two to get the background color associated with various resources.
 * This is used in the buttons and vertical bars dispalyed in Game Two.
 *
 * @author Eric Doppelt
 */
function getResourceBackgroundColor(resource) {
  switch (resource) {
    case ResourceNames.KEEP:
      return ResourceColors.DARK;
    case ResourceNames.KEEP + BAR:
      return ResourceColors.LIGHT;
    case ResourceNames.INVEST:
      return ResourceColors.DARK;
    case ResourceNames.INVEST + BAR:
      return ResourceColors.LIGHT;
    case ResourceNames.COMPETE:
      return ResourceColors.DARK;
    case ResourceNames.COMPETE + BAR:
      return ResourceColors.LIGHT;
    default:
      return ResourceColors.DEFAULT;
  }
}

export default getResourceBackgroundColor;
