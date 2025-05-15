import { Extension } from '@tiptap/core'

// 创建自定义键盘事件处理扩展
export const CustomKeyboardHandlers = Extension.create({
  name: 'customKeyboardHandlers',

    // 添加配置选项，接收事件回调函数
    addOptions() {
        return {
            onEnterPressed: () => {},
        }
    },
  
  addKeyboardShortcuts() {
    return {
      'Enter': ({ editor }) => {
        // 如果按下的是普通回车键，输出编辑器内容到控制台
        console.log('编辑器当前内容:', editor.getHTML());
         // 调用配置中的回调函数，传递编辑器内容
         this.options.onEnterPressed(editor.getHTML());
        return true; // 阻止默认的回车行为
      },
      'Shift-Enter': ({ editor }) => {
        // 如果按下的是 Shift+回车，执行换行
        return editor.commands.first(({ commands }) => [
          () => commands.newlineInCode(),
          () => commands.createParagraphNear(),
          () => commands.liftEmptyBlock(),
          () => commands.splitBlock(),
        ]);
      },
    };
  },
})