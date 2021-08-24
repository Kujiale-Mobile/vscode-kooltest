import {
  TextDocument,
  Position,
  CancellationToken,
  ExtensionContext,
  Hover,
  languages,
} from "vscode";

const keywords: Array<{ reg: RegExp; tip: string }> = [
  {
    reg: /^debugger$/,
    tip: "开启调试模式，脚本运行到这会停止",
  },
  { reg: /^assert_exists$/, tip: "assert_exists <元素> 判断元素是否存在 \n assert_exists \"你好\"" },
  {
    reg: /^assert_not_exists$/,
    tip:
      "assert_not_exists <元素> 判断元素是否不存在，存在的话即会报错，终止用例 \n assert_not_exists \"你好\"",
  },
  {
    reg: /^assert\(_not\)\?_checked$/,
    tip: "判断复选框是否勾选上 一定需要为 input 结尾的 xpath",
  },
  { reg: /^assert_toast$/, tip: "assert_toast <文本> 判断toast提示是否存在" },
  { reg: /^assert_title_exists$/, tip: "判断元素是否存在，不存在则报错" },
  { reg: /^assert_text_equal$/, tip: "比较两段文本是否相同 \n assert_text_equal \"[文本]\" \"[文本]\" 文本可使用 ${key} 的方式。" },
  {
    reg: /^assert_screen_equal$/,
    tip: "后面一定需要跟一个 image:// 元素，判断当前屏幕截图是否和图片一致",
  },
  {
    reg: /^Background:$/,
    tip: "一个 Feature 中的 Scenario 可以提取出一些共性步骤放到 Background 中",
  },
  { reg: /^drag_and_drop$/, tip: "" },
  { reg: /^Examples:$/, tip: "用于定义变量" },
  { reg: /^Feature:$/, tip: "一系列的 Scenario 可以组成一个 Feature" },
  { reg: /^hover$/, tip: "仅网页端可用，悬浮在元素上" },
  {
    reg: /^execute_script$/,
    tip:
      "在浏览器中执行该脚本片段，可以通过在前面加 <key> = 的方式拿到返回值，不建议在 feature 中使用",
  },
  {
    reg: /^do_get$/,
    tip: "发送 GET 请求，可以通过在前面加 <key> = 的方式拿到返回值",
  },
  {
    reg: /^do_post$/,
    tip: "发送 POST 请求，可以通过在前面加 <key> = 的方式拿到返回值",
  },
  {
    reg: /^do_put$/,
    tip: "发送 PUT 请求，可以通过在前面加 <key> = 的方式拿到返回值",
  },
  {
    reg: /^do_delete$/,
    tip: "发送 DELETE 请求，可以通过在前面加 <key> = 的方式拿到返回值",
  },
  {
    reg: /^input$/,
    tip:
      'input <内容> to <元素/(ocr、image)> \n 向某个元素中输入文本。如  input "designtest1@qunhemail.com" to "邮箱账号/手机号"  即表示向 "邮箱账号/手机号" 的元素区域写入 "designtest1@qunhemail.com" \n Tips：\n 我们可以使用 EditText 的 Hint 来作为元素定位的文本。',
  },
  { reg: /^mouse\s+down$/, tip: "鼠标按下事件 \n * mouse down x y" },
  { reg: /^mouse\s+up$/, tip: "鼠标放开事件 \n * mouse up x y" },
  { reg: /^mouse\s+wheel$/, tip: "鼠标滚轮滚动事件 \n * mouse wheel x y deltaY" },
  { reg: /^mouse\s+move$/, tip: "鼠标移动事件 \n * mouse move x y" },
  { reg: /^key\s+up$/, tip: '键盘放开 \n * key up "按键"' },
  { reg: /^key\s+down$/, tip: '键盘按下 \n * key down "按键"' },
  { reg: /^keyboard$/, tip: "对当前 focus 的元素输入某个按键，具体见下方 keyboard 表，多个 key 可以用 空格隔开 \n keyboard \"A\" \"ENTER\" // 按 A 并按回车" },
  { reg: /^upload$/, tip: "上传" },
  { reg: /^open$/, tip: '打开一个网页 \n open "https://www.kujiale.com"' },
  { reg: /^macro$/, tip: "宏指令 \n * macro macro/登录 \"变量1\" \"变量2\"" },
  { reg: /^physical_mouse$/, tip: "" },
  { reg: /^physical_mouse_to$/, tip: "" },
  { reg: /^restart$/, tip: "重启应用，非卸载重装。" },
  {
    reg: /^Scenario:$/,
    tip: "一个最小维度的测试场景，每执行一个 Scenario，应用都会卸载重装",
  },
  {
    reg: /^swipe$/,
    tip:
      'swipe <startX> <startY> <endX> <endY> \n 表示从 start 点点击后，再滑动到 end 点处。如 swipe 0.5 0.5 0.5 0  即表示从屏幕中间位置垂直向上滑动。 \n swipe <元素/ocr> x y \n 这种方式是在先定位到元素，点击然后再进行相对的滑动。点击到 element 元素后，在进行上下左右的相对移动，负值表示向左和上。如 swipe "百科" -0.2 0  表示，先点击到百科后，再向左移动屏幕的 0.2 位置。 ',
  },
  { reg: /^screenshot$/, tip: "截图，会把截图放到测试报告中。" },
  { reg: /^scroll$/, tip: "滚动事件" },
  { reg: /^scroll_to$/, tip: "" },
  {
    reg: /^(\?)?(tap|click)$/,
    tip:
      "点击操作 \n 可以点击某个元素也可以点击位置信息",
  },
  {
    reg: /^check$/,
    tip:
      "针对 radio 和 checkbox 的操作",
  },
  {
    reg: /^wait$/,
    tip:
      "<n> 正整数 \n 等待多少秒，加上后，步骤结束后会停留对应时间 \n wait <n>s",
  },
  { reg: /^window$/, tip: "窗口操作" },
  {
    reg: /^<[\d\w_]+>$/,
    tip: "<> 括弧中的即为变量，可以在 Examples 中进行定义",
  },
  {
    reg: /^@noReset$/,
    tip:
      "有时候某些测试，你可能并不需要应用被重新安装，此时你需要在 Scenario 上方加一个 @noReset 标签。",
  },
  { reg: /^@showProcess$/, tip: "需要展示测试页面" },
  { reg: /^@viewport:$/, tip: "设置该用例所需的屏幕分辨率" },
  { reg: /^@after:$/, tip: "跟随一个 macro，脚本结束时执行" },
  { reg: /\${SYSTEM_TIMESTAMP}/, tip: "系统级变量 时间戳（毫秒级）" },
  { reg: /\${SYSTEM_YEAR}/, tip: "系统级变量 年" },
  { reg: /\${SYSTEM_MONTH}/, tip: "系统级变量 月" },
  { reg: /\${SYSTEM_DAY}/, tip: "系统级变量 日" },
  { reg: /\${SYSTEM_HOUR}/, tip: "系统级变量 时" },
  { reg: /\${SYSTEM_MINUTE}/, tip: "系统级变量 分" },
  { reg: /\${SYSTEM_SECOND}/, tip: "系统级变量 秒" },
  { reg: /^\"\"\"$/, tip: "js 函数命令" },
  {
    reg: /element:\/\//,
    tip: "元素定位方式，后面跟 elements 目录文件中定义的元素名",
  },
  {
    reg: /image:\/\//,
    tip: "元素定位方式，后面图片路径，相对于当前脚本的路径",
  },
  {
    reg: /ocr:\/\//,
    tip: "元素定位方式，后面跟文字内容，会提取图片中的文字后进行比较",
  },
];

const provideHover = (
  document: TextDocument,
  position: Position,
  token: CancellationToken
) => {
  const offset = document.offsetAt(position);
  const text = document.getText();
  const letterArray: Array<string> = [text[offset]];
  let left = offset - 1;
  let right = offset + 1;
  while (/^\S$/.test(text[left])) {
    letterArray.unshift(text[left]);
    left--;
  }
  while (/^\S$/.test(text[right])) {
    letterArray.push(text[right]);
    right++;
  }
  const keyword = letterArray.join("");
  let keyword2 = ' '
  if(keyword == 'mouse' || keyword == 'key') {
    right++
    while(/^\S$/.test(text[right])) {
      keyword2 += text[right]
      right++;
    }
  }
  let idx = -1;
  keywords.map((item, index) => {
    if (item.reg.test(keyword + keyword2) || item.reg.test(keyword)) {
      idx = index;
    }
  });
  if (idx < 0) {
    return new Hover("");
  }
  return new Hover(keywords[idx].tip);
};

export default function(context: ExtensionContext) {
  context.subscriptions.push(
    languages.registerHoverProvider(
      { scheme: "file", language: "gherkin" },
      {
        provideHover,
      }
    )
  );
}
