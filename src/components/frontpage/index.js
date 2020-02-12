import { h, Component } from 'preact';
import { observer } from 'mobx-preact';
import style from './style.css';
import util from '../../lib/util';

const initialState = {
    timeSpentOn: 'Mobile usage',
    showPercent: true,
    minutesEachDay: 193,
    dailySleepHours: 7.5,
    dailyWorkHours: 8,
    dailyCommuteHours: 1,
    weeklyWorkDays: 5,
    monthlyWorkDays: 20,
    hoursEachDay: 24,
    hoursEachWeek: 24 * 7,
    hoursEachMonth: 24 * 30,
    hoursEachYear: 24 * 365,
    holidaysEachYear: 25,
    hoursHolidayEachYear: 24 * 25,
    monthsHolidayEachYear: 1.25,
    daysInWeek: 7,
    daysInMonth: 30,
    daysInYear: 365,
    yearsInLifetime: 70,
    monthsInYear: 12,
};

function formatRound(num, scale = 1) {
    if (!('' + num).includes('e')) {
        return +(Math.round(num + 'e+' + scale)  + 'e-' + scale);
    }
    const arr = ('' + num).split('e');
    let sig = '';
    if (+arr[1] + scale > 0) {
        sig = '+';
    }
    return +(Math.round(+arr[0] + 'e' + sig + (+arr[1] + scale)) + "e-" + scale);
}

const duration = (seconds, localNames = ['y', 'm', 'w', 'd', 'hr', 'min', 'sec']) => {
    // weekParts :: Int -> [Int]
    const weekParts = intSeconds => [0, 12, 4, 7, 24, 60, 60]
        .reduceRight((a, x) => {
            const r = a.rem;
            const mod = x !== 0 ? r % x : r;
            return {
                rem: (r - mod) / (x || 1),
                parts: [mod].concat(a.parts),
            };
        }, {
            rem: intSeconds,
            parts: [],
        })
        .parts;

    // compoundDuration :: [String] -> Int -> String
    const compoundDuration = (labels, intSeconds) => weekParts(intSeconds)
        .map((v, i) => [v, labels[i]])
        .reduce((a, x) => a.concat(x[0] ? [`${x[0]} ${x[1] || '?'}`] : []), [])
        .join(', ');

    return compoundDuration(localNames, seconds);
};

@observer
class Frontpage extends Component {
    constructor(props) {
        super(props);
        const inputProps = util.cleanObject({
            timeSpentOn: props.timeSpentOn,
            minutesEachDay: props.minutesEachDay,
            dailySleepHours: props.dailySleepHours,
            dailyWorkHours: props.dailyWorkHours,
            dailyCommuteHours: props.dailyCommuteHours,
            weeklyWorkDays: props.weeklyWorkDays,
            monthlyWorkDays: props.monthlyWorkDays,
        });
        this.state = {
            ...initialState,
            ...inputProps,
        };
    }

    setTimeSpentOn(timeSpentOn) {
        this.setState({ timeSpentOn });
    }

    setShowPercent(showPercent) {
        this.setState({ showPercent });
    }

    setMinutesEachDay(minutes) {
        this.setState({
            minutesEachDay: minutes,
        });
    }

    setDailyWorkHours(hours) {
        this.setState({
            dailyWorkHours: hours,
        });
    }

    setDailyCommuteHours(hours) {
        this.setState({
            dailyCommuteHours: hours,
        });
    }

    setDailySleepHours(hours) {
        this.setState({
            dailySleepHours: hours,
        });
    }

    setHoursHolidayEachYear(days) {
        const { hoursEachDay, monthlyWorkDays } = this.state;
        this.setState({
            holidaysEachYear: days,
            hoursHolidayEachYear: hoursEachDay * days,
            monthsHolidayEachYear: days / monthlyWorkDays,
        });
    }

    calculateEachDay() {
        const { minutesEachDay } = this.state;
        const sec = minutesEachDay * 60;
        return duration(sec);
    }

