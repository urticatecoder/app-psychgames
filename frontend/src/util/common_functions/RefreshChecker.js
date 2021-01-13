import { useHistory, withRouter} from "react-router-dom";
import React from "react";

const INITIAL_CODE = null;
const HOME_ROUTE = '/';
  /**
   * Function used to get formatting for buttons and bars associated with resources used in Game Two.
   * This is used to position resource buttons and bars such that they are vertically on top of one another.
   *
   * @author Eric Doppelt
   */
  function RefreshChecker(props) {
    if (props.loginCode==null & props.history.location.pathname != HOME_ROUTE) {
      props.history.push(HOME_ROUTE);
    };
    return <div></div>;
  }
  
  export default withRouter(RefreshChecker);
  