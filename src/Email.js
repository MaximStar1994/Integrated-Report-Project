import React from 'react'
import orderLogo from './assets/Keppel_Order_Media.png';
import Tooltip from '@material-ui/core/Tooltip';

export default class EmailButton extends React.Component {
    constructor(props){
        super(props);
        this.onClick = this.onClick.bind(this);
    }
    onClick(){
        window.location.href = `mailto:aftersales@keppelseascan.com`;
    }
    render(){
        return (
            // <Tooltip title="Click to send mail:aftersales@keppelseascan.com" placement="bottom">
            <img src = {orderLogo} alt="Place Order" 
            // onClick={this.onClick} 
            className="top-icon img-responsive pad10 inverted"/>
            // </Tooltip>
        )
    }
}