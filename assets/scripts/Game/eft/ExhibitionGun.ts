

const {ccclass, property} = cc._decorator;

@ccclass
export default class ExhibitionGun extends cc.Component {

    onDisable(){
        this.node.stopAllActions();
        this.node.scale=0;
    }

    rotate()
    {
        this.node.stopAllActions();
        this.node.scale=0;
        this.node.eulerAngles=cc.v3(0,0,0)
        cc.tween(this.node).parallel(
            cc.tween().sequence(
                cc.tween().to(0.5,{scale:1.3}),
                cc.tween().to(0.5,{scale:1}),
            ),
            cc.tween().by(1,{eulerAngles:cc.v3(0,-360,0)})
        ) 
        .repeatForever(
            cc.tween().by(1.5,{eulerAngles:cc.v3(0,-360,0)})
            // .to(0.8,{eulerAngles:cc.v3(0,-360,0)},{easing:"sineOut"})
        )
       .start(); 
    }

    /**
     * 设置模型
     * */
    setMeshs(id:number)
    {
        console.log("setMeshs  id"+id);
        
        this.rotate();
        this.node.children.forEach((node)=>{node.active=false});
        this.node.children[id].active=true;
    }
}
