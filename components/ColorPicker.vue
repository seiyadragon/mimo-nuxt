<script lang="ts" setup>
    const props = defineProps({
        name: {
            type: String,
            default: "colorPicker"
        }
    });

    const emit = defineEmits(["colorSelected"]);

    let selectedColor = ref("")

    let colorEnabled: {key: string, value: boolean}[] = [
        {key: "red", value: false},
        {key: "green", value: false},
        {key: "blue", value: false},
        {key: "yellow", value: false},
        {key: "orange", value: false},
        {key: "purple", value: false},
        {key: "pink", value: false},
        {key: "brown", value: false},
        {key: "gray", value: false},
        {key: "cyan", value: false},
        {key: "magenta", value: false},
        {key: "lime", value: false},
    ]

    const onColorSelected = (color: string) => {
        selectedColor.value = color

        colorEnabled.forEach((c) => {
            if (c !== null) {
                if (c.key === color) {
                    c.value = true
                } else {
                    c.value = false
                }
            }
        })

        emit("colorSelected", color)
    }
</script>

<template>
    <div class="colorPickerWrapper">
        <div class="colorPicker">
            <button v-for="color in colorEnabled" @click="onColorSelected(color.key)">
                <ColorBox :color="color.key" :selected="color.value" />
            </button>
        </div>
    </div>
</template>

<style lang="sass" scoped>
    .colorPicker
        display: flex
        flex-direction: row
        flex-wrap: wrap
        width: 100%
        height: 100%
        column-gap: 2px
        row-gap: 2px
        justify-content: space-between
        margin-top: 8px
        margin-bottom: 8px

        button
            background-color: transparent
            border: none
            outline: none
            width: 16px
            height: 16px
            padding: 0
            margin: 0

    .colorPickerWrapper
        display: flex
        flex-direction: column
        align-items: center
        justify-content: center
        width: 100%
        height: 100%
        row-gap: 8px
</style>