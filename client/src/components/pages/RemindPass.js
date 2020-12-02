import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Button, Spinner } from 'react-bootstrap';

import { sendPasswordReset } from '../../data/firebase/firebaseActions';

const RemindPass = ({ sendPasswordReset }) => {

    const [email, setEmail] = useState("");
    const [mailSend, toggleMailSend] = useState(false)

    const resetSupporter = () => {
        sendPasswordReset(email);
        setTimeout(toggleMailSend(true), 350)
    }

    return (
        <section className="verifyPage">
            <p className="loadPage gameName" >Oude Aard</p>
            <p className="loadPage gameDesc" >Twoja Tekstowa Gra Fabularna</p>
            <p className="logOutinfo">Przypomnienie hasła</p>





            {mailSend ? <p className="logOutinfo">Wysłano maila!</p> :
                <form className="remindEmail" onSubmit={resetSupporter} >
                    <input type="text" value={email} placeholder="Wprowadź adres email" onChange={e => setEmail(e.target.value)} />
                    <Button variant="outline-dark" as="submit" onClick={resetSupporter} >Potwierdź reset hasła</Button>
                </form>
            }

        </section>
    );
}

const MapDispatchToProps = dispatch => ({
    sendPasswordReset: email => dispatch(sendPasswordReset(email))
})

export default connect(null, MapDispatchToProps)(RemindPass);