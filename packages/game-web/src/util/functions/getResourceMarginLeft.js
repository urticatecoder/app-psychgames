import {
  ResourceNames,
  ResourceMargins,
} from "../constants/game_two/GameTwoBundler";

/**
 * Function used to get formatting for buttons and bars associated with resources used in Game Two.
 * This is used to position resource buttons and bars such that they are vertically on top of one another.
 *
 * @author Eric Doppelt
 */
function getResourceMarginLeft(resource) {
  switch (resource) {
    case ResourceNames.KEEP:
      return ResourceMargins.KEEP;
    case ResourceNames.INVEST:
      return ResourceMargins.INVEST;
    case ResourceNames.COMPETE:
      return ResourceMargins.COMPETE;
    default:
      return ResourceMargins.DEFAULT;
  }
}

export default getResourceMarginLeft;