    calculateEachWeek() {
        const { minutesEachDay, daysInWeek } = this.state;
        const sec = minutesEachDay * 60 * daysInWeek;
        return duration(sec);
    }

    calculateEachMonth() {
        const { minutesEachDay, daysInMonth } = this.state;
        const sec = minutesEachDay * 60 * daysInMonth;
        return duration(sec);
    }

    calculateEachYear() {
        const { minutesEachDay, daysInYear } = this.state;
        const sec = minutesEachDay * 60 * daysInYear;
        return duration(sec);
    }

    calculateEachDecade() {
        const { minutesEachDay, daysInYear } = this.state;
        const daysInDecade = daysInYear * 10;
        const sec = minutesEachDay * 60 * daysInDecade;
        return duration(sec);
    }

    calculateALifetime() {
        const { minutesEachDay, daysInYear, yearsInLifetime } = this.state;
        const daysInLifetime = daysInYear * yearsInLifetime;
        const sec = minutesEachDay * 60 * daysInLifetime;
        return duration(sec);
    }

    // eslint-disable-next-line class-methods-use-this
    hoursPart(hoursTotal = 24, doingHours = 8) {
        return doingHours / hoursTotal * 100;
    }

    // Daily
    dailySleep(partOfDay = false) {
        const { dailySleepHours, hoursEachDay } = this.state;
        if (partOfDay) {
            return this.hoursPart(hoursEachDay, dailySleepHours);
        }
        return dailySleepHours;
    }

    dailyWork(partOfDay = false) {
        const { dailyWorkHours, hoursEachDay } = this.state;
        if (partOfDay) {
            return this.hoursPart(hoursEachDay, dailyWorkHours);
        }
        return dailyWorkHours;
    }

    dailyCommute(partOfDay = false) {
        const { dailyCommuteHours, hoursEachDay } = this.state;
        if (partOfDay) {
            return this.hoursPart(hoursEachDay, dailyCommuteHours);
        }
        return dailyCommuteHours;
    }

    dailyUsage(partOfDay = false) {
        const { minutesEachDay, hoursEachDay } = this.state;
        if (partOfDay) {
            return this.hoursPart(hoursEachDay, minutesEachDay / 60);
        }
        return minutesEachDay / 60;
    }

    dailyOther(partOfDay = false) {
        const { dailySleepHours, dailyWorkHours, dailyCommuteHours, hoursEachDay } = this.state;
        const { minutesEachDay } = this.state;
        const restHours = hoursEachDay - dailySleepHours - dailyWorkHours - dailyCommuteHours - minutesEachDay / 60;
        if (partOfDay) {
            return this.hoursPart(hoursEachDay, restHours);
        }
        return restHours;
    }

    // Weekly
    weeklySleep(partOfDay = false) {
        const { dailySleepHours, hoursEachWeek, daysInWeek } = this.state;
        if (partOfDay) {
            return this.hoursPart(hoursEachWeek, dailySleepHours * daysInWeek);
        }
        return dailySleepHours * daysInWeek;
    }

    weeklyWork(partOfDay = false) {
        const { dailyWorkHours, hoursEachWeek, weeklyWorkDays } = this.state;
        if (partOfDay) {
            return this.hoursPart(hoursEachWeek, dailyWorkHours * weeklyWorkDays);
        }
        return dailyWorkHours * weeklyWorkDays;
    }

    weeklyCommute(partOfDay = false) {
        const { dailyCommuteHours, hoursEachWeek, weeklyWorkDays } = this.state;
        if (partOfDay) {
            return this.hoursPart(hoursEachWeek, dailyCommuteHours * weeklyWorkDays);
        }
        return dailyCommuteHours;
    }

    weeklyUsage(partOfDay = false) {
        const { minutesEachDay, hoursEachWeek, daysInWeek } = this.state;
        if (partOfDay) {
            return this.hoursPart(hoursEachWeek, minutesEachDay / 60 * daysInWeek);
        }
        return minutesEachDay / 60 * daysInWeek;
    }

