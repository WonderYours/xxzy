<template>
  <div>
    <router-link to="/settler">去结算</router-link>
    <ul>
      <li v-for="m in subjects" :key="m.uid">
        <button @click="changeCurrentSubject(m.subId)">{{ m.name }}</button>
      </li>
    </ul>
    <TaskDisplay :subId="currentSubject" />
  </div>
</template>

<script>
import axios from "axios";
import TaskDisplay from "../components/TasksDisplay.vue";
export default {
  name: "Main",
  data() {
    return {
      subjects: [],
      currentSubject: "1",
    };
  },
  components: {
    TaskDisplay,
  },
  mounted() {
    //调试期代码，生产环境删
    localStorage.setItem("token", "pc_d0d491ed7b6a483ca75825e37ad3a36b");
    //删
    var _token = localStorage.getItem("token");
    if (_token === null) {
      window.open("/login.html", "_self");
    }
    const options = {
      method: "GET",
      url: "https://zuoyenew.xinkaoyun.com:30001/holidaywork/student/getSubjects",
      params: { token: _token },
    };

    axios
      .request(options)
      .then((response) => {
        if (response.data["state"] === "over") {
          window.open("/login.html", "_self");
        } else {
          this.subjects = [];
          let uid = 1;
          for (let i of response.data["data"]) {
            this.subjects.push({
              uid: uid,
              subId: i["sid"],
              name: i["subname"],
            });
            uid++;
          }
        }
      })
      .catch(function (error) {
        console.error(error);
      });
  },
  methods: {
    changeCurrentSubject(sid) {
      this.currentSubject = sid;
    },
  },
};
</script>

<style>
</style>