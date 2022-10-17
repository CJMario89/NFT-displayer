import "./scss/App.scss"
import React from 'react'
import {
    Routes,
    Route
} from "react-router-dom";
import Main from './Main';

const App = () => {


    return (
        <Routes>
            <Route path='/'>
                <Route index element={<Main />}/>
            </Route>
        </Routes>
    )
}

export default App