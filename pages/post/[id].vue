<script setup lang="ts">
    //@ts-ignore
    import { Database } from '../database.types'

    let user = useSupabaseUser()
    const supabase = useSupabaseClient<Database>()

    const pageData = ref<any>(null)

    const route = useRoute()

    const dne = ref(false)

    onMounted(async () => {
        const { data, error } = await supabase
            .from('UserData')
            .select('*')

        if (error) {
            console.error(error)
        } else {
            pageData.value = data
        }

        let pagesArray = [] as any[]

        data?.forEach((user: any) => {
            user.pages.forEach((page: any) => {
                if (page.sharePage)
                    pagesArray.push(page)
            })
        })

        pageData.value = pagesArray.find((page) => page.pageID === route.params.id)

        setTimeout(() => {
            window.scrollTo(0, 0)
        }, 100)

        setTimeout(() => {
            if (!pageData.value)
                dne.value = true
        }, 5000)
    })

    useHead({
        title: pageData.value?.title || 'MIMO - The Ultimate Online Text Editor',
        meta: [
            {
                name: 'description',
                content: pageData.value?.content || 'MIMO is the ultimate online text editor with AI assistance and Grammarly support. It is',
            },
            {
                name: 'keywords',
                content: pageData.value?.content || "MIMO, text editor, online text editor, online editor, online text editor with AI, online text editor with AI assistance, online text editor with AI assistance and Grammarly support, online text editor with Grammarly support, online text editor with Grammarly extension support, online text editor with Grammarly extension, online text editor with Grammarly, online text editor with Grammarly extension and AI assistance, online text editor with Grammarly extension and AI assistance, online text editor with AI assistance and Grammarly extension, online text editor with AI assistance and Grammarly, online text editor with AI assistance and Grammarly extension, online text editor with AI assistance and Grammarly extension support, online text editor with AI assistance and Grammarly support, online text editor with AI assistance and Grammarly extension and Grammarly support, online text editor with AI assistance and Grammarly extension and Grammarly support",
            }
        ]
    })
</script>

<template>
    <div v-if="!dne">
        <div v-if="pageData">
            <HeroImage :src="pageData.heroSrc" alt="MIMO HERO"/>
            <Panel class="mainPanel">
                <Container class="container">
                    <MimoEditor :content="pageData.pageContent" :editable="false"/>
                </Container>
            </Panel>
        </div>
        <div v-else class="loadingPopupWrapper">
            <LoadingAnimation class="loadingPopup"/>
        </div>
    </div>
    <div v-else>
        <NotFound />
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