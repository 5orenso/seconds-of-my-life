import { h, Component } from 'preact';
import PubSub, { topics } from '../../lib/pubsub';
import util from '../../lib/util';
import Error from '../error';

class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showToken: false,
            isCapsLock: false,
        };
        this.emailRef = {};
        this.passRef = {};
        this.tokenRef = {};
    }

    onAuthenticate = async (e) => {
        e.preventDefault();
        try {
            const opts = {
                method: 'POST',
                publish: false,
            };
            const body = {
                email: this.emailRef.value,
                pass: this.passRef.value,
                token: this.tokenRef.value,
            };

            const loginResponse = await util.fetchApi('/api/login', opts, body);
            if (loginResponse.status === 202 && loginResponse.needsTwoFactor) {
                PubSub.publish(topics.ERROR_MESSAGE, loginResponse.message);
                return this.setState({
                    showToken: true,
                });
            } if (![200, 202].includes(loginResponse.status) || !loginResponse.apiToken) {
                return Promise.reject(new Error('Authentication failed'));
            }

            util.setUserEmail(this.emailRef.value);
            PubSub.publish(topics.JWT_TOKEN_CHANGED, loginResponse.apiToken);
        } catch (err) {
            PubSub.publish(topics.ERROR_MESSAGE, 'Login failed');
            console.log('onAuthenticate error', err);
        }

        return true;
    };

    updateCapsLockStatus = (isCapsLock) => {
        this.setState({
            isCapsLock,
        });
    }

    render() {
        const { isCapsLock } = this.state;
        return (
            <div class='container'>
                <h2 class='mt-5 mb-5'>Login</h2>
                <Error />
                <form onsubmit={this.onAuthenticate}>
                    <div class='form-group'>
                        <label for='emailInput'>Email address</label>
                        <input type='email'
                            class='form-control'
                            name='email'
                            ref={(r) => { this.emailRef = r; }}
                            id='emailInput'
                            onKeypress={(e) => { util.isCapsLock(e, this.updateCapsLockStatus); }}
                        />
                    </div>

                    <div class='form-group'>
                        <label for='passwordInput'>Password</label>
                        <input type='password'
                            class='form-control'
                            name='pass'
                            ref={(r) => { this.passRef = r; }}
                            id='passwordInput'
                            onKeypress={(e) => { util.isCapsLock(e, this.updateCapsLockStatus); }}
                        />

                    </div>

                    {isCapsLock && <div class='alert alert-danger' role='alert'>
                        CAPS LOCK is on!
                    </div>}

                    {this.state.showToken &&
                        <div class='form-group'>
                            <label for='tokenInput'>2FA Token</label>
                            <input type='number'
                                class='form-control'
                                name='token'
                                ref={(r) => { this.tokenRef = r; }}
                                id='tokenInput'
                            />
                        </div>
                    }
                    <input type='submit' value='Log in' />
                </form>
            </div>
        );
    }
}

export default Login;
