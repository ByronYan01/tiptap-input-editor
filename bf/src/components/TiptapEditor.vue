<template>
  <editor-content :editor="editor" />
</template>

<script setup>
import { useEditor, EditorContent } from '@tiptap/vue-3'
import { watch } from 'vue'
// import StarterKit from '@tiptap/starter-kit'
import Document from '@tiptap/extension-document'
import Paragraph from '@tiptap/extension-paragraph'
import Text from '@tiptap/extension-text'
import Placeholder from '@tiptap/extension-placeholder'
import SpecialBlock from './SpecialBlock.js' // Ensure this path is correct
import { CustomKeyboardHandlers } from './CustomKeyboardHandlers.js' 

const props = defineProps({
  modelValue: {
    type: String,
    default: '',
  },
  placeholder: { // This is the global editor placeholder
    type: String,
    default: '请输入内容...'
  }
})

const emit = defineEmits(['update:modelValue', 'enterPressed'])

const editor = useEditor({
  content: props.modelValue,
  extensions: [
    // StarterKit,
    Document,
    Paragraph,
    Text,
    Placeholder.configure({
      // placeholder: ({ node }) => {
      //   // Check for SpecialBlock first
      //   if (node.type.name === 'specialBlock') {
      //     // If it's a SpecialBlock, return its own 'placeholder' attribute.
      //     // The Placeholder extension will then apply 'is-node-empty' if the node is truly empty.
      //     // The actual text display is handled by your CSS using attr(data-placeholder).
      //     return node.attrs.placeholder;
      //   }
      //   // Original logic for paragraph placeholders
      //   if (node.type.name === 'paragraph' && node.content.size === 0) {
      //     return props.placeholder;
      //   }
      //   // For any other node type, no placeholder via this global config
      //   return null;
      // },
      placeholder: props.placeholder,
      emptyEditorClass: 'is-editor-empty', // For the whole editor
      emptyNodeClass: 'is-node-empty', // For individual nodes (like our SpecialBlock)
    }),
    SpecialBlock, // SpecialBlock is added directly
    CustomKeyboardHandlers.configure({
      onEnterPressed: (content) => {
        emit('enterPressed', content);
      }
    }), // 使用自定义键盘事件处理扩展
  ],
  onUpdate: ({ editor }) => {
    emit('update:modelValue', editor.getHTML())
  },
})

watch(() => props.modelValue, (newValue) => {
  if (editor.value && editor.value.getHTML() !== newValue) {
    editor.value.commands.setContent(newValue, false)
  }
})

defineExpose({
  editor,
});

</script>

<style>
/* Global editor placeholder for the main editor area */
.tiptap p.is-editor-empty:first-child::before {
  content: attr(data-placeholder);
  color: #adb5bd;
  float: left;
  height: 0;
  pointer-events: none;
}

/* Styling for the custom SpecialBlock node to look like an input */
.tiptap .special-input-block {
  display: inline-block; /* Or inline, depending on desired interaction with surrounding text */
  padding: 6px 8px;
  background-color: #EBF2FF;
border-radius: 6px;
  /* border: 1px solid #ccc; */
  /* border-radius: 4px; */
  /* background-color: #fff; */
  margin: 0 5px;
  cursor: text; /* Show text cursor */
font-weight: 600;
font-size: 14px;
color: #1C6AF6;
line-height: 16px;
}
 /* Style when the block or its content has focus */
/* .tiptap .special-input-block:focus-within {
  border-color: #86b7fe;
  outline: none;
  box-shadow: 0 0 0 0.2rem rgba(13, 110, 253, 0.25);
} */

/* Placeholder for the SpecialBlock */
/* The 'is-node-empty' class is added by Tiptap's Placeholder extension */
/* The 'data-placeholder' attribute comes from SpecialBlock's renderHTML/attributes */
.tiptap .special-input-block.is-node-empty::before {
  content: attr(data-placeholder);
  color: #1C6AF6;
  opacity: 0.5;
  pointer-events: none; /* Allow clicking through to the input area */
  display: inline-block; /* Or adjust as needed */
  /* You might need to adjust positioning or padding if it overlaps with border */
}


/* General editor styling */
.tiptap {
  border: 1px solid #ced4da;
  padding: 0.5rem;
  border-radius: 4px;
  min-height: 100px;
  font-size: 14px;
}
.tiptap p {
  margin: 0;
}

.tiptap:focus {
  outline: none;
  /* border-color: #86b7fe; */ /* Covered by focus-within on block or main editor */
  /* box-shadow: 0 0 0 0.25rem rgba(13, 110, 253, 0.25); */
}
</style>
