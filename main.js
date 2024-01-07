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

    const sounds = document.getElementById("sounds")

    const notificationBtn = document.getElementById("enable");

    listenLink.addEventListener("click", () => selectTab(listenTab));
    aboutLink.addEventListener("click", () => selectTab(aboutTab));
    settingsLink.addEventListener("click", () => selectTab(settingsTab));

    listenButton.addEventListener("click", startListening);

    notificationBtn.addEventListener("click", askNotificationPermission);

    const tabs = [listenTab, aboutTab, settingsTab];
    const navLinks = [listenLink, aboutLink, settingsLink];

    listenTab.style.display = "flex";
    navLinks[0].classList.add("selected");


    listenTab.style.display = "none";
    header.style.display = "none";
    nav.style.display = "none";

    aboutTab.style.display = "none";
    settingsTab.style.display = "none";

    //Turn on notifications
    function askNotificationPermission() {
        function handlePermission(permission) {
          notificationBtn.style.display =
            Notification.permission === "granted" ? "none" : "block";
        }
      
        if (!("Notification" in window)) {
          console.log("This browser does not support notifications.");
        } else {
          Notification.requestPermission().then((permission) => {
            handlePermission(permission);
          });
        }
      }

    // Tab navigation
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

    let soundArray = ['Speech', 'Child speech, kid speaking', 'Conversation', 'Narration, monologue', 'Babbling', 'Speech synthesizer', 'Shout', 'Bellow', 'Whoop', 'Yell', 'Children shouting', 'Screaming', 'Whispering', 'Laughter', 'Baby laughter', 'Giggle', 'Snicker', 'Belly laugh', 'Chuckle, chortle', 'Crying, sobbing', 'Baby cry, infant cry', 'Whimper', 'Wail, moan', 'Sigh', 'Singing', 'Choir', 'Yodeling', 'Chant', 'Mantra', 'Child singing', 'Synthetic singing', 'Rapping', 'Humming', 'Groan', 'Grunt', 'Whistling', 'Breathing', 'Wheeze', 'Snoring', 'Gasp', 'Pant', 'Snort', 'Cough', 'Throat clearing', 'Sneeze', 'Sniff', 'Run', 'Shuffle', 'Walk, footsteps', 'Chewing, mastication', 'Biting', 'Gargling', 'Stomach rumble', 'Burping, eructation', 'Hiccup', 'Fart', 'Hands', 'Finger snapping', 'Clapping', 'Heart sounds, heartbeat', 'Heart murmur', 'Cheering', 'Applause', 'Chatter', 'Crowd', 'Hubbub, speech noise, speech babble', 'Children playing', 'Animal', 'Domestic animals, pets', 'Dog', 'Bark', 'Yip', 'Howl', 'Bow-wow', 'Growling', 'Whimper (dog)', 'Cat', 'Purr', 'Meow', 'Hiss', 'Caterwaul', 'Livestock, farm animals, working animals', 'Horse', 'Clip-clop', 'Neigh, whinny', 'Cattle, bovinae', 'Moo', 'Cowbell', 'Pig', 'Oink', 'Goat', 'Bleat', 'Sheep', 'Fowl', 'Chicken, rooster', 'Cluck', 'Crowing, cock-a-doodle-doo', 'Turkey', 'Gobble', 'Duck', 'Quack', 'Goose', 'Honk', 'Wild animals', 'Roaring cats (lions, tigers)', 'Roar', 'Bird', 'Bird vocalization, bird call, bird song', 'Chirp, tweet', 'Squawk', 'Pigeon, dove', 'Coo', 'Crow', 'Caw', 'Owl', 'Hoot', 'Bird flight, flapping wings', 'Canidae, dogs, wolves', 'Rodents, rats, mice', 'Mouse', 'Patter', 'Insect', 'Cricket', 'Mosquito', 'Fly, housefly', 'Buzz', 'Bee, wasp, etc.', 'Frog', 'Croak', 'Snake', 'Rattle', 'Whale vocalization', 'Music', 'Musical instrument', 'Plucked string instrument', 'Guitar', 'Electric guitar', 'Bass guitar', 'Acoustic guitar', 'Steel guitar, slide guitar', 'Tapping (guitar technique)', 'Strum', 'Banjo', 'Sitar', 'Mandolin', 'Zither', 'Ukulele', 'Keyboard (musical)', 'Piano', 'Electric piano', 'Organ', 'Electronic organ', 'Hammond organ', 'Synthesizer', 'Sampler', 'Harpsichord', 'Percussion', 'Drum kit', 'Drum machine', 'Drum', 'Snare drum', 'Rimshot', 'Drum roll', 'Bass drum', 'Timpani', 'Tabla', 'Cymbal', 'Hi-hat', 'Wood block', 'Tambourine', 'Rattle (instrument)', 'Maraca', 'Gong', 'Tubular bells', 'Mallet percussion', 'Marimba, xylophone', 'Glockenspiel', 'Vibraphone', 'Steelpan', 'Orchestra', 'Brass instrument', 'French horn', 'Trumpet', 'Trombone', 'Bowed string instrument', 'String section', 'Violin, fiddle', 'Pizzicato', 'Cello', 'Double bass', 'Wind instrument, woodwind instrument', 'Flute', 'Saxophone', 'Clarinet', 'Harp', 'Bell', 'Church bell', 'Jingle bell', 'Bicycle bell', 'Tuning fork', 'Chime', 'Wind chime', 'Change ringing (campanology)', 'Harmonica', 'Accordion', 'Bagpipes', 'Didgeridoo', 'Shofar', 'Theremin', 'Singing bowl', 'Scratching (performance technique)', 'Pop music', 'Hip hop music', 'Beatboxing', 'Rock music', 'Heavy metal', 'Punk rock', 'Grunge', 'Progressive rock', 'Rock and roll', 'Psychedelic rock', 'Rhythm and blues', 'Soul music', 'Reggae', 'Country', 'Swing music', 'Bluegrass', 'Funk', 'Folk music', 'Middle Eastern music', 'Jazz', 'Disco', 'Classical music', 'Opera', 'Electronic music', 'House music', 'Techno', 'Dubstep', 'Drum and bass', 'Electronica', 'Electronic dance music', 'Ambient music', 'Trance music', 'Music of Latin America', 'Salsa music', 'Flamenco', 'Blues', 'Music for children', 'New-age music', 'Vocal music', 'A capella', 'Music of Africa', 'Afrobeat', 'Christian music', 'Gospel music', 'Music of Asia', 'Carnatic music', 'Music of Bollywood', 'Ska', 'Traditional music', 'Independent music', 'Song', 'Background music', 'Theme music', 'Jingle (music)', 'Soundtrack music', 'Lullaby', 'Video game music', 'Christmas music', 'Dance music', 'Wedding music', 'Happy music', 'Sad music', 'Tender music', 'Exciting music', 'Angry music', 'Scary music', 'Wind', 'Rustling leaves', 'Wind noise (microphone)', 'Thunderstorm', 'Thunder', 'Water', 'Rain', 'Raindrop', 'Rain on surface', 'Stream', 'Waterfall', 'Ocean', 'Waves, surf', 'Steam', 'Gurgling', 'Fire', 'Crackle', 'Vehicle', 'Boat, Water vehicle', 'Sailboat, sailing ship', 'Rowboat, canoe, kayak', 'Motorboat, speedboat', 'Ship', 'Motor vehicle (road)', 'Car', 'Vehicle horn, car horn, honking', 'Toot', 'Car alarm', 'Power windows, electric windows', 'Skidding', 'Tire squeal', 'Car passing by', 'Race car, auto racing', 'Truck', 'Air brake', 'Air horn, truck horn', 'Reversing beeps', 'Ice cream truck, ice cream van', 'Bus', 'Emergency vehicle', 'Police car (siren)', 'Ambulance (siren)', 'Fire engine, fire truck (siren)', 'Motorcycle', 'Traffic noise, roadway noise', 'Rail transport', 'Train', 'Train whistle', 'Train horn', 'Railroad car, train wagon', 'Train wheels squealing', 'Subway, metro, underground', 'Aircraft', 'Aircraft engine', 'Jet engine', 'Propeller, airscrew', 'Helicopter', 'Fixed-wing aircraft, airplane', 'Bicycle', 'Skateboard', 'Engine', 'Light engine (high frequency)', "Dental drill, dentist's drill", 'Lawn mower', 'Chainsaw', 'Medium engine (mid frequency)', 'Heavy engine (low frequency)', 'Engine knocking', 'Engine starting', 'Idling', 'Accelerating, revving, vroom', 'Door', 'Doorbell', 'Ding-dong', 'Sliding door', 'Slam', 'Knock', 'Tap', 'Squeak', 'Cupboard open or close', 'Drawer open or close', 'Dishes, pots, and pans', 'Cutlery, silverware', 'Chopping (food)', 'Frying (food)', 'Microwave oven', 'Blender', 'Water tap, faucet', 'Sink (filling or washing)', 'Bathtub (filling or washing)', 'Hair dryer', 'Toilet flush', 'Toothbrush', 'Electric toothbrush', 'Vacuum cleaner', 'Zipper (clothing)', 'Keys jangling', 'Coin (dropping)', 'Scissors', 'Electric shaver, electric razor', 'Shuffling cards', 'Typing', 'Typewriter', 'Computer keyboard', 'Writing', 'Alarm', 'Telephone', 'Telephone bell ringing', 'Ringtone', 'Telephone dialing, DTMF', 'Dial tone', 'Busy signal', 'Alarm clock', 'Siren', 'Civil defense siren', 'Buzzer', 'Smoke detector, smoke alarm', 'Fire alarm', 'Foghorn', 'Whistle', 'Steam whistle', 'Mechanisms', 'Ratchet, pawl', 'Clock', 'Tick', 'Tick-tock', 'Gears', 'Pulleys', 'Sewing machine', 'Mechanical fan', 'Air conditioning', 'Cash register', 'Printer', 'Camera', 'Single-lens reflex camera', 'Tools', 'Hammer', 'Jackhammer', 'Sawing', 'Filing (rasp)', 'Sanding', 'Power tool', 'Drill', 'Explosion', 'Gunshot, gunfire', 'Machine gun', 'Fusillade', 'Artillery fire', 'Cap gun', 'Fireworks', 'Firecracker', 'Burst, pop', 'Eruption', 'Boom', 'Wood', 'Chop', 'Splinter', 'Crack', 'Glass', 'Chink, clink', 'Shatter', 'Liquid', 'Splash, splatter', 'Slosh', 'Squish', 'Drip', 'Pour', 'Trickle, dribble', 'Gush', 'Fill (with liquid)', 'Spray', 'Pump (liquid)', 'Stir', 'Boiling', 'Sonar', 'Arrow', 'Whoosh, swoosh, swish', 'Thump, thud', 'Thunk', 'Electronic tuner', 'Effects unit', 'Chorus effect', 'Basketball bounce', 'Bang', 'Slap, smack', 'Whack, thwack', 'Smash, crash', 'Breaking', 'Bouncing', 'Whip', 'Flap', 'Scratch', 'Scrape', 'Rub', 'Roll', 'Crushing', 'Crumpling, crinkling', 'Tearing', 'Beep, bleep', 'Ping', 'Ding', 'Clang', 'Squeal', 'Creak', 'Rustle', 'Whir', 'Clatter', 'Sizzle', 'Clicking', 'Clickety-clack', 'Rumble', 'Plop', 'Jingle, tinkle', 'Hum', 'Zing', 'Boing', 'Crunch', 'Silence', 'Sine wave', 'Harmonic', 'Chirp tone', 'Sound effect', 'Pulse', 'Inside, small room', 'Inside, large room or hall', 'Inside, public space', 'Outside, urban or manmade', 'Outside, rural or natural', 'Reverberation', 'Echo', 'Noise', 'Environmental noise', 'Static', 'Mains hum', 'Distortion', 'Sidetone', 'Cacophony', 'White noise', 'Pink noise', 'Throbbing', 'Vibration', 'Television', 'Radio', 'Field recording']
    
    let selectedSoundsArray = [];

    addSound("Smoke detector, smoke alarm");
    addSound("Doorbell");
    addSound("Baby cry, infant cry");
    
    // Adding options
    soundArray.forEach(sound => {
        const option = document.createElement('option');
        option.value = sound;
        sounds.appendChild(option);
    });

     // Adding a sound 
     addSoundButton.addEventListener('click', function () {
        const soundValue = alertInput.value.trim();

        if (soundValue == '' || !soundArray.includes(soundValue) || selectedSoundsArray.includes(soundValue)) {
            alertInput.classList.add('error');
        } else {
            alertInput.classList.remove('error');

            addSound(soundValue);
        }
    });

    function addSound(sound) {
        alertInput.classList.remove('error');

        const listItem = document.createElement('li');
        listItem.innerHTML = `
            <p>${sound}</p>
            <svg class="remove_btn" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-x">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
        `;

        const removeBtn = listItem.querySelector('.remove_btn');
        removeBtn.addEventListener('click', function () {
            listItem.remove();
            selectedSoundsArray.splice(selectedSoundsArray.indexOf(sound), 1);
        });

        soundList.appendChild(listItem);
        selectedSoundsArray.push(sound);
        alertInput.value = '';
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
                //    categories[0].categoryName 
                //    categories[0].score.toFixed(3) 

                output.innerText = `${categories[0].categoryName}, ${categories[1].categoryName}, or ${categories[2].categoryName} detected.`

            };

            source.connect(scriptNode);
            scriptNode.connect(audioCtx.destination);
        }



}


 

});