<script lang="ts" setup>
    const props = defineProps({
        accept: {
            type: String,
            default: '*/*'
        },
    })

    const emit = defineEmits(['change'])

    const fileInput = ref<HTMLInputElement | null>(null)
</script>

<template>
    <input type="file" :accept="accept" @change="(event) => emit('change', event)" ref="fileInput" style="display: none"/>
    <button class="floatingMenuButton" @click="() => fileInput?.click()">
        <slot />
    </button>
</template>

<style lang="sass" scoped>

</style>