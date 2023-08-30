<template>
    <div class="panel">
        <slot />
    </div>
</template>

<style lang="sass" scoped>
    .panel
        border: 1px solid #333
        border-radius: 4px
        padding: 4px
        margin-left: auto
        margin-right: auto
        box-shadow: 4px 4px 4px rgba(0, 0, 0, 0.2)

        &:focus
            border-color: #aaa
            outline: none
</style>