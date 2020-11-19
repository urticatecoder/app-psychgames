import React, {useState} from 'react';
import {withStyles} from '@material-ui/core'
import { useSpring, animated } from 'react-spring';
import getBackgroundColor from '../../icons/components/getResourceBackgroundColor';

const INITIAL_HEIGHT = 0;
const COLON_SPACE = ": "

const KEEP = 'keep'
const INVEST = 'invest'
const COMPETE = 'compete'

const HEIGHT_SCALAR = 1.9

//FIXME: duplicated with game one
const styles = ({
    outerDiv: {
        position: 'absolute',
        bottom: '20vh',
    },
    barFormatting: {
        position: 'relative',
        borderRadius: 20,
        width: '80px',
        backgroundColor: '#ffffff',
        display: 'inline-block',
        marginLeft: '.75vw',
    },
    reduceDiv: {
        position: 'relative',
        marginTop: '30px',
        borderRadius: 20,
        height: '3vh',
        width: '11vh',
        backgroundColor: '#ff645c'
    },
    reduceTextDiv: {
        position: 'relative',
        top: '.5vh',
    }
});

function DelayedBar(props) {

    const {classes} = props
    const [toHeight, setToHeight] = useState(INITIAL_HEIGHT);

    const spring = useSpring({
        from: {
          height: '0vh',
        },
        to: {
          height: scaleHeight(toHeight) + 'vh',
        },
        config: {
          mass: 2,
        },
      });

    setTimeout(() => {
        setToHeight(props.tokens)
    }, props.delay);

    let background = getBackgroundColor(props.resource)
    let marginL = getMarginL(props.resource, props.group) + 'vw'

    return(
        <div className={classes.outerDiv}>
            <animated.div className={classes.barFormatting} style={{ ...spring, display: 'inline-block', backgroundColor: background, marginLeft: marginL}}/>
            
            <div className={classes.reduceDiv} style={{backgroundColor: background, marginLeft: marginL}}>
                    <div className={classes.reduceTextDiv}>
                        {props.resource + COLON_SPACE + props.tokens}
                    </div>
            </div>
        </div>
    )
}

function scaleHeight(tokens) {
    return tokens * HEIGHT_SCALAR;
}

function getMarginL(resource, group) {
    let offset = (group === 1) ? 0 : 50
    
    switch(resource) {
        case KEEP:
            return offset + 10;
        case INVEST:
            return offset + 21.75;
        case COMPETE:
            return offset + 33.5;
        default: return offset;
    }
}


export default withStyles(styles)(DelayedBar);



