import React, { Component } from 'react';
import { connect } from 'react-redux';
import { logIn } from '../../data/actions/generalActions';
// import { logIn } from '../../data/actions/generalActions';

class LoginForm extends Component {
    state = {  }
    render() { 
        return ( 
            <form className={this.props.loginClassName} onSubmit={(e) => e.preventDefault()}>
                <input className="logInput" type="text"/>
                <input className="logInput" type="password"/>
                <input className='loginSubmit' type="submit" value="Zaloguj" onClick={this.props.logIn} />
                <p className="formInfo">Logować będzie można się nickiem, jak i nazwą postaci (po wypełnieniu kreatora).</p>
            </form>
         );
    }
}

const MapDispatchToProps = (dispatch) => {
    return {
        logIn: () => dispatch(logIn)
    }
}
 
export default connect(null, MapDispatchToProps)(LoginForm);