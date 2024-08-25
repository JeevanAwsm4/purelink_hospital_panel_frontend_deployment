import React from 'react';
import { Detector } from 'react-detect-offline';
import HashLoader from "react-spinners/HashLoader";

const CheckConnection = props => {
  return (
    <div>
      <Detector
        render={({online}) => (
            online ? props.children:
            <div className='offline' style={{display: 'flex', alignItems: 'center', height: '100vh', textAlign: 'center',}}>
                <HashLoader
                    id='randomHash'
                    color={'#5E3FE3'}
                    aria-label="Loading Spinner"
                    data-testid="loader"
                    size={100}
                />
                <span className='content'>Check your connection</span>
            </div>
        )}
       />
    </div>
  )
}
export default CheckConnection;