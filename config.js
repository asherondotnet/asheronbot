module.exports = {

  // Your bot name. Typically, this is your bot's username without the discriminator.
  // i.e: if your bot's username is MemeBot#0420, then this option would be MemeBot.
  name: "Asheron",

  // The bot's command prefix. The bot will recognize as command any message that begins with it.
  // i.e: "-asheron foo" will trigger the command "foo",
  //      whereas "Asheron foo" will do nothing at all.
  prefix:  "!",

  // Your bot's user token. If you don't know what that is, go here:
  // https://discordapp.com/developers/applications/me
  // Then create a new application and grab your token.
  token: "Mjc4MjgwMjI0NjM3MTkwMTQ2.C3qAaQ.BBh8_ULhrCCwD457yILaD4lbnUo",

  webhooks: {
      reddit: {
          id: 279154101626077184,
          token: 'EMbLEoQHBZqhkMKDoUtcWmKY3peC6YELkVuwzhGCP1QrQgq6mwbpfdinBoNtBn9NBbo9'
      }
  },

  // If this option is enabled, the bot will delete the message that triggered it, and its own
  // response, after the specified amount of time has passed.
  // Enable this if you don't want your channel to be flooded with bot messages.
  // ATTENTION! In order for this to work, you need to give your bot the following permission:
  // MANAGE_MESSAGES - 	0x00002000
  // More info: https://discordapp.com/developers/docs/topics/permissions
  deleteAfterReply: {
    enabled: false,
    time: 10000, // In milliseconds
  }
};
