import "./App.scss"
import React from 'react'
import {
    Routes,
    Route
} from "react-router-dom";
import NFTDisplayer from './NFTDisplayer';

const App = () => {


    return (
        <Routes>
            <Route path='/'>
                <Route index element={<NFTDisplayer />}/>
                {/* <Route path="NFTInfoPage/*" element={<NFTInfoPage />} />                 */}
            </Route>
        </Routes>
    )
}

export default App