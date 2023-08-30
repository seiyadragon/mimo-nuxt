<script lang="ts" setup>
    import { Editor } from '@tiptap/vue-3';
    import { createWorker } from 'tesseract.js'

    let props = defineProps({
        editor: {
            type: Object as PropType<Editor>,
            required: true
        },
        textColor: {
            type: String,
            default: "black"
        },
        aiEnabled: {
            type: Boolean,
            default: false
        }
    })

    let floatingMenuSelectType = ref("7")
    let floatingMenuFont = ref("Roboto")
    let urlSectionOpen = ref(false)
    let urlSectionUrl = ref("")
    let imageSectionOpen = ref(false)
    let youtubeSectionOpen = ref(false)
    let aiSectionOpen = ref(false)
    let aiPromptLoading = ref(false)
    let imageTextSectionOpen = ref(false)
    let inputRef = ref<HTMLInputElement | null>(null)

    const fonts = [
        "Montserrat",
        "Poiret One",
        "Roboto",
        "Roboto Mono",
        "Open Sans"
    ]

    onMounted(() => {
        props.editor.on('selectionUpdate', () => {
            updateDisplayedHeadingLevel()
        })

        toggleTextAlign("left")
    })

    const setHeading = (level: string) => {
        if (level === "7") {
            setParagraph()
            return
        }

        props.editor.chain().focus().setHeading({ level: parseInt(level) as any }).run();
    }

    const setParagraph = () => {
        props.editor.chain().focus().setParagraph().run();
    };

    const toggleBlockquote = () => {
        props.editor.chain().focus().toggleBlockquote().run();
    };

    const toggleCodeBlock = () => {
        props.editor.chain().focus().toggleCodeBlock().run();
    };

    const toggleBold = () => {
        props.editor.chain().focus().toggleBold().run();
    };

    const toggleItalic = () => {
        props.editor.chain().focus().toggleItalic().run();
    };

    const toggleHighlight = () => {
        props.editor.chain().focus().toggleHighlight().run();
    };

    const toggleUnderline = () => {
        props.editor.chain().focus().toggleUnderline().run();
    };

    const toggleStrikethrough = () => {
        props.editor.chain().focus().toggleStrike().run();
    };

    const onHeadingUpdate = (selection: string) => {
        floatingMenuSelectType.value = selection

        setHeading(floatingMenuSelectType.value)
    }

    const onTextColorChanged = (color: any) => {
        props.editor.chain().focus().setColor(color).run();
    }

    const fontChange = (selection: string) => {
        console.log(selection)

        floatingMenuFont.value = selection

        props.editor.chain().focus().setFontFamily(floatingMenuFont.value).run();
    }

    const toggleSubscript = () => {
        props.editor.chain().focus().toggleSubscript().run();
    }

    const toggleSuperscript = () => {
        props.editor.chain().focus().toggleSuperscript().run();
    }

    const toggleOrderedList = () => {
        props.editor.chain().focus().toggleOrderedList().run();
    }

    const toggleTaskList = () => {
        props.editor.chain().focus().toggleTaskList().run();
    }

    const updateDisplayedHeadingLevel = () => {
        let isHeading = false
        
        for (let i = 1; i <= 6; i++) {
            if (props.editor.isActive('heading', { level: i })) {
                floatingMenuSelectType.value = i.toString()
                isHeading = true
            }
        }

        if (!isHeading || props.editor.isActive('paragraph')) {
            floatingMenuSelectType.value = "7"
        }

        for (let font in fonts) {
            if (props.editor.isActive('textStyle', { fontFamily: fonts[font] })) {
                floatingMenuFont.value = fonts[font]
            }
        }
    }

    const toggleLink = (url: string) => {
        props.editor.chain().focus().setLink({ href: url }).run();
    }

    const toggleLinkSection = () => {
        if (!props.editor.isActive('link')) {
            if (!urlSectionOpen.value) {
                urlSectionOpen.value = true
            } else {
                urlSectionOpen.value = false
                if (urlSectionUrl.value.length <= 0 || urlSectionUrl.value === null) {
                    props.editor.chain().focus().unsetLink().run();
                    return
                }

                toggleLink(urlSectionUrl.value)
                urlSectionUrl.value = ""
            }
        } else {
            props.editor.chain().focus().unsetLink().run();
        }
    }

    const toggleImage = (url: string) => {
        props.editor.chain().focus().setImage({ src: url }).run();
    }

    const toggleImageSection = () => {
        if (!props.editor.isActive('image')) {
            if (!imageSectionOpen.value) {
                imageSectionOpen.value = true
            } else {
                imageSectionOpen.value = false
                if (urlSectionUrl.value.length <= 0 || urlSectionUrl.value === null) {
                    return
                }

                toggleImage(urlSectionUrl.value)
                urlSectionUrl.value = ""
            }
        } else {
            
        }
    }

    const toggleTextAlign = (alignment: string) => {
        props.editor.chain().focus().setTextAlign(alignment).run();
    }

    const insertTable = () => {
        props.editor.chain().focus().insertTable({ rows: 3, cols: 3 }).run();
    }

    const insertYoutube = (url: string) => {
        props.editor.chain().focus().setYoutubeVideo({ src: url }).run();
    }

    const toggleYoutubeSection = () => {
        if (!youtubeSectionOpen.value) {
            youtubeSectionOpen.value = true
        } else {
            youtubeSectionOpen.value = false

            if (urlSectionUrl.value.length <= 0 || urlSectionUrl.value === null) {
                return
            }

            insertYoutube(urlSectionUrl.value)
            urlSectionUrl.value = ""
        }
    }

    const getAiResponse = async (command: string, history?: string, _callback?: any) => {
        let failCount = 0;

        while (!aiResponses) {
            try {
                var aiResponses = await (await fetch(`/api/openai?message=${history} ${command}`, {
                    method: "GET",
                })).json();
            } catch (e) {
                console.log(e)

                failCount++;
            }

            if (failCount >= 5) {
                return "Error: Failed to connect to AI server."
            }
        }

        if (_callback)
            _callback(aiResponses[0].message.content);

        return aiResponses[0].message.content;
    }

    const formatText = (str: string) => {
        return str
                .split("\n\n")
                .join("<br><br>")
                .split("\n")
                .join("<br>")
                .split("<li><p><br class='ProseMirror-trailingBreak'></p></li>")
                .join("")
                .split("<li><p><br></p></li>")
                .join("")
                .split("</li><br>  <br>  <li>")
                .join("</li><li>")
                .split("</li><br>  <li>")
                .join("</li><li>")
                .split("<ul><br>  <li>")
                .join("<ul><li>")
                .split("</li><br></ul>")
                .join("</li></ul>")
                .split("<ol><br>  <li>")
                .join("<ol><li>")
                .split("</li><br></ol>")
                .join("</li></ol>")
    }

    const insertAiText = async (command: string) => {
        aiPromptLoading.value = true
        let aiResponse = await getAiResponse(command, props.editor.getText());

        setTimeout(() => {
            
            if (props.editor) {
                var response = formatText(aiResponse)
            } else {
                response = "Error: No editor found! Although you clearly have one open. 🤔"
            }

            aiPromptLoading.value = false
            props.editor.chain().focus().insertContent(response).run()
        }, 1000)
    }

    const toggleAiSection = () => {
        if (!aiSectionOpen.value) {
            aiSectionOpen.value = true
        } else {
            aiSectionOpen.value = false

            if (urlSectionUrl.value.length <= 0 || urlSectionUrl.value === null) {
                return
            }

            insertAiText(urlSectionUrl.value)
            urlSectionUrl.value = ""
        }
    }

    const insertImageText = async (url: string) => {
        aiPromptLoading.value = true

        let worker = await createWorker({
            logger: (m: any) => console.log(m)
        })

        await worker.load()
        await worker.loadLanguage('eng')
        await worker.initialize('eng')
        const { data: { text } } = await worker.recognize(url)
        await worker.terminate()

        setTimeout(() => {

            if (props.editor) {
                var response = formatText(text)
            } else {
                response = "Error: No editor found! Although you clearly have one open. 🤔"
            }

            aiPromptLoading.value = false
            props.editor.chain().focus().insertContent(response).run()
        }, 1000)
    }

    const toggleImageTextSection = () => {
        if (!imageTextSectionOpen.value) {
            imageTextSectionOpen.value = true
        } else {
            imageTextSectionOpen.value = false

            if (urlSectionUrl.value.length <= 0 || urlSectionUrl.value === null) {
                return
            }

            insertImageText(urlSectionUrl.value)
            urlSectionUrl.value = ""
        }
    }

    const onInputFileLoad = (input: any) => {
        inputRef.value = input
    }

    const onInputFileChange = (event: any) => {
        const file = event.target.files[0]
        const reader = new FileReader()

        reader.onload = (event: any) => {
            if (event.target) {
                urlSectionUrl.value = event.target.result

                setTimeout(() => {
                    if (inputRef.value) {
                        inputRef.value?.focus()
                    }
                }, 100)
            }
        }

        reader.readAsDataURL(file)
    }

    const fillAiPrompt = async (command: string) => {
        urlSectionUrl.value = command

        setTimeout(() => {
            inputRef.value?.setSelectionRange(command.length, command.length)
            inputRef.value?.focus()
        }, 100)
    }
