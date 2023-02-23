/* Gaspar Lukacs 2023 */
/*jshint esversion: 6 */

// this variable serves here to easily set the starting div for testing
const start_div = 'game';
// Here, the first div (ID) is 'intro'. To quickly test other pages (e.g. layout), switch the ID.
// (notable other divisions: 'prelim', 'game')

// miscellaneous subject data [#31]
const misc = {
    subject_id: rchoice("CDFGHJKLMNPQRSTVWXZ") +
        rchoice("AEIOUY") +
        rchoice("CDFGHJKLMNPQRSTVWXZ") +
        rchoice("AEIOUYCDFGHJKLMNPQRSTVWXZ") + '_' + neat_date(), // randomly assigned arbitrary user ID (including date)
    lg: 'en', // instruction language
    timeout: 30, // maximum time of inactivity allowed
    timed_out: false, // whether the participant timed out (inactivity time exceeded timeout)
    attention: 0 // tracks attention check responses (should have 2 for passing)
};
// file name for storing
const file_name =
    'pairs_' +
    misc.subject_id +
    ".txt";

// code to execute when the web app is entirely loaded [#9]
document.addEventListener("DOMContentLoaded", function() {

    // check browser compatibility with relevant JavaScript methods [#11]
    try {
        const sum = function(x, y, z) {
            return x + y + z;
        };
        const numbers = [1, 2, 3];
        if (typeof fetch !== 'function' || sum(...numbers) !== 6) {
            return;
        }
    } catch (e) {
        if (e.name == "ReferenceError") {
            return;
        }
    }

    // store hardware and software information
    misc.user_agent = navigator.userAgent;
    misc.screen_h = screen.height;
    misc.screen_w = screen.width;
    misc.browser_name = jscd.browser;
    misc.browser_version = jscd.browserVersion;
    misc.os_name = jscd.os;
    misc.os_version = jscd.osVersion;

    // set starting (first main block) experimental condition (here: ssd magnitudes) randomly
    //current_cond = (Math.random() < 0.5) ? 'short' : 'long';
    // misc.condition = current_cond + '_first'; // save first condition info

    // check URL query parameters, proceed depending on that
    check_params();
});

// get URL query parameters: language, device, etc. [#12]
const check_params = function() {
    const params = new URLSearchParams(location.search);

    // get language [#12]
    misc.lg = params.get('lg');
    // load language and then show displays
    load_language();
};

// load language based on query
const load_language = function() {
    // load texts in the given language [#17]
    const lg_script = document.createElement('script');
    lg_script.onload = function() {
        // when the language file is loaded, modify as needed and add to HTML

        // insert texts of the chosen language into HTML [#17]
        Object.keys(tt).forEach((id) => {
            if (id.startsWith('class_')) {
                [...document.getElementsByClassName(id)].forEach((elem) => {
                    elem.innerHTML = tt[id];
                });
            } else {
                const elem = document.getElementById(id);
                if (elem) {
                    elem.innerHTML = tt[id];
                }
            }
        });

        set_grid(5);

        // If the browser supports the JavaScript included (essentially: ES6), switch to first division.
        switch_div('init_fail', start_div, 0, false);

    };
    // if the specified language file not found, default to English [#16]
    lg_script.onerror = function() {
        misc.lg = 'en';
        console.log('Language defaults to English.');
        load_language();
    };
    lg_script.src = './langs/lg_' + misc.lg + '.js';
    document.head.appendChild(lg_script);
};

const font_color2 = function(bgColor) {
    var color = (bgColor.charAt(0) === '#') ? bgColor.substring(1, 7) : bgColor;
    var r = parseInt(color.substring(0, 2), 16); // hexToR
    var g = parseInt(color.substring(2, 4), 16); // hexToG
    var b = parseInt(color.substring(4, 6), 16); // hexToB
    return (((r * 0.299) + (g * 0.587) + (b * 0.114)) > 186) ?
        '#000000' : '#ffffff';
};

function font_color(bgColor) {
    var color = (bgColor.charAt(0) === '#') ? bgColor.substring(1, 7) : bgColor;
    var r = parseInt(color.substring(0, 2), 16); // hexToR
    var g = parseInt(color.substring(2, 4), 16); // hexToG
    var b = parseInt(color.substring(4, 6), 16); // hexToB
    var uicolors = [r / 255, g / 255, b / 255];
    var c = uicolors.map((col) => {
        if (col <= 0.03928) {
            return col / 12.92;
        }
        return Math.pow((col + 0.055) / 1.055, 2.4);
    });
    var L = (0.2126 * c[0]) + (0.7152 * c[1]) + (0.0722 * c[2]);
    return (L > 0.179) ? '#000000' : '#ffffff';
}

