import React from 'react';
import StatusLight from '../../components/StatusLight/StatusLight'
import AssetApi from '../../model/Asset'

import {withLayoutManager} from '../../Helper/Layout/layout'
import {withRouter} from 'react-router'
import './AssetManagement.css'
class AssetHealthCard extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = { 
            assetName :  this.props.assetName,
            status : "default"
        };
        this.assetnameQuery = this.props.queryName || this.props.assetName.replace(/ /g, '').toLowerCase()
        this.assetApi = new AssetApi()
        this.interval = undefined
    }

    updateValues() {
       this.assetApi.GetAssetCurrHealth(this.assetnameQuery, (val,err) => {
           if (val === null) {
               return
           }
           this.setState({
                status :  val.Description.toLowerCase()
           })
       })
    }

    componentDidMount() { 
        this.updateValues()
        this.interval = setInterval(this.updateValues.bind(this), 1000 * 10);
    }
    componentWillUnmount() {
        if (this.interval !== undefined) {
            clearInterval(this.interval);
        }
    }
 
    render() {
        return (
            <div className="clickable AssetStatusBar" style={{textAlign : "left", display : "flex", backgroundColor : "#0b1829"}} onClick={()=>{
                if(this.assetnameQuery.includes('drawworks') || this.assetnameQuery.includes('topdrive')) {
                    return
                }
                this.props.history.push("/assethealth?assetname="+this.assetnameQuery)
            }}>
                <div style={{width : this.props.renderFor == 2 ? "10%" : "20%", border : "1px solid #04445d"}}>
                    <StatusLight status={this.state.status} width={this.props.renderFor == 2 ? 2:5}/>
                </div>
                <div className="flex-grow-1 assetName" style={{border : "1px solid #04445d" , paddingLeft : "5px"}}>{this.state.assetName}</div>
            </div>
        )
    }
  }

export default withRouter(withLayoutManager(AssetHealthCard));
