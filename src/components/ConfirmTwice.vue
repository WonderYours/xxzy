<template>
  <div>
    <h1>只差一步！您即将提交：</h1>
    <p>选择已自动按30%错误率设置</p>
    <div v-for="(v, k) in taskdata" :key="k">
      <p>{{ v.name }}</p>
      <p>选择答案：{{ objM(k) }}</p>
      <img v-for="(v2, k2) in v.sub" :key="k2" :src="v2" />
    </div>
    <button @click="back">上一步</button>
    <button @click="next">完成提交</button>
  </div>
</template>
  
<script>
export default {
  created() {
    var _this = this;
    document.onkeydown = () => {
      let key = window.event.keyCode;
      if (key == 39 || key == 13) {
        alert("为了您的安全，我们阻止了你的鲁莽行为");
      } else {
        if (key == 37) {
          _this.back();
        }
      }
    };
  },
  props: ["taskdata"],
  methods: {
    next() {
      this.$emit("next");
    },
    back() {
      this.$emit("back");
    },
    objM(sid) {
      let ret = "";
      for (let i in this.taskdata[String(sid)]["answers"]) {
        ret +=
          String(i) +
          ":" +
          this.taskdata[String(sid)]["answers"][String(i)] +
          ",";
      }
      return ret;
    },
    handleString() {},
  },
  mounted() {
    window.scrollTo(0, 0);
    for (let i in this.taskdata) {
      if (Object.keys(this.taskdata[i]["sub"]).length == 0) {
        this.$set(this.taskdata[String(i)], "subSubData", "");
        return;
      }
      for (let j in this.taskdata[i]["sub"]) {
        let string = "";
        let answerArray = this.taskdata[i]["sub"][j];
        for (let h of answerArray) {
          string += j + "," + h + ";";
        }
        string += "|";
        string = string.replaceAll(";|", "|");
        string = string.substring(0, string.length - 1);
        this.$set(this.taskdata[String(i)], "subSubData", string);
      }
    }
  },
};
</script>
  
<style>
</style>