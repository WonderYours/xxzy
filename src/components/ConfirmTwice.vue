<template>
  <div>
    <button @click="back">上一步</button>
    <button @click="next">下一步</button>
  </div>
</template>
  
<script>
export default {
  methods: {
    next() {
      this.$emit("next");
    },
    back() {
      this.$emit("back");
    },
  },
};
</script>
  
<style>
</style>