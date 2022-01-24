import { Client, Collection, Intents, Interaction, } from "discord.js";
import { readdirSync } from "fs";
import BaseCommand from "./commands";
import { REST } from "@discordjs/rest";
import { Routes } from "discord-api-types/rest/v9";
import { config } from "dotenv";
import hasArg from "./lib/utils/hasArg";
config();

class Bot extends Client {
	constructor() {
		super({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MESSAGE_REACTIONS, Intents.FLAGS.DIRECT_MESSAGES, Intents.FLAGS.DIRECT_MESSAGE_REACTIONS] });

	}
}

const commands = new Collection<string, BaseCommand>();

const commandFiles =
	readdirSync("./src/commands")
		.filter((file) => file.split(".command").length > 1);

(async () => {
	for (const file of commandFiles) {
		const { default: command } = await import(`./commands/${file}`) as { default: BaseCommand; };
		commands.set(command.metadata.name, command);
	}
})().then(main);

async function main() {
	if (hasArg("register", "r")) {
		console.log("registering");

		const cmdDatas = commands.map(cmd => cmd.metadata);
		const cmdNames = cmdDatas.map(cmdData => cmdData.name);

		console.log(
			cmdNames.map(cmdName => `'${cmdName}'`).join(", ")
		);

		try {
			const rest = new REST({ version: "9" }).setToken(process.env.TOKEN);
			await rest.put(Routes.applicationGuildCommands("883540250759163975", "924860504302821377"), { body: cmdDatas });
		} catch (error) {
			console.error("Error registering commands:", error);
			return;
		}

		console.log("Successfully registered commands!");
		process.exit(0);
	}

	const client = new Bot();

	client.once("ready", () => {
		console.log(`${client.user.tag} is ready!`);

		client.user?.setActivity({
			name: "with my code",
			type: "COMPETING"
		});
	});

	client.on("interactionCreate", async (interaction: Interaction) => {
		if (interaction.isCommand()) {
			const command = commands.get(interaction.commandName);
			if (!command) return;
			await command.execute(interaction).catch(() => interaction.editReply({
				content: "An error occurred while executing this command.\nIf this keeps happening please contact the owner.",
			}));

		}
	});

	client.login(process.env.TOKEN);

}