
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