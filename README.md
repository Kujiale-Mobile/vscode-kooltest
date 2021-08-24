# 快速上手

## 环境准备

安装 java 环境

https://docs.oracle.com/goldengate/1212/gg-winux/GDRAD/java.htm#BGBFJHAB

安装 VSCode，并安装 kool-test-script 插件

https://code.visualstudio.com/

![](https://qhstaticssl.kujiale.com/newt/165/image/png/1620440762840/48F1331DE7F02091AC40A183B083DF95.png)

## 脚本书写

直接使用 VsCode 创建一个项目，增加一个 .feature 文件，比如

![](https://qhstaticssl.kujiale.com/newt/165/image/png/1622002840249/4AE5969D5EED7EFA47ADEB680012B7C8.png)

点击 **脚本回放**（首次运行因为要下载对应环境配置，所以会慢一些），则直接会运行该脚本，如果需要打断点调试，可以在某个步骤中插入 debugger 标签（注意 debugger 标签不要放在 Scenario 第一行，也不要放在 Background 中），再点击运行回放时，网页会停留在该断点处，此时你可以使用截图、脚本录制（只能在 .macro 中进行录制），或自行获取 selector。比如

```gherkin
Scenario: 酷家乐网页登录测试-登录错误
    * input "12345" to "输入密码"
    * tap "登录"
    debugger
    * assert_exists "账号密码不正确"
```

## 如何使用

### 点击运行

点击 Scenario 上的脚本回放, 即可本地运行脚本
![点击 Scenario 上的脚本回放, 即可本地运行脚本](https://qhstaticssl.kujiale.com/newt/101463/image/gif/1629354969058/BB28C2760BCC721930E6DA4D7228B0EB.gif)

**OK，以上就是所有你需要掌握的啦～，恭喜！**
