<h1 align="center">kool-test-script</h1>

<p align="center">VsCode extension for Kooltest</p>

## 背景

[Kooltest](https://github.com/Kujiale-Mobile/KoolTest) 是酷家乐研发的一个支持多终端的 UI 自动化测试框架。为了给用户提供更优质的产品体验，在产品上线前需要进行各项测试。其中回归测试多由测试人员手动执行，耗费了大量人力，并且还可能存在漏测问题。鉴于此，我们在跨端的 UI 自动化上面做了大量的优化和思考，实现了 KoolTest 的 跨端 UI 自动化测试方案，用以降低人力成本。目前本框架支持使用一套脚本规范来测试 Android、iOS、Web。

## Start

kool-test-script 提供的核心能力有：

- **编码辅助**：基于 DSL 规范提供代码提示（自动补全、信息提示和定义跳转）、代码重构和代码片段等功能，覆盖场景多响应快准确率高，提升编码幸福感。
- **Debug辅助**：提供运行测试脚本的能力，动态生成测试报告。
- **录制行为**：在一些需要模拟鼠标操作/截图的场景，可以通过录制 Macro脚本的形式，记录下鼠标键盘的操作，自动生成具体的 DSL 代码。

VS Code 插件提供一些可以帮你更快开发脚本并且可以快速浏览，脚本运行的结果。

### 快速开始

1. 安装 java 环境 [https://docs.oracle.com/goldengate/1212/gg-winux/GDRAD/java.htm#BGBFJHAB](https://docs.oracle.com/goldengate/1212/gg-winux/GDRAD/java.htm#BGBFJHAB) 。
2. 点击 VS Code 活动栏上的「插件商店图标」搜索 kool-test-script 或者在 VsCode 市场下载 [Kooltest 插件](https://marketplace.visualstudio.com/items?itemName=kujiale.kool-test-script)。
3. 在 VsCode 创建一个 *.feature 文件，插件将自动为 feature 填充好模版。
4. 即可按照你所想编写你的 kooltest 脚本了。

### 自动补全

代码补全 (Code Completion) 提供即时类名、方法名和关键字等预测，辅助开发人员编写代码，大幅提升开发效率。

Kooltest 所使用的 DSL 语法是魔改自 Cucumber 提供 gherkin 语言，为了更好编写我们的 gherkin，我们需要对我们设计的关键字，方法名，文件路径等提供高亮和预测。

kool-test-script 增强了测试人员经常使用的 gherkin 及样式相关文件的代码补全体验。

![https://qhstaticssl.kujiale.com/newt/101463/image/gif/1629774893779/8756842DD142D5B1BA983872D17AD8B1.gif](https://qhstaticssl.kujiale.com/newt/101463/image/gif/1629774893779/8756842DD142D5B1BA983872D17AD8B1.gif)

### *.feature文件

脚本核心文件 feature 可以在编辑器里直接运行脚本

![Kapture 2021-08-19 at 12.20.35.gif](https://qhstaticssl.kujiale.com/newt/101463/image/gif/1629774888039/2E68D6A4699FD9054285E9B4D73327FB.gif)

自动填充模版

![https://qhstaticssl.kujiale.com/newt/103016/image/gif/1629773195621/7F450F9F39CAC3F5CF7B3288943218A4.gif](https://qhstaticssl.kujiale.com/newt/103016/image/gif/1629773195621/7F450F9F39CAC3F5CF7B3288943218A4.gif)

### *.macro 文件

对于提供脚本复用能力的宏指令文件，我们提供了辅助录制键盘鼠标行为的能力。

Command + 鼠标点击自动跳转到对应 macro 文件

![https://qhstaticssl.kujiale.com/newt/101463/image/gif/1629773942136/58DA810319ED7AA606D57F676E30A3C4.gif](https://qhstaticssl.kujiale.com/newt/101463/image/gif/1629773942136/58DA810319ED7AA606D57F676E30A3C4.gif)

录制鼠标键盘的能力

![https://qhstaticssl.kujiale.com/newt/101463/image/gif/1629774382141/880F3CE069ACD524CD8EF1394C585058.gif](https://qhstaticssl.kujiale.com/newt/101463/image/gif/1629774382141/880F3CE069ACD524CD8EF1394C585058.gif)

### 日志系统

运行脚本的时候，脚本会直接在 Terminal 上运行， 并记录如果脚本出错无法进行下去，代码会在哪个行为出错，定位到脚本具体的行为。

在结束进程之后，kooltest 脚本会自动生成对应日志文件。

![https://qhstaticssl.kujiale.com/newt/101463/image/gif/1629773568512/ECDA19578AB1F0DA8AA32157F2C93065.gif](https://qhstaticssl.kujiale.com/newt/101463/image/gif/1629773568512/ECDA19578AB1F0DA8AA32157F2C93065.gif)
