/* ========================================
   STAFA.NET ACCESS PANEL - JAVASCRIPT
   ======================================== */

// ============ THEME MANAGEMENT ============

// Track if user has manually set theme
let isManualTheme = false;

/**
 * Get theme based on current time
 * Light: 06:00 - 17:59, Dark: 18:00 - 05:59
 */
function getTimeBasedTheme() {
    const hour = new Date().getHours();
    return (hour >= 6 && hour < 18) ? 'light' : 'dark';
}

/**
 * Initialize theme based on saved preference or time of day
 */
function initTheme() {
    const savedTheme = localStorage.getItem('stafanet-theme');
    const savedManual = localStorage.getItem('stafanet-manual-theme');
    
    if (savedManual === 'true' && savedTheme) {
        // User manually selected theme - use saved preference
        isManualTheme = true;
        document.documentElement.setAttribute('data-theme', savedTheme);
    } else {
        // Auto mode - use time-based theme
        isManualTheme = false;
        const autoTheme = getTimeBasedTheme();
        document.documentElement.setAttribute('data-theme', autoTheme);
        localStorage.setItem('stafanet-theme', autoTheme);
    }
    
    updateAutoIndicator();
}

/**
 * Update auto mode indicator
 */
function updateAutoIndicator() {
    const indicator = document.getElementById('autoIndicator');
    if (indicator) {
        indicator.style.opacity = isManualTheme ? '0' : '1';
        indicator.textContent = isManualTheme ? '' : 'AUTO';
    }
}

/**
 * Toggle between light and dark theme (manual mode)
 */
function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    // Set manual mode
    isManualTheme = true;
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('stafanet-theme', newTheme);
    localStorage.setItem('stafanet-manual-theme', 'true');
    
    updateAutoIndicator();
    
    // Add animation to toggle button
    const toggleBtn = document.getElementById('themeToggle');
    toggleBtn.style.transform = 'scale(0.9) rotate(360deg)';
    setTimeout(() => {
        toggleBtn.style.transform = '';
    }, 300);
}

/**
 * Reset to auto mode (double-click on toggle)
 */
function resetToAutoMode() {
    isManualTheme = false;
    localStorage.removeItem('stafanet-manual-theme');
    
    const autoTheme = getTimeBasedTheme();
    document.documentElement.setAttribute('data-theme', autoTheme);
    localStorage.setItem('stafanet-theme', autoTheme);
    
    updateAutoIndicator();
}

/**
 * Check and update theme based on time (runs every minute)
 */
function checkAutoTheme() {
    if (!isManualTheme) {
        const autoTheme = getTimeBasedTheme();
        const currentTheme = document.documentElement.getAttribute('data-theme');
        
        if (autoTheme !== currentTheme) {
            document.documentElement.setAttribute('data-theme', autoTheme);
            localStorage.setItem('stafanet-theme', autoTheme);
        }
    }
}

// ============ CLOCK & DATE ============

/**
 * Indonesian day names
 */
const dayNames = [
    'Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'
];

/**
 * Indonesian month names
 */
const monthNames = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
];

/**
 * Update clock display
 */
function updateClock() {
    const now = new Date();
    
    // Format time: HH:MM:SS
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    const timeString = `${hours}:${minutes}:${seconds}`;
    
    // Format date: Hari, DD Bulan YYYY
    const dayName = dayNames[now.getDay()];
    const date = now.getDate();
    const monthName = monthNames[now.getMonth()];
    const year = now.getFullYear();
    const dateString = `${dayName}, ${date} ${monthName} ${year}`;
    
    // Update DOM
    const clockEl = document.getElementById('clock');
    const dateEl = document.getElementById('date');
    
    if (clockEl) clockEl.textContent = timeString;
    if (dateEl) dateEl.textContent = dateString;
}

// ============ BUTTON RIPPLE EFFECT ============

/**
 * Create ripple effect on button click
 */
function createRipple(event) {
    const button = event.currentTarget;
    const ripple = document.createElement('span');
    
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;
    
    ripple.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        left: ${x}px;
        top: ${y}px;
        background: rgba(255, 255, 255, 0.3);
        border-radius: 50%;
        transform: scale(0);
        animation: ripple 0.6s ease-out forwards;
        pointer-events: none;
    `;
    
    button.appendChild(ripple);
    
    setTimeout(() => ripple.remove(), 600);
}

/**
 * Add ripple style to document
 */
function addRippleStyle() {
    const style = document.createElement('style');
    style.textContent = `
        @keyframes ripple {
            to {
                transform: scale(2.5);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
}

// ============ INITIALIZATION ============

/**
 * Initialize all features when DOM is ready
 */
function init() {
    // Initialize theme
    initTheme();
    
    // Setup theme toggle button
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
        // Double-click to reset to auto mode
        themeToggle.addEventListener('dblclick', (e) => {
            e.preventDefault();
            resetToAutoMode();
        });
    }
    
    // Start clock
    updateClock();
    setInterval(updateClock, 1000);
    
    // Check auto theme every minute
    setInterval(checkAutoTheme, 60000);
    
    // Add ripple effect to buttons
    addRippleStyle();
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(btn => {
        btn.addEventListener('click', createRipple);
    });
    
    // Add hover sound effect (optional - visual feedback)
    buttons.forEach(btn => {
        btn.addEventListener('mouseenter', () => {
            btn.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
        });
    });
    
    console.log('✅ Stafa.Net Access Panel initialized');
}

// Run initialization when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
