import React, { useEffect, useState, useRef } from 'react'
import { selectMessage, selectMsgCounter} from "../../features/MessageSlice"
import Message from "./Message"
import { v4 as uuidv4 } from 'uuid';
import { useDispatch, useSelector } from 'react-redux';



const AlertMsg = () => {
    const msgCounter = useSelector(selectMsgCounter);
    const dispatch = useDispatch();
    const messageData = useSelector(selectMessage);
    const [ message, setMessage ] = useState([{data:'', class:''}]);
    const msgCon = useRef();


   
    useEffect(()=>{
        if(msgCounter !== 0){
            setMessage((msgArr) => {
                for(let i = 0; i < msgArr.length; i++){//prevent from rapidly alerting
                    msgArr[i].data = ''
                    msgArr[i].class = ''
                }
                return [{data: messageData[messageData.length - 1], class: 'msgCon'}]
            });
            msgCon.current = [{data: messageData[messageData.length - 1], class: 'msgCon'}] //only display last one
        }
    }, [msgCounter, dispatch, messageData])


    useEffect(()=>{
        msgCon.current = [];
    }, [message]) // after message state is actually set


    return (
        <>
            {
                msgCon.current?.map(msg=><Message {...msg} key={uuidv4()}/>)
            }
        </>
    )
}

export default AlertMsg