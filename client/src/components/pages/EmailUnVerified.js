import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const EmailUnVerified = () => {
    return (
        <section className="verifyPage">
            <p className="loadPage gameName" >Oude Aard</p>
            <p className="loadPage gameDesc" >Twoja Tekstowa Gra Fabularna</p>
            <p className="logOutinfo">Do gry i pełnej imersji z naszym światem niezbędne jest zweryfikowanie swojego adresu e-mail.</p>
            <p className="logOutinfo">Jeśli już to zrobiłeś i z jakiegoś powodu nie działa - kliknij <Link to="/">ten</Link> link. </p>
        </section>
    );
}

export default EmailUnVerified;