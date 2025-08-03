
// ################################################################
// Firebase Functions
// ################################################################

import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-database.js";
import { ref, set } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-database.js";
import { get, update } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-database.js";

// Firebase configuration
const firebaseConfig = {
    databaseURL: "https://codenames-pictures-2e44c-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "codenames-pictures-2e44c"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

function getFirebaseReference(){
    const url = window.location;
    const urlObject = new URL(url);
    var game_id = urlObject.searchParams.get('game')
    if (game_id == null){
        game_id = 'default';
    }
    var FirebaseReference = game_id;
    return FirebaseReference
}

// ################################################################
// Gameplay Functions
// ################################################################



function NewGame() {
    // Reset the game state
    const FirebaseReference = getFirebaseReference();
    const gameCountRef = ref(database, `${FirebaseReference}/gameCount`);
    get(gameCountRef).then((snapshot) => {
        let currentCount = snapshot.exists() ? snapshot.val() : 0;
        set(gameCountRef, currentCount + 1); // <-- Use set() here
    });

    setGame();
}


function spymaster() {
    // Toggle spymaster mode
}

function setGame() {
    const cardIndex = getUniqueRandomIntegers(20, 0, 279);
    const cardImages = cardIndex.map(num => `./assets/cards/card-${String(num)}.jpg`);

    const tiles = document.querySelectorAll('.grid-container .tile img');
    cardImages.forEach((src, i) => {
        if (tiles[i]) {
            tiles[i].src = src;
            tiles[i].alt = `Card ${cardIndex[i]}`;
        }
    });
}


function getUniqueRandomIntegers(count, min, max) {
    const numbers = new Set();
    while (numbers.size < count) {
        const num = Math.floor(Math.random() * (max - min + 1)) + min;
        numbers.add(num);
    }
    return Array.from(numbers);
}

// Export functions for use in other modules
export { NewGame, spymaster, setGame, getUniqueRandomIntegers };

// Make available in console
window.getUniqueRandomIntegers = getUniqueRandomIntegers;

// Make NewGame available globally
window.NewGame = NewGame;

// ################################################################
// Responsive Design Functions
// ################################################################

function checkGitHubCornerVisibility() {
    const githubCorner = document.querySelector('.github-corner');
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    
    // Hide if width + 160px < height
    if (windowWidth - 360 < windowHeight) {
        githubCorner.classList.add('hidden');
    } else {
        githubCorner.classList.remove('hidden');
    }
}

function checkTitleVisibility() {
    const title = document.querySelector('.title');
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;

    // Hide title if it overflows
    if (windowWidth - 360 < windowHeight) {
        title.classList.add('hidden');
    } else {
        title.classList.remove('hidden');
    }
}

function adjustTopControlsForSmallScreen() {
    const topLeft = document.querySelector('.top-left-container');
    const grid = document.querySelector('.grid-container');
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;

    if (windowWidth - 360 < windowHeight) {
        // Center controls and add vertical padding
        topLeft.style.position = 'static';
        topLeft.style.justifyContent = 'center';
        topLeft.style.width = '100%';
        topLeft.style.margin = '0 auto 12px auto';
        grid.style.paddingTop = '24px';
    } else {
        // Restore original styles
        topLeft.style.position = 'absolute';
        topLeft.style.justifyContent = '';
        topLeft.style.width = '';
        topLeft.style.margin = '';
        grid.style.paddingTop = '';
    }
}

function checkSize() {
    checkGitHubCornerVisibility();
    checkTitleVisibility();
    adjustTopControlsForSmallScreen();
}

// Check on load
window.addEventListener('load', checkSize);

// Check on resize
window.addEventListener('resize', checkSize);