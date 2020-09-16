import React, { Component } from 'react'
import { connect } from 'react-redux';
import { createAccount } from '../../data/actions/generalActions'


class RegisterForm extends Component {
    state = {
        login: "",
        password: "",
        repPass: "",
        information: "",
        warnings: false
    }

    fillForm = (e) => {
        if (e.target.id === "login") {
            this.setState({
                login: e.target.value
            })
        } else if (e.target.id === "pass") {
            this.setState({
                password: e.target.value
            })
        } else if (e.target.id === "repPass") {
            this.setState({
                repPass: e.target.value
            })
        }
    }
    submitForm = e => {
        e.preventDefault();

        let isFormOk = false;
        let account = {};

        const { login, password, repPass, information } = this.state;

        if (login === "" || password === "" || repPass === "") {
            this.setState({
                warnings: true,
                information: "Wszystkie pola muszą zostać wypełnione.",
            })
        } else if (password.length < 3) {
            this.setState({
                warnings: true,
                information: "Twoje hasło musi być dłuższe niż 5 znaków.",
            })
        } else if (password !== repPass) {
            this.setState({
                warnings: true,
                information: "Twoje hasła muszą być takie same.",
            })
        } else if (login === " " || login === "  ") {
            this.setState({
                warnings: true,
                information: "Twój login nie może być spacją.",
            })
        } else {
            isFormOk = true;
            account.login = login;
            account.password = password;
            account.repPass = repPass;
        }

        if (isFormOk) {
            this.props.createAccount(account);

            this.setState({
                login: "",
                password: "",
                repPass: "",
                information: "Konto założone.",
                warnings: true
            })
        }
    }

    render() {



        return (
            <form className={this.props.formClassName} onSubmit={this.submitForm} >
                <input className="regInput" type="text" id="login" value={this.state.login} onChange={this.fillForm} />
                <input className="regInput" type="password" id="pass" value={this.state.password} onChange={this.fillForm} />
                <input className="regInput" type="password" id="repPass" value={this.state.repPass} onChange={this.fillForm} />
                <input className="registerSubmit" type="submit" value="Zarejestruj" onSubmit={this.submitForm} />
                {this.state.warnings ? this.state.information :
                    <div className="info">
                        <p className="formInfo">Mail jest niepotrzebny do rejestracji.</p>
                        <p className="formInfo">Logować będzie można się nickiem, jak i nazwą postaci (po wypełnieniu kreatora).</p>
                    </div>}
            </form>
        );
    }
}

const MapDispatchToProps = (dispatch) => {
    return {
        createAccount: (account) => dispatch(createAccount(account))
    }
}

export default connect(null, MapDispatchToProps)(RegisterForm);