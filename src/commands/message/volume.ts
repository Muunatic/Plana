import { CmdOptions, Message, player } from '../../client';

export = {
    name: 'volume',
    async execute(message: Message<true>, args: ReadonlyArray<string>) {
        const queue = player.nodes.get(message.guild.id);
        if (queue?.isPlaying() == null || queue.isPlaying() === false) return message.reply('**No music is currently playing**');
        if (!message.member.voice.channel) return message.reply('**You are not in a voice channel!**');
        if (message.guild.members.me.voice.channel && message.member.voice.channel.id !== message.guild.members.me.voice.channel.id) return message.reply('**You are not in the same voice channel!**');
        if (!args[0] || Math.round(parseInt(args[0])) < 1 || Math.round(parseInt(args[0])) > 100) return message.reply('**Provide a number between 1 and 100!**');
        queue.node.setVolume(parseInt(args[0]));
        await message.reply(`Volume has been set to **${args[0]}%**`);
    }
} as CmdOptions;
