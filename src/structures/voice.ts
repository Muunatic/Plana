import { GuildQueue, basename, player } from '../client';
import { VoiceConnection, VoiceConnectionState, VoiceConnectionStatus } from '@discordjs/voice';
console.info(`Loading ${basename(__filename)}`);

player.events.on('connection', (queue: GuildQueue<unknown>) => {
    (queue.dispatcher.voiceConnection as unknown as VoiceConnection).on('stateChange', (oldState: VoiceConnectionState, newState: VoiceConnectionState) => {
        if (oldState.status === VoiceConnectionStatus.Ready && newState.status === VoiceConnectionStatus.Connecting) {
            queue.dispatcher.voiceConnection.configureNetworking();
        }
    });
});
