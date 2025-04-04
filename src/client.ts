import { ActionRowBuilder, ActivityType, BaseGuildTextChannel, ButtonBuilder, ButtonInteraction, ButtonStyle, Client, Collection, CommandInteraction, EmbedBuilder, GatewayIntentBits, Interaction, Message, MessageComponentInteraction, Partials } from 'discord.js';
import { BaseExtractor, GuildQueue, Player, QueueRepeatMode, SearchResult, Track } from 'discord-player';
import { YoutubeiExtractor } from 'discord-player-youtubei';
import { SpotifyExtractor } from '@discord-player/extractor';
import ytdl, { Filter } from '@distube/ytdl-core';
import { ClientOptions, CmdOptions, ConstructorOptions } from './structures/option';
import { basename } from 'path';
import { token } from '../src/data/config';
import { name, version } from '../package.json';

class Core {
    public client: Client;
    public player: Player;
    public clientOptions: ClientOptions;

    constructor({ maintenanceMode = false }: ConstructorOptions = {}) {
        this.client = new Client({
            intents: [
                GatewayIntentBits.DirectMessages,
                GatewayIntentBits.DirectMessageReactions,
                GatewayIntentBits.DirectMessageTyping,
                GatewayIntentBits.MessageContent,
                GatewayIntentBits.Guilds,
                GatewayIntentBits.GuildModeration,
                GatewayIntentBits.GuildExpressions,
                GatewayIntentBits.GuildIntegrations,
                GatewayIntentBits.GuildInvites,
                GatewayIntentBits.GuildMembers,
                GatewayIntentBits.GuildMessages,
                GatewayIntentBits.GuildMessageReactions,
                GatewayIntentBits.GuildMessageTyping,
                GatewayIntentBits.GuildPresences,
                GatewayIntentBits.GuildVoiceStates,
                GatewayIntentBits.GuildWebhooks
            ],
            partials: [
                Partials.Channel,
                Partials.GuildMember,
                Partials.GuildScheduledEvent,
                Partials.Message,
                Partials.Reaction,
                Partials.ThreadMember,
                Partials.User
            ]
        });

        this.player = new Player(this.client);

        this.clientOptions = {
            maintenanceMode,
            name: name,
            version: version
        };
    }

    private async registerExtractors(extractors: ReadonlyArray<typeof BaseExtractor<object>>): Promise<void> {
        try {
            for (const extractor of extractors) {
                await this.player.extractors.register(extractor, {});
            }
        } catch (error: unknown) {
            console.error('Error registering extractors:', error);
        }
    }

    public async start(): Promise<void> {
        try {
            await this.registerExtractors([SpotifyExtractor, YoutubeiExtractor]);
            await this.client.login(token).catch((error: Error) => console.error('\x1b[31mError\x1b[0m:', error.message));
        } catch (error: unknown) {
            console.error('Error running client:', error);
        }
    }
}

const core = new Core();
const { client, player, clientOptions } = core;

(async () => {
    await core.start();
})().catch((err: Error) => console.error(err));

export {
    ActionRowBuilder,
    ActivityType,
    BaseGuildTextChannel,
    ButtonBuilder,
    ButtonInteraction,
    ButtonStyle,
    Collection,
    CmdOptions,
    CommandInteraction,
    EmbedBuilder,
    Filter,
    GuildQueue,
    Interaction,
    Message,
    MessageComponentInteraction,
    Player,
    QueueRepeatMode,
    SearchResult,
    Track,
    basename,
    client,
    clientOptions,
    player,
    token,
    ytdl
};
