# LinkedIn Mass Unfollow Tool

<table align="right">
 <tr><td><a href="https://github.com/isyuricunha/linkedin-mass-unfollow/blob/main/readme.md">🇺🇸 English</a></td></tr>
 <tr><td><a href="https://github.com/isyuricunha/linkedin-mass-unfollow/blob/main/README-pt-br.md">🇧🇷 Português</a></td></tr>
</table>

<div align="center">

![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![Version](https://img.shields.io/badge/Version-2.0.0-blue?style=for-the-badge)

**A powerful and safe JavaScript tool to mass unfollow LinkedIn connections**

[Features](#-features) • [Installation](#-installation) • [Usage](#-usage) • [Safety](#-safety) • [FAQ](#-faq)

</div>

---

## 📋 About

This tool provides two sophisticated JavaScript scripts to help you mass unfollow LinkedIn connections efficiently and safely. Both scripts include advanced features like progress tracking, error handling, configurable delays, and safety limits to prevent accidental mass unfollowing.

## ✨ Features

### 🔧 Core Features
- **Two Operation Modes**: Soft mode (visible connections only) and Hard mode (all connections with auto-scroll)
- **Smart Progress Tracking**: Real-time statistics and session summaries
- **Advanced Error Handling**: Automatic retry mechanisms and graceful error recovery
- **Configurable Settings**: Customizable delays, limits, and behavior
- **Safety Mechanisms**: Built-in limits to prevent accidental mass unfollowing
- **User Controls**: Start, stop, pause, and resume functionality
- **Detailed Logging**: Timestamped logs with different severity levels

### 🛡️ Safety Features
- **Maximum Unfollow Limits**: Default safety limits (50 for soft mode, 500 for hard mode)
- **Rate Limiting**: Configurable delays between actions to avoid LinkedIn restrictions
- **Manual Control**: Easy pause/resume functionality
- **Progress Monitoring**: Real-time status updates and statistics
- **Error Recovery**: Automatic handling of failed operations

## 🚀 Installation

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge)
- Active LinkedIn account
- Basic understanding of browser developer tools

### Setup Steps

1. **Navigate to LinkedIn Following Page**
   ```
   https://www.linkedin.com/mynetwork/network-manager/people-follow/followers/
   ```

2. **Open Browser Developer Tools**
   
   | Method | Shortcut |
   |--------|----------|
   | Right-click → Inspect | `F12` |
   | Focus Console | `Ctrl + Shift + J` (Windows/Linux)<br>`Cmd + Option + J` (Mac) |
   | Toggle Console | `Ctrl + \`` (backtick) |

3. **Load the Script**
   - Copy the content from either `Scripts/soft-script.js` or `Scripts/hard-script.js`
   - Paste into the browser console
   - Press `Enter`

Note: The scripts validate `window.location.pathname` and will refuse to start if you're not on the followers page. If you navigate away while running, the script will automatically stop.

## 📖 Usage

### Soft Mode (Recommended for Beginners)

**Purpose**: Unfollows only connections visible on the current screen

```javascript
// After loading soft-script.js
LinkedInUnfollow.start()    // Start unfollowing visible connections
LinkedInUnfollow.pause()    // Pause/resume the process
LinkedInUnfollow.stop()     // Stop the process
LinkedInUnfollow.status()   // Check current status
```

**Features**:
- ✅ Processes only visible connections
- ✅ No automatic scrolling
- ✅ Lower risk of rate limiting
- ✅ Perfect for selective unfollowing

### Hard Mode (Advanced Users)

**Purpose**: Automatically unfollows ALL connections with continuous scrolling

```javascript
// After loading hard-script.js
LinkedInUnfollowHard.start()    // Start unfollowing ALL connections
LinkedInUnfollowHard.pause()    // Pause/resume the process
LinkedInUnfollowHard.stop()     // Stop the process
LinkedInUnfollowHard.status()   // Check current status
```

**Features**:
- ⚠️ Processes ALL connections automatically
- ⚠️ Continuous scrolling to load more content
- ⚠️ Higher efficiency but requires more caution
- ⚠️ Built-in safety limits and controls

## ⚙️ Configuration

Both scripts offer extensive configuration options:

```javascript
// Access configuration (example for soft mode)
LinkedInUnfollow.config.delays.betweenUsers = 1500;  // Increase delay between users
LinkedInUnfollow.config.limits.maxUnfollows = 100;   // Change maximum unfollows
LinkedInUnfollow.config.logging = false;             // Disable logging
```

### Available Settings

| Setting | Soft Mode Default | Hard Mode Default | Description |
|---------|-------------------|-------------------|-------------|
| `delays.buttonClick` | 1000ms | 1200ms | Delay after clicking "Following" |
| `delays.betweenUsers` | 800ms | 1000ms | Delay between processing users |
| `limits.maxUnfollows` | 50 | 500 | Maximum unfollows per session |
| `logging` | true | true | Enable/disable console logging |

## 🛡️ Safety

### Important Warnings

⚠️ **CAUTION**: These scripts will unfollow LinkedIn connections. Use responsibly!

⚠️ **HARD MODE WARNING**: Hard mode will attempt to unfollow ALL your connections. Use with extreme caution!

### Safety Measures

1. **Built-in Limits**: Scripts have default maximum unfollow limits
2. **Manual Control**: Easy stop/pause functionality
3. **Progress Tracking**: Monitor exactly what's happening
4. **Error Handling**: Graceful handling of failures
5. **Rate Limiting**: Delays to avoid LinkedIn restrictions

### Best Practices

- ✅ Start with **Soft Mode** to test functionality
- ✅ Keep the LinkedIn tab active and visible
- ✅ Monitor the console output regularly
- ✅ Use reasonable delay settings
- ✅ Don't run multiple scripts simultaneously
- ✅ Stay on the followers page while running (the script will stop automatically if the page changes)
- ❌ Don't close the browser tab while running
- ❌ Don't navigate away from the LinkedIn page
- ❌ Don't run scripts on other LinkedIn pages

## 📊 Monitoring Progress

Both scripts provide detailed progress information:

```javascript
// Get current status
const status = LinkedInUnfollow.status();
console.log(status);

// Example output:
{
  isRunning: true,
  isPaused: false,
  processed: 25,
  unfollowed: 23,
  errors: 2,
  duration: 180,  // seconds
  rate: 7.7       // unfollows per minute (hard mode only)
}
```

## 🔧 Troubleshooting

### Common Issues

**Script not working?**
- Ensure you're on the correct LinkedIn page
- Check that you have "Following" connections visible
- Verify the browser console shows no errors

**Too fast/slow?**
- Adjust delay settings in the configuration
- Use `LinkedInUnfollow.config.delays.betweenUsers = 2000` for slower operation

**Stopped unexpectedly?**
- Check console for error messages
- Verify you haven't hit the safety limit
- Ensure LinkedIn page is still loaded
- Ensure you're still on `https://www.linkedin.com/mynetwork/network-manager/people-follow/followers/`

**LinkedIn showing errors?**
- Increase delays between actions
- Take breaks between sessions
- Consider using soft mode instead of hard mode

## ❓ FAQ

**Q: Is this safe to use?**
A: The scripts include multiple safety measures, but use at your own risk. Start with soft mode and low limits.

**Q: Will LinkedIn ban my account?**
A: The scripts include rate limiting to reduce this risk, but excessive use could potentially trigger LinkedIn's anti-automation measures.

**Q: Can I undo unfollowing?**
A: No, you'll need to manually re-follow connections. Be careful with your selections.

**Q: How many connections can I unfollow?**
A: Default limits are 50 (soft) and 500 (hard) per session. You can adjust these in the configuration.

**Q: Can I run this on mobile?**
A: No, this requires a desktop browser with developer tools access.

**Q: Does this work with LinkedIn Premium?**
A: Yes, the scripts work with both free and premium LinkedIn accounts.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit issues, feature requests, or pull requests.

## 📄 License

This project is licensed under the AGPL-3.0 license - see the [LICENSE](license.md) file for details.

## ⚠️ Disclaimer

This tool is for educational purposes. Users are responsible for complying with LinkedIn's Terms of Service. The authors are not responsible for any consequences of using this tool.

## 🙏 Acknowledgements

Early versions of this project were informed by public LinkedIn mass-unfollow scripts and community examples, including work published by [verfasor](https://github.com/verfasor) on [mgx.me](https://mgx.me/script-to-mass-unfollow-everyone-on-linkedin) and in [mass-unfollow-linkedin](https://github.com/verfasor/mass-unfollow-linkedin). The project has since been substantially refactored and evolved independently.

---

<div align="center">

**Made with ❤️ by [isyuricunha](https://github.com/isyuricunha)**

⭐ Star this repository if it helped you!

</div>
