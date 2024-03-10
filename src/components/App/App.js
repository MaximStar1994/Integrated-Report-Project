import React from 'react'
import './App.css'
import PrivateRoute from '../../Helper/Auth/privateRoute.js'
import AssetManagement from '../../pages/AssetManagement/Home.js'
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import { BrowserRouter as Router,
    Switch,
    Route,
    Link,
    useRouteMatch,
    useParams } from "react-router-dom";

class Apps extends React.Component{

    render(){
        return(
           <div>
               <Link to={this.props.redirectUrl}>
               <div className="app_cat" ><span>{this.props.category}</span></div>
               <div className="app_title">{this.props.title}</div>
               <img className="app_img" src={this.props.imgUrl} />
               <div className="app_desc" >{this.props.desc}</div>
               <div className="app_links" ><ArrowForwardIcon  style={{ color: 'red', fontSize:'medium',marginRight:'5px' }}/>Open App</div>
               </Link>
           
           </div>
        )
    }

}


export default Apps;