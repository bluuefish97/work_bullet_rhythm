import { Stack, Dictionary } from "./Structure";
import { PanelType } from "./PanelType";
import BasePanel from "./BasePanel";

/**
 * 弹窗管理
 */

const { ccclass, property } = cc._decorator;

@ccclass
export default class UIPanelCtr {
    private static _instance: UIPanelCtr;
    public static getInstance() {
        if (!this._instance) {
            this._instance = new UIPanelCtr();
        }
        return this._instance;
    }
    private existPanelDict: Dictionary<PanelType, BasePanel> = new Dictionary<PanelType, BasePanel>();  //保存在场景中存在的所有面板
    private panelStack: Stack<BasePanel> = new Stack<BasePanel>();              //保存存在的面板的堆栈

    private tempTopPanel = null;

    /**
     * 把指定类型的面板入栈, 显示在场景中
     * @param panelType
     */
    pushPanel(panelType: PanelType) {
        if (this.panelStack == null) {
            this.panelStack = new Stack<BasePanel>();
        }
        //判断一下栈里面是否有页面
        if (this.panelStack.size_S() > 0) {
            var topPanel = this.panelStack.peek_S();
            topPanel.onPause();
        }
        //this.getPanel(panelType);
        var panel = this.existPanelDict.get_D(panelType);
        if (panel == null) {
            console.error("请先将面板添加到面板字典内")
        }
        this.panelStack.push_S(panel)
        panel.onEnter();
        console.log('弹出页面' + panelType);
    }

    /**
     * 清空面板栈
     */
    clearPanelStack() {
        if (this.panelStack.size_S() <= 0) {
            return;
        }
        while (this.panelStack.size_S() > 0) {
            var topPanel = this.panelStack.delete_S();
            topPanel.onExit();
        }
    }

    /**
     * 出栈,把面板从场景中移除
     */
    popPanel() {
        if (this.panelStack.size_S() <= 0) {
            return;
        }
        //关闭栈顶面板的显示
        var topPanel = this.panelStack.delete_S();
        topPanel.onExit();
        this.tempTopPanel = topPanel;
        if (this.panelStack.size_S() <= 0) {
            return;
        }
        var topPanel2 = this.panelStack.peek_S();
        topPanel2.onResume();

    }

    /**
    * 把的面板入栈, 显示在场景中
    */
    pushTempTopPanelPanel() {
        if (this.tempTopPanel == null) {
            return;
        }
        //判断一下栈里面是否有页面
        if (this.panelStack.size_S() > 0) {
            var topPanel = this.panelStack.peek_S();
            topPanel.onPause();
        }
        this.tempTopPanel.onEnter();
        this.panelStack.push_S(this.tempTopPanel)
        console.log('弹出页面' + this.tempTopPanel);
    }
    /**
    * 把UI面板添加到场景存在的面板字典内
    * @param panelType 
    */
    pushExistPanelDict(panelType: PanelType, panel: BasePanel) {
        this.existPanelDict.add_D(panelType, panel);
    }

    //检测指定类型面板是否是最上层面板
    checkIsTopPanel(panelType: PanelType) {
        if (this.panelStack.size_S() > 0) {
            var topPanel = this.panelStack.peek_S();
            var tar = this.existPanelDict.get_D(panelType);
            if (topPanel == tar) {
                return true;
            }
        }
        else {
            return false;
        }
    }



    /**
     *重置
     */
    resetPanelStack() {
        this.panelStack = null
        this.existPanelDict = new Dictionary<PanelType, BasePanel>()
    }

}
