<template>
  <a-layout :class="['layout', device]">
    <!-- SideMenu -->
    <a-drawer
      v-if="isMobile()"
      placement="left"
      :wrapClassName="`drawer-sider ${navTheme}`"
      :closable="false"
      :visible="collapsed"
      @close="drawerClose"
    >
      <side-menu
        mode="inline"
        :menus="menus"
        :theme="navTheme"
        :collapsed="false"
        :collapsible="true"
        @menuSelect="menuSelect"
      ></side-menu>
    </a-drawer>

    <side-menu
      v-if="isSideMenu()"
      mode="inline"
      :menus="menus"
      :theme="navTheme"
      :collapsed="collapsed"
      :collapsible="true"
    ></side-menu>

    <side-menu
      v-if="isTopAndSidemenu()"
      mode="inline"
      :menus="menuList"
      :theme="navTheme"
      :collapsed="collapsed"
      :collapsible="true"
    ></side-menu>

    <a-layout :class="[layoutMode, `content-width-${contentWidth}`]" :style="{ paddingLeft: contentPaddingLeft, minHeight: '100vh' }">
      <!-- layout header -->
      <global-header
        v-if="isTopMenu()"
        :mode="layoutMode"
        :menus="menus"
        :theme="navTheme"
        :collapsed="collapsed"
        :device="device"
        @toggle="toggle"
      />
      <top-menu
        v-if="isTopAndSidemenu()"
        :mode="layoutMode"
        :menus="current"
        :theme="navTheme"
        :collapsed="collapsed"
        :device="device"
        @handleClick="handleClick"
        @toggle="toggle"
      />

      <!-- layout content -->
      <a-layout-content :style="{ height: '100%', margin: '24px 24px 0', paddingTop: fixedHeader ? '64px' : '0' }">
        <multi-tab v-if="multiTab"></multi-tab>
        <transition name="page-transition">
          <route-view />
        </transition>
      </a-layout-content>

      <!-- layout footer -->
      <a-layout-footer>
        <global-footer />
      </a-layout-footer>

      <!-- Setting Drawer (show in development mode) -->
      <setting-drawer v-if="!production"></setting-drawer>
    </a-layout>
  </a-layout>

</template>

<script>
import { triggerWindowResizeEvent } from '@/utils/util'
import { mapState, mapActions } from 'vuex'
import { mixin, mixinDevice } from '@/utils/mixin'
import config from '@/config/defaultSettings'

import RouteView from './RouteView'
import SideMenu from '@/components/Menu/SideMenu'
import TopMenu from '@/components/TopMenu'
import GlobalHeader from '@/components/GlobalHeader'
import GlobalFooter from '@/components/GlobalFooter'
import SettingDrawer from '@/components/SettingDrawer'

export default {
  name: 'BasicLayout',
  mixins: [mixin, mixinDevice],
  components: {
    RouteView,
    SideMenu,
    TopMenu,
    GlobalFooter,
    SettingDrawer,
    GlobalHeader
  },
  data () {
    return {
      production: config.production,
      collapsed: false,
      menus: [],
      menuList: [],
      current: [

        {
          path: '/',
          name: 'index',
          meta: { title: '首页' },
          redirect: '/dashboard/workplace'
        },
        {
          path: '/dashboard',
          name: 'dashboard',
          redirect: '/dashboard/workplace',
          component: RouteView,
          meta: { title: '仪表盘' }
        },

        // forms
        {
          path: '/form',
          redirect: '/form/base-form',
          meta: { title: '表单页' }
        },

        // list
        {
          path: '/list',
          name: 'list',
          redirect: '/list/table-list',
          meta: { title: '列表页' }
        },

        // profile
        {
          path: '/profile',
          name: 'profile',
          redirect: '/profile/basic',
          meta: { title: '详情页' }
        },

        // result
        {
          path: '/result',
          name: 'result',
          redirect: '/result/success',
          meta: { title: '结果页' }
        },

        // Exception
        {
          path: '/exception',
          name: 'exception',
          redirect: '/exception/403',
          meta: { title: '异常页' }
        },

        // account
        {
          path: '/account',
          redirect: '/account/center',
          name: 'account',
          meta: { title: '个人页' }
        },

        // other
        {
          path: '/other',
          name: 'otherPage',
          meta: { title: '其他组件' },
          redirect: '/other/icon-selector'
        },
        // system
        {
          path: '/system',
          name: 'systemPage',
          meta: { title: '系统设置' },
          redirect: '/system/role'
        }
      ]
    }
  },
  computed: {
    ...mapState({
      // 动态主路由
      mainMenu: state => state.permission.addRouters
    }),
    contentPaddingLeft () {
      if (!this.fixSidebar || this.isMobile()) {
        return '0'
      }
      if (this.sidebarOpened) {
        return '256px'
      }
      return '80px'
    }
  },
  watch: {
    sidebarOpened (val) {
      this.collapsed = !val
    }
  },
  created () {
    this.menus = this.mainMenu.find(item => item.path === '/').children
    this.collapsed = !this.sidebarOpened
  },
  mounted () {
    const userAgent = navigator.userAgent
    if (userAgent.indexOf('Edge') > -1) {
      this.$nextTick(() => {
        this.collapsed = !this.collapsed
        setTimeout(() => {
          this.collapsed = !this.collapsed
        }, 16)
      })
    }
  },
  methods: {
    ...mapActions(['setSidebar']),
    toggle () {
      this.collapsed = !this.collapsed
      this.setSidebar(!this.collapsed)
      triggerWindowResizeEvent()
    },
    paddingCalc () {
      let left = ''
      if (this.sidebarOpened) {
        left = this.isDesktop() ? '256px' : '80px'
      } else {
        left = (this.isMobile() && '0') || ((this.fixSidebar && '80px') || '0')
      }
      return left
    },
    menuSelect () {
      if (!this.isDesktop()) {
        this.collapsed = false
      }
    },
    drawerClose () {
      this.collapsed = false
    },
    handleClick (e) {
      const menuList = this.mainMenu[0].children
      const menus = menuList.find(item => item.path === e.key)
      if (menus) {
        this.menuList = menus.children
      } else {
        this.menuList = []
      }
    }
  }
}
</script>

<style lang="less">
@import url('../components/global.less');

/*
 * The following styles are auto-applied to elements with
 * transition="page-transition" when their visibility is toggled
 * by Vue.js.
 *
 * You can easily play with the page transition by editing
 * these styles.
 */

.page-transition-enter {
  opacity: 0;
}

.page-transition-leave-active {
  opacity: 0;
}

.page-transition-enter .page-transition-container,
.page-transition-leave-active .page-transition-container {
  -webkit-transform: scale(1.1);
  transform: scale(1.1);
}
</style>
