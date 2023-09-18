
const {ccclass, property} = cc._decorator;

@ccclass
export default class Linerhythm extends cc.Component {


    // LIFE-CYCLE CALLBACKS:
    props: Array<cc.Node> = new Array<cc.Node>();
    midVal:number=0;
    onLoad () {
        // var childen = this.node.children;
        // this.midVal=Math.floor(childen.length/2) 
        // if (childen) {
        //         childen.forEach((child,indx) => {
        //             this.props.push(child);
        //             child.getComponent(cc.Sprite).fillRange=0;
        //         })
        //     }
    }

   
    onShow()
    {
    //     console.log("show");
        
    //     for(let i=0; i<this.props.length;i++)
    //     {
    //         let val;
    //         if(i>this.midVal)
    //         {
    //             val=(i-(i-this.midVal)*2)/this.midVal;
    //         }
    //         else
    //         {
    //             val=i/this.midVal;
    //         }
    //         val=(Math.random()*0.6)+val;
    //         cc.tween(this.props[i].getComponent(cc.Sprite)).by(0.4,{fillRange:val}).start();
    //         // this.props[i].getComponent(cc.Sprite).fillRange=val;

    //     }
    //     let self=this;
    //     let  norcallback=function(){
    //         if(this.props.length<=0) return;
    //         this.props.forEach((child) => {
    //            let offset=(Math.random()*0.6-0.4);
    //             cc.tween(child.getComponent(cc.Sprite)).stop();
    //             cc.tween(child.getComponent(cc.Sprite)).sequence(
    //                 cc.tween().by(0.2,{fillRange:offset}),
    //                 cc.tween().by(0.2,{fillRange:-offset})
    //             ).start();
    //         })
    //     }
    //    this.schedule(norcallback,0.4)
    }

    OnStop()
    {
       
        // this.unscheduleAllCallbacks();
        // this.props.forEach((child,indx) => {
        //     cc.tween(child.getComponent(cc.Sprite)).stop();
        //    cc.tween(child.getComponent(cc.Sprite)).to(0.4,{fillRange:0}).start();
        // })
    }


    onDestroy()
    {


        
    }
}
