import { h, Component } from 'preact';
import PubSub, { topics } from '../../lib/pubsub';

const STATE = {
    STATUS_MESSAGE: 'statusMessage',
    TIMER: 'statusMessageTimer',
};

const STATUS_DISPLAY_MS = 5000;

class Status extends Component {
    constructor(props) {
        super(props);
        this.setState({
            [STATE.STATUS_MESSAGE]: props.message,
        });

        this.subscriptions();
    }

    subscriptions() {
        PubSub.subscribe(topics.STATUS_MESSAGE, (msg) => {
            this.setState({
                [STATE.STATUS_MESSAGE]: msg,
            });
        });
    }

    hideStatusBar = (e) => {
        if (e) {
            e.preventDefault();
        }

        this.setState({
            [STATE.STATUS_MESSAGE]: '',
            [STATE.TIMER]: undefined,
        });
    };

    componentDidUpdate(_, previousState) {
        const prevMsg = previousState[STATE.STATUS_MESSAGE] || '';
        const currMsg = this.state[STATE.STATUS_MESSAGE] || '';

        const displayMessage = prevMsg.length === 0 && currMsg.length > 0;
        const hideMessage = prevMsg.length > 0 && currMsg.length === 0;

        if (displayMessage) {
            this.setState({ // eslint-disable-line
                [STATE.TIMER]: setTimeout(this.hideStatusBar, STATUS_DISPLAY_MS),
            });
        } else if (hideMessage) {
            clearTimeout(this.state[STATE.TIMER]);
        }
    }

    render() {
        if (!this.state[STATE.STATUS_MESSAGE]) {
            return ('');
        }

        return (<div class='container'>
            <div class='alert alert-success row'>
                <div class={`col-11`}>
                    {this.state[STATE.STATUS_MESSAGE]}
                </div>
                <div class='col-1'>
                    <a href='#' onclick={this.hideStatusBar}>
                        <i className='fas fa-times' />
                    </a>
                </div>
            </div>
        </div>);
    }
}

export default Status;
