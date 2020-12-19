import React from "react";
import { Typography, withStyles } from "@material-ui/core";
import '../util/common_stylings/FullScreenDiv.css';
import OptionButton from '../icons/components/OptionButton';

const FULL_DIV = "fullDiv";
const PLAYER_OPTIONS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24];
const styles = {
  confirmButton: {
    position: "absolute",
    top: "68vh",
    left: "5vw",
    height: "5vh",
    width: "15vw",
    opacity: ".9",
    borderRadius: "8px",
    alignItems: "center",
    fontSize: "15px",
  },
};

/**
 * Component that allows the submission of choices in Game One.
 * Handles the web socket call and sends choices passed in as props from Game One.
 * @param {*} props tell the choices to send in the web socket call.
 * 
 * @author Eric Doppelt
 */
function AvatarSelector(props) {
  const { classes } = props;

  return (
    <div className={FULL_DIV}>
        <OptionButton
          player={0}
          onSelect={() => console.log(0)}
        />
        <OptionButton
          player={1}
          onSelect={() => console.log(0)}
        />
        <OptionButton
          player={2}
          onSelect={() => console.log(0)}
        />
        <OptionButton
          player={3}
          onSelect={() => console.log(0)}
        />
        <OptionButton
          player={4}
          onSelect={() => console.log(0)}
        />
        <OptionButton
          player={5}
          onSelect={() => console.log(0)}
        />
        <OptionButton
          player={6}
          onSelect={() => console.log(0)}
        />
        <OptionButton
          player={7}
          onSelect={() => console.log(0)}
        />
        <OptionButton
          player={8}
          onSelect={() => console.log(0)}
        />
        <OptionButton
          player={9}
          onSelect={() => console.log(0)}
        />
        <OptionButton
          player={10}
          onSelect={() => console.log(0)}
        />
        <OptionButton
          player={11}
          onSelect={() => console.log(0)}
        />
        <OptionButton
          player={12}
          onSelect={() => console.log(0)}
        />
        <OptionButton
          player={13}
          onSelect={() => console.log(0)}
        />
        <OptionButton
          player={14}
          onSelect={() => console.log(0)}
        />
        <OptionButton
          player={15}
          onSelect={() => console.log(0)}
        />
        <OptionButton
          player={16}
          onSelect={() => console.log(0)}
        />
        <OptionButton
          player={17}
          onSelect={() => console.log(0)}
        />
        <OptionButton
          player={18}
          onSelect={() => console.log(0)}
        />
        <OptionButton
          player={19}
          onSelect={() => console.log(0)}
        />
        <OptionButton
          player={20}
          onSelect={() => console.log(0)}
        />
        <OptionButton
          player={21}
          onSelect={() => console.log(0)}
        />
        <OptionButton
          player={22}
          onSelect={() => console.log(0)}
        />
        <OptionButton
          player={23}
          onSelect={() => console.log(0)}
        />
        <OptionButton
          player={24}
          onSelect={() => console.log(0)}
        />
    </div>
  );
}

export default withStyles(styles)(AvatarSelector);
