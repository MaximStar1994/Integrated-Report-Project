import React, { useRef, useEffect } from 'react';
 
function DrawLine() {
  const canvas = useRef();
  let ctx = null;
 
  // initialize the canvas context
  useEffect(() => {
    // dynamically assign the width and height to canvas
    const canvasEle = canvas.current;
    canvasEle.width = canvasEle.clientWidth;
    canvasEle.height = canvasEle.clientHeight;
 
    // get context of the canvas
    ctx = canvasEle.getContext("2d");
  }, []);
 
  useEffect(() => {
    // drawLine({  x: 100, y: 40, x1: 100, y1: 100}, { color: 'rgba(255,225,255,1)' , width: 3 });
    // drawLine({  x: 200, y: 100, x1: 210, y1: 100}, { color: 'rgba(255,225,255,1)' , width: 3 });
    // drawLine({ x: 50, y: 50, x1: 200, y1: 100 }, { color: 'rgba(255,225,255,1)' , width: 3 });
 
    // drawLine({ x: 300, y: 250, x1: 260, y1: 70 }, { color: 'rgba(255,225,255,1)', width: 3 });
 
     drawLine({x: 880, y: 0, x1: 880, y1: 80 }, { color: '#ffc107' , width: 3});
     drawLine({x: 830, y: 80, x1: 880, y1: 80 }, { color: '#ffc107' , width: 3});
  }, []);
 
  // draw a line
  const drawLine = (info, style = {}) => {
    const { x, y, x1, y1 } = info;
    const { color = 'black', width = 1 } = style;
 
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x1, y1);
    ctx.strokeStyle = color;
    ctx.lineWidth = width;
    ctx.stroke();
  }
 
  return (

      <canvas  width='1846' height='361' style={{maxWidth:'100%',maxHeight:'90vh'}}  ref={canvas}></canvas>

  );
}
 
export default DrawLine;