<script lang="ts" setup>
    //@ts-ignore
    import darkmode from 'darkmode-js'

    const dm = ref(new darkmode({
        bottom: '16px',
        right: '16px',
        label: '🌓',
        time: '1s',
        saveInCookies: true,
        autoMatchOsTheme: true
    }))

    const navbarDM = ref(dm.value.isActivated())

    onMounted(() => {
        dm.value.showWidget()
        navbarDM.value = localStorage.getItem('darkmode') === 'true' ? true : false
        
        if (dm.value.isActivated())
            navbarDM.value = true
        else
            navbarDM.value = false
        
        localStorage.setItem('darkmode', navbarDM.value.toString())

        let dmToggle = document.getElementsByClassName('darkmode-toggle')[0]
        dmToggle.addEventListener('click', () => {
            navbarDM.value = dm.value.isActivated()
        })
    })
</script>

<template>
    <div>
        <Navbar :darkmode="navbarDM"/>
        <slot />
    </div>
</template>

<style lang="sass">
    @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;700&display=swap')
    @import url('https://fonts.googleapis.com/css2?family=Poiret+One&display=swap')
    @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@100;300;400;500;700;900&display=swap')
    @import url('https://fonts.googleapis.com/css2?family=Roboto+Mono:wght@100;300;400;500;700&display=swap')
    @import url('https://fonts.googleapis.com/css2?family=Open+Sans:wght@100;300;400;500;700&display=swap')
    
    @mixin scrollbars($size, $foreground-color, $background-color: mix($foreground-color, white,  50%))
      // For Google Chrome
      &::-webkit-scrollbar 
        width:  $size
        height: $size
    
      &::-webkit-scrollbar-thumb 
        border-radius: 32px
        border-top-right-radius: 0px
        border-bottom-right-radius: 0px
        transition: all 0.3s ease-in-out
        background-color: $foreground-color
    
      &::-webkit-scrollbar-track 
        background: $background-color
        border-right: dashed 1px $foreground-color
    
      // For Internet Explorer
      & 
        scrollbar-face-color: $foreground-color
        scrollbar-track-color: $background-color

    .darkmode--activated, 
    .darkmode--activated p,
    .darkmode--activated button,
    .darkmode--activated .loginField
        color: white

        select option
            background-color: #000
            color: #fff

    body
        font-family: 'Roboto', sans-serif
        color: black

        @include scrollbars(6px, black, white)

        &.darkmode--activated
            @include scrollbars(6px, white, black)

    .loginField
        display: flex
        flex-direction: row
        align-items: center
        justify-content: space-between
        border: solid 1px #333
        border-radius: 4px
        outline: none
        padding-left: 4px
        padding-right: 4px
        color: #000

        span
            color: #000
            
        input, select, textarea
            border: none
            outline: none
            height: 100%
            padding-top: 8px
            padding-bottom: 8px
            background-color: transparent
            font-size: inherit
            margin-left: 4px

            option
                background-color: #fff

    .loadingPopupWrapper
        position: fixed
        top: 0
        left: 0
        bottom: 0
        right: 0
        z-index: 999
        background-color: rgba(0, 0, 0, 1)
        display: flex
        align-items: center
        justify-content: center

    .loadingPopup
        position: sticky
        top: 0
        left: 0
        bottom: 0
        right: 0
        z-index: 999
        width: 350px
        height: 350px
</style>

<style lang="scss">
    
</style>