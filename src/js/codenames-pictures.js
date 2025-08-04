
// ################################################################
// Firebase Functions
// ################################################################

import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-database.js";
import { ref, set, onValue } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-database.js";
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


function loadGame() {
    const FirebaseReference = getFirebaseReference();
    const gameRef = ref(database, `${FirebaseReference}/game`);
    onValue(gameRef, (snapshot) => {
        try {
            if (snapshot.exists()) {
                const gameData = snapshot.val();
                console.log("Game data loaded successfully:", gameData);
                const cardIndex = gameData.cardIndex || [];
                const revealed = gameData.revealed || [];
                const roles = gameData.roles || [];
                const startingTeam = gameData.startingTeam || 'red';
                showCardImages(cardIndex, roles, revealed);
                spymaster();
                updateStartingTeam(startingTeam);
            } else {
                console.log("No game data found.");
            }
        } catch (error) {
            console.error("Error loading game data:", error);
        }
    });
}

window.addEventListener('load', loadGame);

// ################################################################
// Gameplay Functions
// ################################################################

const blueRoles = ['b1', 'b2', 'b3', 'b4', 'b5', 'b6', 'b7', 'b8'];
function NewGame() {
    // Reset the game state
    const FirebaseReference = getFirebaseReference();
    const gameCountRef = ref(database, `${FirebaseReference}/gameCount`);
    get(gameCountRef).then((snapshot) => {
        let currentCount = snapshot.exists() ? snapshot.val() : 0;
        set(gameCountRef, currentCount + 1); // <-- Use set() here
    });

    setGame();
    // loadGame();
}

function showCardImages(cardIndex, roles, revealed) {
    const cardImages = cardIndex.map(num => `./assets/cards/card-${String(num)}.jpg`);
    const agentImages = roles.map((role, i) => revealed[i] ? `./assets/agents/${role}.png` : '');

    const tiles = document.querySelectorAll('.grid-container .tile img');
    cardImages.forEach((src, i) => {
        if (tiles[i]) {
            if (revealed[i]) {
                // If the card is revealed, show the agent image
                tiles[i].src = agentImages[i];
            }
            else {
                // If the card is not revealed, show the card image
                tiles[i].src = src;
            }
            tiles[i].alt = `Card ${cardIndex[i]}`;
        }
    });
}

function revealCard(index) {
    const FirebaseReference = getFirebaseReference();
    const gameRef = ref(database, `${FirebaseReference}/game`);
    get(gameRef).then((snapshot) => {
        if (snapshot.exists()) {
            const gameData = snapshot.val();
            const revealed = gameData.revealed || [];
            if (!revealed[index]) {
                revealed[index] = true; // Mark the card as revealed
                const updatedGameData = {                    ...gameData,
                    revealed: revealed
                };
                set(gameRef, updatedGameData);
            } else {
                console.log("Card already revealed.");
            }
        } else {
            console.error("Game data not found.");
        }
    }).catch((error) => {
        console.error("Error fetching game data:", error);
    });
}   

function updateStartingTeam(startingTeam) {
    const startingTeamDiv = document.querySelector('.startingTeam');
    if (startingTeamDiv) {
        startingTeamDiv.style.backgroundColor = startingTeam === 'red' ? 'red' : 'blue';
    }
}

function spymaster() {
    // Toggle spymaster mode
    const spymasterButton = document.getElementById('spymaster-btn');
    if (!spymasterButton) return;

    const isActive = spymasterButton.checked; // Use checked property for checkbox

    const FirebaseReference = getFirebaseReference();
    const gameRef = ref(database, `${FirebaseReference}/game`);
    get(gameRef).then((snapshot) => {
        if (!snapshot.exists()) return;
        const gameData = snapshot.val();
        const roles = gameData.roles || [];
        const revealed = gameData.revealed || [];
        const tiles = document.querySelectorAll('.grid-container .tile');

        tiles.forEach((tile, i) => {
            tile.style.boxShadow = '';
            tile.style.background = '';
            const img = tile.querySelector('img');
            if (isActive && !revealed[i]) {
                const role = roles[i];
                if (role && role[0] === 'r') {
                    tile.style.background = 'rgba(255,0,0,0.25)';
                } else if (role && role[0] === 'b') {
                    tile.style.background = 'rgba(0,0,255,0.25)';
                } else if (role && role[0] === 'g') {
                    tile.style.background = 'rgba(255,255,0,0.25)';
                } else if (role && role[0] === 'k') {
                    tile.style.background = 'rgba(0,0,0,0.60)';
                }
                if (img) img.style.opacity = '0.3';
            } else {
                if (img) img.style.opacity = '1';
            }
        });
    });
}



function setGame() {
    const cardIndex = getUniqueRandomIntegers(20, 0, 279);

    // Generate roles for the game
    let redIndex, redRoles, blueIndex, blueRoles, startingTeam;
    if (Math.random() < 0.5) {
        // Red team starts
        redIndex = getUniqueRandomIntegers(8, 0, 7);
        redRoles = redIndex.map(i => `r${i}`);
        blueIndex = getUniqueRandomIntegers(7, 0, 7);
        blueRoles = blueIndex.map(i => `b${i}`);
        startingTeam = 'red';
    } else {
        // Blue team starts
        redIndex = getUniqueRandomIntegers(7, 0, 7);
        redRoles = redIndex.map(i => `r${i}`);
        blueIndex = getUniqueRandomIntegers(8, 0, 7);
        blueRoles = blueIndex.map(i => `b${i}`);
        startingTeam = 'blue';
    }
    const greenIndex = getUniqueRandomIntegers(4, 0, 9);
    const greenRoles = greenIndex.map(i => `g${i}`);

    const blackRole = "k1";

    const roles = [...redRoles, ...blueRoles, ...greenRoles, blackRole];
    const shuffleOrder = getUniqueRandomIntegers(20, 0, 19);

    const shuffledRoles = shuffleOrder.map(i => roles[i]);

    const revealed = Array(20).fill(false);

    const FirebaseReference = getFirebaseReference();
    const gameRef = ref(database, `${FirebaseReference}/game`);
    const gameData = {
        roles: shuffledRoles,
        cardIndex: cardIndex,
        revealed: revealed,
        startingTeam: startingTeam
    };
    set(gameRef, gameData)
        .then(() => {
            console.log("Game data set successfully:", gameData);
        })
        .catch((error) => {
            console.error("Error setting game data:", error);
        }
    );

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

// Make revealing card function available globally
window.revealCard = revealCard;

// Make spymaster function available globally
window.spymaster = spymaster;

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

function adjustStartingTeamDiv() {
    const startingTeamDiv = document.querySelector('.startingTeam');
    if (startingTeamDiv) {
        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;
        if (windowWidth - 360 < windowHeight) {
            startingTeamDiv.style.top = '0px';
        } else {
            startingTeamDiv.style.top = '-16px';
        }
    }
}

function checkSize() {
    checkGitHubCornerVisibility();
    checkTitleVisibility();
    adjustTopControlsForSmallScreen();
    adjustStartingTeamDiv();
}

// Check on load
window.addEventListener('load', checkSize);

// Check on resize
window.addEventListener('resize', checkSize);