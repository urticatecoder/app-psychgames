import { Redirect, useHistory, withRouter} from "react-router-dom";
import React, {useEffect} from "react";
import { Beforeunload } from 'react-beforeunload';

const HOME_ROUTE = "/";
const LEAVE_MESSAGE = "If you leave, you won't be compensated."
  /**
   * Function used to get formatting for buttons and bars associated with resources used in Game Two.
   * This is used to position resource buttons and bars such that they are vertically on top of one another.
   *
   * @author Eric Doppelt
   */
  function RefreshChecker(props) {

    window.onbeforeunload = function () {return LEAVE_MESSAGE;}
    // DELETE THIS WHEN READY
    if (props.loginCode == null && props.location.pathname != HOME_ROUTE) return <Redirect to={HOME_ROUTE}/>
    return null;
  }
  
 
  export default withRouter(RefreshChecker);
  