import React from 'react';
import ResourceImages from '../../Icons/Components/ResourceImages';
import { withStyles } from '@material-ui/core/styles';
import getBackgroundColor from '../../Icons/Components/getResourceBackgroundColor';
import getMarginLeft from '../../Icons/Components/getResourceMarginLeft';

const LABEL = 'Label';
const REMOVE_TOKEN_LABEL = "-1 Token";

const styles = ({
    buttonFormatting: {
        position: 'absolute',
        top: '68vh',
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
    },
    reduceDiv: {
        position: 'relative',
        marginTop: '30px',
        borderRadius: 20,
        height: '30px',
        width: '110px',
        backgroundColor: '#ff645c'
    },
    reduceTextDiv: {
        position: 'relative',
        top: '.5vh',
    }
  });

function ResourceButton(props) {
    const {classes} = props;
    console.log(props.resource)
    let background = getBackgroundColor(props.resource);
    let marginL = getMarginLeft(props.resource);

    return(
        <div className={classes.buttonFormatting} style={{backgroundColor: background, left: marginL}}>
            <div className={classes.innerDiv}>
                <div onClick={() => props.addToken()}>
                    {ResourceImages[props.resource]}
                    <div className={classes.textDiv}>
                    {ResourceImages[props.resource + LABEL]}
                    </div>
                </div>
                <div className={classes.reduceDiv} onClick={() => props.removeToken()}>
                    <div className={classes.reduceTextDiv}>
                        {REMOVE_TOKEN_LABEL}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default withStyles(styles)(ResourceButton);

