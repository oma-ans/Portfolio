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
                'research': 'research-screen',
                'extras': 'extras-screen'
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
            '3': 'research-screen',
            '4': 'extras-screen'
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
                    'research': 'research-screen',
                    'extras': 'extras-screen'
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
    
    // Experience tab toggle
    const tabBtns = document.querySelectorAll('.tab-btn');
    tabBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const target = this.getAttribute('data-tab');
            tabBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            document.querySelectorAll('.tab-panel').forEach(panel => panel.classList.remove('active'));
            document.getElementById('tab-' + target).classList.add('active');
        });
    });

    // Accordion functionality
    const accordionHeaders = document.querySelectorAll('.accordion-header');
    accordionHeaders.forEach(header => {
        header.addEventListener('click', function() {
            const accordionItem = this.closest('.accordion-item');
            accordionItem.classList.toggle('collapsed');
        });
    });

    // ── Spotify Now Playing ──────────────────────────────────────────
    const npCard      = document.getElementById('now-playing-card');
    const npTitle     = document.getElementById('np-title');
    const npArtist    = document.getElementById('np-artist');
    const npAlbumImg  = document.getElementById('np-album-img');
    const npProgress  = document.getElementById('np-progress');
    const npBadge     = npCard ? npCard.querySelector('.np-badge') : null;

    async function fetchNowPlaying() {
        if (!npCard) return;
        try {
            const res = await fetch('/api/now-playing');
            if (!res.ok) throw new Error('API error');
            const data = await res.json();

            npCard.classList.remove('loading', 'playing', 'not-playing');

            if (data.isPlaying) {
                npCard.classList.add('playing');
                npTitle.textContent  = data.title  || '—';
                npArtist.textContent = data.artist || '—';
                if (data.albumArt) {
                    npAlbumImg.src = data.albumArt;
                    npAlbumImg.style.display = 'block';
                }
                if (data.duration > 0) {
                    npProgress.style.width = ((data.progress / data.duration) * 100).toFixed(1) + '%';
                }
                if (npBadge) npBadge.textContent = '● LIVE ON SPOTIFY';
                // Make the card a clickable link to the track
                if (data.trackUrl) {
                    npCard.style.cursor = 'pointer';
                    npCard.onclick = () => window.open(data.trackUrl, '_blank', 'noopener');
                }
            } else {
                npCard.classList.add('not-playing');
                npTitle.textContent  = 'Not currently listening';
                npArtist.textContent = '—';
                npAlbumImg.style.display = 'none';
                npProgress.style.width = '0%';
                if (npBadge) npBadge.textContent = '○ SPOTIFY';
                npCard.style.cursor = 'default';
                npCard.onclick = null;
            }
        } catch (_) {
            // Silently hide the card if the API isn't set up yet
            if (npCard) npCard.style.display = 'none';
        }
    }

    // Fetch on load, then poll every 30 seconds
    fetchNowPlaying();
    setInterval(fetchNowPlaying, 30000);

    // Also re-fetch when the user opens the Extras screen
    const extrasScreen = document.getElementById('extras-screen');
    if (extrasScreen) {
        new MutationObserver(function() {
            if (!extrasScreen.classList.contains('hidden')) {
                fetchNowPlaying();
            }
        }).observe(extrasScreen, { attributes: true, attributeFilter: ['class'] });
    }
    // ────────────────────────────────────────────────────────────────

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

