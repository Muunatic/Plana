import { Interaction, basename, client, clientOptions } from '../client';
import { defaultError } from '../structures/error';
console.info(`Loading ${basename(__filename)}`);

client.on('interactionCreate', async (interaction: Interaction) => {

    if (!interaction.isCommand()) return;
    if (!interaction.guild) return;

    const command = client.commands.get(interaction.commandName);

    if (!command) return;

    if (clientOptions.maintenanceMode) {
        return interaction.reply('Under Maintenance');
    }

    try {
        await command.execute(interaction);
    } catch (error) {
        console.error(error);
        await interaction.reply({ content: defaultError, ephemeral: true });
    }

});
