import { Bold } from '@tiptap/extension-bold'
import { Document } from '@tiptap/extension-document'
import { HardBreak } from '@tiptap/extension-hard-break'
import { Heading } from '@tiptap/extension-heading'
import { Paragraph } from '@tiptap/extension-paragraph'
import { Text } from '@tiptap/extension-text'
import { MarkdownManager } from '@tiptap/markdown'
import { describe, expect, it } from 'vite-plus/test'

describe('heading with a hard break', () => {
  const markdown = new MarkdownManager({
    extensions: [Document, Paragraph, Text, Heading, HardBreak, Bold],
  })

  const doc = {
    type: 'doc',
    content: [
      {
        type: 'heading',
        attrs: { level: 2 },
        content: [
          { type: 'text', text: 'Quarterly report' },
          { type: 'hardBreak' },
          { type: 'text', text: 'Q3', marks: [{ type: 'bold' }] },
        ],
      },
      { type: 'paragraph', content: [{ type: 'text', text: 'Body' }] },
    ],
  }

  it('keeps the whole heading on one Markdown line', () => {
    expect(markdown.serialize(doc)).toBe('## Quarterly report<br>**Q3**\n\nBody')
  })

  it('reads the heading back with its hard break', () => {
    const parsed = markdown.parse(markdown.serialize(doc))

    expect(parsed.content).toHaveLength(2)
    expect(parsed.content?.[0].type).toBe('heading')
    expect(parsed.content?.[0].content?.map(node => node.type)).toEqual([
      'text',
      'hardBreak',
      'text',
    ])
    expect(parsed.content?.[0].content?.[2].text).toBe('Q3')
    expect(parsed.content?.[1].type).toBe('paragraph')
  })

  it('leaves a heading without hard breaks unchanged', () => {
    expect(
      markdown.serialize({
        type: 'doc',
        content: [
          { type: 'heading', attrs: { level: 1 }, content: [{ type: 'text', text: 'Title' }] },
        ],
      }),
    ).toBe('# Title')
  })
})
