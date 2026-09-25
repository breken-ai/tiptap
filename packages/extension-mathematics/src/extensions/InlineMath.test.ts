import { Editor } from '@tiptap/core'
import Document from '@tiptap/extension-document'
import Paragraph from '@tiptap/extension-paragraph'
import Text from '@tiptap/extension-text'
import { MarkdownManager } from '@tiptap/markdown'
import { afterEach, describe, expect, it } from 'vite-plus/test'

import { InlineMath } from './InlineMath.js'

describe('InlineMath', () => {
  let editor: Editor

  afterEach(() => {
    editor?.destroy()
  })

  it('preserves previous character to input rule match', () => {
    editor = new Editor({
      extensions: [Document, Paragraph, Text, InlineMath],
      content: {
        type: 'doc',
        content: [
          {
            type: 'paragraph',
            content: [{ type: 'text', text: 'Hello $$x$' }],
          },
        ],
      },
    })

    editor.commands.setTextSelection(editor.state.doc.nodeSize)

    editor.view.someProp('handleTextInput', f =>
      f(editor.view, editor.state.selection.from, editor.state.selection.from, '$'),
    )

    expect(editor.getJSON()).toEqual({
      type: 'doc',
      content: [
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              // Ensure previous character is preserved (e.g., space)
              text: 'Hello ',
            },
            {
              type: 'inlineMath',
              attrs: { latex: 'x' },
            },
          ],
        },
      ],
    })
  })

  it('ensure unmatched triple $ expressions', () => {
    editor = new Editor({
      extensions: [Document, Paragraph, Text, InlineMath],
      content: {
        type: 'doc',
        content: [
          {
            type: 'paragraph',
            content: [{ type: 'text', text: 'Hello $$$x$' }],
          },
        ],
      },
    })

    editor.commands.setTextSelection(editor.state.doc.nodeSize)

    const handled = editor.view.someProp('handleTextInput', f =>
      f(editor.view, editor.state.selection.from, editor.state.selection.from, '$'),
    )

    // Expect no input rule to match
    expect(handled).toBeFalsy()
  })

  it('does not parse two dollar amounts in markdown as inline math', () => {
    const markdownManager = new MarkdownManager({
      extensions: [Document, Paragraph, Text, InlineMath],
    })

    const doc = markdownManager.parse('It costs $5 and $10 today')

    expect(doc.content).toEqual([
      { type: 'paragraph', content: [{ type: 'text', text: 'It costs $5 and $10 today' }] },
    ])
  })

  it('still parses inline math in markdown next to a dollar amount', () => {
    const markdownManager = new MarkdownManager({
      extensions: [Document, Paragraph, Text, InlineMath],
    })

    const doc = markdownManager.parse('Pay $5 for $x^2$')

    expect(doc.content).toEqual([
      {
        type: 'paragraph',
        content: [
          { type: 'text', text: 'Pay $5 for ' },
          { type: 'inlineMath', attrs: { latex: 'x^2' } },
        ],
      },
    ])
  })
})
