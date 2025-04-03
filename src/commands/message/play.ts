import { CmdOptions, Message, Track, player } from '../../client';
import { defaultError } from '../../structures/error';

export = {
    name: 'play',
    async execute(message: Message<true>, args: ReadonlyArray<string>) {
        const query = args.join(' ').toString();
        const queue = player.nodes.create(message.guild, {
            selfDeaf: true,
            leaveOnEnd: true,
            leaveOnEmpty: true,
            leaveOnEmptyCooldown: 10000,
            leaveOnEndCooldown: 10000,
            metadata: {
                channel: message.channel
            }
        });

        if (!message.member.voice.channel) return message.reply('**You are not in a voice channel!**');

        if (message.guild.members.me.voice.channel && message.member.voice.channel.id !== message.guild.members.me.voice.channel.id)
            return message.reply('**You are not in the same voice channel!**');

        if (message.member.voice.channel.full === true) return message.reply('**Voice channel is full!**');

        if (!args[0]) return message.reply('**Provide a title to start playing a song**');

        try {
            if (!queue.connection) await queue.connect(message.member.voice.channel);
        } catch {
            queue.delete();
            return message.reply({ content: defaultError });
        }

        let track: Track;
        if (new RegExp('\\b' + 'https://open.spotify.com/track/' + '\\b', 'i').test(query)) {
            const splitQuery = query.includes('?si=') ? query.split('?si=')[0].toString() : query;
            track = await player.search(splitQuery, {
                searchEngine: 'spotifySong',
                ignoreCache: true,
                requestedBy: message.author
            }).then((x) => x.tracks[0]);
        } else {
            track = await player.search(query, {
                searchEngine: 'youtube',
                ignoreCache: true,
                requestedBy: message.author
            }).then((x) => x.tracks[0]);
        }
        if (!track) return message.channel.send({ content: defaultError });

        await queue.node.play(track);

        return message.channel.send({ content: `Added song **${track.title}** to **${message.member.voice.channel.name}...**` });
    }
} as CmdOptions;