    weeklyOther(partOfDay = false) {
        const { dailySleepHours, dailyWorkHours, dailyCommuteHours, hoursEachWeek, weeklyWorkDays, daysInWeek } = this.state;
        const { minutesEachDay } = this.state;
        const restHours = hoursEachWeek - dailySleepHours * daysInWeek - dailyWorkHours * weeklyWorkDays - dailyCommuteHours * weeklyWorkDays - minutesEachDay / 60 * daysInWeek;
        if (partOfDay) {
            return this.hoursPart(hoursEachWeek, restHours);
        }
        return restHours;
    }

    // Monthly
    monthlySleep(partOfDay = false) {
        const { dailySleepHours, hoursEachMonth, daysInMonth } = this.state;
        if (partOfDay) {
            return this.hoursPart(hoursEachMonth, dailySleepHours * daysInMonth);
        }
        return dailySleepHours * daysInMonth;
    }

    monthlyWork(partOfDay = false) {
        const { dailyWorkHours, hoursEachMonth, monthlyWorkDays } = this.state;
        if (partOfDay) {
            return this.hoursPart(hoursEachMonth, dailyWorkHours * monthlyWorkDays);
        }
        return dailyWorkHours * monthlyWorkDays;
    }

    monthlyCommute(partOfDay = false) {
        const { dailyCommuteHours, hoursEachMonth, monthlyWorkDays } = this.state;
        if (partOfDay) {
            return this.hoursPart(hoursEachMonth, dailyCommuteHours * monthlyWorkDays);
        }
        return dailyCommuteHours * monthlyWorkDays;
    }

    monthlyUsage(partOfDay = false) {
        const { minutesEachDay, hoursEachMonth, daysInMonth } = this.state;
        const usedHours = minutesEachDay / 60 * daysInMonth;
        if (partOfDay) {
            return this.hoursPart(hoursEachMonth, usedHours);
        }
        return minutesEachDay / 60 * daysInMonth;
    }

    monthlyOther(partOfDay = false) {
        const { dailySleepHours, dailyWorkHours, dailyCommuteHours, hoursEachMonth, daysInMonth, monthlyWorkDays } = this.state;
        const { minutesEachDay } = this.state;
        const sleepHours = dailySleepHours * daysInMonth;
        const workHours = dailyWorkHours * monthlyWorkDays;
        const commuteHours = dailyCommuteHours * monthlyWorkDays;
        const usedHours = minutesEachDay / 60 * daysInMonth;
        const restHours = hoursEachMonth - sleepHours - workHours - commuteHours - usedHours;
        if (partOfDay) {
            return this.hoursPart(hoursEachMonth, restHours);
        }
        return restHours;
    }

    // Yearly
    yearlySleep(partOfDay = false, years = 1) {
        const { dailySleepHours, hoursEachYear, daysInYear } = this.state;
        if (partOfDay) {
            return this.hoursPart(hoursEachYear * years, dailySleepHours * daysInYear * years);
        }
        return dailySleepHours * daysInYear * years;
    }

    yearlyWork(partOfDay = false, years = 1, activeYears) {
        const { dailyWorkHours, hoursEachYear } = this.state;
        if (partOfDay) {
            return this.hoursPart(hoursEachYear * years, dailyWorkHours * 20 * 11 * (activeYears || years));
        }
        return dailyWorkHours * 20 * 11 * (activeYears || years);
    }

    yearlyCommute(partOfDay = false, years = 1, activeYears) {
        const { dailyCommuteHours, hoursEachYear } = this.state;
        if (partOfDay) {
            return this.hoursPart(hoursEachYear * years, dailyCommuteHours * 20 * 11 * (activeYears || years));
        }
        return dailyCommuteHours * 20 * 11 * (activeYears || years);
    }

