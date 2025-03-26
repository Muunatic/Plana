import { CmdOptions, Message, QueueRepeatMode, player } from '../../client';

export = {
    name: 'repeat',
    aliases: ['loop'],
    async execute(message: Message<true>) {
        const queue = player.nodes.get(message.guild.id);
        if (queue?.isPlaying() == null || queue.isPlaying() === false) return message.reply('**No music is currently playing**');
        if (!message.member.voice.channel) return message.reply('**You are not in a voice channel!**');
        if (message.guild.members.me.voice.channel && message.member.voice.channel.id !== message.guild.members.me.voice.channel.id) return message.reply('**You are not in the same voice channel!**');
        queue.setRepeatMode(queue.repeatMode === QueueRepeatMode.OFF ? QueueRepeatMode.TRACK : QueueRepeatMode.OFF);
        const nowMode = function(): 0 | 1 {
            if (queue.repeatMode === QueueRepeatMode.OFF) {
                return 0;
            } else {
                return 1;
            }
        };
        await message.reply(nowMode ? `Loop **${queue.repeatMode === QueueRepeatMode.OFF ? 'disabled' : 'enabled'}**` : `Loop **${queue.repeatMode === QueueRepeatMode.OFF ? 'disabled' : 'enabled'}**`);
    }
} as CmdOptions;
