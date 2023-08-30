<template>
    <div class="container">
        <slot />
    </div>
</template>

<style lang="sass" scoped>
    .container
        margin-left: auto
        margin-right: auto

        width: 100%

        @media (min-width: 568px)
            width: 95%

        @media (min-width: 768px)
            width: 85%
        
        @media (min-width: 1200px)
            width: 65%
</style>