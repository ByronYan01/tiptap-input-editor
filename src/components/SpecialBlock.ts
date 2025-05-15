import { Node, mergeAttributes } from '@tiptap/core';
import type { RawCommands, Editor } from '@tiptap/core';
import { Plugin, PluginKey } from 'prosemirror-state';
import type { EditorState, Selection, Transaction } from 'prosemirror-state';
import { Decoration, DecorationSet } from 'prosemirror-view';
import type { EditorView } from 'prosemirror-view';
import type { Node as ProseMirrorNode } from 'prosemirror-model';

export const SpecialBlock = Node.create({
  name: 'specialBlock',
  group: 'inline',
  content: 'text*',
  inline: true,
  selectable: false,
  isolating: true,
  marks: '',

  addAttributes(): Record<string, any> {
    return {
      placeholder: {
        default: '请输入...',
        parseHTML: (element: HTMLElement) => element.getAttribute('data-placeholder'),
        renderHTML: (attributes: { placeholder?: string }) => {
          if (attributes.placeholder) {
            return { 'data-placeholder': attributes.placeholder };
          }
          return {};
        },
      },
    };
  },

  parseHTML(): any {
    return [
      {
        tag: 'span[data-type="special-block"]',
      },
    ];
  },

  renderHTML({ HTMLAttributes }: { HTMLAttributes: Record<string, any> }) {
    return [
      'span',
      mergeAttributes(HTMLAttributes, {
        'data-type': 'special-block',
        class: 'special-input-block',
      }),
      0, // Indicates where the content should be rendered
    ];
  },

  addCommands(): any {
    return {
      setSpecialBlock: (options?: { placeholder?: string; initialContent?: string }) => ({ commands }: { commands: RawCommands }) => {
        const { placeholder, initialContent } = options || {};
        const attrs = {};
        if (placeholder) {
          attrs.placeholder = placeholder;
        }
        const contentToInsert = initialContent ? [{ type: 'text', text: initialContent }] : [];
        return commands.insertContent({
          type: this.name,
          attrs: attrs,
          content: contentToInsert,
        });
      },
      updateSpecialBlockPlaceholder: (placeholder: string) => ({ commands }: { commands: RawCommands }) => {
        return commands.updateAttributes(this.name, { placeholder });
      },
    };
  },

  addKeyboardShortcuts(): any {
    return {
      'Backspace': () => {
        const { editor } = this as { editor: Editor };
        const { state, view }: { state: EditorState; view: EditorView } = editor;
        const { dispatch }: { dispatch: (tr: Transaction) => void } = view;
        const { selection }: { selection: Selection } = state;
        const { $from, from, empty } = selection as any; // Use 'as any' for now, or be more specific if NodeSelection/TextSelection is known

        if (!empty) return false;

        if ($from.parent.type.name !== this.name) {
          return false;
        }

        const parentNode = $from.parent;

        if (parentNode.content.size === 0 && $from.parentOffset === 0) {
          return true;
        }

        if (parentNode.textContent.length === 1 && $from.parentOffset === 1) {
          const tr = state.tr.deleteRange(from - 1, from);
          dispatch(tr);
          return true;
        }
        return false;
      },
      'Delete': () => {
        const { editor } = this as { editor: Editor };
        const { state, view }: { state: EditorState; view: EditorView } = editor;
        const { dispatch }: { dispatch: (tr: Transaction) => void } = view;
        const { selection }: { selection: Selection } = state;
        const { $to, to, empty } = selection as any; // Use 'as any' for now, or be more specific if NodeSelection/TextSelection is known

        if (!empty) return false;

        if ($to.parent.type.name !== this.name) {
          return false;
        }

        const parentNode = $to.parent;

        if (parentNode.content.size === 0 && $to.parentOffset === 0) {
          return true;
        }

        if (parentNode.textContent.length === 1 && $to.parentOffset === 0) {
          const tr = state.tr.deleteRange(to, to + 1);
          dispatch(tr);
          return true;
        }
        return false;
      },
    };
  },

  addProseMirrorPlugins(): Plugin[] {
    const nodeName = this.name;
    const pluginKey = new PluginKey(`${nodeName}EmptyClassPlugin`);

    return [
      new Plugin({
        key: pluginKey,
        props: {
          decorations(state: EditorState) {
            const decorations = [];
            const { doc } = state;

            doc.descendants((node: ProseMirrorNode, pos: number) => {
              if (node.type.name === nodeName) {
                if (node.content.size === 0) {
                  decorations.push(
                    Decoration.node(pos, pos + node.nodeSize, {
                      class: 'is-node-empty',
                    })
                  );
                }
              }
            });
            return DecorationSet.create(doc, decorations);
          },
        },
      }),
    ];
  }
});