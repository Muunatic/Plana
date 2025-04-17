import { ActionRowBuilder, ButtonBuilder, ButtonInteraction, ButtonStyle, CmdOptions, EmbedBuilder, Message, MessageComponentInteraction, QueueRepeatMode, player, ytdl } from '../../client';

export = {
    name: 'nowplaying',
    async execute(message: Message<true>) {
        const queue = player.nodes.get(message.guild.id);
        if (queue?.isPlaying() == null || queue.isPlaying() === false) return message.reply('**No music is currently playing**');
        if (!message.member.voice.channel) return message.reply('**You are not in a voice channel!**');
        if (message.guild.members.me.voice.channel && message.member.voice.channel.id !== message.guild.members.me.voice.channel.id) return message.reply('**You are not in the same voice channel!**');

        const thumbnailInfo = typeof queue.currentTrack.thumbnail === 'string' ? queue.currentTrack.thumbnail : await ytdl.getInfo(queue.currentTrack.url).then((data) => {
            return data.videoDetails.thumbnails[0].url;
        }).catch(() => {
            return queue.currentTrack.thumbnail;
        });

        const embed = new EmbedBuilder()
        .setColor('#89e0dc')
        .setTitle(queue.currentTrack.title)
        .setThumbnail(thumbnailInfo)
        .setFooter({ text: `Listening on ${queue.currentTrack.source}`, iconURL: message.client.user.avatarURL({ extension: 'png', forceStatic: false, size: 1024 }) })
        .addFields(
            { name: 'Channel', value: `${queue.currentTrack.author}`, inline: true },
            { name: 'Duration', value: `${queue.currentTrack.duration}`, inline: true },
            { name: 'Views', value: `${queue.currentTrack.views}`, inline: true },
            { name: 'Source', value: `[${queue.currentTrack.source}](${queue.currentTrack.url})`, inline: true },
            { name: 'Requested by', value: `${queue.currentTrack.requestedBy.username}`, inline: true },
            { name: 'Repeat Mode', value: `${queue.repeatMode === QueueRepeatMode.OFF ? 'Off' : 'On'}`, inline: true },
            { name: 'Progress Bar', value: `${queue.node.createProgressBar()}`, inline: true }
        )
        .setTimestamp();

        const row = new ActionRowBuilder<ButtonBuilder>()
        .addComponents(
            new ButtonBuilder()
            .setCustomId('resume')
            .setLabel('▶️')
            .setStyle(ButtonStyle.Success)
        )
        .addComponents(
            new ButtonBuilder()
            .setCustomId('pause')
            .setLabel('⏸️')
            .setStyle(ButtonStyle.Primary)
        )
        .addComponents(
            new ButtonBuilder()
            .setCustomId('skip')
            .setLabel('⏭️')
            .setStyle(ButtonStyle.Primary)
        )
        .addComponents(
            new ButtonBuilder()
            .setCustomId('stop')
            .setLabel('⏹️')
            .setStyle(ButtonStyle.Danger)
        );

        const btnFilter = (msg: MessageComponentInteraction): boolean => msg.member.user.id === message.author.id;
        const collector = message.channel.createMessageComponentCollector({ filter: btnFilter, time: 60000 });

        collector.on('collect', async (msg: ButtonInteraction) => {

            if (msg.customId === 'resume') {
                if (queue.node.isPaused() === true) {
                    queue.node.setPaused(false);
                    await msg.reply({ content: '**Song has been resumed**' });
                    return;
                } else if (queue.node.isPaused() === false) {
                    await msg.reply({ content: '**Song is already playing**' });
                    return;
                }
            }

            if (msg.customId === 'pause') {
                if (queue.node.isPaused() === false) {
                    queue.node.setPaused(true);
                    await msg.reply({ content: '**Song has been paused**' });
                    return;
                } else if (queue.node.isPaused() === true) {
                    await msg.reply({ content: '**Song is already paused**' });
                    return;
                }
            }

            if (msg.customId === 'skip') {
                queue.node.skip();
                await msg.reply({ content: '**Song has been skipped**' });
                return;
            }

            if (msg.customId === 'stop') {
                queue.delete();
                await msg.reply({ content: '**Song has been stopped**' });
                return;
            }

            collector.on('end', (collected) => console.log(collected.size));

        });

        await message.reply({ embeds: [embed], components: [row] }).then((msg) => {
            setTimeout(() => {
                (async () => {
                    row.components[0].setDisabled(true);
                    row.components[1].setDisabled(true);
                    row.components[2].setDisabled(true);
                    row.components[3].setDisabled(true);
                    await msg.edit({ components: [row] });
                    collector.stop();
                })().catch((err) => console.log(err));
            }, 5000);
        });
    }
} as CmdOptions;
