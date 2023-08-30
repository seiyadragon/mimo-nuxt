<script lang="ts" setup>
    const props = defineProps({
        src: {
            type: String,
            default: '/MIMO_HERO.png'
        },
        alt: {
            type: String,
            default: 'MIMO HERO'
        }
    })
</script>

<template>
    <div class="heroWrapper">
        <img class="heroImage" :src="props.src" :alt="props.alt" />
    </div>
</template>

<style lang="sass" scoped>
    .heroWrapper
        width: 100%
        display: flex
        align-items: center
        justify-content: center
        background-color: blue
        padding: 0
        border-radius: 4px
        height: 512px

        .heroImage
            object-fit: cover
            border-radius: 4px
            width: 100%
            margin: 0
            height: 512px
</style>