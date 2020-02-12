import querystring from 'querystring';
import PubSub, { topics } from './pubsub';

const API_SERVER_KEY = 'apiServer';
const IMAGE_SERVER_KEY = 'imageServer';
const JWT_TOKEN_KEY = 'jwtToken';
const USER_EMAIL = 'userEmail';
const IS_MAC = /Mac/.test(navigator.platform);

class Utilities {
    static isNumber(number) {
        return !Number.isNaN(parseFloat(number)) && Number.isFinite(number);
    }

    /**
     *
     * @param object
     * @param name Name of key on level 1
     * @param name Name of key on level 2
     * ...
     * @param name Name of key on level N
     * @returns {true|false}
     * @example
     *    Let's say you have object:
     *      obj = {
     *            foo: {
     *                bar: 1
     *            }
     *        };
     *    1. You want to check if obj.foo.bar exists:
     *      checkNested(obj, 'foo', 'bar');
     *          returns true
     *    2. You want to check if obj.foo.bar.gomle exists:
     *      checkNested(obj, 'foo', 'bar', 'gomle');
     *          returns false
     */
    static checkNested($obj, ...args) {
        let obj = $obj;
        for (let i = 0; i < args.length; i += 1) {
            if (!obj || !obj.hasOwnProperty(args[i])) {
                return false;
            }
            obj = obj[args[i]];
        }
        return true;
    }

    static getNestedValue(obj, path) {
        let el = obj;
        path.split('.').forEach((part) => {
            if (typeof el[part] === 'undefined') {
                el = null;
            }

            if (el) {
                el = el[part];
            }
        });

        return el;
    }

    static padDate(number) {
        let r = String(number);
        if (r.length === 1) {
            r = `0${r}`;
        }
        return r;
    }

    static parseInputDate(inputDate) {
        let parsedDate;
        if (typeof inputDate === 'string' || typeof inputDate === 'number') {
            if (inputDate > 1000000000 && inputDate < 9999999999) {
                parsedDate = new Date(0); // The 0 there is the key, which sets the date to the epoch
                parsedDate.setUTCSeconds(inputDate);
            } else if (inputDate > 1000000000000 && inputDate < 9999999999999) {
                parsedDate = new Date(0); // The 0 there is the key, which sets the date to the epoch
                parsedDate.setUTCSeconds(parseInt(inputDate / 1000, 10));
            } else if (typeof inputDate === 'string' && inputDate.match(/\d{4}-\d{2}-\d{2}/)) {
                // "d.m.y"
                parsedDate = new Date(inputDate);
            }
        } else {
            parsedDate = new Date();
        }
        return parsedDate;
    }

    static isoDate(inputDate, showSeconds = false, showTimezone = false) {
        const availDate = Utilities.parseInputDate(inputDate);
        // "d.m.y"
        if (availDate) {
            const mm = availDate.getMonth() + 1;
            const dd = availDate.getDate();
            const yy = availDate.getFullYear();
            const hh = availDate.getHours();
            const mi = availDate.getMinutes();
            const ss = availDate.getSeconds();
            const tzo = -availDate.getTimezoneOffset();
            const dif = tzo >= 0 ? '+' : '-';

            let ret = `${Utilities.padDate(yy)}-${Utilities.padDate(mm)}-${Utilities.padDate(dd)}`;
            ret += ` ${Utilities.padDate(hh)}:${Utilities.padDate(mi)}`;
            if (showSeconds) {
                ret += `:${Utilities.padDate(ss)}`;
            }
            if (showTimezone) {
                ret += `${dif}${tzo}`;
            }
            return ret;
        }
        return 'n/a';
    }

    static ffeDateTime(inputDate, showSeconds = false, showTimezone = false) {
        const availDate = Utilities.parseInputDate(inputDate);
        // "d.m.y"
        if (availDate) {
            const mm = availDate.getMonth() + 1;
            const dd = availDate.getDate();
            const yy = availDate.getFullYear();
            const hh = availDate.getHours();
            const mi = availDate.getMinutes();
            const ss = availDate.getSeconds();
            const tzo = -availDate.getTimezoneOffset();
            const dif = tzo >= 0 ? '+' : '-';

            const date = `${Utilities.padDate(dd)}.${Utilities.padDate(mm)}.${Utilities.padDate(yy)}`;
            let time = `${Utilities.padDate(hh)}:${Utilities.padDate(mi)}`;
            if (showSeconds) {
                time += `:${Utilities.padDate(ss)}`;
            }
            if (showTimezone) {
                time += `${dif}${tzo}`;
            }
            return `${date} ${time}`;
        }
        return 'n/a';
    }

