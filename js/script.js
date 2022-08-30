import playList from '../playList.js';
let state = {
    language: 'en',
    photoSource: 'github',
    searchTags: '',
    isPlayerAdvanced: false,
    blocks: ['link','player','weather','time','date','greeting','quote','socialLink']
};
const playListContainer = document.querySelector('.play-list');
const time = document.querySelector('.time');
const dateText = document.querySelector('.date');
const greet = document.querySelector('.greeting');
const slideNext = document.querySelector('.slide-next');
const slidePrev = document.querySelector('.slide-prev');
const weatherIcon = document.querySelector('.weather-icon');
const temperature = document.querySelector('.temperature');
const weatherDescription = document.querySelector('.weather-description');
const wind = document.querySelector('.wind');
const humidity = document.querySelector('.humidity');
const cityInput = document.querySelector('.city');
const weatherError = document.querySelector('.weather-error');
const quote = document.querySelector('.quote');
const author = document.querySelector('.author');
const changeQuoteBtn = document.querySelector('.change-quote');
let audio;
const playPrevBtn = document.querySelector('.play-prev');
const playNextBtn = document.querySelector('.play-next');
let randomNum = getRandomNum(20);
let isPlay = false;
const play = document.querySelector('.play');
let playNum = 0;
const title = document.querySelector('.title');
const settingsBtn = document.querySelector('.settings');
const settigsContainer = document.querySelector('.settings-container');
const settigsWrapper = document.querySelector('.settings-wrapper');
const settingsClose = document.querySelector('.settings-close');
const settingsHeaderText = document.querySelector('.settings-header-text');
const settingSectionsTexts = document.querySelectorAll('.settings-section-text');
const english = document.querySelector('.english');
const russian = document.querySelector('.russian');
const settingSections = document.querySelectorAll('.settings-switch-section');
const github = document.querySelector('.gitHub');
const unsplash = document.querySelector('.unsplashApi');
const flickr = document.querySelector('.flickrApi');
const socialLink = document.querySelector('.social-link');
const playerSection = document.querySelector('.playerSection');
const player = document.querySelector('.player');
const playerAdvancedSection = document.querySelector('.playerAdvancedSection');
const weatherSection = document.querySelector('.weatherSection');
const weather = document.querySelector('.weather');
const timeSection = document.querySelector('.timeSection');
const dateSection = document.querySelector('.dateSection');
const greetingSection = document.querySelector('.greetingSection');
const greeting = document.querySelector('.greeting-container');
const quoteSection = document.querySelector('.quoteSection');
const quoteWrapper = document.querySelector('.quote-wrapper');
const socialLinksSection = document.querySelector('.socialLinksSection');
const socialMedia = document.querySelector('.social-media-list');
const input = document.querySelector('.tag');
const inputName = document.querySelector('.name');
const totalTime = document.querySelector('.total-time');
const currentTime = document.querySelector('.current-time');
const progress = document.querySelector('.progress');
const soundButton = document.querySelector('.sound-icon');
const soundSlider = document.querySelector('.sound-slider');

const blocks = { "player" : {"block" : player, "switch" : playerSection}, 
                 "weather" : {"block" : weather, "switch" : weatherSection}, 
                 "time" : {"block" : time, "switch" : timeSection},
                 "date" : {"block" : dateText, "switch" : dateSection},
                 "greeting" : {"block" : greeting, "switch" : greetingSection},
                 "quote" : {"block" : quoteWrapper, "switch" : quoteSection},
                 "socialLink" : {"block" : socialLink, "switch" : socialLinksSection}
                };

const settingsTranslation = {
    ru: ['Язык приложения','Английский','Русский','Источник фонового изображения','GitHub','Unsplash API','Flickr API','Показать/скрыть элемент','Аудиоплеер','Аудиоплеер (продвинутый)','Прогноз погоды','Время','Дата','Приветствие','Цитата дня','Ссылки'],
    en: ['Language','English','Russian','Background photo source','GitHub','Unsplash API','Flickr API','Show/Hide','Player','Player (advanced)','Weather','Time','Date','Greating','Quote of the day','Social links'],
};

