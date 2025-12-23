
/**
 * LinkedIn Mass Unfollow Script - Soft Mode
 * 
 * This script unfollows users that are currently visible on the screen.
 * It processes only the connections shown in the current viewport without
 * automatically scrolling to load more content.
 * 
 * Features:
 * - Processes only visible connections
 * - Configurable delays and limits
 * - Progress tracking and logging
 * - Error handling and recovery
 * - User control with pause/resume functionality
 * 
 * @author isyuricunha
 * @version 2.0.0
 */

(function() {
    'use strict';

    const EXPECTED_PATHNAME = '/mynetwork/network-manager/people-follow/followers/';
    
    // Configuration object for customizable behavior
    const CONFIG = {
        delays: {
            buttonClick: 1000,      // Delay after clicking "Following" button
            modalAction: 500,       // Delay for modal actions
            betweenUsers: 800,      // Delay between processing users
            pageLoad: 1500          // Delay for page loading
        },
        limits: {
            maxUnfollows: 50,       // Maximum unfollows per session (safety limit)
            maxRetries: 3           // Maximum retry attempts for failed operations
        },
        selectors: {
            followButton: '.artdeco-button__text',
            modal: '.artdeco-modal',
            unfollowButton: '.artdeco-modal__actionbar .artdeco-button--primary',
            closeButton: '.artdeco-modal__dismiss'
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
        startTime: null
    };

    /**
     * Utility function for logging with timestamps
     * @param {string} message - Message to log
     * @param {string} type - Log type (info, warn, error, success)
     */
    function log(message, type = 'info') {
        if (!CONFIG.logging) return;
        
        const timestamp = new Date().toLocaleTimeString();
        const prefix = `[LinkedIn Unfollow - ${timestamp}]`;
        
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

    function normalizePathname(pathname) {
        if (!pathname) return '/';
        return pathname.endsWith('/') ? pathname : `${pathname}/`;
    }

    function isExpectedLinkedInPage() {
        return normalizePathname(window.location.pathname) === EXPECTED_PATHNAME;
    }

    function assertExpectedLinkedInPage() {
        if (isExpectedLinkedInPage()) return true;

        log('This script must be executed on the LinkedIn followers page:', 'error');
        log(`Expected pathname: ${EXPECTED_PATHNAME}`, 'error');
        log(`Current URL: ${window.location.href}`, 'error');
        log('Open: https://www.linkedin.com/mynetwork/network-manager/people-follow/followers/', 'error');
        return false;
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
            return (text === "Following" || text === "Seguindo") && isVisible;
        });
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
                           followButton.closest('.follows-recommendation-card');
            const userName = userCard ? 
                (userCard.querySelector('.actor-name')?.textContent?.trim() || 'Unknown User') : 
                'Unknown User';

            log(`Attempting to unfollow: ${userName}`);

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
                return true;
            } else {
                log('Unfollow button not found in modal', 'warn');
                
                // Try to close modal if unfollow button not found
                const closeButton = modal.querySelector(CONFIG.selectors.closeButton);
                if (closeButton) {
                    closeButton.click();
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
     * Process all visible following buttons on the current screen
     * @returns {Promise<void>}
     */
    async function processVisibleConnections() {
        if (!state.isRunning || state.isPaused) return;

        if (!isExpectedLinkedInPage()) {
            stopScript('Page changed (not on LinkedIn followers page anymore)');
            return;
        }

        const followingButtons = findFollowingButtons();
        
        if (followingButtons.length === 0) {
            log('No more "Following" buttons found on current screen');
            stopScript('No more connections to unfollow on current screen');
            return;
        }

        log(`Found ${followingButtons.length} connections to process`);

        for (let i = 0; i < followingButtons.length && state.isRunning && !state.isPaused; i++) {
            // Check safety limits
            if (state.unfollowedCount >= CONFIG.limits.maxUnfollows) {
                log(`Reached maximum unfollow limit (${CONFIG.limits.maxUnfollows})`, 'warn');
                stopScript('Safety limit reached');
                return;
            }

            const button = followingButtons[i];
            state.processedCount++;
            
            const success = await unfollowUser(button);
            
            // Wait between processing users to avoid rate limiting
            if (i < followingButtons.length - 1) {
                await wait(CONFIG.delays.betweenUsers);
            }
        }

        if (state.isRunning && !state.isPaused) {
            log('Finished processing all visible connections');
            stopScript('All visible connections processed');
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

        if (!assertExpectedLinkedInPage()) return;

        state.isRunning = true;
        state.isPaused = false;
        state.processedCount = 0;
        state.unfollowedCount = 0;
        state.errorCount = 0;
        state.startTime = Date.now();

        log('Starting LinkedIn Mass Unfollow - Soft Mode');
        log(`Configuration: Max unfollows: ${CONFIG.limits.maxUnfollows}, Delays: ${JSON.stringify(CONFIG.delays)}`);
        
        processVisibleConnections();
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
        
        log(`Script stopped: ${reason}`);
        log(`Session Summary:`, 'info');
        log(`- Duration: ${duration} seconds`);
        log(`- Processed: ${state.processedCount} connections`);
        log(`- Unfollowed: ${state.unfollowedCount} users`);
        log(`- Errors: ${state.errorCount}`);
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
    }

    /**
     * Get current script status
     */
    function getStatus() {
        const duration = state.startTime ? Math.round((Date.now() - state.startTime) / 1000) : 0;
        
        return {
            isRunning: state.isRunning,
            isPaused: state.isPaused,
            processed: state.processedCount,
            unfollowed: state.unfollowedCount,
            errors: state.errorCount,
            duration: duration
        };
    }

    // Expose control functions to global scope for user interaction
    window.LinkedInUnfollow = {
        start: startScript,
        stop: stopScript,
        pause: pauseScript,
        status: getStatus,
        config: CONFIG
    };

    // Display usage instructions
    log('LinkedIn Mass Unfollow Script - Soft Mode Loaded!');
    log('Available commands:');
    log('- LinkedInUnfollow.start() - Start unfollowing process');
    log('- LinkedInUnfollow.stop() - Stop the process');
    log('- LinkedInUnfollow.pause() - Pause/Resume the process');
    log('- LinkedInUnfollow.status() - Get current status');
    log('');
    log('⚠️ IMPORTANT: This script only processes connections visible on the current screen.');
    log('⚠️ Make sure you are on the LinkedIn following page before starting.');
    log('⚠️ To begin, type: LinkedInUnfollow.start()');

})();
