import React from 'react';

class GetSectionHeader extends React.Component{
   constructor(props){
       super(props)
   }
   render(){
    return (
        <div style={{ height: "2vh", backgroundColor: '#006385', color: '#fff', width: "100%", textAlign: "center",marginTop:"1vh", fontSize:"1.5vh" }} >{this.props.title}</div>
    )
   }
    
}
export default GetSectionHeader