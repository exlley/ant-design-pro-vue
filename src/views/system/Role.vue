import action from "../../core/directives/action";
import action from "../../core/directives/action";
<template>
  <div class="layout-page">
    <div class="flex-row">
      <a-card :bordered="false" class="role-panel" :style="{height: panelHeight + 'px'}">
        <a-button type="primary" style="width: 100%; margin-bottom: 10px;"  @click="$refs.edit.add()">添加角色</a-button>
        <a-table
          :columns="columns"
          :dataSource="roleList"
          :customRow="customClick"
          :pagination="false"
          size="small"
          rowKey="id"
          bordered>
          <span slot="action" slot-scope="text, record">
            <template>
              <a @click="handleEdit(record)">删除</a>
            </template>
          </span>
        </a-table>
      </a-card>
      <a-card class="permission-panel" :style="{height: panelHeight + 'px'}">
        <div class="per-header">
          <span>当前角色：{{role.name}}[{{role.id}}]</span>
          <div>
            <a-button type="danger" @click="selectAll">全部选择</a-button>
            <a-button type="primary" style="margin-left: 5px;"  @click="updateRole">设置权限</a-button>
          </div>
        </div>
        <a-table
          :dataSource="permissionList"
          :columns="permissColumns"
          :pagination="false"
          :scroll="{y: panelHeight - 150}"
          rowKey="key"
          size="small"
          bordered>
          <template slot="menu" slot-scope="text, record">
            <div v-if="record.menu" style="font-size: 14px;">
              <a-icon v-if="record.menu.icon" :type="record.menu.icon"/>
              {{ record.menu.title }}
            </div>
          </template>
          <template slot="subMenu" slot-scope="text, record">
            <div v-if="record.subMenu" style="font-size: 14px;">
              <a-checkbox :checked="record.subMenu.checked" @click="record.subMenu.checked = !record.subMenu.checked">
                {{ record.subMenu.title }}
              </a-checkbox>
            </div>
          </template>
          <template slot="actions" slot-scope="text, record">
            <div v-if="record.actions">
              <a-checkbox v-for="action in record.actions" :key="action.key" :checked="action.checked" @click="action.checked = !action.checked">
                {{ action.title }}
              </a-checkbox>
            </div>
          </template>
        </a-table>
      </a-card>
    </div>
    <add-role ref="edit" @success="save"></add-role>
  </div>
</template>

<script>
import { asyncRouterMap } from '@/config/router.config'
import AddRole from './modules/AddRole'
export default {
  components: { AddRole },
  data () {
    return {
      columns: [
        { title: '编号', dataIndex: 'id', align: 'center' },
        { title: '名称', dataIndex: 'name', align: 'center' },
        { title: '操作', dataIndex: 'action', align: 'center', scopedSlots: { customRender: 'action' } }
      ],
      permissColumns: [
        { title: '一级菜单', dataIndex: 'menu', width: 200, align: 'left', scopedSlots: { customRender: 'menu' } },
        { title: '二级菜单', dataIndex: 'subMenu', width: 200, align: 'left', scopedSlots: { customRender: 'subMenu' } },
        { title: '页面动作', dataIndex: 'actions', align: 'left', scopedSlots: { customRender: 'actions' } }
      ],
      list: [
        { menu: '11', sumMenu: '222' }
      ],
      roleList: [
        { id: 1, name: '超级管理员' },
        { id: 2, name: '超级管理员2' },
        { id: 3, name: '超级管理员2' },
        { id: 4, name: '超级管理员2' },
        { id: 5, name: '超级管理员2' },
        { id: 6, name: '超级管理员2' },
        { id: 7, name: '超级管理员2' },
        { id: 8, name: '超级管理员2' },
        { id: 9, name: '超级管理员2' },
        { id: 10, name: '超级管理员2' },
        { id: 11, name: '超级管理员2' },
        { id: 12, name: '超级管理员2' },
        { id: 13, name: '超级管理员2' },
        { id: 14, name: '超级管理员2' },
        { id: 15, name: '超级管理员2' },
        { id: 16, name: '超级管理员2' },
        { id: 17, name: '超级管理员2' }
      ],
      role: {},
      permissionList: [],
      customClick: record => ({
        on: { // 事件
          click: () => {
            this.changeRole(record)
          }
        }
      })
    }
  },
  computed: {
    panelHeight () {
      return window.innerHeight - 200
    }
  },
  created () {
    this.loadPermissionList()
  },
  methods: {
    selectAll () {
      this.permissionList.forEach(item => {
        if (item.subMenu) {
          item.subMenu.checked = true
          item.actions.forEach(item2 => {
            item2.checked = true
          })
        }
      })
    },
    save () {
      alert('1111111111')
    },
    updateRole () {
      const permissions = new Set()
      this.permissionList.forEach(item => {
        if (item.subMenu) {
          if (item.subMenu.checked) {
            permissions.add(item.subMenu.key)
            item.actions.forEach(item2 => {
              if (item2.checked) {
                permissions.add(item2.key)
              }
            })
          }
        }
      })
      const data = {
        ...this.role,
        permissions: JSON.stringify(permissions)
      }
      this.$http.post('/api/role/update', data).then(() => {
        this.$message.success('权限设置成功')
      }).catch(err => {
        this.$message.error(err.message)
      })
    },
    changeRole (row) {
      this.role = row
    },
    loadPermissionList () {
      const list = []
      const menus = asyncRouterMap.find(item => item.path === '/').children
      menus.forEach(menu => {
        list.push({ menu: { ...menu.meta } })
        if (menu.children && menu.children.length > 0) {
          menu.children.forEach(subMenu => {
            let actions = []
            if (subMenu.meta.actions) {
              actions = subMenu.meta.actions.map(item => ({
                ...item,
                key: subMenu.meta.key + ':' + item.key,
                // checked: this.role.permissions.indexOf(subMenu.meta.key + ':' + item.key) !== -1
                checked: false
              }))
            }
            list.push({
              subMenu: {
                ...subMenu.meta,
                actions: undefined,
                checked: false
              },
              actions: actions
            })
          })
        }
      })
      var i = 0
      list.map(item => {
        item.key = ('' + i)
        i++
      })
      this.permissionList = list
    }
  }
}
</script>

<style scoped>
  .layout-page {
    display: flex;
    flex-direction: column;
  }

  .flex-row {
    display: flex;
    flex-direction: row;
  }

  .role-panel {
    width: 300px;
  }

  .permission-panel {
    margin-left: 20px;
    flex: 1;
  }

  .per-header {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    padding: 0 0 8px 0;
    border-bottom: 1px solid #f3f3f3;
  }
</style>
