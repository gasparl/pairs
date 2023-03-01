/* Gaspar Lukacs 2023 */
/*jshint esversion: 6 */

// store the time(s) of any unload (page leave) attempt(s)
const unload_attemps = [];
// store the times and names of division ("page") switches [#5]
const div_switches = {};

// formatted current date
const neat_date = function() {
    const m = new Date();
    return m.getFullYear().toString().slice(-2) + "" +
        ("0" + (m.getMonth() + 1)).slice(-2) + "" +
        ("0" + m.getDate()).slice(-2) + "" +
        ("0" + m.getHours()).slice(-2) + "" +
        ("0" + m.getMinutes()).slice(-2) + "" +
        ("0" + m.getSeconds()).slice(-2);
};

// random choice from array
const rchoice = function(array) {
    return array[Math.floor(array.length * Math.random())];
};

// random whole number choice
const rdigit = function(min, max) { // min and max included
    return Math.floor(Math.random() * (max - min + 1) + min);
};

const mean = function(array) {
    return array.reduce((a, b) => a + b) / array.length;
};

// shuffle array function
const shuffle = function(arr) {
    const array = JSON.parse(JSON.stringify(arr));
    const newarr = [];
    let currentIndex = array.length,
        temporaryValue,
        randomIndex;
    while (0 !== currentIndex) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        newarr[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }
    return newarr;
};

const capitalize = function(s) {
    return s && s[0].toUpperCase() + s.slice(1);
};

// alert to confirm or cancel unload (i.e., leaving the page by navigating away or closing the tab) [#18]
const keep_state = function() {
    window.onbeforeunload = (event) => {
        unload_attemps.push(performance.now());
        misc.unloads = unload_attemps.join('_');
        upload_interim();
        const warn = tt.unload_warn;
        if (!misc.demo) {
            event.preventDefault();
            event.returnValue = warn;
            return warn;
        }
    };
    // try prevent navigating back
    history.pushState(null, null, location.href);
    history.back();
    history.forward();
    window.onpopstate = function() {
        history.go(1);
    };
};

const ro = function(num) {
    return ((Math.round(num * 100) / 100).toFixed(2));
};

const to_sec = function(num) {
    return (Math.round(num / 1000));
};

// enter fullscreen mode [#19]
const fullscreen_on = function(doit = false) {
    document.getElementById('screen_feed').style.display = 'none';
    if (doit != true && (misc.demo || typeof sim_user === "function")) {
        return;
    }
    const element = document.documentElement;
    if (element.requestFullscreen) { //W3C standard
        element.requestFullscreen();
    } else if (element.mozRequestFullScreen) { //FireFox
        element.mozRequestFullScreen();
    } else if (element.msRequestFullscreen) { //IE/Edge
        element.msRequestFullscreen();
    } else if (element.webkitRequestFullscreen) { //Chrome and Safari
        element.webkitRequestFullscreen();
    } else if (element.webkitSupportsFullscreen) { //Chrome and Safari
        element.webkitEnterFullscreen();
    }
};

// exit full screen
const fullscreen_off = function() {
    if (misc.demo) {
        return;
    }
    if (document.exitFullscreen) { //W3C standard
        document.exitFullscreen();
    } else if (document.webkitExitFullscreen) { //Chrome and Safari
        document.webkitExitFullscreen();
    } else if (document.mozCancelFullScreen) { //FireFox
        document.mozCancelFullScreen();
    } else if (document.msExitFullscreen) { //IE/Edge
        document.msExitFullscreen();
    } else if (element.webkitSupportsFullscreen) { //Chrome and Safari
        element.webkitExitFullscreen();
    }
};

// function for assigning what happens depending on whether fullscreen is on
const fullscreen_state = function(on = () => { }, off = () => { }) {
    if (document.fullscreenElement || document.mozFullScreenElement ||
        document.webkitFullscreenElement || document.msFullscreenElement) {
        on();
    } else {
        off();
    }
};

// listen for change in fullscreen mode [#21]
const fullscreen_change = function(on, off) {
    window.onresize = function() {
        fullscreen_state(on, off);
    };
};
// (to stop listening for change in fullscreen mode, set window.onresize = null;)

const char_count = function(event, feed_elem) {
    document.getElementById(feed_elem).value = event.maxLength - event.value.length;
};


// get selected radio button value
const get_radio = function(rad_name) {
    const rad_val = document.querySelector('input[name=' + rad_name + ']:checked');
    return (rad_val ? rad_val.value : "");
};

// spinner HTML
const spinner_content = /*html*/ `
        <div class="g_spinner">
            <svg class="g_circular" viewBox="25 25 50 50">
                <circle class="g_path" cx="50" cy="50" r="20" fill="none" stroke-width="2" stroke-miterlimit="10" />
            </svg>
        </div>`;

// function to switch divisions (virtual pages) [#5]
const switch_div = function(current, next, wait = 0) {
    document.getElementById(current).style.display = 'none';
    window.scrollTo(0, 0);
    document.getElementById(next).style.display = 'block';
    // record the (upcoming) division name and the current time [#6]
    div_switches['p' + Object.keys(div_switches).length + '_' + next] = Math.round(performance.now() / 600) / 100 + wait;
    upload_interim();
};

// gets current geo position [#39]
const current_position = function() {
    navigator.geolocation.getCurrentPosition(pos => {
        console.log(pos.coords); // the coordinates are returned and can be used here
        console.log(pos.coords.latitude);
        console.log(pos.coords.longitude);
        console.log(pos.coords.altitude);
        // e.g. pos.coords.latitude, pos.coords.longitude
    }, err => {
        console.warn(`ERROR(${err.code}): ${err.message}`);
    }, {
        enableHighAccuracy: true,
        timeout: Infinity,
        maximumAge: 0
    });
};
