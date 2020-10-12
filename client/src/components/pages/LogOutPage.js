import React from 'react';
import { Link } from 'react-router-dom'

const LogOutPage = () => {
    return (
        <section className="logOutPage">
            <p className="loadPage gameName" >Oude Aard</p>
            <p className="loadPage gameDesc" >Twoja Tekstowa Gra Fabularna</p>
            <p className="logOutinfo">Poprawnie się wylogowałeś.</p>
            <Link to="/login">Kliknij tutaj by się zalogować</Link>
        </section>
    );
}

export default LogOutPage;