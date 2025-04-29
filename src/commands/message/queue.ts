import { CmdOptions, Message, player } from '../../client';

export = {
    name: 'queue',
    async execute(message: Message<true>) {
        const queue = player.nodes.get(message.guild.id);
        if (queue?.isPlaying() == null || queue.isPlaying() === false) return message.reply('**No music is currently playing**');
        if (!message.member.voice.channel) return message.reply('**You are not in a voice channel!**');
        if (message.guild.members.me.voice.channel && message.member.voice.channel.id !== message.guild.members.me.voice.channel.id) return message.reply('**You are not in the same voice channel!**');
        if (!queue.tracks.data[0]) return message.reply(`**Music Queue**\nNow Playing: **${queue.currentTrack.title}** | **${queue.currentTrack.author}**`);
        await message.reply(`**Music Queue**\nNow Playing: **${queue.currentTrack.title}** | **${queue.currentTrack.author}**\n\n` + (queue.tracks.data.map((track, i) => {
            return `**#${i + 1}** - **${track.title}** | **${track.author}** (requested by: **${track.requestedBy.username}**)`;
        }).slice(0, 5).join('\n') + `\n\n${queue.tracks.data.length > 5 ? `and **${queue.tracks.data.length - 5}** more songs...` : `Playlist contains **${queue.tracks.data.length}** songs...`}`));
    }
} as CmdOptions;
