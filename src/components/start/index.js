import { h, Component } from 'preact';

import Login from '../login';
import Main from '../main';
import PubSub, { topics } from '../../lib/pubsub';
import util from '../../lib/util';

const REQUIRE_LOGIN = false;

const STATE = {
    JWT_TOKEN: 'jwtToken',
};

class Start extends Component {
    constructor(props) {
        super(props);

        const apiServer = props.apiServer || `${window.location.protocol}//${window.location.host}`;
        util.setApiServer(apiServer);

        this.setState({
            [STATE.JWT_TOKEN]: util.getJwtToken(),
        });

        this.subscriptions();
    }

    subscriptions() {
        PubSub.subscribe(topics.LOG_OUT, () => {
            this.setState({
                [STATE.JWT_TOKEN]: undefined,
            });
            util.removeUserEmail();
            util.removeJwtToken();
        });

        PubSub.subscribe(topics.JWT_TOKEN_CHANGED, async (token) => {
            util.setJwtToken(token);
            this.setState({
                [STATE.JWT_TOKEN]: token,
            });
        });
    }

    getContent = () => {
        if (REQUIRE_LOGIN && !this.state[STATE.JWT_TOKEN]) {
            return (<Login />);
        }
        return (<Main />);
    };

    render() {
        return this.getContent();
    }
}

export default Start;
