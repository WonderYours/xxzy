<template>
  <div>
    <p>请确认要上传的二卷</p>
    <p>例如：有他人姓名，和自己是同一班级/级部……</p>

    <button @click="back">上一步</button>
    <button @click="next">下一步</button>
  </div>
</template>

<script>
export default {
  props: ["taskdata"],
  methods: {
    next() {
      this.$emit("next");
    },
    back() {
      this.$emit("back");
    },
  },
  mounted() {
    for (let i in this.taskdata) {
      
    }
  },
};
</script>

<style>
</style>