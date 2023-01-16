<template>
  <div>
    <span>{{ msg }}</span>
  </div>
</template>
  
<script>
import axios from "axios";
export default {
  data() {
    return {
      msg: "请稍等，提交中……",
    };
  },
  props: ["taskdata"],
  created() {
    var _this = this;
    document.onkeydown = () => {
      let key = window.event.keyCode;
      if (key == 39 || key == 13) {
        window.open("/#/home", "_self");
      }
    };
  },
  mounted() {
    console.log(this.taskdata);
    for (let i in this.taskdata) {
      const options = {
        method: "POST",
        url: "https://zuoyenew.xinkaoyun.com:30001/holidaywork/student/submitTask",
        headers: { "content-type": "application/x-www-form-urlencoded" },
        data: {
          objectiveAnswer: this.taskdata[String(i)]["objSubData"],
          subjectiveAnswer: this.taskdata[String(i)]["subSubData"],
          taskId: String(i),
          token: "pc_d0d491ed7b6a483ca75825e37ad3a36b",
        },
      };
      axios
        .request(options)
        .then((response) => {
          this.msg = response.data["msg"];
          localStorage.removeItem("Settler");
        })
        .catch(function (error) {
          console.error(error);
        });
    }
  },
};
</script>
  
  <style>
</style>