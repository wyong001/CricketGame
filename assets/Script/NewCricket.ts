import CricketData, { GameState } from "./CricketData";
import ball from "./ball";

const { ccclass, property } = cc._decorator;

@ccclass
export default class NewCricket extends cc.Component {

    @property(cc.Camera)
    mainCamera: cc.Camera = null;

    @property(cc.Node)
    progressBtn: cc.Node = null;

    @property(cc.Node)
    ban: cc.Node = null;

    @property(cc.Node)
    arm: cc.Node = null;

    @property(cc.Node)
    owlToServe: cc.Node = null;

    @property(cc.Label)
    bestlabel: cc.Label = null;

    @property(cc.Label)
    scorelabel: cc.Label = null;

    @property(cc.Prefab)
    ball: cc.Prefab = null;

    @property(cc.Node)
    players: cc.Node[] = [];

    @property(cc.Node)
    leftOwl: cc.Node[] = [];

    @property(cc.Node)
    rightOwl: cc.Node[] = [];

    @property(cc.Node)
    showScore: cc.Node = null;

    @property(cc.SpriteFrame)
    ScoreSp: cc.SpriteFrame[] = [];

    @property(cc.Node)
    showEnd: cc.Node = null;

    @property(cc.Node)
    pepole: cc.Node = null;

    public currBall: cc.Node = null;

    start() {

        let bestScore = localStorage.getItem("bestScore");
        if (bestScore != null) {
            CricketData.bestScore = Number(bestScore);
        }

        this.initData();
        this.onUp();
    }

    protected onLoad(): void {
        cc.director.getCollisionManager().enabled = true;
    }

    initData() {
        CricketData.clearData();
        CricketData.gameStatus = GameState.ready;
        this.ban.angle = 0;
        this.arm.angle = 0;
        this.showScore.opacity = 0;
        this.showEnd.active = false;

        this.bestlabel.string = CricketData.bestScore + "";
        this.scorelabel.string = CricketData.currScore + "";
    }

    reStartGame() {
        this.showEnd.active = false;
        this.recoveryGame();
        this.initData();
    }

    showGetScore(score: number): void {
        cc.log("showGetScore", score);
        CricketData.currScore += score;
        if (CricketData.currScore >= CricketData.bestScore) {
            CricketData.bestScore = CricketData.currScore;
            localStorage.setItem("bestScore", CricketData.bestScore + "");
        }
        if (score == 6) {
            cc.tween(this.pepole)
                .to(0.2, { y: 62 })
                .to(0.2, { y: 55 })
                .union()
                .repeat(2)
                .start();
        }
        this.bestlabel.string = CricketData.bestScore + "";
        this.scorelabel.string = CricketData.currScore + "";
        this.showScore.opacity = 0;
        this.showScore.y = 120;
        this.showScore.getComponent(cc.Sprite).spriteFrame = this.ScoreSp[score - 1];
        this.showScore.stopAllActions();
        cc.tween(this.showScore)
            .to(0.2, { opacity: 255, y: 150 })
            .to(0.5, { y: 200 })
            .to(0.1, { opacity: 0 })
            .start();
        this.recoveryGame();
    }

    showGameOver() {
        this.showEnd.active = true;
    }

    recoveryGame() {
        cc.log("recoveryGame")
        this.mainCamera.node.stopAllActions();
        cc.tween(this.mainCamera)
            .to(1.5, { zoomRatio: 1 })
            .start();
        cc.tween(this.mainCamera.node)
            .to(1.5, { position: cc.v2(0, 0) })
            .call(() => {
                CricketData.gameStatus = GameState.playing;
                CricketData.fireTimer = 0.5;
                CricketData.runTimer = 0;
                CricketData.perfectBall = false;
                this.progressBtn.x = -415;
                this.currBall.stopAllActions();
                this.currBall.position = cc.v2(-30, 30);
            })
            .start();

        this.playerInit();
        this.owlRecovery();
    }

    onUp() {
        cc.tween(this.mainCamera)
            .to(1.5, { zoomRatio: 1 })
            .start();
        cc.tween(this.mainCamera.node)
            .to(1.5, { position: cc.v2(0, 0) })
            .call(() => {
                cc.tween(this.node.getChildByName("logo"))
                    .to(0.5, { opacity: 0 })
                    .start();
                CricketData.gameStatus = GameState.playing;
            })
            .start();
    }

