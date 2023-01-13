<template>
  <div>
    <p>您即将提交以下作业：</p>
    <p>请注意，如果删除则必须回到主页重新添加，不能撤回</p>
    <button @click="clear">全部清空</button>
    <div v-for="(v, k) in taskdata" :key="k">
      {{ v.name }}
      <button @click="rm(k)">X</button>
    </div>

    <button @click="next">下一步</button>
  </div>
</template>

<script>
export default {
  props: ["taskdata"],
  methods: {
    clear() {
      this.$emit("clear")
    },
    next() {
      this.$emit("next");
    },
    rm(v) {
      this.$emit("rm", v);
    },
  },
};
</script>

<style>
</style>