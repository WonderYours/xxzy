<template>
  <div>
    <router-link to="/home">回首页</router-link>
    <progress max="100" :value="loaderValue"></progress>
    <span>
      <p>预览阶段</p>
      <p>确认二卷</p>
      <p>再次校验</p>
      <p>提交成功</p>
    </span>
    <Preview
      v-if="loaderValue == 0"
      @rm="rmFromTaskdata"
      @next="changeV(33)"
      @clear="clear"
      :taskdata="taskdata"
    />
    <ConfirmSub
      v-else-if="loaderValue == 33"
      @next="changeV(66)"
      @back="changeV(0)"
      :taskdata="taskdata"
    />
    <ConfirmTwice
      v-else-if="loaderValue == 66"
      @next="changeV(100)"
      @back="changeV(33)"
      :taskdata="taskdata"
    />
    <Complete v-else-if="100" @back="changeV(66)" :taskdata="taskdata"/>
  </div>
</template>

<script>
import Preview from "../components/Preview.vue";
import ConfirmSub from "../components/ConfirmSub.vue";
import ConfirmTwice from "../components/ConfirmTwice.vue";
import Complete from "../components/Complete.vue";
import axios from "axios";
export default {
  name: "Settler",
  components: {
    Preview,
    ConfirmSub,
    ConfirmTwice,
    Complete,
  },
  data() {
    return {
      taskdata: {},
      /**↓
       * {
       *  sid:{name,answers,objSubData,sub,subSubData}
       * }
       */
      loaderValue: 0, //0,33,66,100
    };
  },
  methods: {
    clear() {
      this.taskdata = {};
      localStorage.removeItem("Settler");
    },
    rmFromTaskdata(v) {
      this.$delete(this.taskdata, String(v));
      localStorage.setItem("Settler", JSON.stringify(this.taskdata));
    },
    changeV(v) {
      this.loaderValue = v;
    },
    getNoRepeatRandom(num, per) {
      let arr = [];
      for (let i = 1; i <= num; i++) {
        arr.push(i);
      }
      let n = parseInt(arr.length * per);
      let ret = [];
      for (let i = 1; i <= n; i++) {
        let l = arr.length;
        let index = parseInt(Math.random() * (l + 1) - 1);
        ret.push(arr[index]);
        arr.splice(index, 1);
      }
      return ret;
    },
    handleString(response, answer, i) {
      let subString = "";
      for (let h of response.data["data"]) {
        if (h["hasSubjectiveItem"] === 0) {
          if (answer[h["teaCode"]].split("").length == 1) {
            subString += h["teaId"] + "," + answer[h["teaCode"]] + "|";
          } else {
            for (let g of answer[h["teaCode"]].split("")) {
              subString += h["teaId"] + "," + g + ";";
            }
            subString += "|";
          }
        }
      }
      subString = subString.replaceAll(";|", "|");
      subString = subString.substring(0, subString.length - 1);
      this.$set(this.taskdata[i], ["objSubData"], subString);
    },
  },
  mounted() {
    let token = localStorage.getItem("token");
    let data = localStorage.getItem("Settler");
    data = data === null ? "{}" : data;
    this.taskdata = JSON.parse(data);
    const options = {
      method: "POST",
      url: "https://zuoyenew.xinkaoyun.com:30001/holidaywork/student/getTaskInfo",
      headers: { "content-type": "application/x-www-form-urlencoded" },
      data: { taskId: "", token: token },
    };
    for (let i in this.taskdata) {
      options.data.taskId = String(i);
      axios
        .request(options)
        .then((response) => {
          let answerArray = this.taskdata[i]["answers"].split("\n");
          let answer = {}; //一个对象，key为题号，value为答案
          for (let j of answerArray) {
            answer[j.split(".")[0]] = j.split(".")[1].replace(" ", "");
          }
          this.$set(this.taskdata[i], "sub", {});
          let objNum = 0;
          for (let j of response.data["data"]) {
            if (j["hasSubjectiveItem"] === 0) {
              objNum++;
            } else {
              this.$set(this.taskdata[i]["sub"], j["teaId"], []);
            }
          }
          let wrongIndexs = this.getNoRepeatRandom(objNum, 0.3).sort((a, b) => {
            return a - b;
          });
          for (let j of wrongIndexs) {
            switch (answer[String(j)]) {
              case "A":
                answer[String(j)] = "D";
                break;
              case "B":
                answer[String(j)] = "A";
                break;
              case "C":
                answer[String(j)] = "B";
                break;
              case "D":
                answer[String(j)] = "C";
                break;
              default:
                answer[String(j)] = "BD";
            }
          }
          this.taskdata[i]["answers"] = answer;
          //处理提交字符串
          this.handleString(response, answer, i);
          //该处理主观题并传给ConfirmSub
        })
        .catch(function (error) {
          alert(
            "服务器没理你！刷新网页试试？\n多次重复出现此问题的话请将错误信息提交给开发者！\n错误信息:" +
              error
          );
        });
    }
  },
};
</script>

<style>
</style>