</script>

<template>
    <div data-test-id="bubble-menu" class="floatingMenuContainer">
        <div class="floatingMenuSection">
            <MimoSelect class="floatingMenuSelect" @change="onHeadingUpdate" :editor="$props.editor" :default="floatingMenuSelectType" title="Headings">
                <option value="1">Heading 1</option>
                <option value="2">Heading 2</option>
                <option value="3">Heading 3</option>
                <option value="4">Heading 4</option>
                <option value="5">Heading 5</option>
                <option value="6">Heading 6</option>
                <option value="7">Paragraph</option>
            </MimoSelect>
            <MimoSelect class="floatingMenuSelect" @change="fontChange" :editor="$props.editor" :default="floatingMenuFont" title="Fonts">
                <option value="Poiret One">Poiret One</option>
                <option value="Montserrat">Montserrat</option>
                <option value="Roboto">Roboto</option>
                <option value="Roboto Mono">Roboto Mono</option>
                <option value="Open Sans">Open Sans</option>
            </MimoSelect>
        </div>
        <div class="floatingMenuSection">
            <div class="floatingMenuInner">
                <button title="Align Left" :class="editor.isActive({ textAlign: 'left' }) ? 'floatingMenuButtonActive' : 'floatingMenuButton'" @click="() => toggleTextAlign('left')">
                    <Icon name="material-symbols:format-align-left" class="regularIcon"/>
                </button>
                <button title="Align Center" :class="editor.isActive({ textAlign: 'center' }) ? 'floatingMenuButtonActive' : 'floatingMenuButton'" @click="() => toggleTextAlign('center')">
                    <Icon name="material-symbols:format-align-center" class="regularIcon"/>
                </button>
                <button title="Align Right" :class="editor.isActive({ textAlign: 'right' }) ? 'floatingMenuButtonActive' : 'floatingMenuButton'" @click="() => toggleTextAlign('right')">
                    <Icon name="material-symbols:format-align-right" class="regularIcon"/>
                </button>
            </div>
            <div class="floatingMenuInner">
                <button title="Bold" :class="editor.isActive('bold') ? 'floatingMenuButtonActive' : 'floatingMenuButton'" @click="toggleBold">
                    <Icon name="material-symbols:format-bold" class="regularIcon"/>
                </button>
                <button title="Italic" :class="editor.isActive('italic') ? 'floatingMenuButtonActive' : 'floatingMenuButton'" @click="toggleItalic">
                    <Icon name="material-symbols:format-italic" class="regularIcon"/>
                </button>
                <button title="Underline" :class="editor.isActive('underline') ? 'floatingMenuButtonActive' : 'floatingMenuButton'" @click="toggleUnderline">
                    <Icon name="material-symbols:format-underlined" class="regularIcon"/>
                </button>
                <button title="Strikethrough" :class="editor.isActive('strike') ? 'floatingMenuButtonActive' : 'floatingMenuButton'" @click="toggleStrikethrough">
                    <Icon name="material-symbols:strikethrough-s" class="regularIcon"/>
                </button>
            </div>
        </div>
        <div class="floatingMenuSection">
            <div class="floatingMenuInner">
                <button title="Highlight" :class="editor.isActive('highlight') ? 'floatingMenuButtonActive' : 'floatingMenuButton'" @click="toggleHighlight">
                    <Icon name="material-symbols:format-ink-highlighter" class="regularIcon"/>
                </button>
                <button title="Subscript" :class="editor.isActive('subscript') ? 'floatingMenuButtonActive' : 'floatingMenuButton'" @click="toggleSubscript">
                    <Icon name="material-symbols:subscript" class="regularIcon"/>
                </button>
                <button title="Superscript" :class="editor.isActive('superscript') ? 'floatingMenuButtonActive' : 'floatingMenuButton'" @click="toggleSuperscript">
                    <Icon name="material-symbols:superscript" class="regularIcon"/>
                </button>
                <button title="Link" :class="editor.isActive('link') || urlSectionOpen ? 'floatingMenuButtonActive' : 'floatingMenuButton'" @click="toggleLinkSection">
                    <Icon name="material-symbols:link" class="regularIcon"/>
                </button>
            </div>
            <div class="floatingMenuInner">
                <button title="Ordered List" :class="editor.isActive('orderedList') ? 'floatingMenuButtonActive' : 'floatingMenuButton'" @click="toggleOrderedList">
                    <Icon name="material-symbols:format-list-numbered" class="regularIcon"/>
                </button>
                <button title="Task List" :class="editor.isActive('taskList') ? 'floatingMenuButtonActive' : 'floatingMenuButton'" @click="toggleTaskList">
                    <Icon name="material-symbols:checklist-rtl" class="regularIcon"/>
                </button>
                <button title="Blockquote" :class="editor.isActive('blockquote') ? 'floatingMenuButtonActive' : 'floatingMenuButton'" @click="toggleBlockquote">
                    <Icon name="material-symbols:format-quote" class="regularIcon"/>
                </button>
                <button title="Code Block" :class="editor.isActive('codeBlock') ? 'floatingMenuButtonActive' : 'floatingMenuButton'" @click="toggleCodeBlock">
                    <Icon name="material-symbols:code" class="regularIcon"/>
                </button>
            </div>
        </div>
        <div class="floatingMenuSection">
            <button title="Image" :class="editor.isActive('image') || imageSectionOpen ? 'floatingMenuButtonActive' : 'floatingMenuButton'" @click="toggleImageSection">
                <Icon name="material-symbols:add-photo-alternate" class="regularIcon"/>
            </button>
            <button title="Text from Image" :class="imageTextSectionOpen ? 'floatingMenuButtonActive' : 'floatingMenuButton'" @click="toggleImageTextSection">
                <Icon name="material-symbols:image-search" class="regularIcon"/>
            </button>
            <button title="Youtube Video" :class="editor.isActive('youtubeVideo') || youtubeSectionOpen ? 'floatingMenuButtonActive' : 'floatingMenuButton'" @click="toggleYoutubeSection">
                <Icon name="material-symbols:youtube-activity" class="regularIcon"/>
            </button>
            <button title="Table" :class="editor.isActive('table') ? 'floatingMenuButtonActive' : 'floatingMenuButton'" @click="insertTable">
                <Icon name="material-symbols:data-table" class="regularIcon"/>
            </button>
            <button title="Ai"  v-if="aiEnabled" :class="aiSectionOpen ? 'floatingMenuButtonActive' : 'floatingMenuButton'" @click="toggleAiSection">
                <Icon name="material-symbols:network-intelligence" class="regularIcon"/>
            </button>
        </div>
        <div class="floatingMenuSection" v-show="editor.isActive('table')">
            <div class="floatingMenuInnerFull">
                <button title="Add row Before" class='floatingMenuButton' @click="editor.chain().focus().addRowBefore().run()">
                    <Icon name="material-symbols:keyboard-double-arrow-up-rounded"  class="regularIcon"/>
                </button>
                <button title="Add row After" class='floatingMenuButton' @click="editor.chain().focus().addRowAfter().run()">
                    <Icon name="material-symbols:keyboard-double-arrow-down-rounded"  class="regularIcon"/>
                </button>
                <button title="Add column Before" class='floatingMenuButton' @click="editor.chain().focus().addColumnBefore().run()">
                    <Icon name="material-symbols:keyboard-double-arrow-left"  class="regularIcon"/>
                </button>
                <button title="Add column After" class='floatingMenuButton' @click="editor.chain().focus().addColumnAfter().run()">
                    <Icon name="material-symbols:keyboard-double-arrow-right"  class="regularIcon"/>
                </button>
            </div>
            <div class="floatingMenuInner">
                <button title="Merge or Split" class='floatingMenuButton' @click="editor.chain().focus().mergeOrSplit().run()">
                    <Icon name="material-symbols:splitscreen-right-sharp"  class="regularIcon"/>
                </button>
                <button title="Toggle Header" class='floatingMenuButton' @click="editor.chain().focus().toggleHeaderCell().run()">
                    <Icon name="material-symbols:scrollable-header"  class="regularIcon"/>
                </button>
            </div>
            <div class="floatingMenuInner">
                <button title="Delete Column" class='floatingMenuButton' @click="editor.chain().focus().deleteColumn().run()">
                    <Icon name="material-symbols:splitscreen-left-outline-sharp"  class="regularIcon"/>
                </button>
                <button title="Delete Row" class='floatingMenuButton' @click="editor.chain().focus().deleteRow().run()">
                    <Icon name="material-symbols:splitscreen-top-outline-sharp"  class="regularIcon"/>
                </button>
                <button title="Delete Table" class='floatingMenuButton' @click="editor.chain().focus().deleteTable().run()">
                    <Icon name="material-symbols:delete"  class="regularIcon"/>
                </button>
            </div>
        </div>
        <div class="floatingMenuSection">
            <ColorPicker name="TEXT" @colorSelected="onTextColorChanged"/>
        </div>
        <div class="floatingMenuSection" v-if="urlSectionOpen">
            <MimoMenuTextInput title="Link" v-model="urlSectionUrl" @submit="toggleLinkSection"/>
        </div>
        <div class="floatingMenuSection" v-if="imageSectionOpen">
            <MimoMenuTextInput title="Image" v-model="urlSectionUrl" @submit="toggleImageSection" @load="onInputFileLoad"/>
            <FileInput accept="image/*" @change="onInputFileChange">
                <Icon name="material-symbols:upload" class="regularIcon"/>
            </FileInput>
        </div>
        <div class="floatingMenuSection" v-if="youtubeSectionOpen">
            <MimoMenuTextInput title="Video" v-model="urlSectionUrl" @submit="toggleYoutubeSection"/>
        </div>
        <div class="floatingMenuSection" v-if="aiSectionOpen">
            <MimoMenuTextInput title="Prompt" v-model="urlSectionUrl" @submit="toggleAiSection" :textarea="true" @load="onInputFileLoad"/>
            <button class="floatingMenuButton" title="Improve Writing" @click="fillAiPrompt('Improve writing')">
                <Icon name="material-symbols:lightbulb" class="regularIcon"/>
            </button>
            <button class="floatingMenuButton" title="Make the text sound more confident" @click="fillAiPrompt('Make the text sound more confident')">
                <Icon name="material-symbols:lightbulb" class="regularIcon"/>
            </button>
            <button class="floatingMenuButton" title="Make the text sound more informative" @click="fillAiPrompt('Make the text sound more informative')">
                <Icon name="material-symbols:lightbulb" class="regularIcon"/>
            </button>
            <button class="floatingMenuButton" title="Make the text longer" @click="fillAiPrompt('Make the text longer')">
                <Icon name="material-symbols:lightbulb" class="regularIcon"/>
            </button>
            <button class="floatingMenuButton" title="Make the text shorter" @click="fillAiPrompt('Make the text shorter')">
                <Icon name="material-symbols:lightbulb" class="regularIcon"/>
            </button>
            <button class="floatingMenuButton" title="Come up with ideas based on the text" @click="fillAiPrompt('Come up with ideas based on the text')">
                <Icon name="material-symbols:lightbulb" class="regularIcon"/>
            </button>
            <button class="floatingMenuButton" title="Come up with a hook for the text" @click="fillAiPrompt('Come up with a hook for the text')">
                <Icon name="material-symbols:lightbulb" class="regularIcon"/>
            </button>
            <button class="floatingMenuButton" title="Come up with a conclusion for the text" @click="fillAiPrompt('Come up with a conclusion for the text')">
                <Icon name="material-symbols:lightbulb" class="regularIcon"/>
            </button>
        </div>
        <div class="floatingMenuSection" v-if="imageTextSectionOpen">
            <MimoMenuTextInput title="Image" v-model="urlSectionUrl" @submit="toggleImageTextSection" @load="onInputFileLoad"/>
            <FileInput accept="image/*" @change="onInputFileChange">
                <Icon name="material-symbols:upload" class="regularIcon"/>
            </FileInput>
        </div>
        <div v-if="aiPromptLoading">
            <LoadingAnimation/>
        </div>
    </div>