const set_picker = function(cell) {
    document.getElementById("picker").innerHTML = '';
    document.getElementById("picker_button").disabled = true;
    document.getElementById("sample").style.backgroundColor = null;
    let selected = false;
    const init_empty = ['reinvented-color-wheel--hue-handle', 'reinvented-color-wheel--sv-space', 'reinvented-color-wheel--sv-handle'];
    // create a new color picker
    const colorWheel = new ReinventedColorWheel({
        // appendTo is the only required property. specify the parent element of the color wheel.
        appendTo: document.getElementById("picker"),

        // followings are optional properties and their default values.

        // initial color (can be specified in hsv / hsl / rgb / hex)
        hex: '#00ffff',
        handleDiameter: null,

        // handler
        onChange: function(color) {
            // the only argument is the ReinventedColorWheel instance itself.
            if (!selected) {
                init_empty.forEach(id => {
                    [...document.getElementsByClassName(id)].forEach((elem) => {
                        elem.style.visibility = 'visible';
                    });
                });
                selected = true;
                document.getElementById("picker_button").disabled = false;
            }
            document.getElementById("sample").style.backgroundColor = color.hex;
            document.getElementById("sample").style.color = font_color(color.hex);
        },
    });

    init_empty.forEach(id => {
        [...document.getElementsByClassName(id)].forEach((elem) => {
            elem.style.visibility = 'hidden';
        });
    });

    document.getElementById("sample").textContent = cell.textContent;
    colored.push(cell.textContent);

    document.getElementById("prompt").style.display = "grid";
    document.getElementById("picker_button").onclick = function() {
        cell.dataset.bg = colorWheel.hex;
        cell.style.backgroundColor = colorWheel.hex;
        console.log(cell);

        document.getElementById("prompt").style.display = "none";
    };
};

const word_set = ['Admired', 'Alienated', 'Abused', 'Afraid', 'Ambivalent', 'Alive', 'Ashamed', 'Aggravated', 'Alarmed', 'Awkward', 'Appreciated', 'Burdened', 'Agitated', 'Anxious', 'Baffled', 'Assured', 'Condemned', 'Anguished', 'Appalled', 'Bewildered', 'Cheerful', 'Crushed', 'Annoyed', 'Apprehensive', 'Bothered', 'Confident', 'Defeated', 'Betrayed', 'Awed', 'Constricted', 'Content', 'Dejected', 'Cheated', 'Concerned', 'Directionless', 'Delighted', 'Demoralized', 'Coerced', 'Defensive', 'Disorganized', 'Determined', 'Depressed', 'Controlled', 'Desperate', 'Distracted', 'Ecstatic', 'Deserted', 'Deceived', 'Doubtful', 'Doubtful', 'Elated', 'Despised', 'Disgusted', 'Fearful', 'Flustered', 'Encouraged', 'Devastated', 'Dismayed', 'Frantic', 'Foggy', 'Energized', 'Disappointed', 'Displeased', 'Full', 'Hesitant', 'Enthusiastic', 'Discarded', 'Dominated', 'Guarded', 'Immobilized', 'Excited', 'Discouraged', 'Enraged', 'Horrified', 'Misunderstood', 'Exuberant', 'Disgraced', 'Exasperated', 'Impatient', 'Perplexed', 'Flattered', 'Disheartened', 'Exploited', 'Insecure', 'Puzzled', 'Fortunate', 'Disillusioned', 'Frustrated', 'Intimidated', 'Stagnant', 'Fulfilled', 'Dismal', 'Fuming', 'Nervous', 'Surprised', 'Glad', 'Distant', 'Furious', 'Overwhelmed', 'Torn', 'Good', 'Distraught', 'Harassed', 'Panicky', 'Trapped', 'Grateful', 'Distressed', 'Hateful', 'Perplexed', 'Troubled', 'Gratified', 'Drained', 'Hostile', 'Petrified', 'Uncertain', 'Hopeful', 'Empty', 'Humiliated', 'Reluctant', 'Uncomfortable', 'Joyful', 'Exhausted', 'Incensed', 'Shaken', 'Undecided'];


