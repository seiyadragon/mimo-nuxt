<script lang="ts" setup>
    import { useEditor, EditorContent, FloatingMenu, BubbleMenu, JSONContent } from '@tiptap/vue-3'
    import StarterKit from '@tiptap/starter-kit'
    import Highlight from '@tiptap/extension-highlight';
    import Underline from '@tiptap/extension-underline';
    import TextStyle from '@tiptap/extension-text-style';
    import Color from '@tiptap/extension-color';
    import Placeholder from '@tiptap/extension-placeholder';
    import Typography from '@tiptap/extension-typography';
    import FontFamily from '@tiptap/extension-font-family';
    import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
    import Subscript from '@tiptap/extension-subscript';
    import Superscript from '@tiptap/extension-superscript';
    import TaskList from '@tiptap/extension-task-list';
    import TaskItem from '@tiptap/extension-task-item';
    import Link from '@tiptap/extension-link';
    import Image from '@tiptap/extension-image';
    import GapCursor from '@tiptap/extension-gapcursor';
    import Dropcursor from '@tiptap/extension-dropcursor';
    import TextAlign from '@tiptap/extension-text-align';
    import Table from '@tiptap/extension-table';
    import TableRow from '@tiptap/extension-table-row'
    import TableHeader from '@tiptap/extension-table-header'
    import TableCell from '@tiptap/extension-table-cell'
    import Youtube from '@tiptap/extension-youtube';
    import HardBreak from '@tiptap/extension-hard-break';
    import Details from '@tiptap-pro/extension-details';
    import DetailsSummary from '@tiptap-pro/extension-details-summary';
    import DetailsContent from '@tiptap-pro/extension-details-content';
    import Emoji, { gitHubEmojis } from '@tiptap-pro/extension-emoji'

    import {lowlight} from 'lowlight';
    import css from 'highlight.js/lib/languages/css'
    import js from 'highlight.js/lib/languages/javascript'
    import ts from 'highlight.js/lib/languages/typescript'
    import html from 'highlight.js/lib/languages/xml'
    import json from 'highlight.js/lib/languages/json'
    import python from 'highlight.js/lib/languages/python'
    import java from 'highlight.js/lib/languages/java'
    import cpp from 'highlight.js/lib/languages/cpp'
    import csharp from 'highlight.js/lib/languages/csharp'
    import php from 'highlight.js/lib/languages/php'
    import ruby from 'highlight.js/lib/languages/ruby'
    import go from 'highlight.js/lib/languages/go'
    import kotlin from 'highlight.js/lib/languages/kotlin'
    import swift from 'highlight.js/lib/languages/swift'
    import rust from 'highlight.js/lib/languages/rust'
    import sql from 'highlight.js/lib/languages/sql'
    import bash from 'highlight.js/lib/languages/bash'
    import dart from 'highlight.js/lib/languages/dart'
    import yaml from 'highlight.js/lib/languages/yaml'
    
    lowlight.registerLanguage('css', css)
    lowlight.registerLanguage('js', js)
    lowlight.registerLanguage('ts', ts)
    lowlight.registerLanguage('html', html)
    lowlight.registerLanguage('json', json)
    lowlight.registerLanguage('python', python)
    lowlight.registerLanguage('java', java)
    lowlight.registerLanguage('cpp', cpp)
    lowlight.registerLanguage('csharp', csharp)
    lowlight.registerLanguage('php', php)
    lowlight.registerLanguage('ruby', ruby)
    lowlight.registerLanguage('go', go)
    lowlight.registerLanguage('kotlin', kotlin)
    lowlight.registerLanguage('swift', swift)
    lowlight.registerLanguage('rust', rust)
    lowlight.registerLanguage('sql', sql)
    lowlight.registerLanguage('bash', bash)
    lowlight.registerLanguage('dart', dart)
    lowlight.registerLanguage('yaml', yaml)
    
    let editorLineNumber = ref(0)

    const props = defineProps({
        content: {
            type: String,
            default: ''
        },
        placeholder: {
            type: String,
            default: 'Start typing...'
        },
        aiEnabled: {
            type: Boolean,
            default: false
        },
        contentAnimated: {
            type: Boolean,
            default: false
        },
        editable: {
            type: Boolean,
            default: true
        },
        floatingMenu: {
            type: Boolean,
            default: true
        },
    })

    const emit = defineEmits(['update:content', 'editorCallback'])

    watch(() => props.content, (newVal, oldVal) => {
        if (props.contentAnimated && newVal !== oldVal) {
            editor.value?.chain().focus().setContent(newVal).run()
        }
    })

    watch(() => props.editable, (newVal, oldVal) => {
        if (editor.value) {
            editor.value.setEditable(newVal)
        }
    })

    const editor = useEditor({
        content: props.content,
        extensions: [
            StarterKit, Highlight, Underline, 
            TextStyle, Color, Placeholder.configure({
              placeholder: props.placeholder,
            }), 
            Typography, FontFamily, CodeBlockLowlight.configure({
              lowlight,
            }),
            Subscript, Superscript, TaskList, TaskItem, Link.configure({
                HTMLAttributes: {
                    // Change rel to different value
                    // Allow search engines to follow links(remove nofollow)
                    rel: 'noopener noreferrer',
                    // Remove target entirely so links open in current tab
                    class: 'editorLinkSelector',
                },
            }), Image,
            GapCursor, Dropcursor, TextAlign.configure({
              types: ['heading', 'paragraph', 'textStyle', 'link'],
            }), Table.configure({
                resizable: true,
                allowTableNodeSelection: true,
            }), TableCell, TableRow, TableHeader, Youtube,
            HardBreak,
        ],
        editorProps: {
            attributes: {
              class: `tiptap`,
            },
        },
    })

    useHead({
        link: [
            {
                rel: "stylesheet",
                href: "/code-highlighting.css"
            }
        ]
    })

    onMounted(() => {
        console.log(Details)

        if (editor.value) {
            editor.value.on('update', () => {
                emit('update:content', editor.value?.getHTML())

                if (editor.value) {
                    let textLines = editor.value.getText().split('\n\n');

                    if (textLines.length > editorLineNumber.value) {
                        if (editorLineNumber.value <= 0) {
                            newLineAdded(textLines[editorLineNumber.value])
                        } else {
                            newLineAdded(textLines[editorLineNumber.value - 1])
                        }
                    
                        editorLineNumber.value = textLines.length;
                    }
                }

                fixLinks()
            })

            editor.value.chain().focus().setFontFamily('Roboto').insertContent("nut").clearContent().run()
            if (props.content) {
                editor.value.chain().focus().setContent(props.content).run()
            }

            emit('editorCallback', editor.value)

            setTimeout(() => {
                let grammarly = document.getElementsByClassName('dnXmp')
                console.log(grammarly)
    
                if (grammarly) {
                    for (let element of grammarly) {
                        (element as HTMLElement).style.zIndex = '999'
                    }
                }
    
                grammarly = document.getElementsByClassName('dnXmp')
                console.log(grammarly)
            }, 1000)

            editor.value.setEditable(props.editable)

            setTimeout(() => {
                fixLinks()
            }, 250)
        }
    })

    const newLineAdded = async (line: string) => {
        //let content = editor.value?.getJSON() as JSONContent
        //editor.value?.chain().focus().clearContent().insertContent('nut').selectAll().unsetColor().clearContent().setContent(content).run()
    }

    const fixLinks = () => {
        console.log("fixing links")

        let editorLinks = document.getElementsByClassName('editorLinkSelector')
        for (let link of editorLinks) {
            let anchor = link as HTMLAnchorElement      

            if (
                anchor.href.startsWith('https://mimo-eight.vercel.app') ||
                anchor.href.startsWith('http://localhost:3000') ||
                anchor.href.startsWith('https://mimowrite.blog') ||
                anchor.href.startsWith('https://www.mimowrite.blog')
            ) {
                console.log("inside link")
                //make the link open in the same tab
                anchor.target = '_self'
            } else {
                console.log("outside link")
                //make the link open in a new tab
                anchor.target = '_blank'
            }
                
            if (anchor.title !== anchor.href)
                anchor.title = anchor.href
            
        }
    }
