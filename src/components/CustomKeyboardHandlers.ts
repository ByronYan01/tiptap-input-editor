import { Extension } from '@tiptap/core';
import type { Editor, SingleCommands } from '@tiptap/core';

// 创建自定义键盘事件处理扩展
export const CustomKeyboardHandlers = Extension.create({
  name: 'customKeyboardHandlers',

    // 添加配置选项，接收事件回调函数
    addOptions(): { onEnterPressed: (content: string) => void } {
        return {
            onEnterPressed: (content: string) => {},
        }
    },
  
  addKeyboardShortcuts(): { [key: string]: ({ editor }: { editor: Editor }) => boolean } {
    return {
      'Enter': ({ editor }: { editor: Editor }) => {
        // 如果按下的是普通回车键，输出编辑器内容到控制台
        console.log('编辑器当前内容getHTML:', editor.getHTML());
        console.log('编辑器当前内容getJSON:', editor.getJSON());
        console.log('编辑器当前内容getJSON:', JSON.stringify(editor.getJSON()));
        console.log('编辑器当前内容getText:', editor.getText());
         // 调用配置中的回调函数，传递编辑器内容
         (this.options as any).onEnterPressed(editor.getHTML());
        return true; // 阻止默认的回车行为
      },
      'Shift-Enter': ({ editor }: { editor: Editor }) => {
        // 如果按下的是 Shift+回车，执行换行
        return editor.commands.first(({ commands }: { commands: SingleCommands }) => [
          () => commands.newlineInCode(),
          () => commands.createParagraphNear(),
          () => commands.liftEmptyBlock(),
          () => commands.splitBlock(),
        ]);
      },
    };
  },
})