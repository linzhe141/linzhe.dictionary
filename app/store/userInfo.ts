export const userInfoStore = reactive({
  username: '',
  nickname: '',
  bio: '',
  bgImage: '',
  avatarImage: '',
  createTime: '',

  vocabularyList: [] as {
    id: number
    word: string
    symbols: string | null
    trans: string
    createdAt: string
    userId: number | null
  }[],
  loadingVocabularyList: false,
})

export async function getVocabularyCheatSheet() {
  userInfoStore.loadingVocabularyList = true
  return await $fetch('/api/vocabularyCheatSheet')
    .then((data) => {
      userInfoStore.vocabularyList = data
    })
    .finally(() => {
      userInfoStore.loadingVocabularyList = false
    })
}

export async function getProfileInfo() {
  return await $fetch('/api/profiles/info').then((data) => {
    userInfoStore.username = data.username || ''
    userInfoStore.nickname = data.nickname || ''
    userInfoStore.bio = data.bio || ''
    userInfoStore.bgImage = data.bgImage || ''
    userInfoStore.avatarImage = data.avatarImage || ''
    userInfoStore.createTime = data.createTime
  })
}

export async function mergeUserInfo() {
  await Promise.all([getVocabularyCheatSheet(), getProfileInfo()])
}
