
# Synitecht

![Server Count](https://img.shields.io/badge/dynamic/json?color=blue&label=servers&query=%24.server_count&url=https%3A%2F%2Fdiscord-bot-list.com%2Fapi%2Fbots%2F1007699480671432704)
![GitHub stars](https://img.shields.io/github/stars/Sorsagan/synitecht?style=social)
![Latest Release](https://img.shields.io/github/v/release/Sorsagan/synitecht)
![Node.js Version](https://img.shields.io/node/v/synitecht)
[![Discord Server](https://img.shields.io/discord/882383171323314186?label=Join%20our%20Discord&logo=discord&logoColor=white&color=7289DA)](https://discord.gg/khNBFw8DrU)

## Description

Synitecht is a powerful Discord bot built using Discord.js v14, designed to enhance your server experience with a variety of features. Whether you're managing a community, gaming server, or a support hub, Synitecht has you covered with its versatile capabilities.

## Key Features:

**Ticket System:**

+ Create and manage support tickets seamlessly.
+ Provide a structured way for users to seek assistance.

**Temporary Voice Channel System:**

+ Dynamically create temporary voice channels on demand.
+ Automatically delete channels when not in use.

**Rich Command System:**

+ Enjoy a wide range of commands for moderation, utilities, and fun.
+ Easily configurable to suit your server's needs.

**Customization:**

+ Tailor Synitecht to your server's unique requirements.
+ Adjust settings, prefixes, and permissions to fit your community.

**User-Friendly Interface:**

+ Intuitive commands for users and administrators alike.
+ Clear and concise responses for better user interaction.
## Installation 
- Follow these steps to get started with the project.

**Prerequisites**
Make sure you have the following installed:

    Node.js (version 18.7.0 or higher)
    npm (version 9.6.7 or higher)

**Clone the Repository**

```bash
git clone https://github.com/your-username/your-project.git
```

**Navigate to the Project Directory**

```bash
cd your-project
```

**Install Dependencies**

```bash
npm install
```

**Configuration**
- Copy the .env.example file to .env:
```bash
cp .env.example .env
```
- Update the variables in the .env file with your configuration.

**Start the Application**

```bash
nodemon
```
or you might wanna use if you don't want nodemon
```bash
node .
```
## Screenshots

### Voice Channel Dashboard

![Voice Channel Dashboard Screenshot](https://i.imgur.com/slQH2X9.png)

### Auto Mod 

![Auto Mod Screenshot](https://i.imgur.com/jyAiKO5.png)

### Giveaways

![Giveaways Screenshot](https://i.imgur.com/qrruJ5R.png)
## Roadmap

Our planned features and improvements for future releases.

### Version 2.0.0 (Next Major Release)

- [ ] **Economy System:**
  - Introduce a robust economy system to enhance user engagement.
  - Allow users to earn and spend virtual currency within the server.

- [ ] **Music System:**
  - Implement a new Music System accessible to all members in the server.
  - Enjoy high-quality music playback with enhanced features.

- [ ] **Temporary Voice Channel System Enhancement:**
  - Improve the existing Temporary Voice Channel System for better user experience.
  - Add new customization options and flexibility for managing temporary voice channels.

### Version 1.1.0 (Upcoming Minor Release)

- [ ] **Bug Fixes:**
  - Address reported issues and enhance overall stability.
  
- [ ] **Optimizations:**
  - Implement performance optimizations for smoother execution.

- [ ] **Documentation Updates:**
  - Enhance user guides and provide clearer documentation.

### Version 1.0.1 (Patch Release)

- [ ] **Security Patch:**
  - Address any reported vulnerabilities to ensure a secure environment.
  
- [ ] **Minor Improvements:**
  - Implement small updates and fixes to enhance overall functionality.
## Contribute

If you have ideas for improvements or want to report issues, feel free to contribute on GitHub.
## Credits

This project includes code inspired by YouTuber The North Solution's tutorials. Specifically, the following sections were influenced by their work:

- Command, event handling in `handlers/eventHandler.js`: inspired by YouTuber The North Solution's tutorial on error handling.
- Command Comparing in `commandComparing.js`: inspired by YouTuber The North Solution's command comparing techniques.

You can find his youtube channel in there [The North Solution](https://www.youtube.com/@thenorthsolution)
