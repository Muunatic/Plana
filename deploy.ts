import path from 'node:path';
import fs from 'node:fs';
import { REST, Routes } from 'discord.js';
import { clientId, token } from './src/data/config';

const commands: string[] = [];
const commandsPath = path.join(__dirname, './src/commands/interaction');
const commandFiles = fs.readdirSync(commandsPath).filter((file) => file.endsWith('.js'));

(async () => {

    for (const file of commandFiles) {
        const command = import(path.join(commandsPath, file)) as Promise<{data: {toJSON: () => string}}>;
        commands.push((await command).data.toJSON());
    }

})().catch((err: Error) => console.error(err));

const rest = new REST({ version: '10' }).setToken(token);

void (async () => {

    try {
        console.log('Deploying');
        await rest.put(Routes.applicationCommands(clientId), { body: commands });
        console.log('Deployed');
    } catch (error) {
        console.error(error);
    }

})();