const greetingTranslation = {
    "en": {
        "night": "Good night, ",
        "morning": "Good morning, ",
        "afternoon": "Good afternoon, ",
        "evening": "Good evening, "
    },
    "ru": {
        "night": "Доброй ночи, ",
        "morning": "Доброе утро, ",
        "afternoon": "Добрый день, ",
        "evening": "Добрый вечер, "
    }
};

function createPlayListElements() {
    for(let i = 0; i < playList.length; i++){
        const li = document.createElement('li');
        playListContainer.append(li);
        li.classList.add('play-item');
        li.textContent = playList[i].title;
        const audio = document.createElement('audio');
        li.append(audio);
        audio.src = playList[i].src;
        audio.onended = function() {
            playNext();
        };
        li.addEventListener('click', () => { 
            if(isPlay) {
                stopPlay();
                if (playNum !== i) startPlay(i);
            } 
            else startPlay(i);
        });
    }
    audio = document.querySelectorAll('audio');
}

createPlayListElements()

const playItems = document.querySelectorAll('.play-item');

function showTime(){
    const date = new Date();
    time.textContent = date.toLocaleTimeString();
    showDate(date)
    showGreeting(date, state.language)
    setTimeout(showTime, 1000);

    currentTime.textContent = secondsToTimeString(audio[playNum].currentTime);
    progress.max = audio[playNum].duration;
    progress.value = audio[playNum].currentTime;
}

showTime()

function showDate(date){
    const options = {weekday: 'long', month: 'long', day: 'numeric', timeZone: 'UTC'};
    const currentDate = date.toLocaleDateString(state.language, options);
    dateText.textContent = currentDate;
}

function getTimeOfDay (date){
    const hours = date.getHours();
    const floorHours = Math.floor(hours/6)
    if(floorHours >= 0 && floorHours < 1){
        return 'night'
    } else if(floorHours >= 1 && floorHours < 2){
        return 'morning'
    } else if(floorHours >= 2 && floorHours < 3){
        return 'afternoon'
    } else {
        return 'evening'
    };
};

function showGreeting(date){
    const timeOfDay = getTimeOfDay(date);
    greet.textContent = greetingTranslation[state.language][timeOfDay];
};

const userNameInput = document.querySelector('.name');

function setLocalStorage(){
    localStorage.setItem('userName', userNameInput.value);
    localStorage.setItem('city', cityInput.value);
    localStorage.setItem('state', JSON.stringify(state));
}

window.addEventListener('beforeunload', setLocalStorage);

function getLocalStorage(){
    if(localStorage.getItem('userName')){
        userNameInput.value = localStorage.getItem('userName');
    };
    
    if(localStorage.getItem('state')){
        state = JSON.parse(localStorage.getItem('state'));
    };

    if(localStorage.getItem('city')){
        cityInput.value = localStorage.getItem('city');
    } else {
        if(state.language === 'en'){
            cityInput.value = 'Minsk';
        } else {
             cityInput.value = 'Минск';
        }
    }
    getWeather()
}

function init() {
    getLocalStorage();
    translateSettings ()
    input.value = state.searchTags;

    if(state.isPlayerAdvanced){
        let img = playerAdvancedSection.querySelector('img');
        player.classList.add('advanced');
        playerAdvancedSection.classList.add('active');
        img.src = './assets/svg/switch-active.svg';
    }

    if(state.language === 'en') {
        activateLanguage(english, russian, 'en');
    }
    else {
        activateLanguage(russian, english, 'ru');
    }
       
    if(state.photoSource === 'github'){
        activateSource('active', 'passive', 'passive');
    } else if(state.photoSource === 'unsplash'){
        activateSource('passive', 'active', 'passive');
    } else if(state.photoSource === 'flickr'){
        activateSource('passive', 'passive', 'active');
    }

    Object.keys(blocks).forEach(blockName => {
        let block = blocks[blockName].block;
        let mySwitch = blocks[blockName].switch;
        let img = mySwitch.querySelector('img');

        if (state.blocks.includes(blockName)) {
            img.src = './assets/svg/switch-active.svg';
            mySwitch.classList.add('active');
            block.classList.add('active');
        }
        else {
            img.src = './assets/svg/switch-passive.svg';
            mySwitch.classList.remove('active');
            block.classList.remove('active');
        }
    });

    if (state.blocks.includes('socialLink')) {
        socialMedia.classList.add('active');
    }
};

