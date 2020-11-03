import React from 'react';
import ResourceImages from './ResourceImages';
import { withStyles } from '@material-ui/core/styles';

const KEEP = "keep"
const INVEST = "invest"
const COMPETE = "compete"

const KEEP_COLOR = '#e3aac9'
const INVEST_COLOR = '#36c960'
const COMPETE_COLOR = '#ff645c'

const KEEP_MARGIN_LEFT = '45vw';
const INVEST_MARGIN_LEFT = '57vw';
const COMPETE_MARGIN_LEFT = '69vw';

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

function getBackgroundColor(resource) {
    switch(resource) {
        case KEEP: return KEEP_COLOR;
        case INVEST: return INVEST_COLOR;
        case COMPETE: return COMPETE_COLOR;
    }
}

function getMarginLeft(resource) {
    switch(resource) {
        case KEEP: return KEEP_MARGIN_LEFT;
        case INVEST: return INVEST_MARGIN_LEFT;
        case COMPETE: return COMPETE_MARGIN_LEFT;
    }
}

export default withStyles(styles)(ResourceButton);

