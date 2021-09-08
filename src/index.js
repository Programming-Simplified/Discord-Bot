require("dotenv").config();
const { token } = process.env;

const path = require("path");
const { CommandoClient } = require("discord.js-commando");
const { MessageEmbed } = require("discord.js");

// const { mongoUrl } = process.env,
//   { connect, connection } = require("mongoose");
// const { MongoGuild, createGuild } = require("./schemas/guild.js");

// class Mongo {
//   constructor(client) {
//     this.client = client;

//     connect(mongoUrl, {
//       useNewUrlParser: true,
//       useUnifiedTopology: true,
//       autoIndex: false,
//       poolSize: 5,
//       connectTimeoutMS: 10000,
//       family: 4,
//       useCreateIndex: false,
//       useFindAndModify: false,
//     });
//     //
//     connection.on("connected", () => console.log("MongoDB connected"));
//     connection.on("disconnected", () =>
//       console.log("MongoDB disconnected! - - - - - - - - - - - - -")
//     );
//     connection.on("err", () =>
//       console.log("There was an error connecting to MongoDB")
//     );
//     //
//   }

//   async mongoQuery(Schema, method, searchObject, updateObject) {
//     try {
//       if (method === "getAndUpdate") {
//         await Schema.updateMany(searchObject, updateObject, {
//           returnDocument: "after",
//           upsert: true,
//         });
//         return await Schema.find(searchObject);
//       }
//     } catch (err) {
//       this.console.error(err?.stack ?? err);
//       return err?.stack ?? err;
//     }
//   }
//   //
// }

class Gary extends CommandoClient {
  constructor(options) {
    super(options);
    // this.Mongo = {
    //   new: new Mongo(this),
    //   MongoGuild,
    //   getOrMakeGuild: async (id) => {
    //     let guild = await MongoGuild.findOne({ _id: id });
    //     if (!guild) {
    //       const g = await this.guilds.fetch(id);
    //       guild = new MongoGuild(await createGuild(id, g.name));
    //     }
    //     return guild;
    //   },
    // };
  }
}

const client = new Gary({
  owner: "682715516456140838",
  commandPrefix: "-",
});

client.once("ready", async () => {
  console.log("Gary is ready :)");
  client.user.setActivity(`${client.commandPrefix}help`, {
    type: "LISTENING",
  });
  client.registry
    .registerGroups([
      ["misc", "Misc commands"],
      // ["moderation", "Moderation commands"],
    ])
    .registerDefaults()
    .registerCommandsIn(path.join(__dirname, "commands"));
});

client.on("message", async (message) => {
  if (message.author.bot) return;
  if (message.channel.id != "885259801309876254") return;
  const staffChannel = client.channels.cache.get("885263299908870174");
  const embed = {
    color: "#EF476F",
    title: "Suggestion",
    author: {
      name: message.author.tag,
      icon_url: message.author.avatarURL(),
    },
    description: message.content,
    thumbnail: message.author.avatarURL(),
  };
  await staffChannel.send({ embed });
  await message.delete();
});

client.login(token);
