<template>
    <div>
      <button @click="back">上一步</button>
      </div>
  </template>
  
  <script>
  export default {
    methods: {
      back() {
        this.$emit("back");
      },
    },
  };
  </script>
  
  <style>
  </style>