</script>

<template>
    <floating-menu :editor="editor" v-if="editor && floatingMenu">
        <MimoFloatingMenu :editor="editor" textColor="black" :aiEnabled="aiEnabled"/>
    </floating-menu>
    <bubble-menu :editor="editor" v-if="editor && floatingMenu">
        <MimoFloatingMenu :editor="editor" textColor="black" :aiEnabled="aiEnabled"/>
    </bubble-menu>
    <editor-content :editor="editor" contenteditable="false"/>
</template>

<style lang="sass">
    .tiptap
        &:focus
            border-color: #aaa
            outline: none

    .tiptap *
        margin: 0

    .tiptap blockquote
        border-left: 4px solid green
        padding-left: 32px
        border-radius: 4px
        padding-top: 16px
        padding-bottom: 16px
  
    .tiptap pre, .tiptap code
        background-color: #333
        border-radius: 4px
        font-family: 'Roboto Mono'
        font-size: 0.85em
        color: #fff

    .tiptap pre
        padding: 16px

    .tiptap p code, .tiptap span code
        padding: 2px

    .aiResponseLoading
        display: flex
        width: 100%
        justify-content: center
        align-items: center
        position: sticky
        top: 25vh

    .tiptap p.is-empty::before
        color: #adb5bd
        content: attr(data-placeholder)
        float: left
        height: 0
        pointer-events: none

    .tiptap ul[data-type="taskList"], .tiptap ul[data-type="orderedList"], .tiptap ul[data-type="bulletList"]
        list-style: none
        padding: 0

        p 
          margin: 0

        li
          display: flex

          label 
            flex: 0 0 auto
            margin-right: 0.5rem
            user-select: none

          div 
            flex: 1 1 auto

    .tiptap a
        color: #007bff
        text-decoration: underline
    
    .tiptap img
        max-width: 100%
        object-fit: contain
        color: #000

    .tiptap iframe
        width: 100%
        border: none

    .tiptap .ProseMirror-gapcursor:after
        border-top: 1px solid #000

    .darkmode--activated .tiptap .ProseMirror-gapcursor:after
        border-top: 1px solid #fff

    .tiptap .details
        display: flex
        margin: 1rem 0
        border: 1px solid black
        border-radius: 0.5rem
        padding: 0.5rem

        > button
            display: flex
            cursor: pointer
            background: transparent
            border: none
            padding: 0

            &::before
                content: '\25B6'
                display: flex
                justify-content: center
                align-items: center
                width: 1.5em
                height: 1.5em

        &.is-open > button::before
            content: '\25BC'

            > div
                flex: 1 1 auto

    .darkmode--activated .tiptap .details
        border: 1px solid white
  
</style>

<style lang="scss">
.ProseMirror {
  table {
    border-collapse: collapse;
    table-layout: fixed;
    width: 100%;
    margin: 0;
    overflow: hidden;

    td,
    th {
      min-width: 1em;
      border: 2px solid #ced4da;
      vertical-align: top;
      box-sizing: border-box;
      position: relative;
      overflow: hidden;
      height: fit-content;

      > * {
        margin-bottom: 0;
      }
    }

    th {
      font-weight: bold;
      text-align: left;
      background-color: #f1f3f5;
    }

    .darkmode--activated & {
      th {
        background-color: #212529;
      }
    }

    .selectedCell:after {
      z-index: 2;
      position: absolute;
      content: "";
      left: 0; right: 0; top: 0; bottom: 0;
      background: rgba(200, 200, 255, 0.4);
      pointer-events: none;
    }

    .column-resize-handle {
      position: absolute;
      right: -2px;
      top: 0;
      bottom: -2px;
      width: 4px;
      background-color: #adf;
      pointer-events: none;
    }

    p {
      margin: 0;
    }
  }
}

.tableWrapper {
  padding: 1rem 0;
  overflow-x: hidden;
}

.resize-cursor {
  cursor: ew-resize;
  cursor: col-resize;
}
</style>
  