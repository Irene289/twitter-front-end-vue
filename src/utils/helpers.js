import axios from 'axios'
import Swal from 'sweetalert2'

// const baseURL = 'https://cryptic-castle-05556.herokuapp.com/api/'
// const baseURL ='http://localhost:3000/api/'


const axiosInstance = axios.create({
  baseURL: process.env.VUE_APP_BASEURL
})

axiosInstance.interceptors.request.use(config => {
  const token = localStorage.getItem('token')
  if(token){
    config.headers['Authorization']= `Bearer ${token}`   
  }
  return config
}, error => {
  // console.log(error.toJSON())
  Promise.reject(error)
})


axiosInstance.interceptors.response.use( response => {
  return response;
}, function (error) {
  // if (error.response.status === 500) {
  //   console.log('HI, here is helpers.js')
  //   return error.response
  // } else {
    return Promise.reject(error);
  // }
})

export const apiHelper = axiosInstance

export const Toast = Swal.mixin({
  toast: true,
  position: 'center',
  showConfirmButton: false,
  timer: 3000
})