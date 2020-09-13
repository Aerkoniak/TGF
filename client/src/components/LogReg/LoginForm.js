import React, { Component } from 'react';

class LoginForm extends Component {
    state = {  }
    render() { 
        return ( 
            <form className={this.props.loginClassName}>
                <input type="text"/>
                <input type="password"/>
                <input type="submit"/>
            </form>
         );
    }
}
 
export default LoginForm;