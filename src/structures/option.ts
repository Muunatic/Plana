export interface ConstructorOptions {
    maintenanceMode?: boolean;
}

export interface ClientOptions {
    maintenanceMode?: boolean;
    name?: string;
    version?: string;
}

interface BaseCmdOptions {
    name: string;
    aliases?: string[];
}

export type CmdOptions<T extends boolean = true> = T extends true ? BaseCmdOptions : { data: unknown };
