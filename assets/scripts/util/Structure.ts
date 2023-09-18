//TS的数据结构扩展
/**
 * 栈结构
 */
class Stack<T>{
    private _stack=[];
    /**
     * 入栈
     * @param para
     */
    push_S(para:T) {
        this._stack.push(para);
    }
    /**
     * 删除栈顶元素
     */
    delete_S() {
        let top=this._stack.pop();
        return top;
    }
    /**
     * 栈的长度
     * @returns {number}
     */
    size_S() {
        return this._stack.length;
    }
    /**
     * 返回栈顶元素
     * @returns {*}
     */
   peek_S() {
        return this._stack[this._stack.length-1];
    }
    /**
     * 判断栈是否为空
     * @returns {boolean}
     */
     isEmpty_S() {
        if(this._stack.length==0)
        {
            return true;
        }
        else
        {
            return  false;
        }
    }
    /**
     * 清空栈
     * @returns {Array}
     */
    emptyStack_S() {
        return this._stack=[];
    }
    print_S() {
        return this._stack.toString();
    }
}

/**
 * 字典结构
 */
class Dictionary<Tkey,Tvalue>
{
    private _count=0;
    private _keys=new Array<Tkey>();
    private _values=new Array<Tvalue>();

    private checkKeyId(key:Tkey){
        for(var i=0;i<this._count;i++)
        {
            if(key==this._keys[i])
            {
                return i;
            }
        }
        return  -1;
    }
    /**
     * 判断是否包含指定的key
     * @param key
     * @returns {boolean}
     */
    containKey_D(key:Tkey) {
        let index=this.checkKeyId(key);
        if(index!=-1)
        {
            return true;
        }
        return  false;
    }
    /**
     * 添加一个元素到字典
     * @param key
     * @param value
     */
    add_D(key:Tkey,value:Tvalue) {
        var index=this.checkKeyId(key);
        if(index!=-1)
        {
            console.log(key+'is exit');
            return;
        }
        this._keys[this._count]=key;
        this._values[this._count]=value;
        ++this._count;
    }
    /**
     * 从字典移除一个元素
     * @param key
     */
    remove_D(key:Tkey) {
        var index=this.checkKeyId(key);
        if(index==-1)
        {
            console.log(key+'does not exist');
            return;
        }
        this._keys.splice(index,1);
        this._values.splice(index,1);
        --this._count;
    }

    /**
     * 根据所指定的key获得value
     * @param key
     * @returns {null|any}
     */
    get_D(key:Tkey) {
        var index=this.checkKeyId(key);
        if(index==-1)
        {
          //  console.log(key+'does not exist:');
            return null;
        }
        return  this._values[index];
    }

    count() {
        return  this._count;
    }
    getNameByIndex(index:number) {
        return this._keys[index];
    }
}
export {Stack,Dictionary}