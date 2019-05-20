# VueCssTidy README

tidy css，它将帮助您在一个vue文件中识别无效的css文件，确保它包含了作用域标记。
它是智能和高效的，但也可以用于单独的HTML文件，包含太多可能会有错误的判断，
在最新的版本中，甚至可以恢复它来启用CSS
你可以试着使用它,祝你好运！


[传送门](https://marketplace.visualstudio.com/items?itemName=renran.VueCssTidy)

如何得到它:
    
![example](https://raw.githubusercontent.com/zhouyuantest/tidyCss/master/images/vscode.png)



使用演示:

![example](https://raw.githubusercontent.com/zhouyuantest/tidyCss/68f5e9e1af2a2c6e11d3dda36616dec6cdc24d9e/images/tidy.gif)



## 问题

欢迎您把问题提出来，我会尽力解决它的。

## Release Notes
删除脚本中的脚本干扰!
添加一个id的css支持!
添加右键菜单和快捷方式，


### 0.1.0
修正了匹配字符包含特殊字符的匹配问题。
修正了异常匹配终止问题。

### 0.08 
添加空css的支持!
example:
    .nihao{}

### 0.07
删除脚本中的脚本干扰!
example:
    <script> 
        .css{}
    </script>


### 0.0.6
添加一个id的css支持!

### 0.0.1

基本方法
添加右键菜单
快捷键
您可以使用[ctrl + shift + t]整理您的css。
