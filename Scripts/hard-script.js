

// Function to unfollow a user
function unfollowUser() {
  // Find all buttons with the class "artdeco-button__text"
  const followButtons = document.querySelectorAll(".artdeco-button__text");

  // Check if there are any "Following" buttons
  const followingButtons = Array.from(followButtons).filter(button => button.innerText.trim() === "Following");

  if (followingButtons.length > 0) {
    // Click the first "Following" button found
    followingButtons[0].click();

    // Wait for a short delay (adjust this as needed)
    setTimeout(() => {
      // Find the modal dialog with the class "artdeco-modal"
      const modal = document.querySelector(".artdeco-modal");

      if (modal) {
        // Find the "Unfollow" button inside the modal and click it
        const unfollowButton = modal.querySelector(".artdeco-modal__actionbar .artdeco-button--primary");
        if (unfollowButton) {
          unfollowButton.click();
        }
      }

      // Close the modal
      const closeButton = modal.querySelector(".artdeco-modal__dismiss");
      if (closeButton) {
        closeButton.click();
      }

      // After unfollowing, continue with the next user
      setTimeout(() => {
        unfollowUser();
      }, 1000); // Adjust the delay if needed
    }, 1000); // Adjust the delay if needed
  } else {
    // If there are no more "Following" buttons, scroll down
    setTimeout(() => {
      scrollDown();
    }, 1000); // Adjust the delay if needed
  }
}

// Function to scroll down the page
function scrollDown() {
  // Scroll to the bottom of the page
  window.scrollTo(0, document.body.scrollHeight);

  // Wait for the page to load more content (adjust the delay as needed)
  setTimeout(() => {
    unfollowUser();
  }, 2000); // Adjust the delay if needed
}

// Call the scrollDown function to start the process
scrollDown();
