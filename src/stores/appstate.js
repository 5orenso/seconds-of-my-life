import { observable, configure, action, computed, autorun } from 'mobx';
import util from '../lib/util';

configure({ enforceActions: 'always' });

class AppState {
    constructor() {
        this.setView(util.getObject('view'));
    }

    @observable view = {};

    @observable counter = util.get('counter');

    @action
    setView(view) {
        this.view = view;
        util.setObject('view', view);
    }

    @action
    setViewKey(key, value) {
        this.view[key] = value;
    }

    @action
    incCounter() {
        this.counter += 1;
        util.set('counter', this.counter);
    }

    @action
    decCounter() {
        this.counter -= 1;
        util.set('counter', this.counter);
    }

    @computed
    get counterTimes2() {
        return this.counter * 2;
    }
}

const store = new AppState();

autorun(() => {
    // console.log(store.counter);
});

export default store;
