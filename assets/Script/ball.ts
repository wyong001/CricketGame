import CricketData from "./CricketData";
import NewCricket from "./NewCricket";

const { ccclass, property } = cc._decorator;

@ccclass
export default class ball extends cc.Component {

    private mainSp: NewCricket = null;

    start() {

    }

    setMain(main) {
        this.mainSp = main;
    }

    onCollisionEnter(other, self) {
        cc.log("onCollisionEnter", other.tag)
        if (other.tag == 2) {
            cc.log("球出界了")
            if (CricketData.perfectBall) {
                this.mainSp.showGetScore(6);
            } else {
                this.mainSp.showGetScore(4);
            }
        }

        if (other.tag == 1) {
            if (CricketData.perfectBall) return;
            cc.log("球被接住了")
            this.mainSp.owlGetBall();
        }
    }
}
