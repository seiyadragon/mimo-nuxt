<script lang="ts" setup>
    const supabase = useSupabaseClient()
    const user = useSupabaseUser()

    const mode = ref('signIn')

    const email = ref('')

    const password = ref('')
    const passwordConfirm = ref('')

    const loading = ref(false)

    const emit = defineEmits(['signIn', 'signUp'])

    const props = defineProps({
        initFunction: {
            type: Function,
            default: () => {}
        }, 
        mode: {
            type: String,
            default: 'signIn'
        },
        backToDashboard: {
            type: Function,
            default: () => {}
        }
    })

    onMounted(() => {
        mode.value = props.mode
    })

    const toggleSignUp = () => {
        if (mode.value === 'signIn') {
            mode.value = 'signUp'
        } else {
            mode.value = 'signIn'
        }
    }

    const toggleForgotPassword = () => {
        if (mode.value === 'signIn') {
            mode.value = 'forgotPassword'
        } else {
            mode.value = 'signIn'
        }
    }

    const handleSignIn = async () => {
        if (user.value) {
            return
        }

        if (mode.value === 'signUp') {
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
                    mode.value = 'signIn'
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

    const handleResetPassword = async () => {
        try {
            const { error } = await supabase.auth.resetPasswordForEmail(email.value, {
                redirectTo: 'https://mimo-eight.vercel.app/dashboard?mode=resetPassword',
            })

            if (error) throw error
            else {
                alert('Check your email for the reset link!')
                mode.value = 'signIn'
            }
        } catch (error: any) {
            alert(error.error_description || error.message)
        }
    }

    const handleNewPassword = async () => {
        if (password.value !== passwordConfirm.value) {
            alert("Passwords don't match!")
            return
        }

        try {
            const { error } = await supabase.auth.updateUser({
                password: password.value,
            })

            if (error) throw error
            else {
                alert('Password updated!')

                let router = useRouter()
                router.push('/dashboard')

                props.backToDashboard()
            }
        } catch (error: any) {
            alert(error.error_description || error.message)
        }
    }
</script>

<template>
    <Panel class="auth">
        <div v-if="mode === 'signIn'" class="auth">
            <h1>Sign in!</h1>
            <div class="loginField">
                <span>Email:</span>
                <input type="email" placeholder="Email" v-model="email"/>
            </div>
            <div class="loginField">
                <span>Password:</span>
                <input type="password" placeholder="Password" v-model="password"/>
            </div>
            <button class="authButton" @click="handleSignIn">Sign in</button>
            <button class="authButton" @click="toggleSignUp">Don't have an account?</button>
            <button class="authButton" @click="toggleForgotPassword">Forgot Password?</button>
        </div>
        <div v-if="mode === 'signUp'" class="auth">
            <h1>Sign up!</h1>
            <div class="loginField">
                <span>Email:</span>
                <input type="email" placeholder="Email" v-model="email"/>
            </div>
            <div class="loginField">
                <span>Password:</span>
                <input type="password" placeholder="Password" v-model="password"/>
            </div>
            <div class="loginField">
                <span>Confirm password:</span>
                <input type="password" placeholder="Confirm password" v-model="passwordConfirm"/>
            </div>
            <button class="authButton" @click="handleSignIn">Sign up</button>
            <button class="authButton" @click="toggleSignUp">Already have an account?</button>
        </div>
        <div v-if="mode === 'forgotPassword'" class="auth">
            <div class="loginField">
                <span>Email:</span>
                <input type="email" placeholder="Email" v-model="email"/>
            </div>
            <button class="authButton" @click="handleResetPassword">Send reset email</button>
        </div>
        <div v-if="mode === 'resetPassword'" class="auth">
            <div class="loginField">
                <span>Password:</span>
                <input type="password" placeholder="Password" v-model="password"/>
            </div>
            <div class="loginField">
                <span>Confirm password:</span>
                <input type="password" placeholder="Confirm password" v-model="passwordConfirm"/>
            </div>
            <button class="authButton" @click="handleNewPassword">Reset Password</button>
        </div>
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