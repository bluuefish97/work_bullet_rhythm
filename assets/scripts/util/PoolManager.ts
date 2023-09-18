

const {ccclass, property} = cc._decorator;

@ccclass("PoolManager")
export class PoolManager {
    dictPool = {}
    dictPrefab = {}
    dictSfs = {}
    static _instance: PoolManager;

    static get instance () {
        if (this._instance) {
            return this._instance;
        }

        this._instance = new PoolManager();
        return this._instance;
    }

    /**
     * 根据预设从对象池中获取对应节点
     */
    getNode (prefab: cc.Prefab, parent: cc.Node) {
        let name = prefab.data.name;
        this.dictPrefab[name] = prefab;
        let node: cc.Node = null;
        if (this.dictPool.hasOwnProperty(name)) {
            //已有对应的对象池
            let pool = this.dictPool[name];
            if (pool.size() > 0) {
                node = pool.get();
            } else {
              //  console.log("重新生成    "+name);
                
                node = cc.instantiate(prefab);
            }
        } else {
            //没有对应对象池，创建他！
            let pool = new cc.NodePool();
            this.dictPool[name] = pool;
            if(parent.getChildByName(name))
            {
                node=parent.getChildByName(name)    
            }
            else
            {
               // console.log("初次重新生成   "+name);
                node =cc.instantiate(prefab);
            }
        }

        node.parent = parent;
        return node;
    }

    /**
     * 将对应节点放回对象池中
     */
    putNode (node: cc.Node) {
        let name = node.name;
        let pool = null;
        if (this.dictPool.hasOwnProperty(name)) {
            //已有对应的对象池
            pool = this.dictPool[name];
        } else {
            //没有对应对象池，创建他！
            pool = new cc.NodePool();
            this.dictPool[name] = pool;
        }

        pool.put(node);
    }

    /**
     * 根据预制体，清除对应对象池
     */
    clearPool (prefab: cc.Prefab) {
        let name = prefab.data.name;
        if (this.dictPool.hasOwnProperty(name)) {
            let pool = this.dictPool[name];
            pool.clear();
        }
    }


    resetDictPool()
    {
        for(var idx in this.dictPool)
        {
            this.dictPool[idx].clear();
        }
    }


       /**
     * 根据路径获得资源
     */
    getSpriteFrame (url: string ,cb) {
        let self=this;
        if (this.dictSfs.hasOwnProperty(url)) {
            cb&&cb(self.dictSfs[url]);
        } else {
            cc.resources.load(url, cc.SpriteFrame, function (err, spriteFrame) {
             cb&&cb(spriteFrame as cc.SpriteFrame);
             self.dictSfs[url]=spriteFrame;
            });
         
        }
    }
}
