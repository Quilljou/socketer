<template lang="html">
  <el-dialog
    title="提示"
    :visible="visible"
    width="30%">
    <el-input v-model="name" placeholder="请输入名称"></el-input>
    <span slot="footer" class="dialog-footer">
      <el-button @click="hide">取 消</el-button>
      <el-button type="primary" @click="handleClick" :disabled="!name.length">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  props: {
    visible: Boolean,
    name: String
  },
  methods: {
    hide() {
      this.$emit('update:visible', false)
    },
    handleClick() {
      this.hide()
      this.$emit('modalSure', this.name)
    }
  }
}
</script>

<style lang="css">
</style>