    static getApiServer() {
        return localStorage.getItem(API_SERVER_KEY);
    }

    static setApiServer(apiServer) {
        return localStorage.setItem(API_SERVER_KEY, apiServer);
    }

    static getImageServer() {
        return localStorage.getItem(IMAGE_SERVER_KEY);
    }

    static setImageServer(imageServer) {
        return localStorage.setItem(IMAGE_SERVER_KEY, imageServer);
    }

    static getJwtToken() {
        return localStorage.getItem(JWT_TOKEN_KEY);
    }

    static setJwtToken(token) {
        return localStorage.setItem(JWT_TOKEN_KEY, token);
    }

    static removeJwtToken() {
        return localStorage.removeItem(JWT_TOKEN_KEY);
    }

    static setUserEmail(email) {
        return localStorage.setItem(USER_EMAIL, email);
    }

    static getUserEmail() {
        return localStorage.getItem(USER_EMAIL);
    }

    static removeUserEmail() {
        return localStorage.removeItem(USER_EMAIL);
    }

    static setObject(objKey, key, val) {
        const value = localStorage.getItem(objKey);
        let obj = {};
        if (typeof key === 'object') {
            obj = { ...key };
        } else {
            if (typeof value === 'string') {
                obj = JSON.parse(value);
            }
            obj[key] = val;
        }
        return localStorage.setItem(objKey, JSON.stringify(obj));
    }

    static unsetObj(objKey, key) {
        if (typeof key === 'string') {
            return Utilities.setObject(objKey, key, null);
        }
        return localStorage.setItem(objKey, null);
    }

    static getObject(objKey) {
        let data = JSON.parse(localStorage.getItem(objKey));
        if (data === null) {
            data = {};
        }
        return data;
    }

    static set(key, val) {
        return localStorage.setItem(key, JSON.stringify(val));
    }

    static unset(key) {
        return localStorage.setItem(key, null);
    }

    static get(key) {
        return JSON.parse(localStorage.getItem(key));
    }

    /**
     *
     * @param endpoint
     * @param opts
     *  - method: PUT, GET, POST, etc.. Defaults to GET
     *  - publish: if true, use PubSub for various feedbacks (including error handling). Defaults to true
     * @param body
     * @returns {Promise<Promise<any>|Array>}
     */
    static async fetchApi(endpoint, opts = {}, body = {}) {
        const apiServer = Utilities.getApiServer();

        const shouldPublish = opts.hasOwnProperty('publish') ? opts.publish : true;

        if (shouldPublish) {
            PubSub.publish(topics.LOADING_PROGRESS, 0);
        }

        const jwtToken = Utilities.getJwtToken();
        const fetchOpt = {
            credentials: 'omit',
            method: 'GET',
            mode: 'cors',
            cache: 'default',
            headers: {},
            publish: true,
            ...opts,
        };

        if (jwtToken) {
            fetchOpt.headers = {
                Authorization: `Bearer ${jwtToken}`,
            };
        }

        let qs = '';
        if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(opts.method)) {
            fetchOpt.credentials = 'include';
            fetchOpt.body = JSON.stringify(body);
            fetchOpt.headers['Content-Type'] = 'application/json';
        } else {
            qs = querystring.stringify(body);
        }

        if (shouldPublish) {
            PubSub.publish(topics.LOADING_PROGRESS, 25);
        }

