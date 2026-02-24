export default defineNuxtPlugin((nuxtApp) => {
    nuxtApp.vueApp.directive('digits-only', {
        mounted(el) {
            const allowed = [
                'Backspace',
                'Delete',
                'ArrowLeft',
                'ArrowRight',
                'Tab',
            ]

            el.addEventListener('keydown', (e) => {
                if (
                    !/[0-9]/.test(e.key) &&
                    !allowed.includes(e.key)
                ) {
                    e.preventDefault()
                }
            })
        }
    })
})