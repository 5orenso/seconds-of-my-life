import { h, Component } from 'preact';
import PubSub, { topics } from '../../lib/pubsub';

class Progress extends Component {
    constructor(props) {
        super(props);
        this.state = {
            progress: 0,
            display: 'block',
        };
        this.subscriptions();
    }

    subscriptions() {
        PubSub.subscribe(topics.LOADING_PROGRESS, (progress) => {
            if (progress === 100) {
                // Hide bar white we go back to 0;
                clearTimeout(this.timerAnimateId);
                this.timerAnimateId = setTimeout(() => {
                    this.setState({ display: 'none' });
                }, 700);
                // Set bar to go to 0:
                clearTimeout(this.timerResetId);
                this.timerResetId = setTimeout(() => {
                    this.setState({
                        progress: 0,
                        display: 'block',
                    });
                }, 1000);
            }
            if (progress === 0) {
                this.setState({ display: 'block' });
            }
            this.setState({
                progress,
            });
        });
    }

    render() {
        const { progress, display } = this.state;
        return (
            <div class='progress' style='height: 2px;'>
                <div class='progress-bar progress-bar-striped progress-bar-animated'
                    role='progressbar'
                    aria-valuenow={progress}
                    aria-valuemin='0'
                    aria-valuemax='100'
                    style={`width: ${progress}%; display: ${display};`}
                />
            </div>
        );
    }
}

export default Progress;
