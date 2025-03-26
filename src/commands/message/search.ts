import { CmdOptions, EmbedBuilder, Message, SearchResult, player } from '../../client';
import { defaultError } from '../../structures/error';

export = {
    name: 'search',
    async execute(message: Message<true>, args: ReadonlyArray<string>) {
        const query = args.join(' ').toString();
        const queue = player.nodes.create(message.guild, {
            selfDeaf: true,
            leaveOnEnd: true,
            leaveOnEmpty: true,
            leaveOnEmptyCooldown: 5000,
            metadata: {
                channel: message.channel
            }
        });

        if (!message.member.voice.channel) return message.reply('**You are not in a voice channel!**');

        if (message.guild.members.me.voice.channel && message.member.voice.channel.id !== message.guild.members.me.voice.channel.id) return message.reply('**You are not in the same voice channel!**');

        if (message.member.voice.channel.full === true) return message.reply('**Voice channel is full!**');

        if (!args[0]) return message.reply('**Provide a title to search for a song**');

        try {
            if (!queue.connection) await queue.connect(message.member.voice.channel);
        } catch {
            queue.delete();
            return message.reply({ content: defaultError });
        }

        let track: SearchResult;
        if (new RegExp('\\b' + 'https://open.spotify.com/track/' + '\\b', 'i').test(query)) {
            const splitQuery = query.includes('?si=') ? query.split('?si=')[0].toString() : query;
            track = await player.search(splitQuery, {
                searchEngine: 'spotifySearch',
                ignoreCache: true,
                requestedBy: message.author
            });
        } else {
            track = await player.search(query, {
                searchEngine: 'youtube',
                ignoreCache: true,
                requestedBy: message.author
            });
        }

        if (!track) return message.channel.send({ content: defaultError });

        if (!track.tracks[4]?.title) return message.channel.send({ content: defaultError });

        const embed = new EmbedBuilder()
        .setColor('#89e0dc')
        .setThumbnail(track.tracks[0].thumbnail)
        .setAuthor({ name: 'Choose a number to start playing the song, type cancel to cancel operation', iconURL: message.client.user.avatarURL({ extension: 'png', forceStatic: false, size: 1024 }) })
        .setDescription('**1. ' + `\[${track.tracks[0].title}\]\(${track.tracks[0].url}\)` + '\n' + '2. ' + `\[${track.tracks[1].title}\]\(${track.tracks[1].url}\)` + '\n' + '3. ' + `\[${track.tracks[2].title}\]\(${track.tracks[2].url}\)` + '\n' + '4. ' + `\[${track.tracks[3].title}\]\(${track.tracks[3].url}\)` + '\n' + '5. ' + `\[${track.tracks[4].title}\]\(${track.tracks[4].url}\)` + '\n**')
        .setFooter({ text: `Requested by ${message.author.username}`, iconURL: message.author.avatarURL({ extension: 'png', forceStatic: false, size: 1024 }) })
        .setTimestamp();

        await message.reply({ embeds: [embed] });
        const collector = message.channel.createMessageCollector({
            filter: (user) => user.member.id === message.author.id,
            time: 60000
        });

        collector.on('collect', async (msg: Message) => {
            const value = parseInt(msg.content);
            if (msg.content.toLowerCase() === 'cancel') return await msg.reply('**Query canceled**') && collector.stop();
            if (!value || value < 0 || value > 5) {
                await msg.reply(defaultError);
                return;
            } else {
                await message.channel.send({ content: `Adding song **${track.tracks[value - 1].title}** to **${message.member.voice.channel.name}...**` });
                collector.stop();
                queue.addTrack(track.tracks[value - 1]);
                if (!queue.node.isPlaying()) await queue.node.play();
                return;
            }
        });
    }
} as CmdOptions;
