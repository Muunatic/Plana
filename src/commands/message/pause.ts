import { CmdOptions, Message, player } from '../../client';

export = {
    name: 'pause',
    async execute(message: Message<true>) {
        const queue = player.nodes.get(message.guild.id);
        if (queue?.isPlaying() == null || queue.isPlaying() === false) return message.reply('**No music is currently playing**');
        if (!message.member.voice.channel) return message.reply('**You are not in a voice channel!**');
        if (message.guild.members.me.voice.channel && message.member.voice.channel.id !== message.guild.members.me.voice.channel.id) return message.reply('**You are not in the same voice channel!**');
        if (queue.node.isPaused() === true) return message.reply('**Song is already paused**');
        queue.node.setPaused(true);
        await message.reply('**Song has been paused**');
    }
} as CmdOptions;