    yearlyHoliday(partOfDay = false, years = 1, activeYears) {
        const { hoursHolidayEachYear, hoursEachYear } = this.state;
        if (partOfDay) {
            return this.hoursPart(hoursEachYear * years, hoursHolidayEachYear * (activeYears || years));
        }
        return hoursHolidayEachYear * (activeYears || years);
    }

    yearlyUsage(partOfDay = false, years = 1) {
        const { minutesEachDay, hoursEachYear, daysInYear } = this.state;
        const usedHours = minutesEachDay / 60 * daysInYear * years;
        if (partOfDay) {
            return this.hoursPart(hoursEachYear * years, usedHours);
        }
        return minutesEachDay / 60 * daysInYear * years;
    }

    yearlyOther(partOfDay = false, years = 1, activeYears) {
        const { dailySleepHours, dailyWorkHours, dailyCommuteHours, hoursHolidayEachYear, monthsHolidayEachYear, hoursEachYear, daysInYear, monthlyWorkDays, monthsInYear } = this.state;
        const { minutesEachDay } = this.state;
        const sleepHours = dailySleepHours * daysInYear * years;
        const workHours = dailyWorkHours * monthlyWorkDays * (monthsInYear - monthsHolidayEachYear) * (activeYears || years);
        const commuteHours = dailyCommuteHours * monthlyWorkDays * monthsHolidayEachYear * (activeYears || years);
        const holidayHours = hoursHolidayEachYear * (activeYears || years);
        const usedHours = minutesEachDay / 60 * daysInYear * years;
        const restHours = hoursEachYear * years - sleepHours - workHours - commuteHours - holidayHours - usedHours;
        if (partOfDay) {
            return this.hoursPart(hoursEachYear * years, restHours);
        }
        return restHours;
    }

