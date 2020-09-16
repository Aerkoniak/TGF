import React, { Component } from 'react';
import { connect } from 'react-redux';
import { logIn, logInPlayer } from '../../data/actions/generalActions';
// import { logIn } from '../../data/actions/generalActions';

class LoginForm extends Component {
    state = {
        login: "",
        password: "",
        information: this.props.msg
    }

    fillForm = (e) => {
        if (e.target.id === "login") {
            this.setState({
                login: e.target.value
            })
        } else if (e.target.id === "password") {
            this.setState({
                password: e.target.value
            })
        }
    }
    submitLogin = e => {
        e.preventDefault();
        let account = {};
        account.login = this.state.login;
        account.password = this.state.password;
        this.props.logInPlayer(account);
    }

    render() {
        return (
            <form className={this.props.loginClassName} onSubmit={this.submitLogin}>
                <input className="logInput" type="text" id="login" onChange={this.fillForm} />
                <input className="logInput" type="password" id="password" onChange={this.fillForm} />
                <input className='loginSubmit' type="submit" value="Zaloguj" onSubmit={this.submitLogin} />
                    <p className="formInfo">Logowanie działa o ile wpiszecie poprawne dane. Przy błędzie nie wyrzuca błędu nigdzie poza konsolą. Sorry.</p>                
            </form>
        );
    }
}

const MapStateToProps = state => ({
    msg: state.player.msg
})

const MapDispatchToProps = (dispatch) => {
    return {
        logInPlayer: (account) => dispatch(logInPlayer(account))
    }
}

export default connect(MapStateToProps, MapDispatchToProps)(LoginForm);