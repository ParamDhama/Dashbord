import React from 'react'

const Aleart = ({message}) => {
  return (
    <div style={{color:'red', backgroundColor : 'black', width : '80vw', height : '10vh'}}>
      {message}
    </div>
  )
}

export default Aleart
