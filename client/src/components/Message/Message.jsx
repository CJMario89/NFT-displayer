import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import './scss/Message.scss'
import { removeMsg } from '../../features/MessageSlice'



const Message = (props) => {
    const dispatch = useDispatch();
    const [ msg, setMsg ] = useState('');
    const [ className, setClassName ] = useState('');


    
    useEffect(()=>{
        setMsg(props.data)
        setClassName(props.class)
    }, [props])


    const DeleteMsg = (e) => {
        const target = e.target;
        dispatch(removeMsg((target.dataset.msg ? target.dataset.msg : '')))
    }

  return (
    <div className={className} data-msg={msg} onAnimationEnd={DeleteMsg}>{msg}</div>
  )
}

export default Message