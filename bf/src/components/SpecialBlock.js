import { Node, mergeAttributes } from '@tiptap/core';
import { Plugin, PluginKey } from 'prosemirror-state';
import { Decoration, DecorationSet } from 'prosemirror-view';

export const SpecialBlock = Node.create({
  name: 'specialBlock',
  group: 'inline',
  content: 'text*',
  inline: true,
  selectable: false,
  isolating: true,
  marks: '',

  addAttributes() {
    return {
      placeholder: {
        default: '请输入...',
        parseHTML: element => element.getAttribute('data-placeholder'),
        renderHTML: attributes => {
          if (attributes.placeholder) {
            return { 'data-placeholder': attributes.placeholder };
          }
          return {};
        },
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'span[data-type="special-block"]',
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      'span',
      mergeAttributes(HTMLAttributes, {
        'data-type': 'special-block',
        class: 'special-input-block',
      }),
      0, // Indicates where the content should be rendered
    ];
  },

  addCommands() {
    return {
      setSpecialBlock: (options) => ({ commands }) => {
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
      updateSpecialBlockPlaceholder: (placeholder) => ({ commands }) => {
        return commands.updateAttributes(this.name, { placeholder });
      },
    };
  },

  addKeyboardShortcuts() {
    return {
      'Backspace': () => {
        const { editor } = this;
        const { state, view } = editor;
        const { dispatch } = view;
        const { selection } = state;
        const { $from, from, empty } = selection;

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
        const { editor } = this;
        const { state, view } = editor;
        const { dispatch } = view;
        const { selection } = state;
        const { $to, to, empty } = selection;

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

  addProseMirrorPlugins() {
    const nodeName = this.name;
    const pluginKey = new PluginKey(`${nodeName}EmptyClassPlugin`);

    return [
      new Plugin({
        key: pluginKey,
        props: {
          decorations(state) {
            const decorations = [];
            const { doc } = state;

            doc.descendants((node, pos) => {
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

export default SpecialBlock;