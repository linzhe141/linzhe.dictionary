import { mergeUserInfo } from '~/store/userInfo'

export default defineComponent({
  setup() {
    const user = useCookie('user')
    watch(
      user,
      (value) => {
        if (value) mergeUserInfo()
      },
      {
        immediate: true,
      },
    )
  },
  render: () => null,
})
