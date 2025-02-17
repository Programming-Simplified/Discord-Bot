import { Embed } from "@discordjs/builders";
import {
  Message,
  MessageActionRow,
  MessageButton,
  SelectMenuInteraction,
  TextChannel,
} from "discord.js";
import Select from "../structures/Select";
import { createTranscriptEntry } from "../utils/notion";

export default class TicketTypeSelect extends Select {
  constructor() {
    super("ticketType");
  }

  async exec(interaction: SelectMenuInteraction) {
    const transcript = {
      title: interaction.user.tag,
      category: interaction.values[0],
    };

    const notionPage = await createTranscriptEntry(transcript);
    const newTicketName = `${interaction.values[0]}-${
      interaction.user.id
    }-${notionPage.id.split("-").join("")}`;
    await (interaction.channel as TextChannel)?.setName(newTicketName);

    (interaction.message as Message).delete();

    switch (interaction.values[0]) {
      case "python101":
        await interaction.channel.send("<@&935091117966385173>");
        break;
      case "javascript101":
        await interaction.channel.send("<@&935091142884724786>");
        break;
      case "java101":
        await interaction.channel.send("<@&935091172672679976>");
        break;
      case "webdev":
        await interaction.channel.send("<@&935091067437584384>");
        break;
      case "discordjs":
        await interaction.channel.send("<@&935091084218998814>");
        break;
      case "sql":
        await interaction.channel.send("<@&935091203198844950>");
        break;
      case "other":
        break;
    }

    (interaction.channel as TextChannel).permissionOverwrites.edit(
      interaction.user.id,
      {
        SEND_MESSAGES: true,
      }
    );

    interaction.channel.send({
      embeds: [
        new Embed()
          .setTitle(newTicketName)
          .setDescription(
            "Thank you. Now, please describe your issue in detail, making sure to provide all code/errors necessary."
          )
          .setColor(0xa020f0),
      ],
      components: [
        new MessageActionRow().addComponents(
          new MessageButton()
            .setCustomId("ticketConfirm")
            .setLabel("Close Ticket")
            .setEmoji("❌")
            .setStyle("DANGER")
        ),
      ],
    });
  }
}
