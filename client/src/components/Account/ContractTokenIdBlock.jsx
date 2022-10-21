import React, { useEffect, useRef, useState } from 'react'
import { v4 as uuidv4 } from 'uuid';
import './scss/ContractTokenIdBlock.scss'

const ContractTokenIdBlock = (prop) => {
    const { loaded, onContractTokenIdBlockBackgroundClick, chain } = prop;
    const [showTokensList, setShowTokenList] = useState([]);
    const tokenInput = useRef(null);
    if(chain !== 'eth'){
        return(
            <>
                <div className='ContractTokenIdBlock'>
                    <div>All Tokens Contract Launched</div>
                    <div>Only apply on ETH</div>
                </div>
                <div className='ContractTokenIdBlockMask' onClick={()=>{onContractTokenIdBlockBackgroundClick()}}></div>
            </>
        )
    }

    useEffect(()=>{
        const intervalTokenList = setInterval(()=>{
            const tokens = [];
            let count = 0;
            const regex = new RegExp(tokenInput.current.value);

            for(let i = 0; i < window.contract_token_ids.length; i++){
                if(regex.test(window.contract_token_ids[i])){
                    tokens.push(window.contract_token_ids[i]);
                    count++
                }
                if(count >= 10){
                    setShowTokenList(tokens);
                    return;
                }
            }
            setShowTokenList(tokens);
        }, 2000);


        return(()=>{
            clearInterval(intervalTokenList);
        });
    }, [])
    

    return (
        <>
            <div className='ContractTokenIdBlock'>
                {loaded || <svg xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" style={{ background: 'none', display: 'block', shapeRendering: 'auto', preserveAspectRatio:"xMidYMid"}} viewBox="0 0 100 100">
                    <path d="M10 50A40 40 0 0 0 90 50A40 42 0 0 1 10 50" fill="#d5d5d5" stroke="none">
                        <animateTransform attributeName="transform" type="rotate" dur="5.88235294117647s" repeatCount="indefinite" keyTimes="0;1" values="0 50 51;360 50 51"></animateTransform>
                    </path>
                </svg>}
                <div>All Tokens Contract Launched</div>
                <input ref={tokenInput} placeholder={"search token id"} ></input>
                {showTokensList.map((token)=>{
                    return(<div className='token_id' key={uuidv4()}>
                        {token}
                    </div>);
                })}
                <div>Total: {window.contract_token_ids.length}</div>
            </div>
            <div className='ContractTokenIdBlockMask' onClick={()=>{onContractTokenIdBlockBackgroundClick()}}></div>
        </>
    )
}

export default ContractTokenIdBlock