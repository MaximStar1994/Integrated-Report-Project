import React from 'react';

class VerticalHeader extends React.Component{
   constructor(props){
       super(props)
   }
   render(){
    return (
        <div style={{  backgroundColor: '#006385', color: '#fff',  textAlign: "center", verticalAlign:"center", width:"1vw",height:"10vh" }} >
           <span style={{transform:"rotate(-90deg)" }}> {this.props.title}</span>
        </div>
    )
   }
    
}
export default VerticalHeader