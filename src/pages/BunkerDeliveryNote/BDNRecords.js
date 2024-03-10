import React from 'react'
import { Container, Row, Col, Button } from 'react-bootstrap'
import { withLayoutManager } from '../../Helper/Layout/layout'
import {withMessageManager} from '../../Helper/Message/MessageRenderer'
import { withAuthManager } from '../../Helper/Auth/auth'
import BDNTable from './BDNTable'
import BDN from '../../model/BunkerDeliveryNote'
import { withRouter } from "react-router-dom"
import moment from 'moment';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSave, faSync } from '@fortawesome/free-solid-svg-icons';

import FullScreenSpinner from '../../components/FullScreenSpinner/FullScreenSpinner';
import config from '../../config/config';

const rowsPerPage = 10;

class BDNRecords extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            BDNListOriginal: [],
            BDNList: [],
            BDNNoSortAscending: null,
            DateSortAscending: null,
            supplierFilter: '',
            receiverFilter: '',
            bdnStatus: 'none',
            savedBDNId: '',
            lastUpdateTime: '',
            loaded: false
        }
        this.bdnApi = new BDN()
    }

    componentDidMount() {
        this.bdnApi.SyncBDN().then(()=> {
            this.setState({ loaded: true })
            this.bdnApi.ListBunkerDeliveryNoteData(logs => {
                this.setState({ BDNList: logs, BDNListOriginal: logs });
            })    
        }).catch(()=> this.setState({ loaded: true }));
        this.bdnApi.ListBunkerDeliveryNoteData(logs => {
            this.setState({ BDNList: logs, BDNListOriginal: logs });
        })
        this.bdnApi.GetOpenBDN(data => {
            this.setState(data===undefined?{ bdnStatus: 'new', savedBDNId: '' }: { bdnStatus: 'saved', savedBDNId: data.reportId, lastUpdateTime: moment(data.lastUpdateTime).format('DD/MM/YYYY hh:mm a') });
        })
    }

    countPaginationTotal = () => {
        let i=0;
        let paginationList = [];
        if(this.state.BDNList){
            for(i=0; i < parseInt(this.state.BDNList.length/rowsPerPage); i++) {
                paginationList.push(i);
            }
            if(this.state.BDNList%rowsPerPage!==0) {
                paginationList.push(i);
            }
        }
        else
            paginationList = [1];
        return paginationList;
    }

    sortBDNNo = () => {
        let temp = [...this.state.BDNList];
        if(this.state.BDNNoSortAscending===null || this.state.BDNNoSortAscending===false){
            temp.sort((a, b) => (a.id - b.id))
            this.setState({ BDNList: temp, BDNNoSortAscending: true });
        }
        else if(this.state.BDNNoSortAscending===true){
            temp.sort((a, b) => (b.id - a.id))
            this.setState({ BDNList: temp, BDNNoSortAscending: false });
        }
    }
    sortDate = () => {
        let temp = [...this.state.BDNList];
        if(this.state.DateSortAscending===null || this.state.DateSortAscending===false){
            temp.sort((a, b) => (moment(a.generatedDate) - moment(b.generatedDate)))
            this.setState({ BDNList: temp, DateSortAscending: true });
        }
        else if(this.state.DateSortAscending===true){
            temp.sort((a, b) => (moment(b.generatedDate) - moment(a.generatedDate)))
            this.setState({ BDNList: temp, DateSortAscending: false });
        }
    }

    // filterSupplier = (event) => {
    //     let temp = [...this.state.BDNListOriginal];
    //     temp = temp.filter(item => {
    //         if(event.target.value===''){
    //             return true;
    //         }
    //         else{
    //             if(item.supplier){
    //                 return item.supplier.toLowerCase().search(event.target.value.toLowerCase())!==-1
    //             }else{
    //                 return false
    //             }
    //         }
    //     });
    //     this.setState({ BDNList: temp, supplierFilter: event.target.value });
    // }

    filterList = (field, event) => {
        let temp = [...this.state.BDNListOriginal];
        let supplierFilterValue = this.state.supplierFilter;
        let receiverFilterValue = this.state.receiverFilter;
        if(field==='supplier'){
            supplierFilterValue = event.target.value;
        }else if(field==='receiver'){
            receiverFilterValue = event.target.value;
        }
        temp = temp.filter(item => {
            if(supplierFilterValue===''){
                return true;
            }
            else{
                if(item.supplier){
                    return item.supplier.toLowerCase().search(supplierFilterValue.toLowerCase())!==-1
                }else{
                    return false
                }
            }
        });
        temp = temp.filter(item => {
            if(receiverFilterValue===''){
                return true;
            }
            else{
                if(item.receiver){
                    return item.receiver.toLowerCase().search(receiverFilterValue.toLowerCase())!==-1
                }else{
                    return false
                }
            }
        });
        this.setState({ BDNList: temp, supplierFilter: supplierFilterValue, receiverFilter: receiverFilterValue });
    }

    renderLG() {
        return (<></>)
    }
    renderSM() {
        const BDNList = this.state.BDNList
        return (
        <>
        <Container>
            <Row style={{ backgroundColor: '#04384C', padding: '20px' }}>
                <Col>
                    <Row style={{ backgroundColor: '#032A39', padding: '20px' }}>
                        <Col>
                            <Row style={{ color: '#067FAA', justifyContent: 'center', alignItems: 'center', fontSize: '1.2em', paddingBottom: '15px'}}>
                                {/* <span style={{display: 'flex', width: '100%', justifyContent: 'flex-end'}}><Button onClick={() => {this.bdnApi.SyncBDN()}}>Sync &nbsp; <FontAwesomeIcon icon={faSync} /></Button></span> */}
                                E-BUNKERING DELIVERY NOTE - SUMMARY
                            </Row>
                            <Row style={{ marginTop: '30px' }}>
                                <Col xs={{ span: 4 }} md={{ span: 4}} lg={{ span: 2, offset: 2}}>
                                    <Button variant="contained" type={'submit'} color="primary" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(5, 100, 255, 100)', width: '100%' , color: 'white' }} 
                                        disabled={this.state.bdnStatus!=='new'|| !this.props.user.apps.includes(config.apps.OPERATION)}
                                        onClick={()=>{
                                            this.bdnApi.CanViewBDNPage((value, err) => {
                                                if((value===true||value==="true") && this.props.user.apps.includes(config.apps.OPERATION)){
                                                    this.bdnApi.CreateBunkerDeliveryNoteData((data, error) => {
                                                        if(!error) {
                                                            this.props.history.push(`/bunkerdelivery/${data.reportId}`)
                                                        }
                                                    })
                                                }
                                                else{
                                                    if(this.props.user.apps.includes(config.apps.OPERATION))
                                                        this.props.setMessages([{type : "danger", message : "Another device is currently in use!"}]);
                                                }
                                            })
                                        }}> 
                                        <span className="material-icons"> note_add </span>
                                        <span style={{ marginLeft: '5px' }}>NEW</span>
                                    </Button>
                                </Col>
                                <Col xs={{ span: 7, offset: 1 }} md={{ span: 4, offset: 4}} lg={{ span: 3, offset: 4}}>
                                    <div style={{ backgroundColor: '#04384C', padding: '5px', borderRadius: '5px', display: 'inline-flex'}}>
                                        <Button variant="contained" type={'submit'} color="primary" style={{ backgroundColor: 'rgba(5, 100, 255, 100)', color: 'white' }} 
                                            disabled={this.state.bdnStatus!=='saved' || !this.props.user.apps.includes(config.apps.OPERATION)}
                                            onClick={()=>{
                                                this.bdnApi.CanViewBDNPage((value, err) => {
                                                    if((value===true||value==="true") && this.props.user.apps.includes(config.apps.OPERATION)){
                                                        this.props.history.push(`/bunkerdelivery/${this.state.savedBDNId}`)
                                                    }
                                                    else{
                                                        if(this.props.user.apps.includes(config.apps.OPERATION))
                                                            this.props.setMessages([{type : "danger", message : "Another device is currently in use!"}]);
                                                    }
                                                })
                                            }}> 
                                            <span className="material-icons"> <FontAwesomeIcon icon={faSave} /> </span>
                                        </Button>
                                        <span style={{ marginLeft: '25px', paddingRight: '10px', color: 'white', display: 'flex', alignItems: 'center'}}>Resume Saved</span>
                                    </div>
                                    <div>
                                        {this.state.bdnStatus==='saved'?<span style={{ color: '#067FAA', textAlign: 'center' }}>Last Saved: {this.state.lastUpdateTime}</span>:null}
                                    </div>
                                </Col>
                            </Row>
                            <Row style={{ marginTop: '30px', color: '#067FAA', justifyContent: 'center', fontSize: '1.2em', paddingBottom: '15px' }}>
                                BDN RECORDS
                            </Row>
                            <Row>
                                <Col>
                                    <BDNTable data={BDNList} paginationList={this.countPaginationTotal()} rowsPerPage={rowsPerPage} sortBDNNo={this.sortBDNNo} sortDate={this.sortDate} supplierFilter={this.state.supplierFilter} receiverFilter={this.state.receiverFilter} filterList={this.filterList}/>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                </Col>
            </Row>
        </Container>
        </>
        )

    }
    render() {
        if(this.state.loaded){
            if (this.props.renderFor === undefined) {
                return (<></>)
            }
            var contents = this.renderSM()
            if (this.props.renderFor === 2 || this.props.renderFor === 1) {
                contents = this.renderSM()
            }
            return (
                <div className="content-inner-all">
                    {contents}
                    
                </div>)
        }
        else{
            return(<FullScreenSpinner />);
        }
    }
}

export default withRouter(withAuthManager(withMessageManager(withLayoutManager(BDNRecords))));