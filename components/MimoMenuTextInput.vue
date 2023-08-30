<script lang="ts" setup>
    const props = defineProps(['modelValue', 'textarea', 'title'])

    const emit = defineEmits(['update:modelValue', 'submit', 'load'])

    const value = computed({
        get() {
            return props.modelValue
        },
        set(value) {
            emit('update:modelValue', value)
        }
    })

    const onKeyPress = (event: KeyboardEvent) => {
        if (event.key === 'Enter') {
            emit('submit', value.value)
        }
    }

    const urlInput = ref<HTMLInputElement | null>(null)

    onMounted(() => {
        setTimeout(() => {
            if (urlInput.value) {
                urlInput.value.focus()
                emit('load', urlInput.value)
            }
        }, 100)
    })
</script>

<template>
    <div class="loginField">
        <span>{{ title }}: </span>
        <textarea type="text" v-model="value" ref="urlInput" v-if="textarea" @keypress="onKeyPress"/>
        <input type="text" v-model="value" ref="urlInput" v-else @keypress="onKeyPress"/>
        <button class="floatingMenuButton" @click="emit('submit', value)" title="Submit">
            <Icon name="material-symbols:check" class="regularIcon"/>
        </button>
    </div>
</template>

<style lang="sass" scoped>

</style>