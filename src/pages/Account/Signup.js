import React, { useState, useEffect, Component } from 'react';
import { Container, Row, Col, Form, Tabs, Tab } from 'react-bootstrap';
import { Select, MenuItem } from '@material-ui/core';
import Spinner from 'react-bootstrap/Spinner'
import { Button, FormControlLabel, Checkbox } from '@material-ui/core';
import SendIcon from '@material-ui/icons/Send';
import config from '../../config/config';
import {withMessageManager} from '../../Helper/Message/MessageRenderer'
import { withRouter } from "react-router-dom"
import SignupAPI from '../../model/Signup';
import './Account.css';

const isEmpty = val => val===undefined||val===null||val==='';

const Signup = props => {
    const signupAPI = new SignupAPI();
    const [username, setUsername] = useState("");
    const [name, setName] = useState("");
    const [password, setPassword] = useState("");
    const [vesselList, setVesselList] = useState([]);
    const [vesselId, setVesselId] = useState("");
    const [accountType, setAccountType] = useState("");
    const [chats, setChats] = useState([]);
    const [apps, setApps] = useState([]);
    const [selectedChats, setSelectedChats] = useState([]);
    const [selectedApps, setSelectedApps] = useState([]);
    const [loading, setLoading] = useState(false);

    const [userList, setUserList] = useState([])
    const [updateUserUsername, setUpdateUserUsername] = useState("");
    const [updateUserName, setUpdateUserName] = useState("");
    const [updateUserVesselId, setUpdateUserVesselId] = useState("");
    const [updateUserAccountType, setUpdateUserAccountType] = useState("");
    const [updateUserSelectedChats, setUpdateUserSelectedChats] = useState([]);
    const [updateUserSelectedApps, setUpdateUserSelectedApps] = useState([]);

    const newUserSelected = (newusername) => {
        setUpdateUserUsername(newusername);
        setUpdateUserName("");
        setUpdateUserVesselId(vesselList[0]['vessel_id']);
        setUpdateUserAccountType("");
        setUpdateUserSelectedChats([]);
        setUpdateUserSelectedApps([]);
        setLoading(false);
    }

    const getUserData = async() => {
        let userData = await signupAPI.GetUserData(updateUserUsername);
        setUpdateUserName(userData.name||"");
        setUpdateUserVesselId(userData.vessel_id||vesselList[0]['vessel_id']);
        setUpdateUserAccountType(userData.account_type||"");
        if(userData.chats instanceof Array && userData.chats.length>0){
            let temp = [];
            userData.chats.forEach(e=>temp.push(e.chat_id))
            setUpdateUserSelectedChats(temp);
        }
        else{
            setUpdateUserSelectedChats([]);
        }
        if(userData.apps instanceof Array && userData.apps.length>0){
            let temp = [];
            userData.apps.forEach(e=>temp.push(e.app))
            setUpdateUserSelectedApps(temp);
        }
        else{
            setUpdateUserSelectedApps([]);
        }
        setLoading(false);
    }
    
    const getChatList = async() => {
        let chatList = await signupAPI.GetChatsList();
        setChats(chatList);
        let appsList = await signupAPI.GetAppsList();
        setApps(appsList);
        let vesselList = await signupAPI.GetVesselsList();
        setVesselList(vesselList);
        setVesselId(vesselList[0]['vessel_id']);
    }

    const getUserList = async() => {
        let userList = await signupAPI.GetUserList();
        setUserList(userList)
    }

    const signup = async() => {
        let temp = {
            "username": username,
            "name": name,
            "password": password,
            "accountType": accountType,
            "vesselId": vesselId,
            "chats": selectedChats,
            "apps": selectedApps
        }
        if(isEmpty(temp.username)===true){
            props.setMessages([{type : "danger", message : 'Username cannot be empty!'}]);
        }
        else if(isEmpty(temp.password)===true){
            props.setMessages([{type : "danger", message : 'Password cannot be empty!'}]);
        }
        else if(isEmpty(temp.name)===true){
            props.setMessages([{type : "danger", message : 'Name cannot be empty!'}]);
        }
        else if(isEmpty(temp.accountType)===true){
            props.setMessages([{type : "danger", message : 'Account Type cannot be empty!'}]);
        }
        else if(isEmpty(temp.vesselId)===true){
            props.setMessages([{type : "danger", message : 'Vessel cannot be empty!'}]);
        }
        else{
            setLoading(true);
            let result = await signupAPI.Signup(temp);
            if(result.success===true||result.success==='true'){
                setUsername("");
                setName("");
                setPassword("");
                setVesselId(vesselList[0]['vessel_id']);
                setAccountType("");
                setSelectedChats([]);
                setSelectedApps([]);
                props.setMessages([{type : "success", message : 'User added successfully!'}]);
            }
            else{
                props.setMessages([{type : "danger", message : 'Unable to add user!'}]);
            }
            setLoading(false);
        }
    }
    const updateUser = async () => {
        let temp = {
            "username": updateUserUsername,
            "name": updateUserName,
            "accountType": updateUserAccountType,
            "vesselId": updateUserVesselId,
            "chats": updateUserSelectedChats,
            "apps": updateUserSelectedApps
        }
        if(isEmpty(temp.username)===true){
            props.setMessages([{type : "danger", message : 'Username cannot be empty!'}]);
        }
        else if(isEmpty(temp.name)===true){
            props.setMessages([{type : "danger", message : 'Name cannot be empty!'}]);
        }
        else if(isEmpty(temp.accountType)===true){
            props.setMessages([{type : "danger", message : 'Account Type cannot be empty!'}]);
        }
        else if(isEmpty(temp.vesselId)===true){
            props.setMessages([{type : "danger", message : 'Vessel cannot be empty!'}]);
        }
        else{
            setLoading(true);
            let result = await signupAPI.UpdateUser(temp);
            if(result.success===true||result.success==='true'){
                setUpdateUserUsername("");
                setUpdateUserName("");
                setUpdateUserVesselId(vesselList[0]['vessel_id']);
                setUpdateUserAccountType("");
                setUpdateUserSelectedChats([]);
                setUpdateUserSelectedApps([]);
                props.setMessages([{type : "success", message : 'User added successfully!'}]);
            }
            else{
                props.setMessages([{type : "danger", message : 'Unable to add user!'}]);
            }
            setLoading(false);
        }
    }
    useEffect(()=>{
        getChatList();
        getUserList();
    }, [])

    return(
        <Container fluid>
            <Row className="KSTBackground SignupMain">
                <Col>
                    <Tabs
                    defaultActiveKey="Signup"
                    id="mainSignup"
                    className="mb-3"
                    style={{ border: '0px' }}
                    >
                        <Tab eventKey="Signup" title="Signup">
                            <Row>
                                <Col style={{ padding: '0px' }}>
                                    <div className='SignupHeaderBase'>
                                        <div  className="SignupHeaderBackground">
                                            <div className="SignupHeading">
                                            Signup
                                            </div>
                                        </div>
                                    </div> 
                                </Col>
                            </Row>
                            <Row>
                                <Col>
                                    <Row>
                                        <Col>
                                            <Row>
                                                <Col xs={2}>
                                                    <Form.Label style={{ color: config.KSTColors.MAIN, height: '100%', display: 'flex', alignItems: 'center' }}>Username</Form.Label>
                                                </Col>
                                                <Col>
                                                    <div style={{ width: '100%' }} className="SignupSelectionBox">
                                                        <Form.Control
                                                            type='text' 
                                                            id='username' 
                                                            aria-describedby='username'
                                                            value={username}
                                                            onChange={e=>setUsername(e.target.value)}
                                                            name='username'
                                                            className="SignupFillableBox"
                                                            style={{ padding: '5px' }}
                                                        />
                                                    </div>
                                                </Col>
                                            </Row>
                                            <Row style={{ marginTop: '10px' }}>
                                                <Col xs={2}>
                                                    <Form.Label style={{ color: config.KSTColors.MAIN, height: '100%', display: 'flex', alignItems: 'center' }}>Password</Form.Label>
                                                </Col>
                                                <Col>
                                                    <div style={{ width: '100%' }} className="SignupSelectionBox">
                                                        <Form.Control
                                                            type='text' 
                                                            id='password' 
                                                            aria-describedby='password'
                                                            value={password}
                                                            onChange={e=>setPassword(e.target.value)}
                                                            name='password'
                                                            className="SignupFillableBox"
                                                            style={{ padding: '5px' }}
                                                        />
                                                    </div>
                                                </Col>
                                            </Row>
                                            <Row style={{ marginTop: '10px' }}>
                                                <Col xs={2}>
                                                    <Form.Label style={{ color: config.KSTColors.MAIN, height: '100%', display: 'flex', alignItems: 'center' }}>Name</Form.Label>
                                                </Col>
                                                <Col>
                                                    <div style={{ width: '100%' }} className="SignupSelectionBox">
                                                        <Form.Control
                                                            type='text' 
                                                            id='name' 
                                                            aria-describedby='name'
                                                            value={name}
                                                            onChange={e=>setName(e.target.value)}
                                                            name='name'
                                                            className="SignupFillableBox"
                                                            style={{ padding: '5px' }}
                                                        />
                                                    </div>
                                                </Col>
                                            </Row>
                                            <Row style={{ marginTop: '10px' }}>
                                                <Col xs={2}>
                                                    <Form.Label style={{ color: config.KSTColors.MAIN, height: '100%', display: 'flex', alignItems: 'center' }}>Vessel</Form.Label>
                                                </Col>
                                                <Col>
                                                    <div style={{ width: '100%' }} className="SignupSelectionBox">
                                                        <Select style={{ color: config.KSTColors.MAIN }} 
                                                            type='selection' 
                                                            disableUnderline 
                                                            id={"VesselId"} 
                                                            aria-describedby={"VesselId"} 
                                                            value={vesselId===null?"":vesselId}
                                                            onChange={e=> setVesselId(e.target.value.toString())}
                                                            className="SignupSelectionFillableBox"   
                                                        >
                                                            {vesselList.map(element=><MenuItem key={element.vessel_id} value={parseInt(element.vessel_id)}>{element.name}</MenuItem>)}
                                                        </Select>
                                                    </div>
                                                </Col>
                                            </Row>
                                            <Row style={{ marginTop: '10px' }}>
                                                <Col xs={2}>
                                                    <Form.Label style={{ color: config.KSTColors.MAIN, height: '100%', display: 'flex', alignItems: 'center' }}>Account Type</Form.Label>
                                                </Col>
                                                <Col>
                                                    <div style={{ width: '100%' }} className="SignupSelectionBox">
                                                        <Select style={{ color: config.KSTColors.MAIN }} 
                                                            type='selection' 
                                                            disableUnderline 
                                                            id={"AccountType"} 
                                                            aria-describedby={"AccountType"} 
                                                            value={accountType===null?"":accountType}
                                                            onChange={e=> setAccountType(e.target.value)}
                                                            className="SignupSelectionFillableBox"   
                                                        >
                                                            <MenuItem value="">Account Type</MenuItem>
                                                            <MenuItem value="admin">Admin</MenuItem>
                                                            <MenuItem value="management">Management</MenuItem>
                                                            <MenuItem value="vessel">Vessel</MenuItem>
                                                        </Select>
                                                    </div>
                                                </Col>
                                            </Row>
                                            <Row style={{ marginTop: '10px' }}>
                                                <Col xs={2}>
                                                    <Form.Label style={{ color: config.KSTColors.MAIN, height: '100%', display: 'flex', alignItems: 'center' }}>Chats</Form.Label>
                                                </Col>
                                                    <Col>
                                                        <div style={{ width: '100%' }} className="SignupSelectionBox">
                                                            {chats.map(element=>(
                                                                <FormControlLabel
                                                                    key={element.chat_id}
                                                                    checked={selectedChats.includes(element.chat_id.toString())}
                                                                    onChange={()=>selectedChats.includes(element.chat_id.toString())===true?setSelectedChats(prev=>prev.filter(e=>e!==element.chat_id.toString())):setSelectedChats(prev=>[...prev, element.chat_id.toString()])}
                                                                    control={<Checkbox />}
                                                                    label={element.chat_name}
                                                                    labelPlacement="bottom"
                                                                />
                                                            ))}
                                                        </div>
                                                        <Button style={{ backgroundColor: config.KSTColors.MAIN, borderRadius: '8px', paddingLeft: '30px', paddingRight: '30px', marginRight: '20px', color: config.KSTColors.ICON }} variant='contained' onClick={()=>{setSelectedChats([])}} >
                                                            Clear All
                                                        </Button>
                                                        <Button style={{ backgroundColor: config.KSTColors.MAIN, borderRadius: '8px', paddingLeft: '30px', paddingRight: '30px', marginRight: '20px', color: config.KSTColors.ICON }} variant='contained' onClick={()=>{
                                                            let temp = [];
                                                            chats.forEach(element=>element.chat_type==='vessel'&&temp.push(element.chat_id.toString()));
                                                            setSelectedChats(temp);
                                                        }}>
                                                            Select Vessels
                                                        </Button>
                                                        <Button style={{ backgroundColor: config.KSTColors.MAIN, borderRadius: '8px', paddingLeft: '30px', paddingRight: '30px', marginRight: '20px', color: config.KSTColors.ICON }} variant='contained' onClick={()=>{
                                                            let temp = [];
                                                            chats.forEach(element=>element.chat_type!=='vessel'&&temp.push(element.chat_id.toString()));
                                                            setSelectedChats(temp);
                                                        }}>
                                                            Select Management & Admin
                                                        </Button>
                                                        <Button style={{ backgroundColor: config.KSTColors.MAIN, borderRadius: '8px', paddingLeft: '30px', paddingRight: '30px', marginRight: '20px', color: config.KSTColors.ICON }} variant='contained' onClick={()=>{
                                                            let temp = [];
                                                            chats.forEach(element=>temp.push(element.chat_id.toString()));
                                                            setSelectedChats(temp);
                                                        }}>
                                                            Select All
                                                        </Button>
                                                    </Col>
                                            </Row>
                                            {accountType==='management'&&<Row style={{ marginTop: '10px' }}>
                                                <Col xs={2}>
                                                    <Form.Label style={{ color: config.KSTColors.MAIN, height: '100%', display: 'flex', alignItems: 'center' }}>Apps</Form.Label>
                                                </Col>
                                                <Col>
                                                    <div style={{ width: '100%' }} className="SignupSelectionBox">
                                                        {apps.map(element=>(
                                                            <FormControlLabel
                                                                key={element.app}
                                                                checked={selectedApps.includes(element.app.toString())}
                                                                onChange={()=>selectedApps.includes(element.app.toString())===true?setSelectedApps(prev=>prev.filter(e=>e!==element.app.toString())):setSelectedApps(prev=>[...prev, element.app.toString()])}
                                                                control={<Checkbox />}
                                                                label={element.app}
                                                                labelPlacement="bottom"
                                                            />
                                                        ))}
                                                    </div>
                                                </Col>
                                            </Row>}
                                            
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col>
                                            <Row style={{ height: '100%' }}>
                                                <div style={{ display: 'flex', justifyContent: 'flex-end', width: '100%' }}>
                                                    <Button style={{ backgroundColor: config.KSTColors.MAIN, borderRadius: '8px', paddingLeft: '30px', paddingRight: '30px', marginRight: '20px', color: config.KSTColors.ICON }} disabled={loading===true} onClick={signup} >
                                                        {loading===true?
                                                            <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" style={{ color: config.KSTColors.ICON }} />
                                                        :
                                                            <SendIcon style={{ color: config.KSTColors.ICON }}/>
                                                        }
                                                        <span style={{ color: config.KSTColors.WHITE, paddingLeft: '10px' }}>Sign Up</span>
                                                    </Button>
                                                </div>
                                            </Row>
                                        </Col>
                                    </Row>
                                </Col>
                            </Row>
                        </Tab>
                        <Tab eventKey="UpdateUser" title="UpdateUser">
                            <Row>
                                <Col style={{ padding: '0px' }}>
                                    <div className='SignupHeaderBase'>
                                        <div  className="SignupHeaderBackground">
                                            <div className="SignupHeading">
                                            Update User
                                            </div>
                                        </div>
                                    </div> 
                                </Col>
                            </Row>
                            <Row  className="SignupMain">
                                <Col>
                                    <Row>
                                        <Col>
                                            <Row>
                                                <Col xs={2}>
                                                    <Form.Label style={{ color: config.KSTColors.MAIN, height: '100%', display: 'flex', alignItems: 'center' }}>Username</Form.Label>
                                                </Col>
                                                <Col>
                                                    <div style={{ width: '100%' }} className="SignupSelectionBox">
                                                        <Select style={{ color: config.KSTColors.MAIN }} 
                                                            type='selection' 
                                                            disableUnderline 
                                                            id={"Username"} 
                                                            aria-describedby={"Username"} 
                                                            value={updateUserUsername===null?"":updateUserUsername}
                                                            onChange={e=> newUserSelected(e.target.value.toString())}
                                                            className="SignupSelectionFillableBox"   
                                                        >
                                                            {userList.map(element=><MenuItem key={element} value={element}>{element}</MenuItem>)}
                                                        </Select>
                                                    </div>
                                                </Col>
                                                <Col>
                                                    <div style={{ width: '100%' }} className="SignupSelectionBox">
                                                        <Button style={{ backgroundColor: config.KSTColors.MAIN, borderRadius: '8px', paddingLeft: '30px', paddingRight: '30px', marginRight: '20px', color: config.KSTColors.ICON }} variant='contained' onClick={getUserData}>Get</Button>
                                                    </div>
                                                </Col>
                                            </Row>
                                            <Row style={{ marginTop: '10px' }}>
                                                <Col xs={2}>
                                                    <Form.Label style={{ color: config.KSTColors.MAIN, height: '100%', display: 'flex', alignItems: 'center' }}>Name</Form.Label>
                                                </Col>
                                                <Col>
                                                    <div style={{ width: '100%' }} className="SignupSelectionBox">
                                                        <Form.Control
                                                            type='text' 
                                                            id='updateUserName' 
                                                            aria-describedby='updateUserName'
                                                            value={updateUserName}
                                                            onChange={e=>setUpdateUserName(e.target.value)}
                                                            updateUserName='updateUserName'
                                                            className="SignupFillableBox"
                                                            style={{ padding: '5px' }}
                                                        />
                                                    </div>
                                                </Col>
                                            </Row>
                                            <Row style={{ marginTop: '10px' }}>
                                                <Col xs={2}>
                                                    <Form.Label style={{ color: config.KSTColors.MAIN, height: '100%', display: 'flex', alignItems: 'center' }}>Vessel</Form.Label>
                                                </Col>
                                                <Col>
                                                    <div style={{ width: '100%' }} className="SignupSelectionBox">
                                                        <Select style={{ color: config.KSTColors.MAIN }} 
                                                            type='selection' 
                                                            disableUnderline 
                                                            id={"updateUserVesselId"} 
                                                            aria-describedby={"updateUserVesselId"} 
                                                            value={updateUserVesselId===null?"":updateUserVesselId}
                                                            onChange={e=> setUpdateUserVesselId(e.target.value.toString())}
                                                            className="SignupSelectionFillableBox"   
                                                        >
                                                            {vesselList.map(element=><MenuItem key={element.vessel_id} value={parseInt(element.vessel_id)}>{element.name}</MenuItem>)}
                                                        </Select>
                                                    </div>
                                                </Col>
                                            </Row>
                                            <Row style={{ marginTop: '10px' }}>
                                                <Col xs={2}>
                                                    <Form.Label style={{ color: config.KSTColors.MAIN, height: '100%', display: 'flex', alignItems: 'center' }}>Account Type</Form.Label>
                                                </Col>
                                                <Col>
                                                    <div style={{ width: '100%' }} className="SignupSelectionBox">
                                                        <Select style={{ color: config.KSTColors.MAIN }} 
                                                            type='selection' 
                                                            disableUnderline 
                                                            id={"updateUserAccountType"} 
                                                            aria-describedby={"updateUserAccountType"} 
                                                            value={updateUserAccountType===null?"":updateUserAccountType}
                                                            onChange={e=> setUpdateUserAccountType(e.target.value)}
                                                            className="SignupSelectionFillableBox"   
                                                        >
                                                            <MenuItem value="">Account Type</MenuItem>
                                                            <MenuItem value="admin">Admin</MenuItem>
                                                            <MenuItem value="management">Management</MenuItem>
                                                            <MenuItem value="vessel">Vessel</MenuItem>
                                                        </Select>
                                                    </div>
                                                </Col>
                                            </Row>
                                            <Row style={{ marginTop: '10px' }}>
                                                <Col xs={2}>
                                                    <Form.Label style={{ color: config.KSTColors.MAIN, height: '100%', display: 'flex', alignItems: 'center' }}>Chats</Form.Label>
                                                </Col>
                                                    <Col>
                                                        <div style={{ width: '100%' }} className="SignupSelectionBox">
                                                            {chats.map(element=>(
                                                                <FormControlLabel
                                                                    key={element.chat_id}
                                                                    checked={updateUserSelectedChats.includes(element.chat_id.toString())}
                                                                    onChange={()=>updateUserSelectedChats.includes(element.chat_id.toString())===true?setUpdateUserSelectedChats(prev=>prev.filter(e=>e!==element.chat_id.toString())):setUpdateUserSelectedChats(prev=>[...prev, element.chat_id.toString()])}
                                                                    control={<Checkbox />}
                                                                    label={element.chat_name}
                                                                    labelPlacement="bottom"
                                                                />
                                                            ))}
                                                        </div>
                                                        <Button style={{ backgroundColor: config.KSTColors.MAIN, borderRadius: '8px', paddingLeft: '30px', paddingRight: '30px', marginRight: '20px', color: config.KSTColors.ICON }} variant='contained' onClick={()=>{setUpdateUserSelectedChats([])}} >
                                                            Clear All
                                                        </Button>
                                                        <Button style={{ backgroundColor: config.KSTColors.MAIN, borderRadius: '8px', paddingLeft: '30px', paddingRight: '30px', marginRight: '20px', color: config.KSTColors.ICON }} variant='contained' onClick={()=>{
                                                            let temp = [];
                                                            chats.forEach(element=>element.chat_type==='vessel'&&temp.push(element.chat_id.toString()));
                                                            setUpdateUserSelectedChats(temp);
                                                        }}>
                                                            Select Vessels
                                                        </Button>
                                                        <Button style={{ backgroundColor: config.KSTColors.MAIN, borderRadius: '8px', paddingLeft: '30px', paddingRight: '30px', marginRight: '20px', color: config.KSTColors.ICON }} variant='contained' onClick={()=>{
                                                            let temp = [];
                                                            chats.forEach(element=>element.chat_type!=='vessel'&&temp.push(element.chat_id.toString()));
                                                            setUpdateUserSelectedChats(temp);
                                                        }}>
                                                            Select Management & Admin
                                                        </Button>
                                                        <Button style={{ backgroundColor: config.KSTColors.MAIN, borderRadius: '8px', paddingLeft: '30px', paddingRight: '30px', marginRight: '20px', color: config.KSTColors.ICON }} variant='contained' onClick={()=>{
                                                            let temp = [];
                                                            chats.forEach(element=>temp.push(element.chat_id.toString()));
                                                            setUpdateUserSelectedChats(temp);
                                                        }}>
                                                            Select All
                                                        </Button>
                                                    </Col>
                                            </Row>
                                            {updateUserAccountType==='management'&&<Row style={{ marginTop: '10px' }}>
                                                <Col xs={2}>
                                                    <Form.Label style={{ color: config.KSTColors.MAIN, height: '100%', display: 'flex', alignItems: 'center' }}>Apps</Form.Label>
                                                </Col>
                                                <Col>
                                                    <div style={{ width: '100%' }} className="SignupSelectionBox">
                                                        {apps.map(element=>(
                                                            <FormControlLabel
                                                                key={element.app}
                                                                checked={updateUserSelectedApps.includes(element.app.toString())}
                                                                onChange={()=>updateUserSelectedApps.includes(element.app.toString())===true?setUpdateUserSelectedApps(prev=>prev.filter(e=>e!==element.app.toString())):setUpdateUserSelectedApps(prev=>[...prev, element.app.toString()])}
                                                                control={<Checkbox />}
                                                                label={element.app}
                                                                labelPlacement="bottom"
                                                            />
                                                        ))}
                                                    </div>
                                                </Col>
                                            </Row>}
                                            
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col>
                                            <Row style={{ height: '100%' }}>
                                                <div style={{ display: 'flex', justifyContent: 'flex-end', width: '100%' }}>
                                                    <Button style={{ backgroundColor: config.KSTColors.MAIN, borderRadius: '8px', paddingLeft: '30px', paddingRight: '30px', marginRight: '20px', color: config.KSTColors.ICON }} disabled={loading===true} onClick={updateUser} >
                                                        {loading===true?
                                                            <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" style={{ color: config.KSTColors.ICON }} />
                                                        :
                                                            <SendIcon style={{ color: config.KSTColors.ICON }}/>
                                                        }
                                                        <span style={{ color: config.KSTColors.WHITE, paddingLeft: '10px' }}>Update User</span>
                                                    </Button>
                                                </div>
                                            </Row>
                                        </Col>
                                    </Row>
                                </Col>
                            </Row>
                        </Tab>
                    </Tabs>
                </Col>
            </Row>
        </Container>
    );
}

export default withMessageManager(Signup);