    render() {
        const { minutesEachDay, dailyWorkHours, dailyCommuteHours, dailySleepHours, hoursHolidayEachYear, holidaysEachYear, showPercent, timeSpentOn } = this.state;

        return (
            <div class='container'>
                <div class='row'>
                    <div class='col-12'>
                        <div class='row mb-5'>
                            <div class='col-12 mb-4'>
                                <div class="form-group row">
                                    <label class='text-muted col-sm-5 col-form-label text-right' for='timeSpentOn'>The thing you spend time on</label>
                                    <div class="col-sm-6">
                                        <input
                                            type='text'
                                            class={`form-control`}
                                            id='timeSpentOn'
                                            value={timeSpentOn}
                                            onInput={e => this.setTimeSpentOn(e.target.value)}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div class='col-6'>
                                <label class='text-muted' for='dailySleepHours'>Daily sleep hours ({dailySleepHours} hours)</label>
                                <input
                                    type='range'
                                    class={`custom-range ${style.primary}`}
                                    id='dailySleepHours'
                                    min='4'
                                    max='14'
                                    step='0.5'
                                    value={dailySleepHours}
                                    onInput={e => this.setDailySleepHours(e.target.value)}
                                />
                                <label class='text-muted' for='dailyCommuteHours'>Daily commute hours ({dailyCommuteHours} hours)</label>
                                <input
                                    type='range'
                                    class={`custom-range ${style.warning}`}
                                    id='dailyCommuteHours'
                                    min='0'
                                    max='6'
                                    step='0.5'
                                    value={dailyCommuteHours}
                                    onInput={e => this.setDailyCommuteHours(e.target.value)}
                                />
                            </div>
                            <div class='col-6'>
                                <label class='text-muted' for='dailyWorkHours'>Daily work hours ({dailyWorkHours} hours)</label>
                                <input
                                    type='range'
                                    class={`custom-range ${style.success}`}
                                    id='dailyWorkHours'
                                    min='4'
                                    max='14'
                                    step='0.5'
                                    value={dailyWorkHours}
                                    onInput={e => this.setDailyWorkHours(e.target.value)}
                                />
                                <label class='text-muted' for='hoursHolidayEachYear'>Yearly holidays ({holidaysEachYear} days)</label>
                                <input
                                    type='range'
                                    class={`custom-range ${style.info}`}
                                    id='hoursHolidayEachYear'
                                    min='7'
                                    max='60'
                                    step='1'
                                    value={holidaysEachYear}
                                    onInput={e => this.setHoursHolidayEachYear(e.target.value)}
                                />
                            </div>
                        </div>

                        <label for='minutesADay'>Time each day spent on: {timeSpentOn} ({this.calculateEachDay()})</label>
                        <input
                            type='range'
                            class={`custom-range ${style.danger}`}
                            id='minutesADay'
                            min='0'
                            max='420'
                            step='1'
                            value={minutesEachDay}
                            onInput={e => this.setMinutesEachDay(e.target.value)}
                        />

                        <div class='mb-2'>
                            <small>Each day: {this.calculateEachDay()}<br /></small>
                            <div class='progress'>
                                <div class='progress-bar bg-primary' role='progressbar' style={`width: ${this.dailySleep(true)}%`}>
                                    {showPercent ? <span>{formatRound(this.dailySleep(true, 1))}%</span> : <span>{formatRound(this.dailySleep(false), 1)}h</span>}
                                </div>
                                <div class='progress-bar bg-warning' role='progressbar' style={`width: ${this.dailyCommute(true)}%`}>
                                    {showPercent ? <span>{formatRound(this.dailyCommute(true, 1))}%</span> : <span>{formatRound(this.dailyCommute(false), 1)}h</span>}
                                </div>
                                <div class='progress-bar bg-success' role='progressbar' style={`width: ${this.dailyWork(true)}%`}>
                                    {showPercent ? <span>{formatRound(this.dailyWork(true, 1))}%</span> : <span>{formatRound(this.dailyWork(false), 1)}h</span>}
                                </div>
                                <div class='progress-bar bg-danger' role='progressbar' style={`width: ${this.dailyUsage(true)}%`}>
                                    {showPercent ? <span>{formatRound(this.dailyUsage(true, 1))}%</span> : <span>{formatRound(this.dailyUsage(false), 1)}h</span>}
                                </div>
                                <div class='progress-bar bg-secondary' role='progressbar' style={`width: ${this.dailyOther(true)}%`}>
                                    {showPercent ? <span>{formatRound(this.dailyOther(true, 1))}%</span> : <span>{formatRound(this.dailyOther(false), 1)}h</span>}
                                </div>
                            </div>
                        </div>
                        <div class='mb-2'>
                            <small>Each week: {this.calculateEachWeek()}<br /></small>
                            <div class='progress'>
                                <div class='progress-bar bg-primary' role='progressbar' style={`width: ${this.weeklySleep(true)}%`}>
                                    {showPercent ? <span>{formatRound(this.weeklySleep(true, 1))}%</span> : <span>{formatRound(this.weeklySleep(false), 1)}h</span>}
                                </div>
                                <div class='progress-bar bg-warning' role='progressbar' style={`width: ${this.weeklyCommute(true)}%`}>
                                    {showPercent ? <span>{formatRound(this.weeklyCommute(true, 1))}%</span> : <span>{formatRound(this.weeklyCommute(false), 1)}h</span>}
                                </div>
                                <div class='progress-bar bg-success' role='progressbar' style={`width: ${this.weeklyWork(true)}%`}>
                                    {showPercent ? <span>{formatRound(this.weeklyWork(true, 1))}%</span> : <span>{formatRound(this.weeklyWork(false), 1)}h</span>}
                                </div>
                                <div class='progress-bar bg-danger' role='progressbar' style={`width: ${this.weeklyUsage(true)}%`}>
                                    {showPercent ? <span>{formatRound(this.weeklyUsage(true, 1))}%</span> : <span>{formatRound(this.weeklyUsage(false), 1)}h</span>}
                                </div>
                                <div class='progress-bar bg-secondary' role='progressbar' style={`width: ${this.weeklyOther(true)}%`}>
                                    {showPercent ? <span>{formatRound(this.weeklyOther(true, 1))}%</span> : <span>{formatRound(this.weeklyOther(false), 1)}h</span>}
                                </div>
                            </div>
                        </div>
                        <div class='mb-2'>
                            <small>Each month: {this.calculateEachMonth()}<br /></small>
                            <div class='progress'>
                                <div class='progress-bar bg-primary' role='progressbar' style={`width: ${this.monthlySleep(true)}%`}>
                                    {showPercent ? <span>{formatRound(this.monthlySleep(true, 1))}%</span> : <span>{formatRound(this.monthlySleep(false), 1)}h</span>}
                                </div>
                                <div class='progress-bar bg-warning' role='progressbar' style={`width: ${this.monthlyCommute(true)}%`}>
                                    {showPercent ? <span>{formatRound(this.monthlyCommute(true, 1))}%</span> : <span>{formatRound(this.monthlyCommute(false), 1)}h</span>}
                                </div>
                                <div class='progress-bar bg-success' role='progressbar' style={`width: ${this.monthlyWork(true)}%`}>
                                    {showPercent ? <span>{formatRound(this.monthlyWork(true, 1))}%</span> : <span>{formatRound(this.monthlyWork(false), 1)}h</span>}
                                </div>
                                <div class='progress-bar bg-danger' role='progressbar' style={`width: ${this.monthlyUsage(true)}%`}>
                                    {showPercent ? <span>{formatRound(this.monthlyUsage(true, 1))}%</span> : <span>{formatRound(this.monthlyUsage(false), 1)}h</span>}
                                </div>
                                <div class='progress-bar bg-secondary' role='progressbar' style={`width: ${this.monthlyOther(true)}%`}>
                                    {showPercent ? <span>{formatRound(this.monthlyOther(true, 1))}%</span> : <span>{formatRound(this.monthlyOther(false), 1)}h</span>}
                                </div>
                            </div>
                        </div>
                        <div class='mb-2'>
                            <small>Each year: {this.calculateEachYear()}<br /></small>
                            <div class='progress'>
                                <div class='progress-bar bg-primary' role='progressbar' style={`width: ${this.yearlySleep(true)}%`}>
                                    {showPercent ? <span>{formatRound(this.yearlySleep(true, 1), 1)}%</span> : <span>{formatRound(this.yearlySleep(false, 1), 0)}h</span>}
                                </div>
                                <div class='progress-bar bg-warning' role='progressbar' style={`width: ${this.yearlyCommute(true)}%`}>
                                    {showPercent ? <span>{formatRound(this.yearlyCommute(true, 1), 1)}%</span> : <span>{formatRound(this.yearlyCommute(false, 1), 0)}h</span>}
                                </div>
                                <div class='progress-bar bg-success' role='progressbar' style={`width: ${this.yearlyWork(true)}%`}>
                                    {showPercent ? <span>{formatRound(this.yearlyWork(true, 1), 1)}%</span> : <span>{formatRound(this.yearlyWork(false, 1), 0)}h</span>}
                                </div>
                                <div class='progress-bar bg-danger' role='progressbar' style={`width: ${this.yearlyUsage(true)}%`}>
                                    {showPercent ? <span>{formatRound(this.yearlyUsage(true, 1), 1)}%</span> : <span>{formatRound(this.yearlyUsage(false, 1), 0)}h</span>}
                                </div>
                                <div class='progress-bar bg-info' role='progressbar' style={`width: ${this.yearlyHoliday(true)}%`}>
                                    {showPercent ? <span>{formatRound(this.yearlyHoliday(true, 1), 1)}%</span> : <span>{formatRound(this.yearlyHoliday(false, 1), 0)}h</span>}
                                </div>
                                <div class='progress-bar bg-secondary' role='progressbar' style={`width: ${this.yearlyOther(true)}%`}>
                                    {showPercent ? <span>{formatRound(this.yearlyOther(true, 1), 1)}%</span> : <span>{formatRound(this.yearlyOther(false, 1), 0)}h</span>}
                                </div>
                            </div>
                        </div>
                        
                        <div class='mb-2'>
                            <small>A lifetime: {this.calculateALifetime()}<br /></small>
                            <div class='progress'>
                                <div class='progress-bar bg-primary' role='progressbar' style={`width: ${this.yearlySleep(true, 70)}%`}>
                                    {showPercent ? <span>{formatRound(this.yearlySleep(true, 70), 1)}%</span> : <span>{formatRound(this.yearlySleep(false, 70), 0)}h</span>}
                                </div>
                                <div class='progress-bar bg-warning' role='progressbar' style={`width: ${this.yearlyCommute(true, 70, 40)}%`}>
                                    {showPercent ? <span>{formatRound(this.yearlyCommute(true, 70, 40), 1)}%</span> : <span>{formatRound(this.yearlyCommute(false, 70), 0)}h</span>}
                                </div>
                                <div class='progress-bar bg-success' role='progressbar' style={`width: ${this.yearlyWork(true, 70, 40)}%`}>
                                    {showPercent ? <span>{formatRound(this.yearlyWork(true, 70, 40), 1)}%</span> : <span>{formatRound(this.yearlyWork(false, 70), 0)}h</span>}
                                </div>
                                <div class='progress-bar bg-danger' role='progressbar' style={`width: ${this.yearlyUsage(true, 70)}%`}>
                                    {showPercent ? <span>{formatRound(this.yearlyUsage(true, 70), 1)}%</span> : <span>{formatRound(this.yearlyUsage(false, 70), 0)}h</span>}
                                </div>
                                <div class='progress-bar bg-info' role='progressbar' style={`width: ${this.yearlyHoliday(true, 70, 40)}%`}>
                                    {showPercent ? <span>{formatRound(this.yearlyHoliday(true, 70, 40), 1)}%</span> : <span>{formatRound(this.yearlyHoliday(false, 70, 40), 0)}h</span>}
                                </div>
                                <div class='progress-bar bg-secondary' role='progressbar' style={`width: ${this.yearlyOther(true, 70, 40)}%`}>
                                    {showPercent ? <span>{formatRound(this.yearlyOther(true, 70, 40), 1)}%</span> : <span>{formatRound(this.yearlyOther(false, 70, 40), 0)}h</span>}
                                </div>
                            </div>
                        </div>

                        <div class='mb-2 float-right'>
                            <small>
                                <span class='ml-0'><span class='bg-primary'>&nbsp;&nbsp;&nbsp;&nbsp;</span> Sleep</span>
                                <span class='ml-3'><span class='bg-warning'>&nbsp;&nbsp;&nbsp;&nbsp;</span> Commute</span>
                                <span class='ml-3'><span class='bg-success'>&nbsp;&nbsp;&nbsp;&nbsp;</span> Work</span>
                                <span class='ml-3'><span class='bg-danger'>&nbsp;&nbsp;&nbsp;&nbsp;</span> {timeSpentOn}</span>
                                <span class='ml-3'><span class='bg-secondary'>&nbsp;&nbsp;&nbsp;&nbsp;</span> Other</span>
                                <span class='ml-3'><span class='bg-info'>&nbsp;&nbsp;&nbsp;&nbsp;</span> Holiday</span>
                            </small>
                        </div>

                        <div class='custom-control form-control-lg custom-switch'>
                            <input type='checkbox' class='custom-control-input'
                                autocomplete='off'
                                id='showPercent'
                                aria-describedby='showPercentHelp'
                                value={showPercent}
                                checked={showPercent ? 'checked' : ''}
                                onInput={e => this.setShowPercent(showPercent ? e.target.checked : e.target.value)}
                            />
                            <label class='custom-control-label text-muted form-control-sm' for='showPercent'>Show %</label>
                        </div>

                    </div>
                </div>
            </div>
        );
    }
}

export default Frontpage;
