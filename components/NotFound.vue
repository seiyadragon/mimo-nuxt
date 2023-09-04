<script setup lang="ts">
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
                }, 15)
            } else {
                editorDisabled.value = true
            }
        }
    }

    onMounted( async () => {
        editorShouldDisplay.value = `
            <h1 style="text-align:center;">Uh oh! Looks like this page has gone missing.</h1>
            <br>
            <br>
            <h1 style="text-align:center;">I could have sworn I put it somewhere...</h1>
            <br>
            <br>
            <h1 style="text-align:center;">But while I look for it, enjoy Rick instead!</h1>
            <br>
            <br>
            <h1 style="text-align:center;">PS. It's gonna take a bit to load... But it will 😅</h1>
            <br>
            <br>
            <h1 style="text-align:center;">PPS. You can also just <em><a href='/dashboard' target='_self'>click here</a></em> to go back to the dashboard!</h1>
            <br>
            <br>
            <div data-youtube-video="" contenteditable="false" draggable="true" class=""><iframe width="640" height="480" allowfullscreen="true" autoplay="false" disablekbcontrols="false" enableiframeapi="false" endtime="0" ivloadpolicy="0" loop="false" modestbranding="false" origin="" playlist="" src="https://www.youtube.com/embed/hQdp7rN6vUs" start="0"></iframe></div>
        `

        displayAbout()
    })
</script>

<template>
    <HeroImage src="https://jkjvmupmdindwanpirxe.supabase.co/storage/v1/object/public/static/404_not_found.jpg?t=2023-09-04T06%3A32%3A16.188Z" alt="404"/>
    <Panel class="mainPanel">
        <Container class="container">
            <MimoEditor :content="editorContent" placeholder="Feel free to try MIMO out!" content-animated :editable="!editorDisabled" :floatingMenu="false"/>
        </Container>
    </Panel>
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