const colored = [];
let previous;
let listen = true;
const set_grid = function(rows) {
    const cols = 4;
    const n_word = rows * cols;
    const all_words = shuffle([].concat(...Array(2).fill(shuffle(word_set).slice(0, n_word / 2))));

    const container = document.getElementById("grid");
    container.style.setProperty('--grid-rows', rows);
    container.style.setProperty('--grid-cols', cols);
    all_words.forEach((word, i) => {
        let cell = document.createElement("div");
        cell.innerHTML = '<span>' + word + '</span>';
        cell.id = 'cell_' + (i + 1);
        cell.onclick = function() {
            if (cell.childNodes[0].style.visibility !== 'visible' && listen) {
                cell.childNodes[0].style.visibility = 'visible';
                cell.style.backgroundColor = null;
                if (previous !== undefined) {
                    listen = false;
                    setTimeout(() => {
                        listen = true;
                        [previous, cell].forEach(el => {
                            el.childNodes[0].style.visibility = 'hidden';
                            el.style.backgroundColor = el.dataset.bg;
                        });
                        if (previous.textContent === cell.textContent) {
                            [previous, cell].forEach(el => {
                                el.style.visibility = 'hidden';
                            });
                        } else if (!colored.includes(cell.textContent) && Math.random() < 0.75) {
                            set_picker(cell);
                        }
                        previous = undefined;
                    }, 800);
                } else {
                    previous = cell;
                }
            }
        };
        container.appendChild(cell).className = "grid-item";
    });
};

// actions following consent
const consent_submit = function() {
    // if user ID is manually given, store it
    switch_div('intro', 'prelim');
};


// switch age input depending on "prefer not to say" checkbox
const age_check = function(e) {
    const age = document.getElementById("age_id");
    if (e.target.checked == true) {
        age.value = "";
        age.disabled = true;
    } else {
        age.disabled = false;
    }
};

// switch "other" language option depending on the corresponding checkbox
const lang_check = function(e) {
    if (e.target.checked == true) {
        document.getElementById("lg_note").style.display = 'inline';
    } else {
        document.getElementById("lg_other").value = "";
        document.getElementById("lg_note").style.display = 'none';
    }
};

// submit preliminary information (such as demographics)
const prelim_submit = (() => {
    // "clicked_once" to keep track of whether the user tried to proceed already [#36]
    // (this self-executing function serves to keep this variable local)
    let clicked_once = false;
    return function() {
        misc.sex = get_radio('sex');
        misc.age = document.getElementById("age_id").value;
        misc.age_na = document.getElementById("age_na").checked;
        misc.education = document.getElementById("education").value;
        let is_lang = false;
        ['lg_en',
            'lg_de',
            'lg_fr',
            'lg_na'
        ].forEach((lg_id) => {
            misc[lg_id] = document.getElementById(lg_id).checked;
            if (misc[lg_id]) {
                is_lang = true;
            }
        });
        misc.lg_note = document.getElementById("lg_note").value;

        if (misc.demo || (misc.sex && (misc.age ||
            misc.age_na) && misc.education && is_lang)) {
            switch_div('prelim', 'game');
        }
    };
})();


// arrange file for the final format in which it is to be downloaded
const prep_file = function() {
    // join all div switch info [#6]
    misc.page_times = Object.keys(div_switches).map(function(key) {
        return (key + '_' + div_switches[key]);
    }).join('|');
    misc.full_duration = Math.round((performance.now() / 600) / 100 - Object.values(div_switches)[0]);
    return (JSON.stringify(misc)); // JSON.stringify for appending miscellaneous data as JSON [#31]
};

// have the file downloaded manually, via pop-up [#28]
const dl_as_file = function() {
    const blobx = new Blob([prep_file()], {
        type: 'text/plain'
    });
    const elemx = window.document.createElement('a');
    elemx.href = window.URL.createObjectURL(blobx);
    elemx.download = file_name;
    elemx.style.display = 'none';
    document.body.appendChild(elemx);
    elemx.click();
    document.body.removeChild(elemx);
    // allow to leave page without alert
    window.onbeforeunload = null;
};


// store partial interim data during the experiment [#22]
const upload_interim = function() {
    if (misc.demo) {
        return;
    }
    fetch('./store.php', {
        method: 'post',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'text/plain'
        },
        body: JSON.stringify({
            fname_post: file_name, // name of the file to be saved at the server
            results_post: prep_file() // data (text content) of the file
        })
    });

    // for pretesting alone, one may check the server responses as below
    // (for live testing, server response for interim storage is probably unnecessary)
    // 
    // .then(response => response.text())
    // .then(echoed => {
    //     console.log(echoed);
    // })
    // .catch((error) => {
    //     console.log(error);
    // });
};
