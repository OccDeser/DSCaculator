from tkinter import *
from tkinter import ttk
import DysonSphereCaculator as DSC

LOG_LINE_NUM = 0


class DSC_GUI():
    def __init__(self, init_window_name):
        self.init_window_name = init_window_name
        self.dsc = DSC.DSCaculator('./config')

    def set_init_window(self):
        self.init_window_name.title("戴森球计划计算器_v0.1")
        self.init_window_name.geometry('518x726+10+10')
        # 标签
        self.init_data_label = Label(self.init_window_name, text="选择产物")
        self.init_data_label.grid(row=0, column=0)
        # 下拉框
        productVar = StringVar()
        productValue = (
            "电磁矩阵",
            "能量矩阵",
            "结构矩阵",
            "信息矩阵",
            "引力矩阵",
            "宇宙矩阵",
            "电弧熔炉",

            "铁块",
            "铜块",
            "高纯硅块",
            "钛块",
            "石材",
            "高能石墨",
            "磁铁",
            "钢材",
            "晶格硅",
            "钛合金",
            "玻璃",
            "金刚石",
            "磁线圈",
            "液氢燃料棒",
            "氘核燃料棒",
            "反物质燃料棒",
            "电动机",
            "钛化玻璃",
            "棱镜",
            "有机晶体",
            "钛晶石",
            "推进器",
            "加力推进器",
            "齿轮",
            "电磁涡轮",
            "电路板",
            "引力透镜",
            "位面过滤器",
            "物流运输机",
            "星际物流运输船",
            "小型运载火箭",
            "电浆激发器",
            "超级磁场环",
            "粒子宽带",
            "处理器",
            "卡西米尔晶体",
            "粒子容器",
            "空间翘曲器",
            "湮灭约束球",
            "太阳帆",
            "框架材料",
            "戴森球组件",
            "光子合并器",
            "微晶原件",
            "量子芯片",
            "空间翘曲器",
            "地基",
            "塑料",
            "有机晶体",
            "石墨烯",
            "碳纳米管",
            "奇异物质",
            "精炼油",

            "化工厂",
            "粒子对撞机",
            "原油精炼厂",
            "制造台",
            "矩阵研究站",
            "矿机")
        self.product_ComboBox = ttk.Combobox(
            self.init_window_name, textvariable=productVar, value=productValue)
        self.product_ComboBox.grid(row=1, column=0, rowspan=1, columnspan=5)

        # 按钮
        self.str_trans_to_md5_button = Button(
            self.init_window_name, text="计算", bg="lightblue", width=10, command=self.caculateProduct)  # 调用内部方法  加()为直接调用
        self.str_trans_to_md5_button.grid(row=1, column=6)

        # 标签
        self.result_data_label = Label(self.init_window_name, text="输出结果")
        self.result_data_label.grid(row=2, column=0)
        # 文本框
        self.result_data_Text = Text(
            self.init_window_name, width=70, height=49)  # 处理结果展示
        self.result_data_Text.grid(
            row=3, column=0, rowspan=15, columnspan=10, padx=10)

    # 功能函数
    def caculateProduct(self):
        product = self.product_ComboBox.get()
        self.result_data_Text.delete(1.0, END)
        if product:
            try:
                result = self.dsc.caculate(product)
                resultTree = result.formatTree(prelist=[])
                self.dsc.clear()
                self.dsc.countMachines(result)
                statisData = self.dsc.formatStatis()
                resultData = resultTree + '\n' + statisData
                self.result_data_Text.insert(1.0, resultData)
                print(resultData)
            except:
                self.result_data_Text.insert(1.0, "产物计算失败")
        else:
            self.result_data_Text.insert(1.0, "产物计算失败")


if __name__ == '__main__':

    init_window = Tk()  # 实例化出一个父窗口
    ZMJ_PORTAL = DSC_GUI(init_window)
    # 设置根窗口默认属性
    ZMJ_PORTAL.set_init_window()

    init_window.mainloop()  # 父窗口进入事件循环，可以理解为保持窗口运行，否则界面不展示
