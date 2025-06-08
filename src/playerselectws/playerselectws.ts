import { OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server, Socket } from 'socket.io';
import { v4 as uid } from 'uuid';


@WebSocketGateway(20000, {
    namespace: "PlayerSelect",
    cors: {
        origin: "*"
    },
    perMessageDeflate: false,
})
export class playerselectws implements OnGatewayConnection, OnGatewayDisconnect {


    @WebSocketServer() server: Server
    games: Map<string, { token: string, selectionIndex: number, Selected: Boolean, game: string, clientId: string }[]> = new Map()
    Tempgames: Map<string, { token: string, selectionIndex: number, Selected: Boolean, game: string }[]> = new Map()

    createNewGame() {
        return uid();
    }

    handleConnection(client: Socket, ...args: any[]) {
        client.emit("proceed", { Messgage: "Proceed" })
    }

    @SubscribeMessage("Setup")
    handleActualConnection(client: Socket, data: { token: string }) {
        var haveEmptyGame = { status: false, game: "" }
        var isPlayerAlreadyJoined = false
        this.games.forEach((players, gameId) => {
            if (players.length == 1) {
                haveEmptyGame.status = true
                haveEmptyGame.game = gameId
            }
            players.forEach((player, index) => {
                if (player.token == data.token) {
                    isPlayerAlreadyJoined = true
                    client.join(gameId)
                    client.emit("ConnectionSuccess", { Message: "AlreadyJoined", PlayerNum: index + 1, GameData: this.games.get(gameId) })
                }
            })
        })
        if (!isPlayerAlreadyJoined) {
            if (haveEmptyGame.status) {
                this.games.get(haveEmptyGame.game).push({ token: data.token, selectionIndex: 13, Selected: false, game: haveEmptyGame.game, clientId: client.id })
                client.join(haveEmptyGame.game)
                client.emit("ConnectionSuccess", { PlayerNum: 2, GameData: this.games.get(haveEmptyGame.game) })
                this.server.to(haveEmptyGame.game).emit("WaitingOver")
            }
            else {
                const game = this.createNewGame()
                this.games.set(game, [{ token: data.token, selectionIndex: 1, Selected: false, game: game, clientId: client.id }])
                client.join(game)
                client.emit("ConnectionSuccess", { PlayerNum: 1, GameData: this.games.get(game) })
            }
        }
        


    }

    handleDisconnect(client: Socket) {
        for (const [gameId, players] of this.games) {
            const index = players.findIndex(player => player.clientId === client.id);
            if (index !== -1) {
                players.splice(index, 1);
                if (players.length === 0) {
                    this.games.delete(gameId);
                } else {
                    this.games.set(gameId, players);
                    this.server.to(gameId).emit("RelocatePlayer" , {PlayerNum:1})
                }
                break;
            }
        }
        

    }

    @SubscribeMessage('change')
    handleselectionChange(client: Socket, data: { PlayerNum: number, Game: string, token: string, GameData: { selected: boolean, selectionIndex: number } }) {
        var GameData = this.games.get(data.Game)
        if (!GameData) {

            this.server.to(data.Game).emit("Error", { message: "Tampering With GameData Detected" })
        }
        if (GameData[data.PlayerNum - 1].token == data.token) {
            GameData[data.PlayerNum - 1].Selected = data.GameData.selected
            GameData[data.PlayerNum - 1].selectionIndex = data.GameData.selectionIndex
            this.games.set(data.Game, GameData)
            this.server.to(data.Game).emit("handled", this.games.get(data.Game))
        }
        else {
            this.server.to(data.Game).emit("Error", { message: "Tampering With Credential Data" })
        }
        if(this.games.get(data.Game).length == 2){
            if(this.games.get(data.Game)[0].Selected && this.games.get(data.Game)[1].Selected){
            this.server.to(data.Game).emit("PhaseComplete")
        }
        }
        

    }








}
