import React from 'react';
import { Link } from 'react-router-dom'

const LogOutPage = () => {
    return (
        <section className="mainPage logOut">
            <h2>Nie jesteś zalogowany</h2>
            <Link to="/login">Kliknij tutaj by się zalogować</Link>
        </section>
    );
}

export default LogOutPage;