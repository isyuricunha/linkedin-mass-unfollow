

/**
 * LinkedIn Mass Unfollow Script - Hard Mode
 * 
 * This script automatically unfollows ALL connections by continuously scrolling
 * through the following list and processing all visible connections.
 * 
 * Features:
 * - Automatic scrolling to load more connections
 * - Configurable delays and safety limits
 * - Progress tracking and detailed logging
 * - Error handling and recovery mechanisms
 * - User control with pause/resume functionality
 * - Smart scroll detection to avoid infinite loops
 * 
 * @author isyuricunha
 * @version 2.0.0
 */

(function() {
    'use strict';
    
    // Configuration object for customizable behavior
    const CONFIG = {
        delays: {
            buttonClick: 1200,      // Delay after clicking "Following" button
            modalAction: 600,       // Delay for modal actions
            betweenUsers: 1000,     // Delay between processing users
            scrollDelay: 2500,      // Delay after scrolling for content to load
            noProgressDelay: 5000   // Delay when no progress is made
        },
        limits: {
            maxUnfollows: 500,      // Maximum unfollows per session (safety limit)
            maxRetries: 3,          // Maximum retry attempts for failed operations
            maxScrollAttempts: 10,  // Maximum scroll attempts without finding new content
            maxNoProgressCycles: 5  // Maximum cycles without progress before stopping
        },
        selectors: {
            followButton: '.artdeco-button__text',
            modal: '.artdeco-modal',
            unfollowButton: '.artdeco-modal__actionbar .artdeco-button--primary',
            closeButton: '.artdeco-modal__dismiss',
            loadingSpinner: '.artdeco-spinner'
        },
        scrolling: {
            pixelsPerScroll: 800,   // Pixels to scroll each time
            smoothScroll: true      // Use smooth scrolling
        },
        logging: true               // Enable/disable console logging
    };

    // State management
    let state = {
        isRunning: false,
        isPaused: false,
        processedCount: 0,
        unfollowedCount: 0,
        errorCount: 0,
        scrollAttempts: 0,
        noProgressCycles: 0,
        lastScrollHeight: 0,
        startTime: null,
        lastUnfollowTime: null
    };

    /**
     * Utility function for logging with timestamps
     * @param {string} message - Message to log
     * @param {string} type - Log type (info, warn, error, success)
     */
    function log(message, type = 'info') {
        if (!CONFIG.logging) return;
        
        const timestamp = new Date().toLocaleTimeString();
        const prefix = `[LinkedIn Unfollow Hard - ${timestamp}]`;
        
        switch(type) {
            case 'error':
                console.error(`${prefix} ❌ ${message}`);
                break;
            case 'warn':
                console.warn(`${prefix} ⚠️ ${message}`);
                break;
            case 'success':
                console.log(`${prefix} ✅ ${message}`);
                break;
            default:
                console.log(`${prefix} ℹ️ ${message}`);
        }
    }

    /**
     * Wait for a specified amount of time
     * @param {number} ms - Milliseconds to wait
     * @returns {Promise} Promise that resolves after the delay
     */
    function wait(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    /**
     * Check if the page is currently loading
     * @returns {boolean} True if page is loading
     */
    function isPageLoading() {
        const spinner = document.querySelector(CONFIG.selectors.loadingSpinner);
        return spinner && spinner.offsetParent !== null;
    }

    /**
     * Wait for page loading to complete
     * @param {number} maxWait - Maximum time to wait in milliseconds
     * @returns {Promise<void>}
     */
    async function waitForPageLoad(maxWait = 10000) {
        const startTime = Date.now();
        while (isPageLoading() && (Date.now() - startTime) < maxWait) {
            await wait(500);
        }
    }

    /**
     * Find all visible "Following" buttons on the current screen
     * @returns {Array} Array of following button elements
     */
    function findFollowingButtons() {
        const followButtons = document.querySelectorAll(CONFIG.selectors.followButton);
        return Array.from(followButtons).filter(button => {
            const text = button.innerText.trim();
            const isVisible = button.offsetParent !== null;
            const rect = button.getBoundingClientRect();
            const isInViewport = rect.top >= 0 && rect.bottom <= window.innerHeight;
            
            return (text === "Following" || text === "Seguindo") && isVisible && isInViewport;
        });
    }

    /**
     * Scroll down the page to load more content
     * @returns {Promise<boolean>} True if new content was loaded
     */
    async function scrollDown() {
        const currentHeight = document.body.scrollHeight;
        
        // Scroll down
        if (CONFIG.scrolling.smoothScroll) {
            window.scrollBy({
                top: CONFIG.scrolling.pixelsPerScroll,
                behavior: 'smooth'
            });
        } else {
            window.scrollBy(0, CONFIG.scrolling.pixelsPerScroll);
        }

        // Wait for content to load
        await wait(CONFIG.delays.scrollDelay);
        await waitForPageLoad();

        // Check if new content was loaded
        const newHeight = document.body.scrollHeight;
        const hasNewContent = newHeight > currentHeight;
        
        if (hasNewContent) {
            state.scrollAttempts = 0;
            state.lastScrollHeight = newHeight;
            log(`Scrolled and loaded new content (height: ${newHeight}px)`);
        } else {
            state.scrollAttempts++;
            log(`No new content after scrolling (attempt ${state.scrollAttempts}/${CONFIG.limits.maxScrollAttempts})`);
        }

        return hasNewContent;
    }

    /**
     * Attempt to unfollow a specific user
     * @param {Element} followButton - The "Following" button element
     * @returns {Promise<boolean>} Success status of the unfollow operation
     */
    async function unfollowUser(followButton) {
        try {
            // Get user info for logging
            const userCard = followButton.closest('[data-test-id="people-card"]') || 
                           followButton.closest('.follows-recommendation-card') ||
                           followButton.closest('.reusable-search__result-container');
            
            const userName = userCard ? 
                (userCard.querySelector('.actor-name')?.textContent?.trim() || 
                 userCard.querySelector('.entity-result__title-text a')?.textContent?.trim() ||
                 'Unknown User') : 
                'Unknown User';

            log(`Attempting to unfollow: ${userName}`);

            // Scroll user into view if needed
            followButton.scrollIntoView({ behavior: 'smooth', block: 'center' });
            await wait(300);

            // Click the "Following" button
            followButton.click();
            await wait(CONFIG.delays.buttonClick);

            // Wait for modal to appear and handle unfollow confirmation
            const modal = document.querySelector(CONFIG.selectors.modal);
            if (!modal) {
                log('Modal not found after clicking Following button', 'warn');
                return false;
            }

            // Find and click the unfollow confirmation button
            const unfollowButton = modal.querySelector(CONFIG.selectors.unfollowButton);
            if (unfollowButton) {
                unfollowButton.click();
                await wait(CONFIG.delays.modalAction);
                
                log(`Successfully unfollowed: ${userName}`, 'success');
                state.unfollowedCount++;
                state.lastUnfollowTime = Date.now();
                return true;
            } else {
                log('Unfollow button not found in modal', 'warn');
                
                // Try to close modal if unfollow button not found
                const closeButton = modal.querySelector(CONFIG.selectors.closeButton);
                if (closeButton) {
                    closeButton.click();
                    await wait(CONFIG.delays.modalAction);
                }
                return false;
            }

        } catch (error) {
            log(`Error unfollowing user: ${error.message}`, 'error');
            state.errorCount++;
            return false;
        }
    }

    /**
     * Process all visible following buttons and handle scrolling
     * @returns {Promise<void>}
     */
    async function processConnections() {
        while (state.isRunning && !state.isPaused) {
            // Check safety limits
            if (state.unfollowedCount >= CONFIG.limits.maxUnfollows) {
                log(`Reached maximum unfollow limit (${CONFIG.limits.maxUnfollows})`, 'warn');
                stopScript('Safety limit reached');
                return;
            }

            // Check for too many scroll attempts without progress
            if (state.scrollAttempts >= CONFIG.limits.maxScrollAttempts) {
                log('Reached maximum scroll attempts without new content', 'warn');
                stopScript('No more content to load');
                return;
            }

            // Find visible following buttons
            const followingButtons = findFollowingButtons();
            
            if (followingButtons.length === 0) {
                log('No "Following" buttons found on current screen, scrolling...');
                
                const hasNewContent = await scrollDown();
                if (!hasNewContent) {
                    state.noProgressCycles++;
                    if (state.noProgressCycles >= CONFIG.limits.maxNoProgressCycles) {
                        stopScript('No more connections found after multiple scroll attempts');
                        return;
                    }
                    await wait(CONFIG.delays.noProgressDelay);
                }
                continue;
            }

            // Reset no progress counter when we find buttons
            state.noProgressCycles = 0;
            log(`Found ${followingButtons.length} connections to process`);

            // Process each following button
            for (let i = 0; i < followingButtons.length && state.isRunning && !state.isPaused; i++) {
                const button = followingButtons[i];
                state.processedCount++;
                
                const success = await unfollowUser(button);
                
                // Wait between processing users to avoid rate limiting
                await wait(CONFIG.delays.betweenUsers);

                // Check safety limits again
                if (state.unfollowedCount >= CONFIG.limits.maxUnfollows) {
                    log(`Reached maximum unfollow limit (${CONFIG.limits.maxUnfollows})`, 'warn');
                    stopScript('Safety limit reached');
                    return;
                }
            }

            // After processing visible buttons, scroll to load more
            if (state.isRunning && !state.isPaused) {
                log('Finished processing visible connections, scrolling for more...');
                await scrollDown();
            }
        }
    }

    /**
     * Start the unfollowing process
     */
    function startScript() {
        if (state.isRunning) {
            log('Script is already running', 'warn');
            return;
        }

        // Reset state
        state.isRunning = true;
        state.isPaused = false;
        state.processedCount = 0;
        state.unfollowedCount = 0;
        state.errorCount = 0;
        state.scrollAttempts = 0;
        state.noProgressCycles = 0;
        state.lastScrollHeight = document.body.scrollHeight;
        state.startTime = Date.now();
        state.lastUnfollowTime = null;

        log('Starting LinkedIn Mass Unfollow - Hard Mode');
        log(`Configuration: Max unfollows: ${CONFIG.limits.maxUnfollows}, Delays: ${JSON.stringify(CONFIG.delays)}`);
        log('⚠️ WARNING: This will unfollow ALL your connections. Use with caution!');
        
        // Start processing
        processConnections();
    }

    /**
     * Stop the unfollowing process
     * @param {string} reason - Reason for stopping
     */
    function stopScript(reason = 'Manual stop') {
        if (!state.isRunning) return;

        state.isRunning = false;
        state.isPaused = false;

        const duration = state.startTime ? Math.round((Date.now() - state.startTime) / 1000) : 0;
        const rate = duration > 0 ? Math.round((state.unfollowedCount / duration) * 60) : 0;
        
        log(`Script stopped: ${reason}`);
        log(`Session Summary:`, 'info');
        log(`- Duration: ${duration} seconds`);
        log(`- Processed: ${state.processedCount} connections`);
        log(`- Unfollowed: ${state.unfollowedCount} users`);
        log(`- Errors: ${state.errorCount}`);
        log(`- Rate: ${rate} unfollows/minute`);
        log(`- Scroll attempts: ${state.scrollAttempts}`);
    }

    /**
     * Pause the unfollowing process
     */
    function pauseScript() {
        if (!state.isRunning) {
            log('Script is not running', 'warn');
            return;
        }
        
        state.isPaused = !state.isPaused;
        log(state.isPaused ? 'Script paused' : 'Script resumed');
        
        if (!state.isPaused) {
            processConnections();
        }
    }

    /**
     * Get current script status
     */
    function getStatus() {
        const duration = state.startTime ? Math.round((Date.now() - state.startTime) / 1000) : 0;
        const rate = duration > 0 ? Math.round((state.unfollowedCount / duration) * 60) : 0;
        
        return {
            isRunning: state.isRunning,
            isPaused: state.isPaused,
            processed: state.processedCount,
            unfollowed: state.unfollowedCount,
            errors: state.errorCount,
            duration: duration,
            rate: rate,
            scrollAttempts: state.scrollAttempts,
            progress: `${state.unfollowedCount}/${CONFIG.limits.maxUnfollows}`
        };
    }

    // Expose control functions to global scope for user interaction
    window.LinkedInUnfollowHard = {
        start: startScript,
        stop: stopScript,
        pause: pauseScript,
        status: getStatus,
        config: CONFIG
    };

    // Display usage instructions
    log('LinkedIn Mass Unfollow Script - Hard Mode Loaded!');
    log('Available commands:');
    log('- LinkedInUnfollowHard.start() - Start unfollowing ALL connections');
    log('- LinkedInUnfollowHard.stop() - Stop the process');
    log('- LinkedInUnfollowHard.pause() - Pause/Resume the process');
    log('- LinkedInUnfollowHard.status() - Get current status');
    log('');
    log('⚠️ DANGER: This script will unfollow ALL your LinkedIn connections!');
    log('⚠️ Make sure you are on the LinkedIn following page before starting.');
    log('⚠️ Current safety limit: ' + CONFIG.limits.maxUnfollows + ' unfollows per session');
    log('⚠️ To begin, type: LinkedInUnfollowHard.start()');

})();
