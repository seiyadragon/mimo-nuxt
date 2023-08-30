<script lang="ts" setup>
    const supabase = useSupabaseClient()
    const user = useSupabaseUser()

    const signUp = ref(false)

    const email = ref('')

    const password = ref('')
    const passwordConfirm = ref('')

    const loading = ref(false)

    const emit = defineEmits(['signIn', 'signUp'])

    const props = defineProps({
        initFunction: {
            type: Function,
            default: () => {}
        }
    })

    const toggleSignUp = () => {
        signUp.value = !signUp.value
    }

    const handleSignIn = async () => {
        if (user.value) {
            return
        }

        if (signUp.value) {
            // Sign up
            if (password.value !== passwordConfirm.value) {
                alert("Passwords don't match!")
                return
            }

            loading.value = true
            try {
                const { error } = await supabase.auth.signUp({
                    email: email.value,
                    password: password.value,
                })

                if (error) throw error
                else {
                    alert('Check your email for the confirmation link!')
                    props.initFunction()
                }

            } catch (error: any) {
                alert(error.error_description || error.message)
            } finally {
                loading.value = false
            }
        } else {
            // Sign in
            loading.value = true
            try {
                const { error } = await supabase.auth.signInWithPassword({
                    email: email.value,
                    password: password.value,
                })

                if (error) throw error
                else {
                    props.initFunction()
                }

            } catch (error: any) {
                alert(error.error_description || error.message)
            } finally {
                loading.value = false
            }
        }
    }
</script>

<template>
    <Panel class="auth">
        <h1 v-if="signUp">Sign up!</h1>
        <h1 v-else>Sign in!</h1>
        <div class="loginField">
            <span>Email:</span>
            <input type="email" placeholder="Email" v-model="email"/>
        </div>
        <div class="loginField">
            <span>Password:</span>
            <input type="password" placeholder="Password" v-model="password"/>
        </div>
        <div v-if="signUp" class="loginField">
            <span>Confirm password:</span>
            <input type="password" placeholder="Confirm password" v-model="passwordConfirm"/>
        </div>
        <button v-if="signUp" class="authButton" @click="handleSignIn">Sign up</button>
        <button v-else class="authButton" @click="handleSignIn">Sign in</button>
        <button v-if="signUp" class="authButton" @click="toggleSignUp">Already have an account?</button>
        <button v-else class="authButton" @click="toggleSignUp">Don't have an account?</button>
    </Panel>
</template>

<style lang="sass" scoped>
    .auth
        width: 280px
        height: 100%
        display: flex
        flex-direction: column
        align-items: center
        justify-content: center
        row-gap: 8px

        h1
            text-align: center
            color: black

    .loginField
        display: flex
        flex-direction: row
        align-items: center
        justify-content: space-between
        width: 96%
        border: solid 1px #333
        border-radius: 4px
        outline: none
        padding-left: 4px
        padding-right: 4px
        color: #000

        span
            color: #000

        input
            border: none
            outline: none
            height: 100%
            padding-top: 8px
            padding-bottom: 8px
            background-color: transparent
            color: #000

    .authButton
        border: solid 1px #333
        border-radius: 4px
        outline: none
        background-color: transparent
        padding: 8px
        width: 100%
        transition: all 0.2s ease-in-out
        color: #000

        &:hover
            background-color: #333
            color: #fff
</style>