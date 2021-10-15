import BeigeTriangle from '../images/shapes/beige-triangle.png';
import BlackArrows from "../images/shapes/black-arrows.png";
import BlackEye from "../images/shapes/black-eye.png";
import BlueArrows from "../images/shapes/blue-arrows.png";
import BlueCircles from "../images/shapes/blue-circles.png";
import BluePyramids from "../images/shapes/blue-pyramids.png";
import Chainlink from "../images/shapes/chainlink.png";
import FemalePurple from "../images/shapes/female-purple.png";
import FemaleRed from "../images/shapes/female-red.png";
import GreenCircleArrow from "../images/shapes/green-circle-arrow.png";
import GreenElliptical from "../images/shapes/green-elliptical.png";
import GreenFence from "../images/shapes/green-fence.png";
import GreenLeaf from "../images/shapes/green-leaf.png";
import GreenLens from "../images/shapes/green-lens.png";
import GreenSquare from "../images/shapes/green-square.png";
import GreenTrident from "../images/shapes/green-trident.png";
import Hourglass from "../images/shapes/hourglass.png";
import MaleYellow from "../images/shapes/male-yellow.png";
import PinkSlider from "../images/shapes/pink-slider.png";
import RedX from "../images/shapes/red-x.png";
import Solar from "../images/shapes/solar.png";
import Trapezoid from "../images/shapes/trapezoid.png";
import UpArrows from "../images/shapes/up-arrows.png";
import YellowCrosshair from "../images/shapes/yellow-crosshair.png";

const BEIGE_TRIANGLE_ID = "beige-triangle";
const BLACK_ARROWS_ID = "black-arrows";
const BLACK_EYE_ID = "black-eye";
const BLUE_ARROWS_ID = "blue-arrows";
const BLUE_CIRCLES_ID = "blue-circles";
const BLUE_PYRAMIDS_ID = "blue-pyramids";
const CHAINLINK_ID = "chainlink";
const FEMALE_PURPLE_ID = "female-purple";
const FEMALE_RED_ID = "female-red";
const GREEN_CIRCLE_ARROW_ID = "green-circle-arrow";
const GREEN_ELLIPTICAL_ID = "green-elliptical";
const GREEN_FENCE_ID = "green-fence";
const GREEN_LEAF_ID = "green-leaf";
const GREEN_LENS_ID = "green-lens";
const GREEN_SQUARE_ID = "green-square";
const GREEN_TRIDENT_ID = "green-trident";
const HOURGLASS_ID = "hourglass";
const MALE_YELLOW_ID = "male-yellow";
const PINK_SLIDER_ID = "pink-slider";
const RED_X_ID = "red-X";
const SOLAR_ID = "solar";
const TRAPEZOID_ID = "trapezoid";
const UP_ARROWS_ID = "up-arrows";
const YELLOW_CROSSHAIR_ID = "yellow-crosshair";

const BEIGE_TRIANGLE_LABEL = "Beige-Triangle";
const BLACK_ARROWS_LABEL = "Black-Arrows";
const BLACK_EYE_LABEL = "Black-Eye";
const BLUE_ARROWS_LABEL = "Blue-Arrows";
const BLUE_CIRCLES_LABEL = "Blue-Circles";
const BLUE_PYRAMIDS_LABEL = "Blue-Pyramids";
const CHAINLINK_LABEL = "Chainlink";
const FEMALE_PURPLE_LABEL = "Female-Purple";
const FEMALE_RED_LABEL = "Female-red";
const GREEN_CIRCLE_ARROW_LABEL = "Green-Circle-Arrow";
const GREEN_ELLIPTICAL_LABEL = "Green-Elliptical";
const GREEN_FENCE_LABEL = "Green-Fence";
const GREEN_LEAF_LABEL = "Green-Leaf";
const GREEN_LENS_LABEL = "Green-Lens";
const GREEN_SQUARE_LABEL = "Green-Square";
const GREEN_TRIDENT_LABEL = "Green-Trident";
const HOURGLASS_LABEL = "Hourglass";
const MALE_YELLOW_LABEL = "Male-Yellow";
const PINK_SLIDER_LABEL = "Pink-Slider";
const RED_X_LABEL = "Red-X";
const SOLAR_LABEL = "Solar";
const TRAPEZOID_LABEL = "Trapezoid";
const UP_ARROWS_LABEL = "Up-Arrows";
const YELLOW_CROSSHAIR_LABEL = "Yellow-Crosshair";

