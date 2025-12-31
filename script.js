// Screen navigation
function showScreen(screenId) {
    // Hide all screens
    const screens = document.querySelectorAll('.screen');
    screens.forEach(screen => {
        screen.classList.add('hidden');
    });
    
    // Show target screen
    const targetScreen = document.getElementById(screenId);
    if (targetScreen) {
        targetScreen.classList.remove('hidden');
    }
    
    // Reset menu buttons when returning to title screen
    if (screenId === 'title-screen') {
        const menuButtons = document.querySelectorAll('.menu-btn');
        menuButtons.forEach(btn => {
            btn.classList.remove('active');
        });
    }
}

// Menu button navigation
document.addEventListener('DOMContentLoaded', function() {
    const menuButtons = document.querySelectorAll('.menu-btn');
    
    menuButtons.forEach(button => {
        button.addEventListener('click', function() {
            const targetScreen = this.getAttribute('data-screen');
            
            // Map menu button targets to actual screen IDs
            const screenMap = {
                'about': 'about-screen',
                'education': 'education-screen',
                'experience': 'experience-screen',
                'leadership': 'leadership-screen',
                'research': 'research-screen'
            };
            
            const screenId = screenMap[targetScreen] || targetScreen + '-screen';
            showScreen(screenId);
            
            // Update active state
            menuButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
        });
    });
    
    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
        // ESC key to go back to title screen
        if (e.key === 'Escape') {
            showScreen('title-screen');
            menuButtons.forEach(btn => btn.classList.remove('active'));
        }
        
        // Number keys for quick navigation (1-5)
        const keyMap = {
            '1': 'about-screen',
            '2': 'education-screen',
            '3': 'experience-screen',
            '4': 'leadership-screen',
            '5': 'research-screen'
        };
        
        if (keyMap[e.key]) {
            showScreen(keyMap[e.key]);
            // Update active button
            menuButtons.forEach(btn => {
                btn.classList.remove('active');
                const btnScreen = btn.getAttribute('data-screen');
                const screenMap = {
                    'about': 'about-screen',
                    'education': 'education-screen',
                    'experience': 'experience-screen',
                    'leadership': 'leadership-screen',
                    'research': 'research-screen'
                };
                if (screenMap[btnScreen] === keyMap[e.key]) {
                    btn.classList.add('active');
                }
            });
        }
    });
    
    // Add sound effects simulation (visual feedback)
    const buttons = document.querySelectorAll('button');
    buttons.forEach(button => {
        button.addEventListener('click', function() {
            // Add a subtle animation for button press
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = '';
            }, 100);
        });
    });
    
    // Add hover sound effect simulation for quest items
    const questItems = document.querySelectorAll('.quest-item');
    questItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            this.style.transition = 'all 0.3s ease';
        });
    });
    
    // Animate health bars on load
    const healthBars = document.querySelectorAll('.health-fill');
    healthBars.forEach(bar => {
        const width = bar.style.width;
        bar.style.width = '0%';
        setTimeout(() => {
            bar.style.transition = 'width 1s ease-out';
            bar.style.width = width;
        }, 100);
    });
    
});

// Smooth scrolling for long content
function smoothScroll(element) {
    element.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
    });
}

// Add parallax effect to background (subtle)
window.addEventListener('scroll', function() {
    const scrolled = window.pageYOffset;
    const parallax = document.querySelector('.game-container');
    if (parallax) {
        parallax.style.backgroundPositionY = scrolled * 0.5 + 'px';
    }
});

// Add click sound simulation (visual only)
document.addEventListener('click', function(e) {
    if (e.target.tagName === 'BUTTON' || e.target.closest('button')) {
        // Create a small visual feedback
        const ripple = document.createElement('div');
        ripple.style.position = 'fixed';
        ripple.style.width = '10px';
        ripple.style.height = '10px';
        ripple.style.borderRadius = '50%';
        ripple.style.background = 'rgba(0, 217, 255, 0.5)';
        ripple.style.pointerEvents = 'none';
        ripple.style.left = e.clientX - 5 + 'px';
        ripple.style.top = e.clientY - 5 + 'px';
        ripple.style.animation = 'ripple 0.6s ease-out';
        document.body.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    }
});

// Add ripple animation
const style = document.createElement('style');
style.textContent = `
    @keyframes ripple {
        0% {
            transform: scale(0);
            opacity: 1;
        }
        100% {
            transform: scale(20);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