window.addEventListener('load', init)

const body = document.querySelector('body');

function getRandomNum(max) {
    let result = 0;
    let min = Math.ceil(1);
    result = Math.floor(Math.random() * (max - min + 1)) + min;
    return result
}

async function setBg(date, randomNum, imageLocation){
    let imageUrl;
    if(imageLocation === 'github') imageUrl = getGithubImage(date, randomNum);
    else if (imageLocation === 'unsplash') imageUrl = await getUnsplashImage(date);
    else if (imageLocation === 'flickr') imageUrl = await getFlickrImage(date, randomNum);
    
    const img = new Image();
    img.src = imageUrl;
    img.onload = () => {
        body.style.backgroundImage =`url('${imageUrl}')`;
    };
}

function getGithubImage(date, randomNum) {
    let bgNum = randomNum.toString();
    let timeOfDay = getTimeOfDay (date);
    if(bgNum.length === 1){
        bgNum = `0${bgNum}`;
    };
    return `https://raw.githubusercontent.com/Bulrock/stage1-tasks/assets/images/${timeOfDay}/${bgNum}.jpg`;
}

async function getUnsplashImage (date){
    let tagText = getBackgroundPhotoTag(date);
    const urlUnsplash = `https://api.unsplash.com/photos/random?orientation=landscape&query=${tagText}&client_id=Q1XX62aMzpE14ChKjlTz9rLCANhk8oBMnQHclleuUOQ`;
    const res = await fetch(urlUnsplash);
    const data = await res.json();
    console.log(data)
    return data.urls.regular;
}

async function getFlickrImage (date, randomNum){
    let tagText = getBackgroundPhotoTag(date);
    const urlFlickr = `https://www.flickr.com/services/rest/?method=flickr.photos.search&api_key=7e4f1d04ff410e63577a7eec9c4ae048&tags=${tagText}&extras=url_h&format=json&nojsoncallback=1`;
    const res = await fetch(urlFlickr);
    const data = await res.json();
    console.log(urlFlickr)
    console.log(data)
    return data.photos.photo[randomNum].url_h;
}

function getSlideNext(){
    if(randomNum < 20){
        randomNum += 1;
        setBg(new Date(), randomNum, state.photoSource);
    } else {
        randomNum = 1
        setBg(new Date(), randomNum, state.photoSource);
    };
}

function getSlidePrev(){
    if(randomNum > 1){
        randomNum -= 1;
        setBg(new Date(), randomNum, state.photoSource);
    } else {
        randomNum = 20
        setBg(new Date(), randomNum, state.photoSource);
    };
}

slideNext.addEventListener('click', getSlideNext);
slidePrev.addEventListener('click', getSlidePrev);

const weatherTranslation = {
    "en": {
        "windspeed": "Wind speed:",
        "humidity": "Humidity:",
        "speed": "m/s"
    },
    "ru": {
        "windspeed": "Скорость ветра:",
        "humidity": "Влажность:",
        "speed": "м/с"
    }
};