    onLeft() {
        cc.tween(this.mainCamera)
            .to(1.5, { zoomRatio: 1.2 })
            .start();
        cc.tween(this.mainCamera.node)
            .to(1.5, { position: cc.v2(-100, 0) })
            .start();
    }

    onRight() {
        cc.tween(this.mainCamera)
            .to(1.5, { zoomRatio: 1.2 })
            .start();
        cc.tween(this.mainCamera.node)
            .to(1.5, { position: cc.v2(100, 0) })
            .start();
    }

    onDown() {
        cc.tween(this.mainCamera)
            .to(1.5, { zoomRatio: 1.2 })
            .start();
        cc.tween(this.mainCamera.node)
            .to(1.5, { position: cc.v2(0, -50) })
            .start();
    }

    playRunAction() {
        let delayTime = 0.2;
        let runTime = 0.8;
        this.players[0].stopAllActions();
        this.players[1].stopAllActions();
        cc.tween(this.players[0])
            .to(runTime, { position: cc.v2(-70, 0), scale: 0.2 })
            .delay(delayTime)
            .call(() => {
                CricketData.runTimer++;
            })
            .to(runTime, { position: cc.v2(-120, -180), scale: 1 })
            .delay(delayTime)
            .call(() => {
                CricketData.runTimer++;
            })
            .union()
            .repeatForever()
            .start();
        cc.tween(this.players[1])
            .to(runTime, { position: cc.v2(-120, -180), scale: 1.5 })
            .delay(delayTime)
            .to(runTime, { position: cc.v2(-70, 0), scale: 1 })
            .delay(delayTime)
            .union()
            .repeatForever()
            .start();
    }

    playerInit() {
        this.players[0].stopAllActions();
        this.players[1].stopAllActions();
        let runTime = 0.3;
        cc.tween(this.players[0])
            .to(runTime, { position: cc.v2(-120, -180), scale: 1 })
            .start();
        cc.tween(this.players[1])
            .to(runTime, { position: cc.v2(-70, 0), scale: 1 })
            .start();
    }

    onClickHit() {

        this.hitAction();
        if (CricketData.gameStatus == GameState.ready) {
            return
        }

        if (CricketData.gameStatus == GameState.playing) {
            this.toServe();
            return;
        }

        cc.log(CricketData.fireTimer, "gameStatus:", CricketData.gameStatus)
        if (CricketData.gameStatus == GameState.hit) {
            if (CricketData.fireTimer <= 0.4 && CricketData.fireTimer > 0.3) {
                cc.log("左边")
                CricketData.gameStatus = GameState.over;
                this.onLeft();
                this.progressBtn.stopAllActions();
                let tx = Math.random() * 100 + 80
                cc.tween(this.currBall)
                    .by(0.5, { position: cc.v2(-tx, 30) })
                    .repeatForever()
                    .start();
                this.playRunAction();
                this.owlRun();
            }
            if (CricketData.fireTimer <= 0.3 && CricketData.fireTimer > 0.2) {
                cc.log("中间")
                CricketData.gameStatus = GameState.over;
                CricketData.perfectBall = true;
                this.progressBtn.stopAllActions();
                this.onDown();
                cc.tween(this.currBall)
                    .to(2, { position: cc.v2(200, 300) })
                    .to(0.5, { position: cc.v2(250, 250) })
                    .start();
                this.owlRun();
            }
            if (CricketData.fireTimer <= 0.2 && CricketData.fireTimer > 0.1) {
                cc.log("右边")
                CricketData.gameStatus = GameState.over;
                this.progressBtn.stopAllActions();
                this.onRight();
                let tx = Math.random() * 100 + 80
                cc.tween(this.currBall)
                    .by(0.5, { position: cc.v2(tx, 30) })
                    .repeatForever()
                    .start();
                this.playRunAction();
                this.owlRun();
            }
            if (CricketData.fireTimer <= 0.1) {
                cc.log("没打中失败")
                this.progressBtn.stopAllActions();
                CricketData.gameStatus = GameState.over;
                this.node.getChildByName("lan").getComponent(cc.Animation).play();
                this.showGameOver();
            }
        }
    }

