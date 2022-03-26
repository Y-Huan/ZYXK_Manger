import variables from '@/styles/element-variables.scss'
import defaultSettings from '@/settings'

const { tagsView, fixedHeader, sidebarLogo } = defaultSettings

const state = {
  theme: variables.theme,
  tagsView: tagsView,
  fixedHeader: fixedHeader,
  sidebarLogo: sidebarLogo
}
export default {
  namespaced: true,
  state
}

