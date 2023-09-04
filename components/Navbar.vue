<script lang="ts" setup>
    let user = useSupabaseUser()

    let props = defineProps({
        darkmode: {
            type: Boolean,
            default: false
        }
    })

    let darkie = ref(props.darkmode)
    let image = ref<HTMLImageElement | null>(null)

    onMounted(() => {
        darkie.value = props.darkmode 

        if (localStorage.getItem('darkmode') === 'true') {
            darkie.value = true
            image.value?.classList.add('darkmodeImage')
        }
    })

    watch(() => props.darkmode, () => {
        darkie.value = props.darkmode
    })
</script>

<template>
    <header class="navigation">
        <NuxtLink to="/">
            <img src="/MIMO_LOGO.png" alt="Mimo Logo" width="45px" :class="darkie ? 'darkmodeImage' : ''" ref="image"/>
        </NuxtLink>
        <div class="links">
            <NuxtLink to="/try">
                <button class="navButton">Try it</button>
            </NuxtLink>
            <NuxtLink to="/dashboard">
                <button v-if="user" class="navButton">Dashboard</button>
                <button v-else class="navButton">Sign in</button>
            </NuxtLink>
        </div>
    </header>
</template>

<style lang="sass" scoped>
    @keyframes whiteToBlack
        0%
            background-color: #fff
        100%
            background-color: #000

    @keyframes blackToWhite
        0%
            background-color: #000
        100%
            background-color: #fff 

    .navigation
        background-color: transparent
        position: sticky
        top: 0
        height: 64px
        display: flex
        align-items: center
        justify-content: space-between
        z-index: 1000
        transition: all 0.3s ease-in-out
        padding-right: 4px
        margin-top: -8px

        img
            height: 45px
            width: 45px
            object-fit: cover
            background: #000
            border-radius: 100%
            transition: all 0.3s ease-in-out
            animation: whiteToBlack 0.3s ease-in-out forwards

        .darkmodeImage
            background: #fff
            animation: blackToWhite 0.3s ease-in-out forwards

        .links
            display: flex
            align-items: center
            justify-content: space-between
            column-gap: 8px

        .navButton
            background-color: transparent
            border: 1px solid #333
            border-radius: 4px
            padding: 5px 10px
            font-size: 1rem
            font-weight: 600
            transition: all 0.3s ease-in-out
            backdrop-filter: blur(9px)

            &:hover
                background-color: #333
                color: #fff
</style>