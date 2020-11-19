import React from 'react';
import '../CommonStylings/FullScreenDiv.css';
import axios from 'axios';

/* modified based on https://gist.github.com/joelgriffith/43a4a8195c9fd237a222fe84c2b2e2b4 */
class AdminAuth extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: '',
            error: '',
        };

        this.handlePassChange = this.handlePassChange.bind(this);
        this.handleUserChange = this.handleUserChange.bind(this);
        this.dismissError = this.dismissError.bind(this);
    }

    dismissError() {
        this.setState({error: ''});
    }

    handleSubmit = (evt) => {
        evt.preventDefault();

        if (!this.state.username) {
            return this.setState({error: 'Username is required'});
        }

        if (!this.state.password) {
            return this.setState({error: 'Password is required'});
        }

        axios.get('/auth', {
            params: {
                username: this.state.username,
                password: this.state.password
            }
        }).then((res) => {
            let isValid = res.data.isValid;
            if (isValid) this.props.history.push({pathname: "/admin", isAuthenticated: true});
            else return this.setState({error: 'Username or password incorrect'});
        });
    }

    handleUserChange(evt) {
        this.setState({
            username: evt.target.value,
        });
    };

    handlePassChange(evt) {
        this.setState({
            password: evt.target.value,
        });
    }

    render() {
        return (
            <div className="Login">
                <form onSubmit={this.handleSubmit}>
                    {
                        this.state.error &&
                        <h3 onClick={this.dismissError}>
                            <button onClick={this.dismissError}>✖</button>
                            {this.state.error}
                        </h3>
                    }
                    <label>User Name</label>
                    <input id='admin-username' type="text" value={this.state.username} onChange={this.handleUserChange}/>
                    <br/>
                    <label>Password</label>
                    <input id='admin-password' type="password" value={this.state.password} onChange={this.handlePassChange}/>
                    <br/>
                    <input id='admin-button' type="submit" value="Log In"/>
                    {/* FOR TESTING
                    <br/>
                    <br/>
                    <ContinueButton route='/' disabled={false}/> */}
                </form>
            </div>
        );
    }
}

export default AdminAuth;
