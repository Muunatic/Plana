import { EmbedBuilder, Message, player, ytdl } from '../../client';
import { defaultError } from '../../structures/error';

module.exports = {
    name: 'lyrics',
    async execute(message: Message<true>) {
        const queue = player.nodes.get(message.guild.id);
        if (queue?.isPlaying() == null || queue.isPlaying() === false) return message.reply('**No music is currently playing**');
        if (!message.member.voice.channel) return message.reply('**You are not in a voice channel!**');
        if (message.guild.members.me.voice.channel && message.member.voice.channel.id !== message.guild.members.me.voice.channel.id) return message.reply('**You are not in the same voice channel!**');

        const thumbnailInfo = await ytdl.getInfo(queue.currentTrack.url).then((data) => {
            return data.videoDetails.thumbnails[0].url;
        }).catch(() => {
            return queue.currentTrack.thumbnail;
        });
        const result = await player.lyrics.search({ q: queue.currentTrack.title });
        if (!result[0].plainLyrics) return message.reply(defaultError);

        const embed = new EmbedBuilder()
        .setColor('#89e0dc')
        .setTitle(queue.currentTrack.title)
        .setDescription(result[0].plainLyrics)
        .setThumbnail(thumbnailInfo)
        .setFooter({ text: `Listening on ${queue.currentTrack.source}`, iconURL: message.client.user.avatarURL({ extension: 'png', forceStatic: false, size: 1024 }) })
        .setTimestamp();

        await message.reply({embeds: [embed]});
    }
};
