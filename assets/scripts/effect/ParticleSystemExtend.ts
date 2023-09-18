
const {ccclass, property} = cc._decorator;

@ccclass
export default class ParticleSystemExtend extends cc.Component {

    onEnable()
    {
        this.getComponent(cc.ParticleSystem).resetSystem();
    }
}