// ========== Runner game (Chrome Dino-style) ==========
(function() {
    const SPRITE_PATHS = {
        idle: 'assets/businessman_idle.png',
        run1: 'assets/businessman_run1.png',
        run2: 'assets/businessman_run2.png',
        run3: 'assets/businessman_run3.png',
        jump: 'assets/businessman_jump.png',
        duck1: 'assets/businessman_duck1.png',
        duck2: 'assets/businessman_duck2.png',
        dead: 'assets/businessman_dead.png',
        tree1: 'assets/obstacle_tree1.png',
        tree2: 'assets/obstacle_tree2.png',
        airplane: 'assets/obstacle_paper_airplane.png'
    };

    let canvas, ctx, viewport;
    let sprites = {};
    let gameWidth, gameHeight;
    let groundY;
    let characterX, characterY, characterW, characterH, characterDuckH;
    let state = 'waiting'; // waiting | idle | running | jumping | ducking | dead
    let velocityY = 0;
    let runFrameIndex = 0;
    let duckFrameIndex = 0;
    let lastFrameTime = 0;
    let runFrameTime = 0;
    let duckFrameTime = 0;
    let score = 0;
    let highScore = 0;
    let speed = 357;
    let obstacles = [];
    let lastSpawnX = 0;
    let minGap = 320;
    let jumpPressedAt = 0;
    let jumpHeld = false;
    let duckHeld = false;
    let animationId = null;
    const GRAVITY = 2200;
    const JUMP_IMPULSE = 770;
    const JUMP_HOLD_EXTRA = 320;
    const JUMP_HOLD_MAX_MS = 280;
    const TAP_THRESHOLD_MS = 180;
    const RUN_FRAME_MS = 90;
    const DUCK_FRAME_MS = 100;
    const TREE_BASE_W = 32;
    const TREE_BASE_H = 48;
    const AIRPLANE_W = 40;
    const AIRPLANE_H = 24;
    const CHAR_BASE_W = 40;
    const CHAR_RUN_H = 48;
    const CHAR_DUCK_H = 28;
    const SCALE = 2;
    const CLUMP_PROB = 0.35;
    const AIRPLANE_SPAWN_PROB = 0.22;
    const AIRPLANE_Y_OFFSET = 36;
    const GROUND_HEIGHT = 48;

    function loadImage(src) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => resolve(img);
            img.onerror = reject;
            img.src = src;
        });
    }

    function preloadSprites() {
        const entries = Object.entries(SPRITE_PATHS);
        return Promise.all(entries.map(([key, src]) => loadImage(src).then(img => { sprites[key] = img; })));
    }

    function getViewportSize() {
        if (!viewport) return { w: 600, h: 300 };
        const rect = viewport.getBoundingClientRect();
        const w = Math.max(viewport.offsetWidth || 0, Math.ceil(rect.width)) || 600;
        const h = Math.max(viewport.offsetHeight || 0, Math.ceil(rect.height)) || 300;
        return { w, h };
    }

    function initCanvas() {
        viewport = document.getElementById('runner-viewport');
        canvas = document.getElementById('runner-canvas');
        if (!canvas || !viewport) return false;
        ctx = canvas.getContext('2d');
        const { w, h } = getViewportSize();
        const dpr = window.devicePixelRatio || 1;
        const widthPx = Math.ceil(w * dpr);
        const heightPx = Math.ceil(h * dpr);
        canvas.width = widthPx;
        canvas.height = heightPx;
        canvas.style.width = w + 'px';
        canvas.style.height = h + 'px';
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.scale(dpr, dpr);
        gameWidth = w;
        gameHeight = h;
        groundY = h - GROUND_HEIGHT;
        characterX = gameWidth * 0.2;
        characterW = CHAR_BASE_W * SCALE * 0.85;
        characterH = CHAR_RUN_H * SCALE * 0.85;
        characterDuckH = CHAR_DUCK_H * SCALE * 0.85;
        characterY = groundY - characterH;
        return true;
    }

    function drawSprite(key, x, y, w, h) {
        const img = sprites[key];
        if (!img) return;
        ctx.imageSmoothingEnabled = false;
        ctx.drawImage(img, x, y, w, h);
    }

    function getCharacterHitbox() {
        const h = state === 'ducking' ? characterDuckH : characterH;
        const y = state === 'ducking' ? groundY - h : characterY;
        return {
            left: characterX + characterW * 0.15,
            right: characterX + characterW * 0.85,
            top: y + h * 0.1,
            bottom: y + h - 2
        };
    }

    function rectsOverlap(a, b) {
        return a.left < b.right && a.right > b.left && a.top < b.bottom && a.bottom > b.top;
    }

    function spawnObstacle() {
        const isAirplane = Math.random() < AIRPLANE_SPAWN_PROB && obstacles.every(o => o.type !== 'airplane');
        if (isAirplane) {
            const img = sprites.airplane;
            const w = AIRPLANE_W * SCALE;
            const h = AIRPLANE_H * SCALE;
            obstacles.push({
                type: 'airplane',
                x: gameWidth,
                y: groundY - h - AIRPLANE_Y_OFFSET,
                w, h,
                img
            });
            lastSpawnX = gameWidth;
            return;
        }

        const isClump = Math.random() < CLUMP_PROB;
        const count = isClump ? (Math.random() < 0.5 ? 2 : 3) : 1;
        let x = gameWidth;
        for (let i = 0; i < count; i++) {
            const scale = 0.75 + Math.random() * 0.5;
            const w = TREE_BASE_W * SCALE * scale;
            const h = TREE_BASE_H * SCALE * scale;
            const treeImg = Math.random() < 0.5 ? sprites.tree1 : sprites.tree2;
            obstacles.push({
                type: 'tree',
                x, y: groundY - h + 6,
                w, h, img: treeImg
            });
            x += w;
        }
        lastSpawnX = gameWidth;
    }

    function updateObstacles(dt) {
        const move = speed * (dt / 1000);
        for (let i = obstacles.length - 1; i >= 0; i--) {
            obstacles[i].x -= move;
            if (obstacles[i].x + obstacles[i].w < 0) obstacles.splice(i, 1);
        }
        const rightmost = obstacles.length ? Math.max(...obstacles.map(o => o.x + o.w)) : 0;
        if (gameWidth - rightmost > minGap) spawnObstacle();
    }

    function checkCollisions() {
        const char = getCharacterHitbox();
        for (const o of obstacles) {
            let box;
            if (o.type === 'tree') {
                const trunkFraction = 0.45;
                const trunkTop = o.y + o.h * (1 - trunkFraction);
                box = { left: o.x + o.w * 0.15, right: o.x + o.w * 0.85, top: trunkTop, bottom: o.y + o.h };
            } else {
                box = { left: o.x, right: o.x + o.w, top: o.y, bottom: o.y + o.h };
            }
            if (!rectsOverlap(char, box)) continue;
            if (o.type === 'tree') return true;
            if (o.type === 'airplane' && state !== 'ducking') return true;
        }
        return false;
    }

    function update(timestamp) {
        if (document.getElementById('about-screen').classList.contains('hidden')) return;
        if (state === 'dead') return;
        if (state === 'waiting') return;
        const dt = lastFrameTime ? timestamp - lastFrameTime : 16;
        lastFrameTime = timestamp;

        score += Math.floor(speed * (dt / 1000) * 2);
        document.getElementById('runner-score').textContent = 'SCORE: ' + String(score).padStart(5, '0');

        speed = Math.min(600, 357 + score * 0.0225);

        if (state === 'jumping') {
            const holdDuration = timestamp - jumpPressedAt;
            if (jumpHeld && holdDuration < JUMP_HOLD_MAX_MS && velocityY < 0) {
                velocityY -= (JUMP_HOLD_EXTRA * dt) / 1000;
            }
            velocityY += (GRAVITY * dt) / 1000;
            characterY += velocityY * (dt / 1000);
            if (characterY >= groundY - characterH) {
                characterY = groundY - characterH;
                velocityY = 0;
                state = duckHeld ? 'ducking' : 'running';
            }
        }

        if (state === 'running' || state === 'ducking') {
            runFrameTime += dt;
            duckFrameTime += dt;
            if (runFrameTime >= RUN_FRAME_MS) {
                runFrameTime = 0;
                runFrameIndex = (runFrameIndex + 1) % 3;
            }
            if (state === 'ducking' && duckFrameTime >= DUCK_FRAME_MS) {
                duckFrameTime = 0;
                duckFrameIndex = 1 - duckFrameIndex;
            }
        }

        if (state !== 'waiting') updateObstacles(dt);

        if (state !== 'waiting' && checkCollisions()) {
            state = 'dead';

            if (score > highScore) {
                highScore = score;
            }

            document.getElementById('runner-final-score').textContent =
                'SCORE: ' + String(score).padStart(5, '0');

            const highScoreEl = document.getElementById('runner-high-score');
            if (highScoreEl) {
                highScoreEl.textContent =
                    'HIGH SCORE: ' + String(highScore).padStart(5, '0');
            }

            document.getElementById('runner-game-over').classList.remove('hidden');
        }
    }

    function draw() {
        ctx.clearRect(0, 0, gameWidth, gameHeight);

        const dpr = window.devicePixelRatio || 1;
        const canvasLogicalWidth = canvas.width / dpr;
        const drawWidth = Math.max(gameWidth, canvasLogicalWidth, canvas.clientWidth || 0) + 50;
        const groundGradient = ctx.createLinearGradient(0, groundY, 0, gameHeight);
        groundGradient.addColorStop(0, '#3d6b20');
        groundGradient.addColorStop(1, '#2d5016');
        ctx.fillStyle = groundGradient;
        ctx.fillRect(0, groundY, drawWidth, GROUND_HEIGHT + 2);
        ctx.fillStyle = '#1a3009';
        ctx.fillRect(0, groundY, drawWidth, 3);

        for (const o of obstacles) {
            if (o.img) ctx.drawImage(o.img, o.x, o.y, o.w, o.h);
        }

        let spriteKey;
        let drawH = characterH;
        let drawY = characterY;
        if (state === 'dead') {
            spriteKey = 'dead';
            drawH = characterH;
        } else if (state === 'jumping') {
            spriteKey = 'jump';
        } else if (state === 'ducking') {
            spriteKey = duckFrameIndex === 0 ? 'duck1' : 'duck2';
            drawH = characterDuckH;
            drawY = groundY - characterDuckH;
        } else if (state === 'idle' || state === 'waiting') {
            spriteKey = 'idle';
        } else {
            spriteKey = ['run1', 'run2', 'run3'][runFrameIndex];
        }
        drawSprite(spriteKey, characterX, drawY, characterW, drawH);
    }

    function gameLoop(timestamp) {
        update(timestamp);
        draw();
        const aboutHidden = document.getElementById('about-screen').classList.contains('hidden');
        if (state !== 'dead' && !aboutHidden) {
            animationId = requestAnimationFrame(gameLoop);
        } else {
            animationId = null;
        }
    }

    function startGame() {
        const startOverlay = document.getElementById('runner-start-overlay');
        if (startOverlay) startOverlay.classList.add('hidden');
        state = 'idle';
        velocityY = 0;
        runFrameIndex = 0;
        duckFrameIndex = 0;
        score = 0;
        speed = 357;
        obstacles = [];
        lastSpawnX = gameWidth;
        characterY = groundY - characterH;
        document.getElementById('runner-game-over').classList.add('hidden');
        if (!animationId) animationId = requestAnimationFrame(gameLoop);
    }

    function onJumpPress() {
        if (state === 'dead') return;
        if (state === 'waiting') {
            startGame();
            state = 'jumping';
            velocityY = -JUMP_IMPULSE;
            jumpHeld = true;
            jumpPressedAt = performance.now();
            return;
        }
        jumpHeld = true;
        jumpPressedAt = performance.now();
        if (state === 'running' || state === 'idle') {
            state = 'jumping';
            velocityY = -JUMP_IMPULSE;
        }
    }

    function onJumpRelease() {
        jumpHeld = false;
        if (state === 'idle') state = 'running';
    }

    function onDuckPress() {
        if (state === 'dead') return;
        if (state === 'waiting') return;
        duckHeld = true;
        if (state === 'jumping' && velocityY < 0) velocityY = 0;
        if (state === 'running' && characterY >= groundY - characterH - 2) state = 'ducking';
        if (state === 'idle') state = 'ducking';
    }

    function onDuckRelease() {
        duckHeld = false;
        if (state === 'ducking') state = 'running';
    }

    function bindControls() {
        const jumpBtn = document.getElementById('runner-jump-btn');
        const duckBtn = document.getElementById('runner-duck-btn');
        const restartBtn = document.getElementById('runner-restart-btn');
        if (!jumpBtn || !duckBtn || !restartBtn) return;

        jumpBtn.addEventListener('pointerdown', e => { e.preventDefault(); onJumpPress(); });
        jumpBtn.addEventListener('pointerup', onJumpRelease);
        jumpBtn.addEventListener('pointerleave', onJumpRelease);
        duckBtn.addEventListener('pointerdown', e => { e.preventDefault(); onDuckPress(); });
        duckBtn.addEventListener('pointerup', onDuckRelease);
        duckBtn.addEventListener('pointerleave', onDuckRelease);
        function doRestart() {
            document.getElementById('runner-game-over').classList.add('hidden');
            state = 'running';
            velocityY = 0;
            runFrameIndex = 0;
            duckFrameIndex = 0;
            score = 0;
            speed = 357;
            obstacles = [];
            lastSpawnX = gameWidth;
            characterY = groundY - characterH;
            animationId = requestAnimationFrame(gameLoop);
        }

        restartBtn.addEventListener('click', doRestart);

        document.addEventListener('keydown', function(e) {
            if (document.getElementById('about-screen').classList.contains('hidden')) return;
            if (state === 'dead' && (e.key === 'w' || e.key === 'W' || e.key === 's' || e.key === 'S' || e.key === 'r' || e.key === 'R')) {
                e.preventDefault();
                doRestart();
                return;
            }
            if (e.key === 'w' || e.key === 'W') { e.preventDefault(); onJumpPress(); }
            if (e.key === 's' || e.key === 'S') { e.preventDefault(); onDuckPress(); }
        });
        document.addEventListener('keyup', function(e) {
            if (e.key === 'w' || e.key === 'W') onJumpRelease();
            if (e.key === 's' || e.key === 'S') onDuckRelease();
        });
    }

    function init() {
        if (!document.getElementById('runner-canvas')) return;
        preloadSprites().then(() => {
            if (!initCanvas()) return;
            bindControls();
            state = 'waiting';
            document.getElementById('runner-start-overlay').classList.remove('hidden');
            animationId = requestAnimationFrame(gameLoop);
        }).catch(() => {
            if (initCanvas()) {
                bindControls();
                state = 'waiting';
                document.getElementById('runner-start-overlay').classList.remove('hidden');
                animationId = requestAnimationFrame(gameLoop);
            }
        });
    }

    document.addEventListener('DOMContentLoaded', function() {
        const aboutScreen = document.getElementById('about-screen');
        if (!aboutScreen) return;
        const observer = new MutationObserver(function(mutations) {
            if (!aboutScreen.classList.contains('hidden') && canvas) {
                requestAnimationFrame(function() {
                    initCanvas();
                    if (!animationId) {
                        state = 'waiting';
                        document.getElementById('runner-game-over').classList.add('hidden');
                        document.getElementById('runner-start-overlay').classList.remove('hidden');
                        animationId = requestAnimationFrame(gameLoop);
                    }
                });
            }
        });
        observer.observe(aboutScreen, { attributes: true, attributeFilter: ['class'] });
        init();
    });

    window.addEventListener('resize', function() {
        if (!viewport || !canvas) return;
        if (document.getElementById('about-screen').classList.contains('hidden')) return;
        const { w, h } = getViewportSize();
        const dpr = window.devicePixelRatio || 1;
        canvas.width = Math.ceil(w * dpr);
        canvas.height = Math.ceil(h * dpr);
        canvas.style.width = w + 'px';
        canvas.style.height = h + 'px';
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.scale(dpr, dpr);
        gameWidth = w;
        gameHeight = h;
        groundY = h - GROUND_HEIGHT;
        characterY = groundY - characterH;
    });
})();


