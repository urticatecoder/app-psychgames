import React from 'react';
import { useSpring, animated } from 'react-spring';
import {withStyles} from '@material-ui/core';
import getBackgroundColor from '../../Icons/Components/getResourceBackgroundColor';
import getMarginLeft from '../../Icons/Components/getResourceMarginLeft';

const styles = ({
    outerDiv: {
        position: 'absolute',
        bottom: '35vh',

    },
    barFormatting: {
        position: 'relative',
        borderRadius: 20,
        width: '80px',
        display: 'inline-block',
        marginLeft: '.75vw',
    }
  });

function ResourceBar(props) { 

    const spring = useSpring({
        from: {
          height: props.from + 'vh',
        },
        to: {
          height: props.to + 'vh',
        },
        config: {
          mass: 2,
        },
      });

    const {classes} = props;
    let background = getBackgroundColor(props.resource);
    let marginL = getMarginLeft(props.resource);
    return (
        <div className={classes.outerDiv}>
            <animated.div className={classes.barFormatting} style={{ ...spring, backgroundColor: background, left: marginL}}/>
        </div>
    )
}

export default withStyles(styles)(ResourceBar);

