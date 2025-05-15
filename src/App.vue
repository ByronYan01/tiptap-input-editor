<script setup lang="ts">
import { ref } from 'vue'
import TiptapEditor from './components/TiptapEditor.vue'

// Ref to access the TiptapEditor component instance and its exposed editor
const tiptapEditorRef = ref(null)

// // Initial content using the new specialBlock node structure.
// const editorContent = ref('111111'
// );
const editorContent = ref(
  '<p>这是一段普通文本，后面跟着一个<span data-type="special-block">初始内容A</span>还有普通文本。</p>' 
);
const customPlaceholder = ref('在这里输入你的想法...')

// 处理回车键事件
const handleEnterPressed = (content) => {
  console.log('App 组件接收到回车事件，当前编辑器内容:', content);
}


const addSpecialBlock = () => {
  const editor = tiptapEditorRef.value?.editor;
  if (editor) {
    editor.chain().focus().setSpecialBlock({
      initialContent: '默认值' // placeholder 将使用 SpecialBlock.js 中定义的默认值
    }).run();
  }
}

const removeAllSpecialBlocks = () => {
  const editor = tiptapEditorRef.value?.editor;
  if (editor) {
    // This is a more complex operation. A simple way is to get the content,
    // remove the nodes via string manipulation (not ideal), and set it back.
    // A better Tiptap way would be to iterate through nodes and remove them by range.
    
    // For now, let's do a simpler (but less robust for complex content) string replace
    // to demonstrate the concept. In a real app, a more robust solution is needed.
    let currentHtml = editor.getHTML();
    // This regex is basic and might need refinement for complex cases
    const cleanedHtml = currentHtml.replace(/<span data-type="special-block".*?>.*?<\/span>/g, '');
    editor.commands.setContent(cleanedHtml, true); // true to parse the HTML

    // A more Tiptap-native approach (conceptual):
    // const { state, dispatch } = editor.view;
    // const { tr } = state;
    // state.doc.descendants((node, pos) => {
    //   if (node.type.name === 'specialBlock') {
    //     tr.delete(pos, pos + node.nodeSize);
    //   }
    // });
    // if (tr.docChanged) {
    //   dispatch(tr);
    // }
  }
}

</script>

<template>
  <div class="app-container">
    <h1>Tiptap 自定义节点输入框</h1>
    
    <div class="editor-wrapper">
      <TiptapEditor 
        ref="tiptapEditorRef" 
        v-model="editorContent" 
        :placeholder="customPlaceholder"
        @enterPressed="handleEnterPressed" 
      />
    </div>

    <div class="controls">
      <button @click="addSpecialBlock">添加特殊块</button>
      <button @click="removeAllSpecialBlocks">移除所有特殊块</button>
    </div>

    <div class="output">
      <h2>编辑器内容 (HTML):</h2>
      <pre>{{ editorContent }}</pre>
    </div>
  </div>
</template>

<style scoped>
.app-container {
  max-width: 800px;
  margin: 20px auto;
  padding: 20px;
  font-family: sans-serif;
}

.editor-wrapper {
  border: 1px solid #ccc;
  border-radius: 4px;
  padding: 10px;
  margin-bottom: 20px;
}

.editor-wrapper :deep(.tiptap) {
  min-height: 150px;
}

.editor-wrapper :deep(.tiptap:focus) {
  outline: none;
}

.controls button {
  margin-right: 10px;
  padding: 8px 15px;
  border: 1px solid #007bff;
  background-color: #007bff;
  color: white;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.controls button:hover {
  background-color: #0056b3;
}

.output {
  margin-top: 30px;
  background-color: #f8f9fa;
  padding: 15px;
  border-radius: 4px;
  border: 1px solid #e9ecef;
}

.output pre {
  white-space: pre-wrap;
  word-wrap: break-word;
  font-family: monospace;
  background: #eee;
  padding: 10px;
  border-radius: 4px;
}
</style>