async function getWeather(){
    const city = cityInput.value;
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&lang=${state.language}&appid=e0986f11d3e6951681ea488bed9b128a&units=metric`;
    const res = await fetch(url);
    const data = await res.json();
  
    if(data.cod !== 200){
        weatherError.textContent = `Error! ${data.message} for '${city}'!`
        weatherIcon.classList =[];
        temperature.textContent = '';
        weatherDescription.textContent = '';
        wind.textContent = '';
        humidity.textContent = '';
        return
    } 

    console.log(data.weather[0].id, data.weather[0].description, data.main.temp, data.wind.speed, data.main.humidity);
    weatherIcon.className = 'weather-icon owf';
    weatherError.textContent = '';
    weatherIcon.classList.add(`owf-${data.weather[0].id}`);
    temperature.textContent = `${Math.ceil(data.main.temp)}°C`;
    weatherDescription.textContent = data.weather[0].description;
    wind.textContent = `${weatherTranslation[state.language].windspeed} ${Math.floor(data.wind.speed)} ${weatherTranslation[state.language].speed}`;
    humidity.textContent = `${weatherTranslation[state.language].humidity} ${(data.main.humidity)}%`;
};

async function setQuote (){
    const quotes = 'json/data.json';
    const res = await fetch(quotes);
    const data = await res.json();
    let i = getRandomNum(9);
    quote.textContent = data[i-1][state.language].quote;
    author.textContent = data[i-1][state.language].author;
};

setQuote ();

cityInput.addEventListener('change', getWeather);
changeQuoteBtn.addEventListener('click', setQuote);

function stopPlay() {
    audio[playNum].pause();
    isPlay = false;
    playItems[playNum].classList.remove('playing')
    playItems[playNum].classList.remove('item-active')
    play.classList.remove('pause');
}

function startPlay(songNum) {
    playNum = songNum
    audio[playNum].play();
    isPlay = true;
    totalTime.textContent = secondsToTimeString(audio[playNum].duration);
    playItems[playNum].classList.add('playing')
    playItems[playNum].classList.add('item-active')
    title.textContent = playList[playNum].title
    play.classList.add('pause');
}

function playAudio(){
    if(!isPlay){
        startPlay(playNum)
    } else {
        stopPlay()
    }
};

play.addEventListener('click', playAudio);
progress.addEventListener('change', ()=> {
    audio[playNum].currentTime = progress.value;
});

soundButton.addEventListener('click', ()=> {
    if(soundButton.classList.contains('muted')){
        soundButton.classList.remove('muted');
        soundButton.src = "./assets/svg/sound-high.svg"
        audio.forEach((song) => {
            song.muted = false;
        });
    } else {
        soundButton.classList.add('muted');
        soundButton.src = "./assets/svg/sound-off.svg"
        audio.forEach((song) => {
            song.muted = true;
        });
    }
});

soundSlider.addEventListener('change', ()=> {
    audio[playNum].volume = soundSlider.value/100;
});

playerAdvancedSection.addEventListener('click', () => {
    player.classList.toggle('advanced');
    state.isPlayerAdvanced = player.classList.contains('advanced');
    let imgAdvancedPlayer = playerAdvancedSection.querySelector('img');
    if(player.classList.contains('advanced')){
        imgAdvancedPlayer.src = './assets/svg/switch-active.svg';
        playerAdvancedSection.classList.add('active');
    } else {
        imgAdvancedPlayer.src = './assets/svg/switch-passive.svg';
        playerAdvancedSection.classList.remove('active');
    }
});

function secondsToTimeString(seconds){
    let minutes = Math.floor(seconds/60);
    let secondsCurrent = Math.floor(seconds - minutes*60);
    let secondsCurrentString = secondsCurrent;
    if(secondsCurrent < 10){
    secondsCurrentString = `0${secondsCurrent}`
    }
    let time = `${minutes}:${secondsCurrentString}`;
    return time
}

function playPrev(){
    stopPlay()
    let songNum = playNum;
    if(songNum > 0){
        songNum -= 1;
    } else if (songNum === 0){
        songNum = playList.length - 1;
    };
    startPlay(songNum)
};

function playNext(){
    stopPlay()
    let songNum = playNum;
    if (songNum < (playList.length -1)){
        songNum += 1;
    } else if (songNum === (playList.length - 1)){
        songNum = 0;
    };
    startPlay(songNum)
};

playPrevBtn.addEventListener('click', playPrev)
playNextBtn.addEventListener('click', playNext)

function toggleBtn1() {
    play.classList.add('pause');
};

playPrevBtn.addEventListener('click', toggleBtn1);
playNextBtn.addEventListener('click', toggleBtn1);

function toggleSettings() {
    if(settigsContainer.classList.contains('active')) {
        settigsContainer.classList.remove('active');
        setTimeout(() => {
            settigsWrapper.classList.remove('active');
       }, 500);
    }
    else {
        settigsContainer.classList.add('active');
        settigsWrapper.classList.add('active');
    }
};

settingsBtn.addEventListener('click', toggleSettings)
settingsClose.addEventListener('click', () => {
    toggleSettings()
});

const namePlaceholder = {
    ru: ['[Введите имя]'],
    en: ['[Enter name]'],
};

const settingsHeader = {
    ru: ['Настройки'],
    en: ['Settings'],
};

const settingsTag = {
    ru: ['Введите теги для поиска фона...'],
    en: ['Enter background image search tags...'],
};

function translateSettings (){
    for (let i = 0; i < settingSectionsTexts.length; i++){
     settingSectionsTexts[i].textContent = settingsTranslation[state.language][i];
    }
    settingsHeaderText.textContent = settingsHeader[state.language][0];
    let settingsTagText = settingsTag[state.language][0];
    input.setAttribute('placeholder', settingsTagText);
    let placeholderNameText = namePlaceholder[state.language][0];
    inputName.setAttribute('placeholder', placeholderNameText);
 };

function setLanguage (lang){
    state.language = lang;
    showTime();
    getWeather();
    setQuote();
    translateSettings();

    if(cityInput.value === 'Минск' && state.language === 'en'){
        cityInput.value = 'Minsk';
    } else if (cityInput.value === 'Minsk' && state.language === 'ru'){
         cityInput.value = 'Минск';
    }
};

function activateLanguage(activeLanguageSwitch, inactiveLanguageSwitch, language) {
    let imgEn = activeLanguageSwitch.querySelector('img')
    imgEn.src = './assets/svg/switch-active.svg'
    activeLanguageSwitch.classList.add('active');

    let imgRu = inactiveLanguageSwitch.querySelector('img');
    imgRu.src = './assets/svg/switch-passive.svg';
    inactiveLanguageSwitch.classList.remove('active');

    setLanguage(language);
};

english.addEventListener('click', () => {
    activateLanguage(english, russian, 'en');
});

russian.addEventListener('click', () => {
    activateLanguage(russian, english, 'ru');
});

settingSections.forEach(section => {
    let img = section.querySelector('img')
    section.addEventListener('mouseover', () => {
        if(section.classList.contains('active')){
            img.src = './assets/svg/switch-active-hover.svg'
        } else {
            img.src = './assets/svg/switch-passive-hover.svg'
        }
    });
});

settingSections.forEach(section => {
    let img = section.querySelector('img')
    section.addEventListener('mouseout', () => {
        if(section.classList.contains('active')){
            img.src = './assets/svg/switch-active.svg'
        } else {
            img.src = './assets/svg/switch-passive.svg'
        }
    });
});

function activateSource(firstCondition, secondCondition, thirdCondition) {
    let imgGit = github.querySelector('img');
    if(firstCondition === 'active'){
        imgGit.src = './assets/svg/switch-active.svg';
        github.classList.add('active');

        state.photoSource = 'github';
        setBg(new Date(), randomNum, 'github');
    } else {
        imgGit.src = './assets/svg/switch-passive.svg';
        github.classList.remove('active');
    }

    let imgUnsplash = unsplash.querySelector('img');
    if(secondCondition === 'active'){
        imgUnsplash.src = './assets/svg/switch-active.svg';
        unsplash.classList.add('active');
        imgGit.src = './assets/svg/switch-passive.svg';
        github.classList.remove('active');

        state.photoSource = 'unsplash';
        setBg(new Date(), randomNum, 'unsplash');
    } else {
        imgUnsplash.src = './assets/svg/switch-passive.svg';
        unsplash.classList.remove('active');
    }   

    let imgFlickr = flickr.querySelector('img');
    if(thirdCondition === 'active'){
        imgFlickr.src = './assets/svg/switch-active.svg';
        flickr.classList.add('active');
        imgGit.src = './assets/svg/switch-passive.svg';
        github.classList.remove('active');

        state.photoSource = 'flickr';
        setBg(new Date(), randomNum, 'flickr');
    } else {
        imgFlickr.src = './assets/svg/switch-passive.svg';
        flickr.classList.remove('active');
    }
};

github.addEventListener('click', () => {
    activateSource('active', 'passive', 'passive')
});

unsplash.addEventListener('click', () => {
    activateSource('active', 'active', 'passive')
});

flickr.addEventListener('click', () => {
    activateSource('passive', 'passive', 'active')
});

function activatePlayer (playerSection, player, blockName){
    let imgPlayer = playerSection.querySelector('img');
    imgPlayer.src = './assets/svg/switch-active.svg';
    playerSection.classList.add('active');
    player.classList.add('active');
    state.blocks.push(blockName);
};

function deactivatePlayer (playerSection, player, blockName){
    let imgPlayer = playerSection.querySelector('img');
    imgPlayer.src = './assets/svg/switch-passive.svg';
    playerSection.classList.remove('active');
    player.classList.remove('active');
    state.blocks = state.blocks.filter(block => block !== blockName);
};

playerSection.addEventListener('click', () => {
    if(playerSection.classList.contains('active')){
        deactivatePlayer(playerSection, player, 'player');
    } else {
        activatePlayer(playerSection, player, 'player');
    }
});

weatherSection.addEventListener('click', () => {
    let imgWeather = weatherSection.querySelector('img');
    if(weatherSection.classList.contains('active')){
        imgWeather.src = './assets/svg/switch-passive.svg';
        weatherSection.classList.remove('active');
        weather.classList.remove('active');
        state.blocks = state.blocks.filter(block => block !== 'weather');
    } else {
        imgWeather.src = './assets/svg/switch-active.svg';
        weatherSection.classList.add('active');
        weather.classList.add('active');
        state.blocks.push('weather');
    }
});

timeSection.addEventListener('click', () => {
    let imgTime = timeSection.querySelector('img');
    if(timeSection.classList.contains('active')){
        imgTime.src = './assets/svg/switch-passive.svg';
        timeSection.classList.remove('active');
        time.classList.remove('active');
        state.blocks = state.blocks.filter(block => block !== 'time');
    } else {
        imgTime.src = './assets/svg/switch-active.svg';
        timeSection.classList.add('active');
        time.classList.add('active');
        state.blocks.push('time');
    }
});

dateSection.addEventListener('click', () => {
    let imgDate = dateSection.querySelector('img');
    if(dateSection.classList.contains('active')){
        imgDate.src = './assets/svg/switch-passive.svg';
        dateSection.classList.remove('active');
        dateText.classList.remove('active');
        state.blocks = state.blocks.filter(block => block !== 'date');
    } else {
        imgDate.src = './assets/svg/switch-active.svg';
        dateSection.classList.add('active');
        dateText.classList.add('active');
        state.blocks.push('date');
    }
});

greetingSection.addEventListener('click', () => {
    let imgGreeting = greetingSection.querySelector('img');
    if(greetingSection.classList.contains('active')){
        imgGreeting.src = './assets/svg/switch-passive.svg';
        greetingSection.classList.remove('active');
        greeting.classList.remove('active');
        state.blocks = state.blocks.filter(block => block !== 'greeting');
    } else {
        imgGreeting.src = './assets/svg/switch-active.svg';
        greetingSection.classList.add('active');
        greeting.classList.add('active');
        state.blocks.push('greeting');
    }
});

quoteSection.addEventListener('click', () => {
    let imgQuote = quoteSection.querySelector('img');
    if(quoteSection.classList.contains('active')){
        imgQuote.src = './assets/svg/switch-passive.svg';
        quoteSection.classList.remove('active');
        quoteWrapper.classList.remove('active');
        state.blocks = state.blocks.filter(block => block !== 'quote');
    } else {
        imgQuote.src = './assets/svg/switch-active.svg';
        quoteSection.classList.add('active');
        quoteWrapper.classList.add('active');
        state.blocks.push('quote');
    }
});

socialLinksSection.addEventListener('click', () => {
    let imgSocial = socialLinksSection.querySelector('img');
    if(socialMedia.classList.contains('active')){
        imgSocial.src = './assets/svg/switch-passive.svg';
        socialLinksSection.classList.remove('active');
        socialMedia.classList.remove('active');
        socialLink.classList.remove('active');
        state.blocks = state.blocks.filter(block => block !== 'socialLink');
    } else {
        imgSocial.src = './assets/svg/switch-active.svg';
        socialLinksSection.classList.add('active');
        socialMedia.classList.add('active');
        socialLink.classList.add('active');
        state.blocks.push('socialLink');
    }
});

function getBackgroundPhotoTag(date) {
    const timeOfDay = getTimeOfDay(date);
    let tagText = input.value
    if(tagText != null && tagText != undefined && tagText != ''){
        tagText = tagText.split(/\s*\W\s*/, 20).filter(c => c != '').join(',');
    } else {
        tagText = timeOfDay;
    }

    input.addEventListener('change', ()=> {
        state.searchTags = input.value;
        setBg(date, randomNum, state.photoSource)
    });
    
    return tagText;
};