import React, { Component } from 'react'


class RegisterForm extends Component {
    state = {  }
    render() { 
        return ( 
            <form className={this.props.formClassName} onSubmit={(e) => e.preventDefault()} >
                <input className="regInput" type="text"/>
                <input className="regInput" type="password"/>
                <input className="regInput" type="password"/>
                <input className="registerSubmit" type="submit" value="Zarejestruj" />
                <p className="formInfo">Mail jest niepotrzebny do rejestracji.</p>
                <p className="formInfo">Logować będzie można się nickiem, jak i nazwą postaci (po wypełnieniu kreatora).</p>
            </form>
         );
    }
}
 
export default RegisterForm;