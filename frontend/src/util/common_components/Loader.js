import React from "react"
import '../common_stylings/Loader.scss'

function Loader(props) {
    return (
    <div style={{width: '2000px'}}>
        <div className="loading">
            <div className="dot"></div>
            <div className="dot"></div>
            <div class="dot"></div>
            <div class="dot"></div>
            <div class="dot"></div>
        </div>
    </div>
    );
}
  
 
export default (Loader);
  