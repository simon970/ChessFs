import { WebSocket } from "ws";
import { Chess } from "chess.js";
import { GAME_OVER, INIT_GAME, MOVE } from "./messages";
export class Game{
     
    public player1:WebSocket;
    public player2:WebSocket;
    private board:Chess;
    private moves:[];
    private startTime:Date;
    private moveCount=0;

    constructor(player1: WebSocket,player2: WebSocket){
        this.player1= player1;
        this.player2= player2;
        this.board=new Chess();
        this.moves=[ ];
        this.startTime=new Date();

        this.player1.send(JSON.stringify({
            type:INIT_GAME,
            payload:{
                color:"white"
            }
        }))
        this.player2.send(JSON.stringify({
            type:INIT_GAME,
            payload:{
                color:"black"
            }
        }))
    }

    makeMove(socket:WebSocket,move:{
        from:string,
        to:string 
    }){

        if(this.moveCount%2===0 && socket !== this.player1){
            console.log("1")
            return;
        }
        if(this.moveCount%2===1 && socket !== this.player2){
            console.log("2")
            return;
        }
        try{
            this.board.move(move)
            console.log("3");
            
            console.log("4")
        }catch(e){
            console.log(e); 
          return; 
        }

        if(this.board.isGameOver()){
            this.player1.emit(JSON.stringify({
                type:GAME_OVER,
                payload:{
                    winner: this.board.turn()=='w'?"black":"white"
                }
            }))
            this.player2.emit(JSON.stringify({
                type:GAME_OVER,
                payload:{
                    winner: this.board.turn()=='w'?"black":"white"
                }
            }))

            return;
        }
        console.log(this.moveCount%2)

        if(this.moveCount%2===0){
            console.log("5")
            this.player2.send(JSON.stringify({
                type:MOVE,
                payload:move
            }))

        }else{
            this.player1.send(JSON.stringify({
                type:MOVE,
                payload:move
            }))
            console.log("6")

        }

        this.moveCount++; 
  }

} 