import { Collection, basename, client } from '../client';
import path from 'node:path';
import fs from 'node:fs';
console.info(`Loading ${basename(__filename)}`);

declare module 'discord.js' {
    export interface Client {
        commands: Collection<unknown, { execute: (message: Message<boolean> | Interaction<CacheType>, args?: string[]) => Promise<void>; name: string; aliases: ReadonlyArray<string>; }>;
    }
}

client.commands = new Collection();
const interactionPath = path.join(__dirname, '../commands/interaction');
const commandInteraction = fs.readdirSync(interactionPath).filter((file) => file.endsWith('.js'));

const commandPath = path.join(__dirname, '../commands/message');
const commandMessage = fs.readdirSync(commandPath).filter((file) => file.endsWith('.js'));

(async () => {

    for (const file of commandInteraction) {
        const command = import(path.join(interactionPath, file)) as Promise<{ data: { name: string; }; }>;
        client.commands.set((await command).data.name, await command as never);
    }

    for (const file of commandMessage) {
        const command = import(path.join(commandPath, file)) as Promise<{ name: string; }>;
        client.commands.set((await command).name, await command as never);
    }

})().catch((err: Error) => console.error(err));
