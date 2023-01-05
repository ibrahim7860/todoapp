import React from 'react';
import {auth} from "../firebase-config";
import {signOut} from 'firebase/auth'
import {useNavigate} from "react-router-dom";

function HomePage() {

    const navigate = useNavigate()

    const signUserOut = () => {
        signOut(auth).then(() => {
            navigate('/')
        }).catch((error) => {
            alert(error.message)
        })
    }

    return (
        <div>
            <h1>Hello {auth.currentUser.email}</h1>
            <button onClick={signUserOut}>SIGN OUT</button>
        </div>
    )
}

export default HomePage;