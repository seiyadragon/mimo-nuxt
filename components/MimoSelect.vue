<script lang="ts" setup>
    import {v4 as uuidv4} from 'uuid';

    const props = defineProps({
        editor: {
            type: Object,
            required: true
        },
        default: {
            type: String,
            default: ''
        },
        title: {
            type: String,
            default: ''
        }
    })

    const emit = defineEmits(['change'])

    const selectOpen = ref(false)
    const selectValue = ref(props.default)
    const name = ref('')

    onMounted(() => {
        if (window) {
            window.addEventListener('click', (e: any) => {
                if (selectOpen.value) {
                    if (e.target.id !== 'mimo-select' && e.target.typeof !== HTMLInputElement) {
                        selectOpen.value = false
                        props.editor.chain().focus().run();

                    } else if (e.target.id === 'mimo-select') {
                        if (name.value !== e.target.name) {
                            selectOpen.value = false
                        }
                    }
                }
            })
        }

        selectValue.value = props.default
        name.value = uuidv4().toString()
    })

    const onSelectClick = () => {
        if (selectOpen.value) {
            selectOpen.value = false

            props.editor.chain().focus().run();
        } else {
            selectOpen.value = true
        }
    }

    const onChange = () => {
        emit('change', selectValue.value)
        
        selectOpen.value = false
    }

    watch(() => props.default, (newValue) => {
        selectValue.value = newValue
    })
</script>

<template>
    <select id="mimo-select" :name="name" @click="onSelectClick" @change="onChange" v-model="selectValue" :title="title">
        <slot />
    </select>
</template>