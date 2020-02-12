import { h, Component } from 'preact';
import PubSub, { topics } from '../../lib/pubsub';

const STATE = {
    ERROR_MESSAGE: 'errorMessage',
    TIMER: 'timer',
};

const ERROR_DISPLAY_MS = 10000;

class ErrorMessage extends Component {
    constructor(props) {
        super(props);
        this.setState({
            [STATE.ERROR_MESSAGE]: props.message,
        });

        PubSub.subscribe(topics.ERROR_MESSAGE, (msg) => {
            this.setState({
                [STATE.ERROR_MESSAGE]: msg,
            });

            PubSub.publish(topics.INDICATE_FETCH_CONTENT_STOP);
        });
    }

    componentDidUpdate(_, previousState) {
        const prevMsg = previousState[STATE.ERROR_MESSAGE] || '';
        const currMsg = this.state[STATE.ERROR_MESSAGE] || '';

        const displayMessage = prevMsg.length === 0 && currMsg.length > 0;
        const hideMessage = prevMsg.length > 0 && currMsg.length === 0;

        if (displayMessage) {
            this.setState({ // eslint-disable-line
                [STATE.TIMER]: setTimeout(this.hideErrorBar, ERROR_DISPLAY_MS),
            });
        } else if (hideMessage) {
            clearTimeout(this.state[STATE.TIMER]);
        }
    }

    hideErrorBar = (e) => {
        if (e) {
            e.preventDefault();
        }
        this.setState({
            [STATE.ERROR_MESSAGE]: '',
            [STATE.TIMER]: undefined,
        });
    };

    render() {
        if (!this.state[STATE.ERROR_MESSAGE]) {
            return ('');
        }

        return (<div class='container'>
            <div class='alert alert-danger row'>
                <div class={`col-11`}>
                    {this.state[STATE.ERROR_MESSAGE]}
                </div>
                <div class='col-1'>
                    <a href='#' onclick={this.hideErrorBar}>
                        <i className='fas fa-times' />
                    </a>
                </div>
            </div>
        </div>);
    }
}

export default ErrorMessage;
