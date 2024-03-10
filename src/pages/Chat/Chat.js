import React, { useState, useEffect, useRef } from 'react';
import moment from 'moment-timezone';
import { Modal, Tab, Nav, Row, Col, Form, Button } from 'react-bootstrap';
import { Chip } from '@material-ui/core';
import ChatAPI from "../../model/Chat";
import { withAuthManager } from '../../Helper/Auth/auth';
import SendIcon from '@material-ui/icons/Send';
import './Chat.css'

const Chat = props => {
    const chatAPI = new ChatAPI();
    const [chatList, setChatList] = useState([]);
    const [chat, setChat] = useState([]);
    const [chatSelection, setChatSelection] = useState(0);
    const [chatLoading, setChatLoading] = useState(false);
    const [msgInput, setMsgInput] = useState('');
    const [disableSent, setDisableSent] = useState(false);
    const [chatInterval, setChatInterval] = useState(null);
    const messagesEndRef = useRef(null);
    const clearAllStates = () => {
        setChatList([]);
        setChat([]);
        setChatSelection(0);
        setChatLoading(false);
        setMsgInput('');
        setDisableSent(false);
        if(chatInterval!==null){
          clearInterval(chatInterval); 
          setChatInterval(null);
        }
    }
    const getChatList = async() => {
      let chatList = await chatAPI.GetChatsList(props.user.accountId);
      setChatList(chatList);
    }

    const getChats = async() => {
      let chats = await chatAPI.GetChats(chatSelection, props.user.accountId);
      setChat(chats);
      messagesEndRef.current.scrollIntoView({ behaviour: 'smooth' });

      let chatInterval = setInterval(async()=>{
        let chats = await chatAPI.GetChats(chatSelection, props.user.accountId);
        // chats.push(<div ref={messagesEndRef}/>);
        setChat(chats);
        // console.log(messagesEndRef.current);
        // if(messagesEndRef.current!==null)
      }, 500);
      setChatInterval(chatInterval);
    }

    const sendMsg = async() => {
      if(msgInput!==''){
        setDisableSent(true);
        await chatAPI.SendMsg(chatSelection, msgInput);
        let chats = await chatAPI.GetChats(chatSelection, props.user.accountId);
        setChat(chats);
        messagesEndRef.current.scrollIntoView({ behaviour: 'smooth' });
        setDisableSent(false);
        setMsgInput('');
      }
    }

    useEffect(()=>{
      if(props.show===true)
        getChatList();
      if(props.show===false){
        clearAllStates();
      }
    }, [props.show]);
    
    useEffect(()=>{
      if(chatSelection!==0){
        getChats();
      }
      if(chatInterval!==null){
        clearInterval(chatInterval);
        setChatInterval(null);
      }
    }, [chatSelection]);
    return (
      <div>
        <Modal
          show={props.show}
          onHide={props.hide}
          size="xl"
          // fullscreen={true}
          dialogClassName="modal-90w"
          aria-labelledby="ConfirmSubmitModal"
          centered
        >
          <Modal.Body style={{ color: '#04588e', minHeight: '90vh' }} >
            <Row>
              <Col xs={12}>
                <div onClick={()=>{
                  if(chatSelection===0)
                    props.hide();
                  else
                    setChatSelection(0)
                }} className='smallChatDisplay'>{'< Back'}</div>
              </Col>
              <Col xs={12} style={{ display: 'flex', justifyContent: "center" }}>
                VesselCare Support
              </Col>  
            </Row>
            {chatList.length>0&&
              <>
                <div className="bigChatDisplay">
                  <Tab.Container id="chat" defaultActiveKey={chatSelection}>
                    <Row>
                      <Col sm={3} className="chatscroll" style={{ height: '83vh', overflow: 'scroll',scrollBehavior:"smooth", flexDirection: 'row', backgroundColor: '#DBDBE8', borderRadius: "10px"}}>
                        <Nav variant="pills" className="flex-column">
                          {chatList.map((chat, idx) => {
                            return (
                              <Nav.Item key={idx} className={`${chatSelection===chat.chat_id?'activeChat':''}`}>
                                <Nav.Link eventKey={chat.chat_id} onClick={()=>{
                                setChatSelection(chat.chat_id)
                                }}
                                style={{ border: chatSelection===chat.chat_id?'1px solid red':'', backgroundColor: 'rgba(0,0,0,0)', color: '#2C92FF'}}
                                >
                                  <Row>
                                    <Col>
                                      {props.chatNotifications.length>0&&
                                        <Chip color={props.chatNotifications.filter(e=>e.chat_id===chat.chat_id)[0]['newMsgs']===0?'primary':'secondary'} 
                                              label={props.chatNotifications.filter(e=>e.chat_id===chat.chat_id)[0]['newMsgs']} 
                                              variant="outlined"
                                              style={{ border: chatSelection===chat.chat_id?'1px solid red':'', backgroundColor: 'rgba(0,0,0,0)', color: '#2C92FF'}}  />}
                                    </Col>
                                    <Col style={{ display: 'flex', flexGrow: '10', alignItems: 'center' }}>
                                      {chat.chat_name}
                                    </Col>
                                  </Row>
                                </Nav.Link>
                              </Nav.Item>
                            );
                          })}
                        </Nav>
                      </Col>
                      <Col sm={9}>
                        <Tab.Content style={{ height: '90vh' }}>
                          <Tab.Pane eventKey={chatSelection} style={{ height: '100%', overflow: 'scroll' }}>
                            <div style={{ display: 'flex', flexFlow: 'column' }}>
                              <div className="chatscroll" style={{ height: '83vh', overflow: 'scroll' }}>
                                {chat.map((element, idx)=>{
                                  return(
                                    <div key={idx} style={{ display: 'flex', justifyContent: `${element.msg_from_id===props.user.accountId?'end':'start'}` }}>
                                      <div className={`${element.msg_from_id===props.user.accountId?'ChatMsgSenderBox':'ChatMsgBox'}`}>
                                        <div className={`${element.msg_from_id===props.user.accountId?'chatMsgSenderSender':'chatMsgSender'}`}>
                                          {element.msg_from_name}
                                        </div>
                                        <div className='chatMsg'>
                                          {element.msg}
                                        </div>
                                        <div className={`${element.msg_from_id===props.user.accountId?'chatMsgSenderTimestamp':'chatMsgTimestamp'}`}>
                                          {moment(element.sent_datetime).format('DD-MM-YYYY hh:mm A')}
                                        </div>
                                      </div>
                                    </div>
                                  );
                                })}
                                <div ref={messagesEndRef} />
                              </div>
                              <div>
                                {chatSelection!==0&&
                                  <div className='ChatInputBox'>
                                    <div className='ChatInput'>
                                      <Form.Control
                                          type="string" 
                                          id="msgInput" 
                                          aria-describedby="msgInput" 
                                          value={msgInput===null?'':msgInput}
                                          onKeyPress={e=>{
                                            if(e.charCode===13)
                                              sendMsg();
                                          }
                                          }
                                          onChange={e=>{setMsgInput(e.target.value)}}
                                          name={"msgInput"}
                                          className={"ChatFillableBox"}
                                          style={{ padding: '5px' }}
                                          placeholder='Type your message here...'
                                      />
                                    </div>
                                    <div className='ChatInputButton' onClick={sendMsg}>
                                      <SendIcon />
                                    </div>
                                  </div>
                                }
                              </div>
                            </div>
                          </Tab.Pane>
                        </Tab.Content>
                      </Col>
                    </Row>
                  </Tab.Container>
                </div>
              <div className="smallChatDisplay">
                <div className={`${chatSelection === 0 ? "chatscroll" : ""}`} style={{overflowY: "scroll",height: '83vh',overflowX:"hidden"}}>
                {chatSelection === 0 ?
                  chatList.map((chat, idx) => {
                    return (
                        <div key={idx} className={`${chatSelection===chat.chat_id?'activeChat':''}`}>
                          <div onClick={()=>{
                          setChatSelection(chat.chat_id)
                          }}
                          style={{ border: chatSelection===chat.chat_id?'1px solid red':'', backgroundColor: 'rgba(0,0,0,0)', color: '#2C92FF'}}
                          className={`${chatSelection===chat.chat_id?'activeChat':''}`}
                          >
                            <Row>
                              <Col>
                                {props.chatNotifications.length>0&&
                                  <Chip color={props.chatNotifications.filter(e=>e.chat_id===chat.chat_id)[0]['newMsgs']===0?'primary':'secondary'} 
                                        label={props.chatNotifications.filter(e=>e.chat_id===chat.chat_id)[0]['newMsgs']} 
                                        variant="outlined"
                                        style={{ border: chatSelection===chat.chat_id?'1px solid red':'', backgroundColor: 'rgba(0,0,0,0)', color: '#2C92FF'}}  />}
                              </Col>
                              <Col style={{ display: 'flex', flexGrow: '10', alignItems: 'center' }}>
                                {chat.chat_name}
                              </Col>
                            </Row>
                          </div>
                        </div>
                      );
                    })
                  :
                    <div style={{ display: 'flex', flexFlow: 'column' }}>
                      <div className="chatscroll" style={{ height: '83vh', overflow: 'scroll' }}>
                        {chat.map((element, idx)=>{
                          return(
                            <div key={idx} style={{ display: 'flex', justifyContent: `${element.msg_from_id===props.user.accountId?'end':'start'}` }}>
                              <div className={`${element.msg_from_id===props.user.accountId?'ChatMsgSenderBox':'ChatMsgBox'}`}>
                                <div className={`${element.msg_from_id===props.user.accountId?'chatMsgSenderSender':'chatMsgSender'}`}>
                                  {element.msg_from_name}
                                </div>
                                <div className='chatMsg'>
                                  {element.msg}
                                </div>
                                <div className={`${element.msg_from_id===props.user.accountId?'chatMsgSenderTimestamp':'chatMsgTimestamp'}`}>
                                  {moment(element.sent_datetime).format('DD-MM-YYYY hh:mm A')}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                        <div ref={messagesEndRef} />
                      </div>
                      <div>
                        {chatSelection!==0&&
                          <div className='ChatInputBox'>
                            <div className='ChatInput'>
                              <Form.Control
                                  type="string" 
                                  id="msgInput" 
                                  aria-describedby="msgInput" 
                                  value={msgInput===null?'':msgInput}
                                  onKeyPress={e=>{
                                    if(e.charCode===13)
                                      sendMsg();
                                  }
                                  }
                                  onChange={e=>{setMsgInput(e.target.value)}}
                                  name={"msgInput"}
                                  className={"ChatFillableBox"}
                                  style={{ padding: '5px' }}
                                  placeholder='Type your message here...'
                              />
                            </div>
                            <div className='ChatInputButton' onClick={sendMsg}>
                              <SendIcon />
                            </div>
                          </div>
                        }
                      </div>
                    </div>
                  }
                  </div>
                </div>
              </>
            }
          </Modal.Body>
        </Modal>
      </div>
    );
}

export default withAuthManager(Chat);