        try {
            const response = await fetch(`${apiServer}${endpoint}${qs ? `?${qs}` : ''}`, fetchOpt);
            if (shouldPublish) {
                PubSub.publish(topics.LOADING_PROGRESS, 100);
            }

            if (response.status >= 500) {
                throw new Error(`${response.status} ${response.statusText}`);
            }

            return response.json();
        } catch (err) {
            if (shouldPublish) {
                PubSub.publish(topics.ERROR_MESSAGE, 'An error occurred');
                return [];
            }

            throw err;
        }
    }

    static format($number, $decimals, $decPoint, $thousandsSep, $compact = false) {
        const decimals = Number.isNaN($decimals) ? 2 : Math.abs($decimals);
        const decPoint = ($decPoint === undefined) ? ',' : $decPoint;
        const thousandsSep = ($thousandsSep === undefined) ? ' ' : $thousandsSep;

        const number = Math.abs($number || 0);
        const sign = Math.sign($number) >= 0 ? '' : '-';

        if ($compact) {
            if (number > 999999) {
                const compact = Utilities.format((number / 1000000), 1, $decPoint, $thousandsSep);
                return `${sign}${compact}M`;
            } if (number > 999) {
                const compact = Utilities.format((number / 1000), 1, $decPoint, $thousandsSep);
                return `${sign}${compact}K`;
            }
        }

        if (Utilities.isNumber(number)) {
            const intPart = String(parseInt(number.toFixed(decimals), 10));
            const j = intPart.length > 3 ? intPart.length % 3 : 0;

            const firstPart = (j ? intPart.substr(0, j) + thousandsSep : '');
            const secondPart = intPart.substr(j).replace(/(\d{3})(?=\d)/g, `$1${thousandsSep}`);
            const decimalPart = (decimals ? decPoint + Math.abs(number - intPart).toFixed(decimals).slice(2) : '');
            return `${sign}${firstPart}${secondPart}${decimalPart}`;
        }
        return '';
    }

    static formatCompact(number) {
        return Utilities.format(number, 0, ',', ' ', true);
    }

    static formatBytes($bytes, decimals) {
        const bytes = parseInt($bytes, 10);
        if (Utilities.isNumber(bytes)) {
            if (bytes === 0) {
                return '0 Bytes';
            }
            const k = 1024;
            const dm = decimals || 2;
            const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
            const i = Math.floor(Math.log(bytes) / Math.log(k));
            return `${parseFloat((bytes / (k ** i)).toFixed(dm))} ${sizes[i]}`;
        }
        return '';
    }

    static getDomain() {
        if (Utilities.checkNested(window, 'location')) {
            return window.location.hostname;
        }
        return undefined;
    }

    static getImageHostname() {
        const imageServer = Utilities.getImageServer();
        return imageServer;
    }

    static getImageSrc(image, size = '220x', index = 1, defaultPrefix = 'product') {
        if (typeof image === 'object') {
            if (image.newFilename) {
                return `${size}/${image.newFilename}`;
            }
            return `${size}/${image.prefix || defaultPrefix}_${index}_${image.filename}.${image.ext}`;
        }
        return '';
    }

    static isCapsLock(event, callback = () => {}) {
        let capsLock = false;
        const charCode = event.charCode;
        const shiftKey = event.shiftKey;

        if (charCode >= 97 && charCode <= 122) {
            capsLock = shiftKey;
        } else if (charCode >= 65 && charCode <= 90 && !(shiftKey && IS_MAC)) {
            capsLock = !shiftKey;
        }
        callback(capsLock);
    }

    static validateEmail(email) {
        // eslint-disable-next-line
        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }

    static ucfirst(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    static randomPassword() {
        const randomstring = Math.random().toString(36).slice(-8);
        return randomstring;
    }

    static cleanObject($obj, opt = {}) {
        const obj = Object.assign({}, $obj);
        const keys = Object.keys(obj);
        for (let i = 0; i < keys.length; i += 1) {
            const idx = keys[i];
            if (obj.hasOwnProperty(idx)) {
                if (typeof obj[idx] === 'undefined' || obj[idx] === null) {
                    delete obj[idx];
                }
                if (opt.emptyIsUndefined && obj[idx] === '') {
                    delete obj[idx];
                }
                if (opt.zeroIsUndefined && obj[idx] === 0) {
                    delete obj[idx];
                }
                if (opt.zeroStringIsUndefined && obj[idx] === '0') {
                    delete obj[idx];
                }
                if (opt.falseIsUndefined && obj[idx] === false) {
                    delete obj[idx];
                }
            }
        }
        return obj;
    }
}

export default Utilities;
