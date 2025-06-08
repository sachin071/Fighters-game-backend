import { OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server, Socket } from 'socket.io';

@WebSocketGateway(20000, {
    namespace: 'Game',
    cors: {
        origin: '*'
    },
    perMessageDeflate: false,
    compression: true,
})
export class WSfunction implements OnGatewayConnection, OnGatewayDisconnect {

    @WebSocketServer() server: Server
    games = new Map<string, {
        width?: number,
        token?: string,
        clientId?: any,
        PlayerNum?: number,
        states?: {
            Round_Won: number,
            health: number,
            player: string,
            playerImage: number,
            StateImg: string,
            isOnGround: boolean,
            facing: number,
            data: { isHit: boolean, width: number, PositionHorizontal: number, PositionVertical: number, VelocityVertical: number, VelocityHorizontal: number, height: number },
            Punch_1: { isActive: boolean, isHitting: boolean, PositionHorizontal: number, PositionVertical: number },
            Projectile: { isActive: boolean, isHitting: boolean, PositionHorizontal: number, P_facing: number, PositionVertical: number, chs: boolean },
            Kick_1: { isActive: boolean, isHitting: boolean, PositionHorizontal: number, PositionVertical: number }
        }
    }[]>

    decoder = new TextDecoder('utf-8')
    async HandleDecode(data: any) {
        return await this.decoder.decode(data)
    }

    async HandleEncode(data: string) {
        return await Buffer.from(data, "utf-8")
    }


    handleConnection(client: any, ...args: any[]) {
        client.emit("GameSetup")
    }

    @SubscribeMessage("InitiateGame")
    async HandleSetupInitiation(client: Socket, data: any) {
        this.games.set(data.Game, [{}, {}])
        if (this.games.get(data.game)[1].width && data.PlayerNum == 1) {
            const MinWidth = Math.min(data.Game, this.games.get(data.Game)[0].width)
            this.games.get(data.Game)[1].width = MinWidth
            this.games.get(data.Game)[1].states.data.PositionHorizontal = MinWidth - 175
            this.games.get(data.Game)[0] = {
                width: MinWidth,
                token: data.token,
                clientId: client.id,
                PlayerNum: 1,
                states: {
                    Round_Won: 0,
                    health: 100,
                    player: "",
                    playerImage: 0,
                    StateImg: "idle",
                    isOnGround: true,
                    facing: 1,
                    data: {
                        isHit: false,
                        PositionHorizontal: 100,
                        PositionVertical: 0,
                        VelocityVertical: 0,
                        VelocityHorizontal: 0,
                        width: 75,
                        height: 125
                    },
                    Punch_1: {
                        isActive: false,
                        isHitting: false,
                        PositionHorizontal: 0,
                        PositionVertical: 0
                    },
                    Projectile: {
                        isHitting: false,
                        isActive: false,
                        P_facing: 1,
                        PositionHorizontal: 0,
                        PositionVertical: 75,
                        chs: false
                    },
                    Kick_1: {
                        isActive: false,
                        isHitting: false,
                        PositionHorizontal: 0,
                        PositionVertical: 0
                    }
                }
            }

        }
        if (this.games.get(data.Game)[0].width && data.PlayerNum == 2) {
            const MinWidth = Math.min(data.Game, this.games.get(data.Game)[1].width)
            this.games.get(data.Game)[0].width = MinWidth
            this.games.get(data.Game)[1] = {
                width: MinWidth,
                token: data.token,
                clientId: client.id,
                PlayerNum: 2,
                states: {
                    Round_Won: 0,
                    health: 100,
                    player: "",
                    playerImage: 0,
                    StateImg: "idle",
                    isOnGround: true,
                    facing: 1,
                    data: {
                        isHit: false,
                        PositionHorizontal: MinWidth - 175,
                        PositionVertical: 0,
                        VelocityVertical: 0,
                        VelocityHorizontal: 0,
                        width: 75,
                        height: 125
                    },
                    Punch_1: {
                        isActive: false,
                        isHitting: false,
                        PositionHorizontal: 0,
                        PositionVertical: 0
                    },
                    Projectile: {
                        isHitting: false,
                        isActive: false,
                        P_facing: 1,
                        PositionHorizontal: 0,
                        PositionVertical: 75,
                        chs: false
                    },
                    Kick_1: {
                        isActive: false,
                        isHitting: false,
                        PositionHorizontal: 0,
                        PositionVertical: 0
                    }
                }
            }
        }
        if (!(this.games.get(data.Game)[0].width && this.games.get(data.Game)[1].width)) {
            if (data.PlayerNum == 1) {
                this.games.get(data.Game)[0] = {
                    width: data.width,
                    token: data.token,
                    clientId: client.id,
                    PlayerNum: 1,
                    states: {
                        Round_Won: 0,
                        health: 100,
                        player: "",
                        playerImage: 0,
                        StateImg: "idle",
                        isOnGround: true,
                        facing: 1,
                        data: {
                            isHit: false,
                            PositionHorizontal: 100,
                            PositionVertical: 0,
                            VelocityVertical: 0,
                            VelocityHorizontal: 0,
                            width: 75,
                            height: 125
                        },
                        Punch_1: {
                            isActive: false,
                            isHitting: false,
                            PositionHorizontal: 0,
                            PositionVertical: 0
                        },
                        Projectile: {
                            isHitting: false,
                            isActive: false,
                            P_facing: 1,
                            PositionHorizontal: 0,
                            PositionVertical: 75,
                            chs: false
                        },
                        Kick_1: {
                            isActive: false,
                            isHitting: false,
                            PositionHorizontal: 0,
                            PositionVertical: 0
                        }
                    }
                }
            }
                if (data.PlayerNum == 2) {
                    this.games.get(data.Game)[1] = {
                        width: data.width,
                        token: data.token,
                        clientId: client.id,
                        PlayerNum: 2,
                        states: {
                            Round_Won: 0,
                            health: 100,
                            player: "",
                            playerImage: 0,
                            StateImg: "idle",
                            isOnGround: true,
                            facing: 1,
                            data: {
                                isHit: false,
                                PositionHorizontal: 100,
                                PositionVertical: 0,
                                VelocityVertical: 0,
                                VelocityHorizontal: 0,
                                width: 75,
                                height: 125
                            },
                            Punch_1: {
                                isActive: false,
                                isHitting: false,
                                PositionHorizontal: 0,
                                PositionVertical: 0
                            },
                            Projectile: {
                                isHitting: false,
                                isActive: false,
                                P_facing: 1,
                                PositionHorizontal: 0,
                                PositionVertical: 75,
                                chs: false
                            },
                            Kick_1: {
                                isActive: false,
                                isHitting: false,
                                PositionHorizontal: 0,
                                PositionVertical: 0
                            }
                        }
                    }
                }
            }
            client.join(data.Game)
            client.emit("ConnectionSuccess")

        }


        handleDisconnect(client: Socket) {

        }




    }