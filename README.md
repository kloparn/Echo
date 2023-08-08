# ECHO

Echo gives discord users a clean and simple discord music bot. 

This repository is for the people to be used for their own private discord channels with awesome music opportunities!

## Purpose
In recent days there has been a lot of controversy about discord music players and what kind of music is possible to play.

This Discord bot is to counteract this issue with easy setup and ussage in discord.

## Usage

The bot can be deployed in any matter you want, though some stuff needs to exist at the place you are deploying the bot to!

### Requirements

The app is written in Typescript and proccessed with babel for javascript reading.

So the libraries needed:
- Node 18+
- Typescript builder

Bot requirements:
- Discord bot key
- Discord channel guild id
- Discord client id

The bot requirements has to lay in the .env file that should exist in the root directory.

The contents should look something like this.

```markdown
TOKEN=DISCORD_BOT_TOKEN_SECRET
GUILD_ID=DISCORD_CHANNEL_ID
CLIENT_ID=DISCORD_BOT_ID
```

### Deployments
Deployments can be which everway you want it to be, as long as it supports the building method!

## LocalTesting

Prerequisites: 
* node 18+
* discord bot token
* discord guild id
* discord client_id

All the Prerequisites should be in the `.env` file.

it should look something like this
```bash
TOKEN=DISCORD_BOT_TOKEN_SECRET
GUILD_ID=DISCORD_CHANNEL_ID
CLIENT_ID=DISCORD_BOT_ID
```

### setup

The application is very simple to use.
If you have a node version handler installed do this command first. \
`nvm use 18`

Otherwise do this command to start the app.
`npm ci && npm start` 
