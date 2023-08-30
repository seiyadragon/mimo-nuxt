<script lang="ts" setup>
    const editorContent = ref("")
    const editorShouldDisplay = ref("")
    const displayedCharsCounter = ref(0)
    const editorDisabled = ref(false)

    const displayAbout = () => {
        if (editorContent.value.length < editorShouldDisplay.value.length) {
            editorContent.value = editorContent.value.concat(editorShouldDisplay.value.charAt(displayedCharsCounter.value))

            displayedCharsCounter.value++
            if (editorContent.value.length < editorShouldDisplay.value.length) {
                setTimeout(() => {
                    displayAbout()
                }, 25)
            } else {
                editorDisabled.value = true
            }
        }
    }

    onMounted( async () => {
        editorShouldDisplay.value = `
            <h1>Introducing MIMO: Unleash Your Creativity and Productivity! 🚀📝</h1>
            <p>Imagine a world where your ideas seamlessly transform into stunning documents. With MIMO, the ultimate online text editor, you're not just creating content – you're crafting experiences. Harness the power of cutting-edge AI assistance, effortlessly convert images into text, and seamlessly integrate YouTube videos to amplify your narratives. Your work stays in sync across all devices, and with dynamic checklists, code highlighting, and full Grammarly extension support, you'll conquer writing with finesse. Whether it's dazzling light or enigmatic dark themes, MIMO adapts to your style. And when it's time to share, export to .doc files for flawless collaboration. Elevate your creativity, conquer your to-dos, and compose brilliance with MIMO!</p>
            <p><strong>Get started today and revolutionize your workflow.</strong></p>
        `

        displayAbout()
    })

    useHead({
        title: "MIMO - The Ultimate Online Text Editor",
        meta: [
            {
                name: 'description',
                content: "Imagine a world where your ideas seamlessly transform into stunning documents. With MIMO, the ultimate online text editor, you're not just creating content – you're crafting experiences. Harness the power of cutting-edge AI assistance, effortlessly convert images into text, and seamlessly integrate YouTube videos to amplify your narratives. Your work stays in sync across all devices, and with dynamic checklists, code highlighting, and full Grammarly extension support, you'll conquer writing with finesse. Whether it's dazzling light or enigmatic dark themes, MIMO adapts to your style. And when it's time to share, export to .doc files for flawless collaboration. Elevate your creativity, conquer your to-dos, and compose brilliance with MIMO!",
            },
            {
                name: 'keywords',
                content: "MIMO, text editor, online text editor, online editor, online text editor with AI, online text editor with AI assistance, online text editor with AI assistance and Grammarly support, online text editor with Grammarly support, online text editor with Grammarly extension support, online text editor with Grammarly extension, online text editor with Grammarly, online text editor with Grammarly extension and AI assistance, online text editor with Grammarly extension and AI assistance, online text editor with AI assistance and Grammarly extension, online text editor with AI assistance and Grammarly, online text editor with AI assistance and Grammarly extension, online text editor with AI assistance and Grammarly extension support, online text editor with AI assistance and Grammarly support, online text editor with AI assistance and Grammarly extension and Grammarly support, online text editor with AI assistance and Grammarly extension and Grammarly support",
            }
        ]
    })
</script>

<template>
    <div>
        <HeroImage src="/MIMO_HERO.png" alt="MIMO HERO"/>
        <Panel class="mainPanel">
            <Container class="container">
                <MimoEditor :content="editorContent" placeholder="Feel free to try MIMO out!" content-animated :editable="!editorDisabled"/>
            </Container>
        </Panel>
    </div>
</template>

<style lang="sass" scoped>
    .mainPanel
        margin-top: 20px
        margin-bottom: 20px
        min-height: 600px

        .container
            padding-top: 20px
            padding-bottom: 20px
</style>