    hitAction() {
        this.arm.runAction(cc.sequence(cc.rotateTo(0.05, -30), cc.rotateTo(0.05, 0)));
        this.ban.runAction(cc.sequence(cc.rotateTo(0.05, -60), cc.rotateTo(0.05, 0)));
    }

    barAction() {
        CricketData.gameStatus = GameState.hit;
        this.progressBtn.x = -415;
        cc.tween(this.progressBtn)
            .to(0.1, { x: -225 })
            .to(0.1, { x: -75 })
            .to(0.1, { x: 70 })
            .to(0.1, { x: 220 })
            .to(0.1, { x: 415 })
            .start();
    }

    toServe() {
        if (this.currBall == null) {
            let item = cc.instantiate(this.ball);
            item.position = cc.v2(-30, 30);
            item.getComponent(ball).setMain(this);
            item.setParent(this.owlToServe);
            this.currBall = item;
        }

        CricketData.gameStatus = GameState.fire;
        cc.tween(this.owlToServe)
            .to(0.2, { scale: 0.9, y: -10 })
            .to(0.2, { scale: 1, y: -30 })
            .call(() => {
                this.currBall.stopAllActions();
                cc.tween(this.currBall)
                    .to(0.5, { position: cc.v2(-40, -40), scale: 1.2 })
                    .by(0.1, { y: 5, x: 0 })
                    .to(1.1, { position: cc.v2(-65, -190), scale: 1.5 })
                    .start();
                cc.tween(this.node)
                    .delay(1.3)
                    .call(() => {
                        this.barAction();
                    })
                    .start()
            })
            .start();
    }

    update(dt: number): void {

        if (CricketData.gameStatus == GameState.hit) {
            CricketData.fireTimer -= dt;
            if (CricketData.fireTimer < 0) {
                CricketData.gameStatus = GameState.over;
                cc.log("没打失败")
                this.node.getChildByName("lan").getComponent(cc.Animation).play();
                this.showGameOver();
            }
        }
    }

    owlRun(): void {

        this.leftOwl[0].runAction(cc.moveBy(3, cc.v2(-100 + Math.random() * 30, 30 + Math.random() * 10)));
        this.leftOwl[1].runAction(cc.moveBy(3, cc.v2(-100 + Math.random() * 30, 30 + Math.random() * 10)));
        this.leftOwl[2].runAction(cc.moveBy(3, cc.v2(-100 + Math.random() * 30, 30 + Math.random() * 10)));


        this.rightOwl[0].runAction(cc.moveBy(3, cc.v2(-100 + Math.random() * 30, 30 + Math.random() * 10)));
        this.rightOwl[1].runAction(cc.moveBy(3, cc.v2(-100 + Math.random() * 30, 30 + Math.random() * 10)));
        this.rightOwl[2].runAction(cc.moveBy(3, cc.v2(-100 + Math.random() * 30, 30 + Math.random() * 10)));
    }

    owlRecovery() {
        this.leftOwl[0].runAction(cc.moveTo(0.5, cc.v2(450, -90)));
        this.leftOwl[1].runAction(cc.moveTo(0.5, cc.v2(260, -25)));
        this.leftOwl[2].runAction(cc.moveTo(0.5, cc.v2(580, -217)));

        this.rightOwl[0].runAction(cc.moveTo(0.5, cc.v2(450, -90)));
        this.rightOwl[1].runAction(cc.moveTo(0.5, cc.v2(260, -25)));
        this.rightOwl[2].runAction(cc.moveTo(0.5, cc.v2(580, -217)));
    }

    owlGetBall() {
        this.leftOwl[0].stopAllActions();
        this.leftOwl[1].stopAllActions();
        this.leftOwl[2].stopAllActions();
        this.rightOwl[0].stopAllActions();
        this.rightOwl[1].stopAllActions();
        this.rightOwl[2].stopAllActions();

        this.currBall.stopAllActions();
        cc.tween(this.currBall)
            .to(0.5, { position: cc.v2(-30, 30) })
            .start();
        this.playerInit();
        cc.log("getScore", CricketData.runTimer);
        this.recoveryGame();
        this.showGetScore(CricketData.runTimer);
    }
}
