import { Message, basename, client, clientOptions } from '../client';
import { prefix } from '../data/config';
import { defaultError } from '../structures/error';
console.info(`Loading ${basename(__filename)}`);

client.on('messageCreate', async (message: Message) => {

    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();
    const cmd = client.commands.get(command) || client.commands.find((a) => a.aliases?.includes(command));

    if (!message.content.startsWith(prefix) || message.author.bot) return;
    if (!message.guild) return;

    if (!cmd) return;

    if (clientOptions.maintenanceMode) {
        return message.reply('Under Maintenance');
    }

    try {
        await cmd.execute(message, args);
    } catch (error) {
        console.error(error);
        await message.reply(defaultError);
    }

});
