document.addEventListener("DOMContentLoaded", function () {
    const listenTab = document.getElementById("listen_tab");
    const aboutTab = document.getElementById("about_tab");
    const settingsTab = document.getElementById("settings_tab");

    const listenLink = document.getElementById("listen_link");
    const aboutLink = document.getElementById("about_link");
    const settingsLink = document.getElementById("settings_link");

    const listenButton = document.getElementById("listen");
    const listen_text = document.getElementById("listen_btn");
    const listenIconContainer = document.getElementById("listen_icon_container");

    const addSoundButton = document.getElementById("add_sound_btn");
    const soundList = document.getElementById("sound_list");
    const alertInput = document.getElementById("alert_input");

    listenLink.addEventListener("click", () => selectTab(listenTab));
    aboutLink.addEventListener("click", () => selectTab(aboutTab));
    settingsLink.addEventListener("click", () => selectTab(settingsTab));

    listenButton.addEventListener("click", startListening);

    const tabs = [listenTab, aboutTab, settingsTab];
    const navLinks = [listenLink, aboutLink, settingsLink];

    listenTab.style.display = "flex";
    navLinks[0].classList.add("selected");

    aboutTab.style.display = "none";
    settingsTab.style.display = "none";

    function selectTab(tab) {
        for (let i = 0; i < tabs.length; i++) {
            const el = tabs[i];
            el.style.display = "none";
            navLinks[i].classList.remove("selected");
            if (el === tab) {
                el.style.display = "flex";
               navLinks[i].classList.add("selected");
            }
        }
    }

    let isListening = false;

    function startListening() {
        if (isListening) {
            listenIconContainer.innerHTML = '<svg class="listen_icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-headphones"><path d="M3 18v-6a9 9 0 0 1 18 0v6"></path><path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"></path></svg>'
            listen_text.innerText = "Start listening";
            isListening = false;
        } else {
            listenIconContainer.innerHTML = '<svg class="listen_icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-pause-circle"><circle cx="12" cy="12" r="10"></circle><line x1="10" y1="15" x2="10" y2="9"></line><line x1="14" y1="15" x2="14" y2="9"></line></svg>'
            listen_text.innerText = "Stop listening";
            isListening = true;
        }
    }

});