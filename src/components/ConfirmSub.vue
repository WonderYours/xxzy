<template>
  <div>
    <p>请确认要上传的二卷</p>
    <p>例如：有他人姓名，和自己是同一班级/级部……</p>
    <div v-for="(v, k) in taskdata" :key="k">
      <!-- v是每一项作业的数据,k是每一项作业的sid -->
      <h1>{{ v.name }}</h1>
      <div v-for="(v2, k2) in v.sub" :key="k2">
        <!-- v2是二卷url数组，k2是teaId -->
        <h4 v-if="asyncShow">
          {{ subData[String(k2)]["name"] }}·{{
            subData[String(k2)]["class"]
          }}·年级第{{ subData[String(k2)]["grade"] }}名
        </h4>
        <img v-for="(v3, k3) in v2" :key="k3" :src="v3" @click="jumpTo(v3)" />
        <!-- k3做uid用，v3是二卷url -->
        <button @click="randomSubChange(k, k2)">这什么玩意啊，赶紧换</button>
      </div>
    </div>
    <button @click="back">上一步</button>
    <button @click="next">下一步</button>
  </div>
</template>

<script>
import axios from "axios";
export default {
  created() {
    var _this = this;
    document.onkeydown = () => {
      let key = window.event.keyCode;
      if (key == 39 || key == 13) {
        _this.next();
      } else {
        if (key == 37) {
          _this.back();
        }
      }
    };
  },
  props: ["taskdata"],
  methods: {
    jumpTo(url) {
      window.open(url, "_blank");
    },
    next() {
      this.$emit("next");
    },
    back() {
      this.$emit("back");
    },
    randomSubChange(taskId, teaId) {
      let token = localStorage.getItem("token");
      let n = parseInt(this.gradeList[taskId]["size"]);
      n = n >= 1000 ? 1000 : n;
      console.log("n:" + n);
      let index = parseInt(Math.random() * (n + 1) - 1);
      console.log(index);
      let userId = this.gradeList[taskId]["data"][index]["userId"];
      let userName = this.gradeList[taskId]["data"][index]["realName"];
      let userClass = this.gradeList[taskId]["data"][index]["className"];
      this.$set(this.subData, String(teaId), {});
      this.$set(this.subData[String(teaId)], "name", userName);
      this.$set(this.subData[String(teaId)], "class", userClass);
      this.$set(this.subData[String(teaId)], "grade", String(index + 1));
      const options = {
        method: "POST",
        url: "https://zuoyenew.xinkaoyun.com:30001/holidaywork/student/getMutualTaskInfo",
        headers: { "content-type": "application/x-www-form-urlencoded" },
        data: {
          taskId: taskId,
          userId: userId,
          token: token,
        },
      };
      //此api请求某人（userId）的某套（taskId）二卷
      //然后把url作为列表设置到taskdata[作业号]["sub"][题号]中
      axios
        .request(options)
        .then((response) => {
          this.$set(
            this.taskdata[String(taskId)]["sub"],
            String(teaId),
            response.data["data"][0]["images"]
          );
        })
        .catch(function (error) {
          console.error(error);
        });
    },
  },
  data() {
    return {
      gradeList: {},
      subData: {},
      asyncShow: false,
    };
  },
  mounted() {
    let token = localStorage.getItem("token");
    setTimeout(() => {
      this.asyncShow = true;
    }, 1500);
    for (let i in this.taskdata) {
      //i即taskId
      for (let j in this.taskdata[String(i)]["sub"]) {
        const options = {
          method: "POST",
          url: "https://zuoyenew.xinkaoyun.com:30001/holidaywork/student/getGradeRanks",
          headers: { "content-type": "application/x-www-form-urlencoded" },
          data: {
            page: "1",
            limit: "1000",
            taskId: String(i),
            token: token,
          },
        };
        axios.request(options).then(async (response) => {
          await this.$set(this.gradeList, String(i), response.data);
          this.randomSubChange(i, j);
        });
      }
    }
  },
};
</script>

<style>
</style>