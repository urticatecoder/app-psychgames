import React, { Fragment, useRef, useState, useEffect } from "react";
import TweenMax from "gsap";



const Animation = () => {
  // cpu1 refs
  const cpu1 = useRef(null);
  // cpu3 refs
  const cpu3 = useRef(null);
  // cpu2 refs
  const cpu2 = useRef(null);
  // cpu4 refs
  const cpu4= useRef(null);
  // cpu5 refs
  const cpu5= useRef(null);
  // cpu6 refs
  const cpu6= useRef(null);

  // move
  const [user1_y, setUser1_y]= useState(200)
  const [user2_y, setUser2_y]= useState(200)
  const [user3_y, setUser3_y]= useState(200)
  const [user4_y, setUser4_y]= useState(200)
  const [user5_y, setUser5_y]= useState(200)
  const [user6_y, setUser6_y]= useState(200)
  
  return (
    <Fragment>
      <div class="buttons">
        <button className="three-button" onClick={()=>{
          setUser1_y(user1_y-20);setUser2_y(user2_y+20);setUser3_y(user3_y+20)}}>User1</button>
        <button className="two-button" onClick={()=>{
          setUser2_y(user2_y-20);setUser1_y(user1_y+20);setUser3_y(user3_y+20)}}>User2</button>
        <button className="one-button" onClick={()=>{
          setUser3_y(user3_y-20);setUser1_y(user1_y+20);setUser2_y(user2_y+20)}}>User3</button>
        <button className="four-button" onClick={()=>{
          setUser4_y(user4_y-20)}}>User4</button>
        <button className="five-button" onClick={()=>{
          setUser5_y(user5_y-20)}}>User5</button>
        <button className="six-button" onClick={()=>{
          setUser6_y(user6_y-20)}}>User6</button>
      </div>
      <div>{user1_y}</div>
  
      <svg>
        <g fill="#87C33A">
          <circle
            cx="150" cy={user1_y} r="30"
            class="cpu3"
            ref={cpu3}
          />
        </g>
        <circle
          cx="300" cy={user2_y} r="30"
          fill="#F8CAA1"
          ref={cpu2}
          className="cpu2"
        />
        <g>
          <circle
            cx="450" cy={user3_y} r="30"
            fill="#DA2427"
            ref={cpu1}
            className="cpu1"
          />
        </g>
        <g>
          <circle
            cx="600" cy={user4_y} r="30"
            fill="#DA2427"
            ref={cpu4}
            className="cpu4"
          />
        </g>
        <g>
          <circle
            cx="750" cy={user5_y} r="30"
            fill="#DA2427"
            ref={cpu5}
            className="cpu5"
          />
        </g>
        <g>
          <circle
            cx="900" cy={user5_y} r="30"
            fill="#DA2427"
            ref={cpu6}
            className="cpu6"
          />
        </g>
      </svg>
    </Fragment>
  );
};

export default Animation;
