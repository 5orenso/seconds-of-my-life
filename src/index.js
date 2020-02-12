// eslint-disable-next-line
import habitat from 'preact-habitat';

import Widget from './components/start';

require('preact-cli/lib/lib/webpack/polyfills');

const hab = habitat(Widget);

hab.render({
    selector: '[data-widget-host="seconds-of-my-life"]',
    clean: true,
});
