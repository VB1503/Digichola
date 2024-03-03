import React from 'react'
import '../styles/Joincard.css'


const JoinCard = (props) => {
    const title = props.tit;
    const subtitle = props.subtit;
    const cat = props.img;
  return (
    <div className='card'>
        <div className='card-content'>
            <img src={cat} alt=''/>
            <div>
                <p className='title'>{title}</p>
                <p>{subtitle}</p>
            </div>
        </div>
       <div className='joinbtns'>
        <button className='joinbtn'>{props.amt}</button>
        <button className='joinbtn'>Join</button>
       </div>
    </div>
  )
}

export default JoinCard;