import axios from 'axios'
import Swal from 'sweetalert2'

// const baseURL = 'https://cryptic-castle-05556.herokuapp.com/api/'
// const baseURL ='http://localhost:3000/api/'


const axiosInstance = axios.create({
  // baseURL: process.env.VUE_APP_BASEURL
  baseURL: 'https://cryptic-castle-05556.herokuapp.com/api/'
})

axiosInstance.interceptors.request.use(config => {
  const token = localStorage.getItem('token')
  if(token){
    config.headers['Authorization']= `Bearer ${token}`   
  }
  return config
}, error => {
  Promise.reject(error)
})

export const apiHelper = axiosInstance

export const Toast = Swal.mixin({
  toast: true,
  position: 'center',
  showConfirmButton: false,
  timer: 3000
})