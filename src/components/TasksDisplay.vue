<template>
  <div>
    <ul>
      <li v-for="m in tasks" :key="m.sid">
        <h4>
          {{ m.name }}
        </h4>
        <p>
          {{ m.submitStatue }}
          <button @click="addToSettlement(m.sid, m.name,m.answers)" v-if="m.answerable">
            加入结算区
          </button>
          <button v-else disabled>
            {{ waitMessage }}
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
      const token = localStorage.getItem("token"); //获得token
      
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
      }; //设置请求参数
      axios //请求作业列表信息
        .request(options)
        .then((response) => {
          //同步
          let data = response.data["data"]; //为了简写而将返回数组赋值
          this.tasks = []; //清空tasks
          for (var i of data) {
            //遍历返回数组
            //把数据推入tasks
            this.tasks.push({
              sid: i["taskId"],
              name: i["taskName"],
              answerable: false, //先赋值为false,再异步更改。
              submitable: i["submitCode"] === 0, //0时可以提交
              submitStatue: i["submitState"],
            });
          }
          this.waitMessage = "正在问服务器有没有答案……";
          var sent = []; //发送数据初始化
          //把可提交的全部加入发送数据
          for (let n of this.tasks) {
            if (n["submitable"]) {
              sent.push(Number(n["sid"]));
            }
          }
          sent = JSON.stringify(sent); //数组转化为json

          const options = {
            method: "POST",
            url: "http://xinkaoyun.tk/getoanswer2.php",
            params: { sid: sent },
          }; //设置请求参数

          axios
            .request(options)
            .then((response) => {
              if (response.data["code"] === 0) {
                alert(
                  "服务器没理你！刷新网页试试？\n多次重复出现此问题的话请将错误信息提交给开发者！\n错误信息:后端500，code=0，" +
                    response.data["errorMessage"]
                );
                return;
              }
              for (let i of this.tasks) {
                if (
                  response.data[i["sid"]] === undefined ||
                  response.data[i["sid"]] === "No Answer"
                ) {
                } else {
                  i["answerable"] = true;
                  i["answers"] = response.data[i["sid"]];
                }
              }
              this.waitMessage = "没有找到这套题的答案";
            })
            .catch(function (error) {
              alert(
                "服务器没理你！刷新网页试试？\n多次重复出现此问题请将错误信息提交给开发者！\n错误信息:" +
                  error
              );
            });
          return;
          //判断是否有答案
        })
        .catch((error) => {
          alert(
            "服务器没理你！刷新网页试试？\n多次重复出现此问题请将错误信息提交给开发者！\n错误信息:" +
              error
          );
        });
    },
  },
  methods: {
    addToSettlement(sid, name,answers) {
      let Settler = localStorage.getItem("Settler");
      Settler = Settler === null ? {} : JSON.parse(Settler);
      Settler[String(sid)] = {name:name,answers:answers};
      localStorage.setItem("Settler", JSON.stringify(Settler));
    },
  },
};
</script>

<style>
</style>