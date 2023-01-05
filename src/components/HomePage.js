import React from 'react';
import {Link} from "react-router-dom";

function HomePage() {
    return (
        <Link to="/homepage" replace>Hello</Link>
    )
}

export default HomePage;