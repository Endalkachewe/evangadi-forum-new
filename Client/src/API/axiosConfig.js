import axios from "axios";

const axiosBase = axios.create({
  // baseURL: "http://localhost:5500/api"
   baseURL: "https://evangadiforumbe.cherasfaw.com/"
})
export default axiosBase