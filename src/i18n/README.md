国际化说明
=
### 1. 定义key
key是每个翻译的唯一标识，vue会根据key和当前语言渲染对应的语言文字。  
为了保证key的唯一性和可读性，定义时将按照页面（组件）、[标签类型]、标签描述的顺序，并用下划线间隔。  
例如：   
 
```
login_btn_confirm
```
login为页面，btn是按钮，表示标签类型，confirm表示描述，该按钮是确定按钮。

### 2. 添加翻译
key定义完成之后，将其填入当前目录下的translations.xlsx文件中的keys列，并填写对应的翻译。  

| Keys  | EN  | ZH  |
|:----------|:----------|:----------|
| login_title   | Delaware SRM    | 德莱维SRM   |
| login_subtitle   | Login with account   | 账号登录   |
| login_auto_login    | Login automatically| 自动登录    |
| login_btn_confirm   | Confirm  | 确定   |
| login_company   | Delaware    | 德莱维   |

如果需要增加新的语种，直接添加一列即可，首行为标题。

### 3. 使用
编辑表格之后，在根目录下执行命令，脚本会自动处理国际化文件。
```
yarn lang
```
在vue代码中，用$t调用翻译
```
<a-tab-pane key="tab1" :tab="$t('login_subtitle')">
	...
</a-tab-pane>

<a-button>{{ $t('login_btn_confirm') }}</a-button>

```

