<script lang="ts" setup>
    import tinycolor from "tinycolor2"

    let props = defineProps({
        color: {
            type: String,
            default: "#000000"
        },
        title: {
            type: String,
            default: ""
        }
    })

    let color = ref(props.color ? props.color : "#000000")
    let darkerColor = ref(props.color ? props.color : "#000000")

    onMounted(() => {
        darkerColor.value = tinycolor(color.value).darken(15).toString()
    })

    
</script>

<template>
    <div class="colorBox" :title="title === '' ? color : title"/>
</template>

<style lang="sass" scoped>
    .colorBox
        width: 16px
        height: 16px
        transition: all 0.2s ease-in-out
        margin: 0
        background-color: v-bind(color)
        border-radius: 100%
        border-bottom: solid 2px v-bind(darkerColor)
        border-left: solid 2px v-bind(darkerColor)

        &:hover
            transform: translate(-1px, -1px)
            border-bottom: solid 6px v-bind(darkerColor)
            border-left: solid 6px v-bind(darkerColor)
</style>