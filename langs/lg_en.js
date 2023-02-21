/* Gaspar Lukacs 2023 */
/*jshint esversion: 6 */

// all texts in the website in English
const tt = {

    intro_text:
        /*html*/ `
            <p class='title'>
                Study Information
            </p>

            <div id="demo_info">
                <b>This is a demo version of the experiment with the following
                    differences:
                </b>
                <br>
                <ul>
                    <li>There are less trials (12 per block instead of 60).</li>
                    <li>None of the questions are obligatory in order to proceed to the next page (and
                        there is no alert if questions are not answered).</li>
                    <li>No fullscreen is initiated automatically.</li>
                    <li>No data is saved on the server.</li>
                </ul>

            </div>

            <p><b>Aim:</b>
                <br>In the present experiment, we examine certain influencing factors on response inhibition. During the
                test, participants are asked to respond, in each trial, with either of two response keys depending on
                the
                item presented on the screen. On a subset of trials, the item is followed by a second item (a stop
                signal),
                in which case participants should abort the response already initiated and not press any keys.
            </p>

            <p><b>Payment:</b>
                <br>
                The task takes around 10 minutes. It should be done within one session, without any long (more than a few minute) pause.
                <span id="pay_info">
                    Your valid completed participation will be rewarded with 2 GBP.
                </span>
            </p>

            <p><b>Rights:</b>
                <br>You can stop participating in the study at any time without giving a reason (by closing or
                refreshing
                this website).
            </p>

            <p><b>Technical Requirements:</b>
            <br>
                <span id='device_type'></span> We strongly recommend using Google Chrome or Mozilla Firefox browser for
                this test. Before starting, please switch the browser to fullscreen mode (press <kbd>F11</kbd> or, on Mac, <kbd>Ctrl</kbd>+<kbd>Command</kbd>+<kbd>F</kbd> or <kbd>Fn</kbd>+<kbd>F</kbd>), otherwise it will be switched automatically following your consent. The fullscreen mode should be kept throughout the response time experiment (otherwise you get a warning and can only continue after switching back to fullscreen).
                <br>This application was tested thoroughly, but we cannot take responsibility for potential technical
                issues
                in the context of your
                specific software and hardware. Please contact please contact <a target="_blank" href="https://gasparl.github.io/">Gáspár Lukács</a> at <a href="mailto:lkcsgaspar@gmail.com">lkcsgaspar@gmail.com</a> if you run into any trouble.
            </p>

            <p><b>Anonymity and Privacy:</b>
                <br>The results of the study are to be used and published for research purposes. The data do
                not provide any information about you personally. Your identity will be kept strictly confidential.
            </p>

            <p><b>Consent:</b>
                <br>By pressing the "Consent & Continue" button, you declare that you have read and understood the
                information above. You confirm that you will be concentrating on the task and complete it to the best of
                your abilities.
            </p>
            <br>

             <button class="main_button" type="button"
                onclick="consent_submit();">
                Consent & Continue
            </button>
            <br>
            <br>`,
    prelim: /*html*/`
    Please give us the following demographic information about yourself.
    <br><br>
    <br> Age:    
    <input type="number" onkeypress='return /[0-9]/i.test(event.key)'
    oninput="this.value=this.value.slice(0,2)" min='1' max='99' id="age_id" size="4">
    | <input type="checkbox" id="age_na" onchange="age_check(event);" />
    <label for="age_na" style="font-size: 90%;">Prefer not to say</label>

    <br><br>
    Sex:<br>
    <div class="options">
        <input type="radio" id="male" name="sex" value="male">
        <label for="male">Male</label><br>
        <input type="radio" id="female" name="sex" value="female">
        <label for="female">Female</label><br>
        <input type="radio" id="sex_na" name="sex" value="na">
        <label for="sex_na">Other/Prefer not to say</label>
    </div>

    <br>
    Highest education:
    <select id="education">
        <option value="">- choose one -</option>
        <option value="1">Elementary School</option>
        <option value="2">High School</option>
        <option value="3">Professional training / vocational program</option>
        <option value="4">Some college</option>
        <option value="5">Bachelor's degree</option>
        <option value="6">Master's degree (or above)</option>
        <option value="na">Prefer not to say</option>
    </select>

    <br><br>
    Native language (mother tongue):<br>

    <div class="options">
        <input type="checkbox" id="lg_en" />
        <label for="lg_en">English</label><br>

        <input type="checkbox" id="lg_de" />
        <label for="lg_de">German</label><br>

        <input type="checkbox" id="lg_fr" />
        <label for="lg_fr">French</label><br>

        <input type="checkbox" id="lg_na" onchange="lang_check(event);" />
        <label for="lg_na">Other</label>
        <span id="lg_note" style='display:none;'>(please specify)
            <input id="lg_other" style="width: 170px;margin:0;" maxlength="20">
        </span>
    </div>

    <br>
    <br>
    <button class="main_button class_next" type="button" onclick="prelim_submit();">
        Next
    </button>
    <br>
    `,
    unload_warn: 'If you leave this page, all your progress will be lost. Are you sure you want to proceed?.'
};
