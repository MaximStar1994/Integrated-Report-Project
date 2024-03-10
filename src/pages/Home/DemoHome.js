import React, { useState } from 'react';
import DemoHomeImg from '../../assets/DemoHome1.png'
import DemoHomeImg2 from '../../assets/DemoHome2.png'

const DemoHome = props => {
    const [demoImage2, setDemoImage2] = useState(false);
    return(
    <React.Fragment>
        <img src={demoImage2===true?DemoHomeImg2:DemoHomeImg} style={{width : "100vw", height: '85vh'}} 
        // onClick={()=> {setDemoImage2(!demoImage2)}}
        />
    </React.Fragment>
    )
};

export default DemoHome;