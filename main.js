document.addEventListener("DOMContentLoaded", function () {
    const listenTab = document.getElementById("listen_tab");
    const aboutTab = document.getElementById("about_tab");
    const settingsTab = document.getElementById("settings_tab");

    const listenLink = document.getElementById("listen_link");
    const aboutLink = document.getElementById("about_link");
    const settingsLink = document.getElementById("settings_link");

    const listenButton = document.getElementById("listen");

    const addSoundButton = document.getElementById("add_sound_btn");
    const soundList = document.getElementById("sound_list");
    const alertInput = document.getElementById("alert_input");

    listenLink.addEventListener("click", () => selectTab(listenTab));
    aboutLink.addEventListener("click", () => selectTab(aboutTab));
    settingsLink.addEventListener("click", () => selectTab(settingsTab));


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

});