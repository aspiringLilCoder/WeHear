import audio from "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-audio@0.10.0";
const { AudioClassifier, AudioClassifierResult, FilesetResolver } = audio;

document.addEventListener("DOMContentLoaded", async function () {
    
    const header = document.getElementById("header");
    const nav = document.getElementById("nav");
    const loader = document.getElementById("loader");
    
    const listenTab = document.getElementById("listen_tab");
    const aboutTab = document.getElementById("about_tab");
    const settingsTab = document.getElementById("settings_tab");

    const listenLink = document.getElementById("listen_link");
    const aboutLink = document.getElementById("about_link");
    const settingsLink = document.getElementById("settings_link");

    const listenButton = document.getElementById("listen");
    const listen_text = document.getElementById("listen_btn");
    const listenIconContainer = document.getElementById("listen_icon_container");
    const soundDetected = document.getElementById("sound_detected");

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


    listenTab.style.display = "none";
    header.style.display = "none";
    nav.style.display = "none";

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



    //Audio Classifier
   let audioClassifier = AudioClassifier;
   let audioCtx = new (window.AudioContext)(); //change
   
   const createAudioClassifier = async () => {
     const audio = await FilesetResolver.forAudioTasks(
       "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-audio@0.10.0/wasm"
     );
   
     audioClassifier = await AudioClassifier.createFromOptions(audio, {
       baseOptions: {
         modelAssetPath:
           "https://storage.googleapis.com/mediapipe-models/audio_classifier/yamnet/float32/1/yamnet.tflite"
       }
     });
   };

   createAudioClassifier();
 
   loader.style.display = "none";
   listenTab.style.display = "flex";
   header.style.display = "flex";
   nav.style.display = "flex";
   soundDetected.style.display = "none";



    let isListening = false;

    async function startListening() {

   //stream audio

    await runStreamingAudioClassification();
  

   async function runStreamingAudioClassification() {
   const output = soundDetected; //change
   const constraints = { audio: true };
   let stream;

   try {
       stream = await navigator.mediaDevices.getUserMedia(constraints);
   } catch (err) {
       console.log("The following error occured: " + err);
       alert("getUserMedia not supported on your browser");
   }

   if (!audioCtx) {
       audioCtx = new AudioContext({ sampleRate: 16000 });
   } else if (audioCtx.state === "running") {
       await audioCtx.suspend();

       listenIconContainer.innerHTML = '<svg class="listen_icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-headphones"><path d="M3 18v-6a9 9 0 0 1 18 0v6"></path><path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"></path></svg>'
       listen_text.innerText = "Start listening";
       isListening = false;
       soundDetected.style.display = "none";


       return;
   }

   // resumes AudioContext if has been suspended
   await audioCtx.resume();

   listenIconContainer.innerHTML = '<svg class="listen_icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-pause-circle"><circle cx="12" cy="12" r="10"></circle><line x1="10" y1="15" x2="10" y2="9"></line><line x1="14" y1="15" x2="14" y2="9"></line></svg>'
   listen_text.innerText = "Stop listening";
   isListening = true;
   soundDetected.style.display = "flex";

   const source = audioCtx.createMediaStreamSource(stream);
   const scriptNode = audioCtx.createScriptProcessor(16384, 1, 1);

   scriptNode.onaudioprocess = function (audioProcessingEvent) {
       const inputBuffer = audioProcessingEvent.inputBuffer;
       let inputData = inputBuffer.getChannelData(0);

       // Classify the audio
       const result = audioClassifier.classify(inputData);
       const categories = result[0].classifications[0].categories;

       // Display results
    //    output.innerText =
    //    categories[0].categoryName +
    //    "(" +
    //    categories[0].score.toFixed(3) +
    //    ")\n" +
    //    categories[1].categoryName +
    //    "(" +
    //    categories[1].score.toFixed(3) +
    //    ")\n" +
    //    categories[2].categoryName +
    //    "(" +
    //    categories[2].score.toFixed(3) +
    //    ")";

    output.innerText = `${categories[0].categoryName}, ${categories[1].categoryName}, or ${categories[2].categoryName} detected.`

   };

   source.connect(scriptNode);
   scriptNode.connect(audioCtx.destination);
   }






    }


 

});