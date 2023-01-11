<template>
  <div>
    <h1>{{ waitMessage }}</h1>
    <ul>
      <li v-for="m in tasks" :key="m.sid">
        <h4>
          {{ m.name }}
        </h4>
        <p>
          {{ m.submitStatue }}
          <button @click="addToSettlement(m.sid)" v-if="m.answerable">
            加入结算区
          </button>
          <button @click="addToSettlement(m.sid)" v-else disabled>
            加入结算区
          </button>
        </p>
      </li>
    </ul>
  </div>
</template>

<script>
import axios from "axios";
export default {
  name: "TasksDisplay",
  props: ["subId"],
  data() {
    return {
      tasks: [],
      waitMessage: "",
    };
  },
  watch: {
    subId(nV) {
      const token = localStorage.getItem("token");
      let options = {
        method: "POST",
        url: "https://zuoyenew.xinkaoyun.com:30001/holidaywork/student/getTasks",
        headers: { "content-type": "application/x-www-form-urlencoded" },
        data: {
          page: "1",
          limit: "99999999",
          sid: nV,
          start: "",
          end: "",
          submitCode: "",
          token: token,
        },
      };
      axios //请求作业列表信息
        .request(options)
        .then((response) => {
          let data = response.data["data"]; //为了简写而赋值
          this.tasks = [];
          for (var i of data) {
            this.tasks.push({
              sid: i["taskId"],
              name: i["taskName"],
              answerable: false,
              submitable: i["submitCode"] === 0,
              submitStatue: i["submitState"],
            });
          }
          this.waitMessage = "请求作业答案中,请稍后...";
          var sent = [];
          for (let n of this.tasks) {
            if (n["submitable"]) {
              sent.push(Number(n["sid"]));
            }
          }
          sent = JSON.stringify(sent);
          const options = {
            method: "POST",
            url: "http://xinkaoyun.tk/getoanswer2.php",
            params: { sid: sent },
          };

          axios
            .request(options)
            .then((response) => {
              if (response.data["code"] === 0) {
                alert(
                  "网络连接失败，刷新网页试试？\n多次重复出现此问题请将错误信息提交给开发者！\n错误信息:" +
                    response.data["errorMessage"]
                );
              }
              for (let i of this.tasks) {
                if (
                  response.data[i["sid"]] === undefined ||
                  response.data[i["sid"]] === "No Answer"
                ) {
                } else {
                  i["answerable"] = true;
                }
              }
              this.waitMessage = "";
            })
            .catch(function (error) {
              alert(
                "网络连接失败，刷新网页试试？\n多次重复出现此问题请将错误信息提交给开发者！\n错误信息:" +
                  error
              );
            });
          return;
          //判断是否有答案
        })
        .catch((error) => {
          alert(
            "网络连接失败，刷新网页试试？\n多次重复出现此问题请将错误信息提交给开发者！\n错误信息:" +
              error
          );
        });
    },
  },
  methods: {
    addToSettlement(sid) {
      let Settler = localStorage.getItem("Settler");
      Settler = Settler === null ? [] : JSON.parse(Settler);
      Settler.push(sid);
      localStorage.setItem("Settler", JSON.stringify(Settler));
    },
  },
};
</script>

<style>
</style>