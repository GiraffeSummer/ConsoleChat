interface User {
    name: string,
    color: string,
    version: number,
    channel: Channel,
    socket: any
}
interface Client {
    name: string,
    color: string,
    version: number,
}

interface Channel {
    name: string,
    users: Array<User>
}
interface Command {
    description: string,
    enabled: boolean,
    name: string,
    usage: string
}

export type { User, Client, Channel, Command }