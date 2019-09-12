<template>
  <a-modal :width="640" :visible="visible" title="角色添加" @ok="handleSubmit" @cancel="visible = false">
    <a-form @submit="handleSubmit" :form="form">
      <a-form-item
        label="角色编号"
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
      >
        <a-input v-decorator="['id', {rules:[{required: true, message: '请输入角色编号'}]}]" />
      </a-form-item>
      <a-form-item
        label="角色名称"
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
      >
        <a-input v-decorator="['name', {rules:[{required: true, message: '请输入角色名称'}]}]" />
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script>
export default {
  name: 'TaskForm',
  data () {
    return {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 7 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 13 }
      },

      visible: false,
      form: this.$form.createForm(this)
    }
  },
  methods: {
    add () {
      this.visible = true
    },
    handleSubmit () {
      const { form: { validateFields } } = this
      this.visible = true
      validateFields((errors, values) => {
        if (!errors) {
          console.log('values', values)
          this.$emit('success')
        }
      })
    }
  }
}
</script>
