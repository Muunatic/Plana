import { GuildQueue, Message, Track, basename, client, player } from '../client';
console.info(`Loading ${basename(__filename)}`);

client.on('shardDisconnect', () => {
    console.log('Disconnect');
});

client.on('shardReconnecting', () => {
    console.log('Reconnecting');
});

player.events.on('emptyChannel', async (queue: GuildQueue<unknown>) => {
    await (<Message<true>>queue.metadata).channel.send('**Tidak ada member di voice**');
});

player.events.on('playerStart', async (queue: GuildQueue<unknown>, track: Track) => {
    await (<Message<true>>queue.metadata).channel.send(`Memutar lagu **${track.title}**`);
});

player.events.on('emptyQueue', async (queue: GuildQueue<unknown>) => {
    await (<Message<true>>queue.metadata).channel.send('**Tidak ada music yang tersisa**');
});

player.events.on('playerError', (queue: GuildQueue<unknown>, error: Error) => {
    console.error(`Connection Error: ${error.message}`);
});

player.events.on('error', (queue: GuildQueue<unknown>, error: Error) => {
    console.error(error.message);
});
