<script lang="ts" setup>
    import { Editor } from '@tiptap/vue-3';
    import {v4 as uuidv4} from 'uuid';

    //@ts-ignore
    import { Database } from '../database.types'

    let user = useSupabaseUser()
    const supabase = useSupabaseClient<Database>()

    const heroSrc = ref('')
    const pageName = ref('')
    const pageID = ref('')
    const pageContent = ref('')

    const pageSelection = ref('')
    const pageSelectionRef = ref<HTMLSelectElement | null>(null)
    const loadingNewPage = ref(false)
    const dashboardLoading = ref(true)

    let pageList = ref([] as any[])

    const editor = ref<Editor | null>(null)
    const editorRef = ref<HTMLDivElement | null>(null)

    onMounted(async () => {
        user = useSupabaseUser()
        pageList = ref([] as any[])

        if (user.value)
            setTimeout(() => {
                init()
            }, 100)
    })

    const resetData = () => {
        heroSrc.value = ''
        pageName.value = ''
        pageContent.value = ''
        pageID.value = ''
        pageSelection.value = ''

        pageList.value = []
    }

    const init = async () => {
        dashboardLoading.value = true

        user = useSupabaseUser()
        resetData()

        let {data, error} = await supabase.from('UserData').select('pages').eq('user_id', user.value?.id).single()

        if (error) {
            console.error(error)
            pageList.value = []

            setTimeout(() => {
                dashboardLoading.value = false
            }, 500)
        } else {
            pageList.value = data?.pages

            setTimeout(() => {
                dashboardLoading.value = false
            }, 500)
        }

        if (pageList.value.length > 0)
            var p_id = pageList.value[0] ? pageList.value[0].pageID : ''
        else p_id = ''

        if (localStorage) {
            if (localStorage.getItem('pageID')) {
                p_id = localStorage.getItem('pageID')
            } else {
                p_id = pageList.value[0].pageID
            }
        } else {
            p_id = pageList.value[0].pageID
        }

        let p_id_doesnt_match = true

        pageList.value.map((page) => {
            if (page.pageID === p_id) {
                p_id_doesnt_match = false
            }
        })

        if (p_id_doesnt_match && pageList.value.length > 0)
            p_id = pageList.value[0].pageID

        pageSelection.value = p_id as string
        
        if (pageList.value.length <= 0) {
            pageSelection.value = 'new'
        }

        console.log(pageSelection.value)

        setTimeout(() => {
            pageSelectorChange()
        }, 100)
    }

    const signOut = () => {
        resetData()
        supabase.auth.signOut()
    }

    const pageSelectorChange = () => {
        if (pageSelection.value === 'new') {
            newPage()
        } else {
            setPage(pageSelection.value)
        }
    }

    const newPage = () => {
        let uuid = uuidv4().toString()
        let pageData = pageList.value.find((page) => page.pageID === uuid)

        while (pageData) {
            uuid = uuidv4().toString()
            pageData = pageList.value.find((page) => page.pageID === uuid)
        }

        pageList.value.push({
            heroSrc: 'https://jkjvmupmdindwanpirxe.supabase.co/storage/v1/object/public/static/MIMO_HERO.png',
            pageName: 'untitled',
            pageID: uuidv4().toString(),
            pageContent: '',
        })

        savePages()
        setPage(pageList.value[pageList.value.length - 1].pageID)
    }

    const setPage = (page: string) => {
        pageID.value = page
        localStorage.setItem('pageID', page)

        const pageData = pageList.value.find((page) => page.pageID === pageID.value)
        
        if (pageData) {
            pageSelection.value = pageData.pageID
            heroSrc.value = pageData.heroSrc
            pageName.value = pageData.pageName
            pageContent.value = pageData.pageContent
            loadingNewPage.value = true

            setTimeout(() => {
                loadingNewPage.value = false
            }, 100)

            savePages()
        }
    }

    watch(heroSrc, (newValue) => {
        const pageData = pageList.value.find((page) => page.pageID === pageID.value)

        if (pageData) {
            pageData.heroSrc = newValue
            savePages()
        }
    })

    watch(pageName, (newValue) => {
        const pageData = pageList.value.find((page) => page.pageID === pageID.value)

        if (pageData) {
            pageData.pageName = newValue
            savePages()
        }
    })

    watch(pageContent, (newValue) => {
        const pageData = pageList.value.find((page) => page.pageID === pageID.value)

        if (pageData) {
            pageData.pageContent = newValue
            savePages()
        }
    })

    const savePages = async () => {
            let {data, error} = await supabase.from('UserData').upsert({
                user_id: user.value?.id,
                pages: pageList.value,
            }).eq('user_id', user.value?.id)
    
            if (error) {
                console.log(error)
            }
    }

    const deletePage = async () => {
        const pageData = pageList.value.find((page) => page.pageID === pageID.value)

        if (pageData) {
            pageList.value.splice(pageList.value.indexOf(pageData), 1)

            if (pageList.value.length <= 0) {
                pageSelection.value = 'new'
                pageSelectorChange()
            } else {
                setPage(pageList.value[0].pageID)
            }
        }
    }

    const print = () => {
        function downloadInnerHtml(filename: string) {
            var elHtml = "<html>" + document.getElementById("dashHero")?.innerHTML + editor.value?.getHTML() + "</html>"
            var link = document.createElement('a');
            link.setAttribute('download', filename);

            link.setAttribute('href', 'data:' + 'text/doc' + ';charset=utf-8,' + encodeURIComponent(elHtml?.toString() as string));
            link.click(); 
        }

        downloadInnerHtml(`${pageName.value}.doc`)
    }

    useHead({
        title: "Dashboard - MIMO - The Ultimate Online Text Editor",
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
    <div v-if="user" id="dashboard">
        <HeroImage :src="heroSrc" alt="MIMO HERO" class="border" v-if="!dashboardLoading" id="dashHero"/>
        <div v-else class="loadingPopupWrapper">
            <LoadingAnimation class="loadingPopup"/>
        </div>
        <Panel class="accountPanel">
            <div class="loginField">
                <span class="loginFieldText">Wallpaper: </span>
                <input type="text" v-model="heroSrc">
            </div>
            <div class="loginField">
                <span>Title: </span>
                <input type="text" v-model="pageName">
            </div>
            <div class="loginField">
                <span class="loginFieldText">Document: </span>
                <select @change="pageSelectorChange" v-model="pageSelection" ref="pageSelectionRef" :editor="(editor as Editor)">
                    <option v-for="page in pageList" :value="page.pageID">{{page.pageName}}</option>
                </select>
                <div class="pageControls">
                    <button @click="newPage" class="borderlessButton">
                        <Icon name="material-symbols:add" size="20px"/>
                    </button>
                    <button @click="deletePage" class="borderlessButton">
                        <Icon name="material-symbols:delete" size="20px"/>
                    </button>
                </div>
            </div>
            <div class="dashMenu">
                <button @click="print" class="borderlessButton">
                    <Icon name="material-symbols:download" size="20px"/>
                </button>
                <button @click="signOut" class="borderlessButton">
                    <Icon name="material-symbols:logout" size="20px"/>
                </button>
            </div>
        </Panel>
        <Panel class="mainPanel">
            <Container class="container">
                <MimoEditor aiEnabled @update:content="(content) => pageContent = content" v-if="!loadingNewPage" :content="pageContent" @editorCallback="(edit) => editor = edit" ref="editorRef"/>
            </Container>
        </Panel>
    </div>
    <div v-else class="authContainer">
        <Authenticator :initFunction="init"/>
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

    .accountPanel
        margin-top: 20px
        margin-bottom: 20px
        display: flex
        column-gap: 8px
        row-gap: 8px
        flex-direction: column

        @media screen and (min-width: 1100px)
            flex-direction: row
            align-items: center
            justify-content: space-between 

        h1
            font-size: 2rem
            font-weight: 600
            margin-bottom: 20px
            text-align: center

        .optionButton, borderlessButton
            background-color: transparent
            border: 1px solid #333
            border-radius: 4px
            padding: 8px 10px
            font-size: 1rem
            font-weight: 600
            color: #333
            transition: all 0.3s ease-in-out

            &:hover
                background-color: #333
                color: #fff

        .borderlessButton
            border: none
            background-color: transparent
            border-radius: 100%
            transition: all 0.3s ease-in-out
            width: 32px
            height: 32px
            color: #000
            margin-left: 4px

            &:hover
                background-color: #333
                color: #fff

    .border
        border: 1px solid #000

    .pageControls
        display: flex
        flex-direction: row
        align-items: center
        justify-content: space-between
        border-left: 1px solid #000
        height: 100%
        margin-left: 8px

    .dashMenu
        display: flex
        flex-direction: row
        align-items: center
        justify-content: left

    .loadingPopupWrapper
        position: fixed
        top: 0
        left: 0
        bottom: 0
        right: 0
        z-index: 999
        background-color: rgba(0, 0, 0, 1)
        display: flex
        align-items: center
        justify-content: center

    .loadingPopup
        position: sticky
        top: 0
        left: 0
        bottom: 0
        right: 0
        z-index: 999
        width: 350px
        height: 350px
</style>