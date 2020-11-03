import React from 'react';
import ResourceImages from './ResourceImages';
import { withStyles } from '@material-ui/core/styles';
import getBackgroundColor from './getResourceBackgroundColor';
import getMarginLeft from './getResourceMarginLeft';

const LABEL = 'Label'

const styles = ({
    buttonFormatting: {
        position: 'absolute',
        top: '70vh',
        borderRadius: 40,
        height: '110px',
        width: '110px',
    },
    innerDiv: {
        position: 'relative',
        top: '10px',
    },
    textDiv: {
        position: 'relative',
        top: '3px',
    }
  });

function ResourceButton(props) {
    const {classes} = props;
    console.log(props.resource)
    let background = getBackgroundColor(props.resource);
    let marginL = getMarginLeft(props.resource);
    return(
        <div className={classes.buttonFormatting} style={{backgroundColor: background, marginLeft: marginL}} onClick={() => props.onSelect()}>
            <div className={classes.innerDiv}>
                {ResourceImages[props.resource]}
                <div className={classes.textDiv}>
                {ResourceImages[props.resource + LABEL]}
                </div>
            </div>
        </div>
    )
}

export default withStyles(styles)(ResourceButton);

