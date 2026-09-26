import { Document } from '@tiptap/extension-document'
import { Italic } from '@tiptap/extension-italic'
import { Link } from '@tiptap/extension-link'
import { Paragraph } from '@tiptap/extension-paragraph'
import { Text } from '@tiptap/extension-text'
import { MarkdownManager } from '@tiptap/markdown'
import { describe, expect, it } from 'vite-plus/test'

describe('bare URLs and email addresses in text', () => {
  const markdown = new MarkdownManager({ extensions: [Document, Paragraph, Text, Italic, Link] })

  const paragraph = (text: string) => ({
    type: 'doc',
    content: [{ type: 'paragraph', content: [{ type: 'text', text }] }],
  })

  const textOf = (doc: any): string =>
    (doc.content?.[0]?.content ?? []).map((node: any) => node.text ?? '').join('')

  const hrefs = (doc: any): string[] =>
    (doc.content?.[0]?.content ?? []).flatMap((node: any) =>
      (node.marks ?? []).filter((m: any) => m.type === 'link').map((m: any) => m.attrs.href),
    )

  it.each([
    ['see https://example.com/my_page for details', 'https://example.com/my_page'],
    ['open www.example.com/foo_bar now', 'http://www.example.com/foo_bar'],
    ['read https://example.com/__init__.py first', 'https://example.com/__init__.py'],
    ['mail first_last@example.com today', 'mailto:first_last@example.com'],
  ])('does not add backslashes to %j', (text, href) => {
    const md = markdown.serialize(paragraph(text))
    const parsed = markdown.parse(md)

    expect(textOf(parsed)).toBe(text)
    expect(hrefs(parsed)).toEqual([href])
  })

  it('still escapes markdown characters around the URL', () => {
    const md = markdown.serialize(paragraph('*not italic* https://example.com/a_b my_var'))

    expect(md).toBe('\\*not italic\\* https://example.com/a_b my\\_var')
    expect(textOf(markdown.parse(md))).toBe('*not italic* https://example.com/a_b my_var')
  })

  it('still escapes URL-like text inside link text', () => {
    const md = markdown.serialize({
      type: 'doc',
      content: [
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'https://example.com/*a*',
              marks: [{ type: 'link', attrs: { href: 'https://example.com/*a*' } }],
            },
          ],
        },
      ],
    })

    expect(md).toBe('[https://example.com/\\*a\\*](https://example.com/*a*)')
  })
})
