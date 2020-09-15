import React, { Component } from 'react'


class RegisterForm extends Component {
    state = {  }
    render() { 
        return ( 
            <form className={this.props.formClassName} onSubmit={(e) => e.preventDefault()} >
                <input className="regInput" type="text"/>
                <input className="regInput" type="password"/>
                <input className="regInput" type="password"/>
                <input className="registerSubmit" type="submit"/>
            </form>
         );
    }
}
 
export default RegisterForm;