/**
 * Constant that holds images, names, and labels for every avatar used in the avatar selection process.
 * Avatars are accessed by indices from 0 to 24.
 * @author Eric Doppelt
 */

const PlayerOptions = {
  name0: BEIGE_TRIANGLE_ID,
  label0: BEIGE_TRIANGLE_LABEL,
  image0: BeigeTriangle,

  name1: BLACK_ARROWS_ID,
  label1: BLACK_ARROWS_LABEL,
  image1: BlackArrows,

  name2: BLACK_EYE_ID,
  label2: BLACK_EYE_LABEL,
  image2: BlackEye,

  name3: BLUE_ARROWS_ID,
  label3: BLUE_ARROWS_LABEL,
  image3: BlueArrows,

  name4: BLUE_CIRCLES_ID,
  label4: BLUE_CIRCLES_LABEL,
  image4: BlueCircles,

  name5: BLUE_PYRAMIDS_ID,
  label5: BLUE_PYRAMIDS_LABEL,
  image5: BluePyramids,

  name6: CHAINLINK_ID,
  label6: CHAINLINK_LABEL,
  image6: Chainlink,

  name7: FEMALE_PURPLE_ID,
  label7: FEMALE_PURPLE_LABEL,
  image7: FemalePurple,

  name8: FEMALE_RED_ID,
  label8: FEMALE_RED_LABEL,
  image8: FemaleRed,

  name9: GREEN_CIRCLE_ARROW_ID,
  label9: GREEN_CIRCLE_ARROW_LABEL,
  image9: GreenCircleArrow,

  name10: GREEN_ELLIPTICAL_ID,
  label10: GREEN_ELLIPTICAL_LABEL,
  image10: GreenElliptical,

  name11: GREEN_FENCE_ID,
  label11: GREEN_FENCE_LABEL,
  image11: GreenFence,

  name12: GREEN_LEAF_ID,
  label12: GREEN_LEAF_LABEL,
  image12: GreenLeaf,

  name13: GREEN_LENS_ID,
  label13: GREEN_LENS_LABEL,
  image13: GreenLens,

  name14: GREEN_SQUARE_ID,
  label14: GREEN_SQUARE_LABEL,
  image14: GreenSquare,

  name15: GREEN_TRIDENT_ID,
  label15: GREEN_TRIDENT_LABEL,
  image15: GreenTrident,

  name16: HOURGLASS_ID,
  label16: HOURGLASS_LABEL,
  image16: Hourglass,

  name17: MALE_YELLOW_ID,
  label17: MALE_YELLOW_LABEL,
  image17: MaleYellow,

  name18: PINK_SLIDER_ID,
  label18: PINK_SLIDER_LABEL,
  image18: PinkSlider,

  name19: RED_X_ID,
  label19: RED_X_LABEL,
  image19: RedX,

  name20: SOLAR_ID,
  label20: SOLAR_LABEL,
  image20: Solar,

  name21: TRAPEZOID_ID,
  label21: TRAPEZOID_LABEL,
  image21: Trapezoid,

  name22: UP_ARROWS_ID,
  label22: UP_ARROWS_LABEL,
  image22: UpArrows,

  name23: YELLOW_CROSSHAIR_ID,
  label23: YELLOW_CROSSHAIR_LABEL,
  image23: YellowCrosshair,
};

export default PlayerOptions;
