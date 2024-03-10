import React, { useState } from 'react'
import fullScreenLogo from './assets/Keppel_Fullscreen_Media.png';
import Tooltip from '@material-ui/core/Tooltip';
const FullScreen = props => {
  return (
    <Tooltip title="Full Screen Mode" placement="bottom">
       <img src = {fullScreenLogo} alt="Full Screen" className="top-icon img-responsive pad10 inverted clickable"
          onClick={() => {
            if(props.handle.active===false){
              props.handle.enter();
            }
            else if(props.handle.active===true){
              props.handle.exit();
            }
          }}/>
    </Tooltip>
  )
}

export default FullScreen