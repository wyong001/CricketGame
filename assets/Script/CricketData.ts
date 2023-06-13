
export enum GameState {
    ready,
    playing, //游戏中
    fire,   //发球
    hit,    //等待击打
    over, //游戏结束
}

export default class CricketData {
    public static gameStatus: GameState = GameState.ready;

    public static bestScore: number = 0;
    public static currScore: number = 0;

    public static fireTimer: number = 0;

    public static runTimer: number = 0;

    public static perfectBall: boolean = false;

    public static clearData() {
        cc.log("clearData");
        this.fireTimer = 0.5;
        this.gameStatus = GameState.ready;
        this.runTimer = 0;
        this.perfectBall = false;
        this.currScore = 0;
        localStorage.setItem("bestScore", this.bestScore + "");
    }
}