</template>

<style lang="sass" scoped>
    .floatingMenuContainer
        align-items: center
        border: 1px solid #ccc
        border-radius: 4px
        padding: 8px
        background-color: black
        width: 256px
        box-shadow: 4px 4px 4px rgba(0, 0, 0, 0.2)
        display: flex
        flex-direction: column
        row-gap: 4px
        transition: all 0.5s ease-in-out

        .floatingMenuSection
            display: flex
            width: 100%
            justify-content: space-between
            flex-wrap: wrap
            row-gap: 4px
            column-gap: 4px
            border-bottom: 1px solid #ccc
            padding-bottom: 4px

        .floatingMenuInner 
            width: 124px
            display: flex
            justify-content: space-between

        .floatingMenuInnerFull
            width: 256px
            display: flex
            justify-content: space-between

        .is-active
            background-color: #333

        :deep(.floatingMenuButton)
            padding: 4px
            cursor: pointer
            outline: none
            border: solid 1px #333
            background-color: transparent
            border-radius: 4px
            transition: all 0.2s ease-in-out
            color: white

            &:hover
                border: solid 1px #eee

        .floatingMenuButtonActive
            padding: 4px
            cursor: pointer
            outline: none
            border: solid 1px #eee
            background-color: #333
            border-radius: 4px
            transition: all 0.2s ease-in-out

        .floatingMenuSelect
            border: none
            padding: 8px
            margin: 0
            cursor: pointer
            outline: none
            color: white
            background-color: #333
            border-radius: 4px
            width: 124px

            option
                background-color: #333
                padding: 4px

    .regularIcon
        width: 16px
        height: 16px
        color: white

    .loginField
        width: 97%

        :deep(span), :deep(input), :deep(textarea)
            color: white
            font-family: 'Roboto', sans-serif
            font-size: 1em

        :deep(input), :deep(textarea)
            width: 80%

        :deep(button)
            width: 32px

        :deep(textarea)
            resize: none
            margin-top: 4px
            margin-bottom: 4px

    .loadingAnimation
        transform: scale(0.25, 0.25)
</style>