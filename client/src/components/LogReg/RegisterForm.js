import React, { Component } from 'react'


class RegisterForm extends Component {
    state = {  }
    render() { 
        return ( 
            <form className={this.props.formClassName}>
                <input type="text"/>
                <input type="password"/>
                <input type="password"/>
                <input className="registerSubmit" type="submit"/>
            </form>
         );
    }
}
 
export default RegisterForm;