import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form } from 'react-bootstrap';
import { Select, MenuItem } from '@material-ui/core';
import Spinner from 'react-bootstrap/Spinner'
import { Button, FormControlLabel, Checkbox } from '@material-ui/core';
import SendIcon from '@material-ui/icons/Send';
import config from '../../config/config';
import {withMessageManager} from '../../Helper/Message/MessageRenderer'
import { withRouter } from "react-router-dom"
import ChatAPI from '../../model/Chat';
import './Chat.css';

const isEmpty = val => val===undefined||val===null||val==='';

const ChatManager = props => {
    const chatAPI = new ChatAPI();
    const [chatName, setChatName] = useState("");
    const [accountType, setAccountType] = useState("");
    const [users, setUsers] = useState([]);
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [chatList, setChatList] = useState([]);
    const [updateChatName, setUpdateChatName] = useState("");
    const [newChatUsers, setNewChatUsers] = useState([]);
    const [showUpdateUsers, setShowUpdateUsers] = useState(false);

    
    const getUserList = async() => {
        let userList = await chatAPI.GetUsersList();
        let chatList = await chatAPI.GetChatList();
        setUsers(userList);
        setChatList(chatList);
        setLoading(false);
    }
    const getChatDetails = async()=>{
        if(isEmpty(updateChatName)===true){
            props.setMessages([{type : "danger", message : 'Chat Name cannot be empty!'}]);
        }
        else{
            setLoading(true);
            let chatData = await chatAPI.GetChatData(updateChatName);
            setNewChatUsers(users.filter(u=>chatData.includes(u.account_id)));
            setLoading(false);
            setShowUpdateUsers(true);
        }
    }
    const createNewChat = async() => {
        let temp = {
            "chatName": chatName,
            "chatType": accountType,
            "users": selectedUsers,
        }
        if(isEmpty(temp.chatName)===true){
            props.setMessages([{type : "danger", message : 'Chat Name cannot be empty!'}]);
        }
        else if(isEmpty(temp.chatType)===true){
            props.setMessages([{type : "danger", message : 'Chat Type cannot be empty!'}]);
        }
        else{
            setLoading(true);
            let result = await chatAPI.CreateNewChat(temp);
            if(result.success===true||result.success==='true'){
                setChatName("");
                setAccountType("");
                setSelectedUsers([]);
                props.setMessages([{type : "success", message : 'User added successfully!'}]);
            }
            else{
                props.setMessages([{type : "danger", message : 'Unable to add user!'}]);
            }
            setLoading(false);
        }
    }
    const updateChat = async() => {
        let temp = {
            "chatID": updateChatName,
            "users": newChatUsers,
        }
        if(isEmpty(temp.chatID)===true){
            props.setMessages([{type : "danger", message : 'Chat Name cannot be empty!'}]);
        }
        else{
            setLoading(true);
            let result = await chatAPI.UpdateChat(temp);
            if(result.success===true||result.success==='true'){
                setUpdateChatName("");
                setNewChatUsers([]);
                props.setMessages([{type : "success", message : 'Chat updated successfully!'}]);
            }
            else{
                props.setMessages([{type : "danger", message : 'Unable to update chat!'}]);
            }
            setLoading(false);
            setShowUpdateUsers(false);
        }
    }
    useEffect(()=>{
        getUserList();
    }, [])

    return(
        <Container fluid className="KSTBackground">
            <Row>
                <Col style={{ padding: '0px' }}>
                    <div className='ChatManagerHeaderBase'>
                        <div  className="ChatManagerHeaderBackground">
                            <div className="ChatManagerHeading">
                                Chat Manager
                            </div>
                            <div className="ChatManagerHeading">
                                Create New Chat
                            </div>
                        </div>
                    </div> 
                </Col>
            </Row>
            <Row  className="ChatManagerMain">
                <Col>
                    <Row>
                        <Col>
                            <Row>
                                <Col xs={2}>
                                    <Form.Label style={{ color: config.KSTColors.MAIN, height: '100%', display: 'flex', alignItems: 'center' }}>Chat Name</Form.Label>
                                </Col>
                                <Col>
                                    <div style={{ width: '100%' }} className="ChatManagerSelectionBox">
                                        <Form.Control
                                            type='text' 
                                            id='chatName' 
                                            aria-describedby='chatName'
                                            value={chatName}
                                            onChange={e=>setChatName(e.target.value)}
                                            name='chatName'
                                            className="ChatManagerFillableBox"
                                            style={{ padding: '5px' }}
                                        />
                                    </div>
                                </Col>
                            </Row>
                            <Row style={{ marginTop: '10px' }}>
                                <Col xs={2}>
                                    <Form.Label style={{ color: config.KSTColors.MAIN, height: '100%', display: 'flex', alignItems: 'center' }}>Account Type</Form.Label>
                                </Col>
                                <Col>
                                    <div style={{ width: '100%' }} className="ChatManagerSelectionBox">
                                        <Select style={{ color: config.KSTColors.MAIN }} 
                                            type='selection' 
                                            disableUnderline 
                                            id={"AccountType"} 
                                            aria-describedby={"AccountType"} 
                                            value={accountType===null?"":accountType}
                                            onChange={e=> setAccountType(e.target.value)}
                                            className="ChatManagerSelectionFillableBox"   
                                        >
                                            <MenuItem value="">Account Type</MenuItem>
                                            <MenuItem value="management">Management</MenuItem>
                                            <MenuItem value="vessel">Vessel</MenuItem>
                                        </Select>
                                    </div>
                                </Col>
                            </Row>
                            <Row style={{ marginTop: '10px' }}>
                                <Col xs={2}>
                                    <Form.Label style={{ color: config.KSTColors.MAIN, height: '100%', display: 'flex', alignItems: 'center' }}>Users</Form.Label>
                                </Col>
                                    <Col>
                                        <div style={{ width: '100%' }} className="ChatManagerSelectionBox">
                                            {users.map(element=>(
                                                <FormControlLabel
                                                    key={element.account_id}
                                                    checked={selectedUsers.filter(e=>e.account_id.toString()===element.account_id.toString()).length>0}
                                                    onChange={()=>selectedUsers.filter(e=>e.account_id.toString()===element.account_id.toString()).length>0?setSelectedUsers(prev=>prev.filter(e=>e.account_id.toString()!==element.account_id.toString())):setSelectedUsers(prev=>[...prev, element])}
                                                    control={<Checkbox />}
                                                    label={element.name}
                                                    labelPlacement="bottom"
                                                />
                                            ))}
                                        </div>
                                        <Button style={{ backgroundColor: config.KSTColors.MAIN, borderRadius: '8px', paddingLeft: '30px', paddingRight: '30px', marginRight: '20px', color: config.KSTColors.ICON }} variant='contained' onClick={()=>{setSelectedUsers([])}} >
                                            Clear All
                                        </Button>
                                        <Button style={{ backgroundColor: config.KSTColors.MAIN, borderRadius: '8px', paddingLeft: '30px', paddingRight: '30px', marginRight: '20px', color: config.KSTColors.ICON }} variant='contained' onClick={()=>{
                                            let temp = [];
                                            users.forEach(element=>element.account_type==='vessel'&&temp.push(element));
                                            setSelectedUsers(temp);
                                        }}>
                                            Select Vessels
                                        </Button>
                                        <Button style={{ backgroundColor: config.KSTColors.MAIN, borderRadius: '8px', paddingLeft: '30px', paddingRight: '30px', marginRight: '20px', color: config.KSTColors.ICON }} variant='contained' onClick={()=>{
                                            let temp = [];
                                            users.forEach(element=>element.account_type!=='vessel'&&temp.push(element));
                                            setSelectedUsers(temp);
                                        }}>
                                            Select Management & Admin
                                        </Button>
                                        <Button style={{ backgroundColor: config.KSTColors.MAIN, borderRadius: '8px', paddingLeft: '30px', paddingRight: '30px', marginRight: '20px', color: config.KSTColors.ICON }} variant='contained' onClick={()=>{
                                            let temp = [];
                                            users.forEach(element=>temp.push(element));
                                            setSelectedUsers(temp);
                                        }}>
                                            Select All
                                        </Button>
                                    </Col>
                            </Row>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <Row style={{ height: '100%' }}>
                                <div style={{ display: 'flex', justifyContent: 'flex-end', width: '100%' }}>
                                    <Button style={{ backgroundColor: config.KSTColors.MAIN, borderRadius: '8px', paddingLeft: '30px', paddingRight: '30px', marginRight: '20px', color: config.KSTColors.ICON }} disabled={loading===true} onClick={createNewChat} >
                                        {loading===true?
                                            <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" style={{ color: config.KSTColors.ICON }} />
                                        :
                                            <SendIcon style={{ color: config.KSTColors.ICON }}/>
                                        }
                                        <span style={{ color: config.KSTColors.WHITE, paddingLeft: '10px' }}>Create</span>
                                    </Button>
                                </div>
                            </Row>
                        </Col>
                    </Row>
                </Col>
            </Row>

            {/* Update Chat Members */}
            
            <Row>
                <Col style={{ padding: '0px' }}>
                    <div className='ChatManagerHeaderBase'>
                        <div  className="ChatManagerHeaderBackground">
                            <div className="ChatManagerHeading">
                                Update Chat
                            </div>
                        </div>
                    </div> 
                </Col>
            </Row>
            <Row  className="ChatManagerMain">
                <Col>
                    <Row>
                        <Col>
                            <Row style={{ marginTop: '10px' }}>
                                <Col xs={2}>
                                    <Form.Label style={{ color: config.KSTColors.MAIN, height: '100%', display: 'flex', alignItems: 'center' }}>Chat Name</Form.Label>
                                </Col>
                                <Col xs={9}>
                                    <div style={{ width: '100%' }} className="ChatManagerSelectionBox">
                                        <Select style={{ color: config.KSTColors.MAIN }} 
                                            type='selection' 
                                            disableUnderline 
                                            id={"UpdateChatName"} 
                                            aria-describedby={"UpdateChatName"} 
                                            value={updateChatName===null?"":updateChatName}
                                            onChange={e=> {setUpdateChatName(e.target.value); setShowUpdateUsers(false);}}
                                            className="ChatManagerSelectionFillableBox"   
                                        >
                                            <MenuItem value="">Select Chat</MenuItem>
                                            {chatList.map(c=><MenuItem key={c.chat_id} value={c.chat_id}>{c.chat_name}</MenuItem>)}
                                        </Select>
                                    </div>
                                </Col>
                                <Col xs={1}>
                                    <Button style={{ backgroundColor: config.KSTColors.MAIN, borderRadius: '8px', paddingLeft: '30px', paddingRight: '30px', marginRight: '20px', color: config.KSTColors.ICON }} variant='contained' onClick={getChatDetails}>
                                        Get
                                    </Button>
                                </Col>
                            </Row>
                            {showUpdateUsers===true&&
                                <Row style={{ marginTop: '10px' }}>
                                    <Col xs={2}>
                                        <Form.Label style={{ color: config.KSTColors.MAIN, height: '100%', display: 'flex', alignItems: 'center' }}>Users</Form.Label>
                                    </Col>
                                        <Col>
                                            <div style={{ width: '100%' }} className="ChatManagerSelectionBox">
                                                {users.map(element=>(
                                                    <FormControlLabel
                                                        key={element.account_id}
                                                        checked={newChatUsers.filter(e=>e.account_id.toString()===element.account_id.toString()).length>0}
                                                        onChange={()=>newChatUsers.filter(e=>e.account_id.toString()===element.account_id.toString()).length>0?setNewChatUsers(prev=>prev.filter(e=>e.account_id.toString()!==element.account_id.toString())):setNewChatUsers(prev=>[...prev, element])}
                                                        control={<Checkbox />}
                                                        label={element.name}
                                                        labelPlacement="bottom"
                                                    />
                                                ))}
                                            </div>
                                            <Button style={{ backgroundColor: config.KSTColors.MAIN, borderRadius: '8px', paddingLeft: '30px', paddingRight: '30px', marginRight: '20px', color: config.KSTColors.ICON }} variant='contained' onClick={()=>{setNewChatUsers([])}} >
                                                Clear All
                                            </Button>
                                            <Button style={{ backgroundColor: config.KSTColors.MAIN, borderRadius: '8px', paddingLeft: '30px', paddingRight: '30px', marginRight: '20px', color: config.KSTColors.ICON }} variant='contained' onClick={()=>{
                                                let temp = [];
                                                users.forEach(element=>element.account_type==='vessel'&&temp.push(element));
                                                setNewChatUsers(temp);
                                            }}>
                                                Select Vessels
                                            </Button>
                                            <Button style={{ backgroundColor: config.KSTColors.MAIN, borderRadius: '8px', paddingLeft: '30px', paddingRight: '30px', marginRight: '20px', color: config.KSTColors.ICON }} variant='contained' onClick={()=>{
                                                let temp = [];
                                                users.forEach(element=>element.account_type!=='vessel'&&temp.push(element));
                                                setNewChatUsers(temp);
                                            }}>
                                                Select Management & Admin
                                            </Button>
                                            <Button style={{ backgroundColor: config.KSTColors.MAIN, borderRadius: '8px', paddingLeft: '30px', paddingRight: '30px', marginRight: '20px', color: config.KSTColors.ICON }} variant='contained' onClick={()=>{
                                                let temp = [];
                                                users.forEach(element=>temp.push(element));
                                                setNewChatUsers(temp);
                                            }}>
                                                Select All
                                            </Button>
                                        </Col>
                                </Row>
                            }
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            {showUpdateUsers===true&&
                                <Row style={{ height: '100%' }}>
                                    <div style={{ display: 'flex', justifyContent: 'flex-end', width: '100%' }}>
                                        <Button style={{ backgroundColor: config.KSTColors.MAIN, borderRadius: '8px', paddingLeft: '30px', paddingRight: '30px', marginRight: '20px', color: config.KSTColors.ICON }} disabled={loading===true} onClick={updateChat} >
                                            {loading===true?
                                                <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" style={{ color: config.KSTColors.ICON }} />
                                            :
                                                <SendIcon style={{ color: config.KSTColors.ICON }}/>
                                            }
                                            <span style={{ color: config.KSTColors.WHITE, paddingLeft: '10px' }}>Update</span>
                                        </Button>
                                    </div>
                                </Row>
                            }
                        </Col>
                    </Row>
                </Col>
            </Row>
        </Container>
    );
}

export default withMessageManager(ChatManager);