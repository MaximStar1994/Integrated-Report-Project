import React from 'react';
import './Display.css';

function DisplayData(props){
    const {title,value,unit,width,font} = props;
    
    return(
        <div  style={{justifyContent:"center",width:width+'%'}} >
        <div className={`p-2 text-center LEDBGBlack-1k-${font}`}>{title}</div>
        <div className={`p-2 text-center LEDBGBlack-1v-${font}`}>{value}</div>
        <div className={`p-2 text-right LEDBGBlack-1u-${font}`}>{unit}</div>
        </div>
    )

}

export default DisplayData;