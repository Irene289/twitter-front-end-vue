(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-05db5318"],{"25f0":function(e,t,s){"use strict";var r=s("5e77").PROPER,a=s("cb2d"),i=s("825a"),n=s("577e"),o=s("d039"),c=s("90d8"),u="toString",l=RegExp.prototype,m=l[u],d=o((function(){return"/a/b"!=m.call({source:"a",flags:"b"})})),p=r&&m.name!=u;(d||p)&&a(RegExp.prototype,u,(function(){var e=i(this),t=n(e.source),s=n(c(e));return"/"+t+"/"+s}),{unsafe:!0})},"2e6b":function(e,t,s){},"4ef5":function(e,t,s){"use strict";s.r(t);var r=function(){var e=this,t=e.$createElement,s=e._self._c||t;return s("main",[s("div",{staticClass:"container"},[s("div",{staticClass:"row"},[s("div",{staticClass:"col-1 col-lg-2 sidebar"},[s("Sidebar")],1),s("form",{staticClass:"col-7 col-lg-7 content-container setting-forms",attrs:{action:""},on:{submit:function(t){return t.stopPropagation(),t.preventDefault(),e.handleSubmit.apply(null,arguments)}}},[e._m(0),s("div",{staticClass:"setting-form setting-form__input-account"},[s("label",{attrs:{for:""}},[e._v("帳號")]),s("input",{directives:[{name:"model",rawName:"v-model.trim",value:e.user.account,expression:"user.account",modifiers:{trim:!0}}],attrs:{type:"text",name:"account",placeholder:"請輸入帳號",required:""},domProps:{value:e.user.account},on:{change:e.inputWarning,input:function(t){t.target.composing||e.$set(e.user,"account",t.target.value.trim())},blur:function(t){return e.$forceUpdate()}}}),s("div",{staticClass:"text-limits"},[s("span",{directives:[{name:"show",rawName:"v-show",value:e.wrongAccount,expression:"wrongAccount"}],staticClass:"text-limit"},[e._v(" 請輸入英文字母或數字 ")])])]),s("div",{staticClass:"setting-form setting-form__input-name"},[s("label",{attrs:{for:""}},[e._v("名稱")]),s("input",{directives:[{name:"model",rawName:"v-model.trim",value:e.user.name,expression:"user.name",modifiers:{trim:!0}}],attrs:{type:"text",name:"name",placeholder:"請輸入使用者名稱",required:""},domProps:{value:e.user.name},on:{change:e.inputWarning,input:function(t){t.target.composing||e.$set(e.user,"name",t.target.value.trim())},blur:function(t){return e.$forceUpdate()}}}),s("div",{staticClass:"text-limits text-limit-length"},[s("span",{directives:[{name:"show",rawName:"v-show",value:e.wrongName,expression:"wrongName"}],staticClass:"text-limit"},[e._v(" 請輸入英文姓名（可包含 - 與空白，不包含其它符號） ")]),s("span",{staticClass:"text-length",class:{waring:e.isExceed}},[e._v(" "+e._s(e.textWarning(e.user.name.length))+" "+e._s(e.user.name.length)+"/50")])])]),s("div",{staticClass:"setting-form setting-form__input-email"},[s("label",{attrs:{for:""}},[e._v("Email")]),s("input",{directives:[{name:"model",rawName:"v-model.trim",value:e.user.email,expression:"user.email",modifiers:{trim:!0}}],attrs:{type:"email",name:"email",placeholder:"請輸入 Email",required:""},domProps:{value:e.user.email},on:{change:e.inputWarning,input:function(t){t.target.composing||e.$set(e.user,"email",t.target.value.trim())},blur:function(t){return e.$forceUpdate()}}}),s("div",{staticClass:"text-limits"},[s("span",{directives:[{name:"show",rawName:"v-show",value:e.wrongEmail,expression:"wrongEmail"}],staticClass:"text-limit"},[e._v(" 請輸入正確 email 格式 ")])])]),s("div",{staticClass:"setting-form setting-form__input-password"},[s("label",{attrs:{for:""}},[e._v("密碼")]),s("input",{directives:[{name:"model",rawName:"v-model.trim",value:e.user.password,expression:"user.password",modifiers:{trim:!0}}],attrs:{type:"password",name:"password",placeholder:"請設定密碼",required:""},domProps:{value:e.user.password},on:{change:e.inputWarning,input:function(t){t.target.composing||e.$set(e.user,"password",t.target.value.trim())},blur:function(t){return e.$forceUpdate()}}}),s("div",{staticClass:"text-limits"},[s("span",{directives:[{name:"show",rawName:"v-show",value:e.wrongPassword,expression:"wrongPassword"}],staticClass:"text-limit"},[e._v(" 請輸入英文字母或數字 ")])])]),s("div",{staticClass:"setting-form setting-form__input-password-check"},[s("label",{attrs:{for:""}},[e._v("密碼確認")]),s("input",{directives:[{name:"model",rawName:"v-model.trim",value:e.user.passwordCheck,expression:"user.passwordCheck",modifiers:{trim:!0}}],attrs:{type:"password",name:"passwordCheck",placeholder:"請再次輸入密碼",required:""},domProps:{value:e.user.passwordCheck},on:{change:e.inputWarning,input:function(t){t.target.composing||e.$set(e.user,"passwordCheck",t.target.value.trim())},blur:function(t){return e.$forceUpdate()}}}),s("div",{staticClass:"text-limits"},[s("span",{directives:[{name:"show",rawName:"v-show",value:e.wrongPasswordCheck,expression:"wrongPasswordCheck"}],staticClass:"text-limit"},[e._v(" 請輸入英文字母或數字 ")])])]),s("button",{staticClass:"btn btn-setting",attrs:{type:"submit",disabled:e.isExceed||e.isWarning}},[e._v(" "+e._s(e.isProcessing?"處理中":"儲存")+" ")])]),e._m(1)])])])},a=[function(){var e=this,t=e.$createElement,s=e._self._c||t;return s("div",{staticClass:"setting-form-title"},[s("h1",[e._v("帳戶設定")])])},function(){var e=this,t=e.$createElement,s=e._self._c||t;return s("div",{staticClass:"col-4 col-lg-3"},[s("div",{staticClass:"space"})])}],i=s("5530"),n=s("1da1"),o=(s("96cf"),s("b0c0"),s("d3b7"),s("25f0"),s("ac1f"),s("00b4"),s("498a"),s("d9e2"),s("5ea5")),c=s("1602"),u=s("2fa3"),l=s("2f62"),m={name:"Setting",components:{Sidebar:o["a"]},data:function(){return{user:{id:-1,account:"",name:"",email:""},wrongAccount:!1,wrongName:!1,wrongEmail:!1,wrongPassword:!1,wrongPasswordCheck:!1,isProcessing:!1,isExceed:!1,isWarning:!1}},watch:{user:function(){this.textWarning()}},created:function(){if(-1!==this.currentUser.id){var e=this.$route.params.id;this.setUser(e)}},beforeRouteUpdate:function(e,t,s){if(-1!==this.currentUser.id){var r=e.params.id;this.setUser(r),s()}},methods:{setUser:function(e){var t=this.currentUser,s=t.id,r=t.name,a=t.account,i=t.email;this.user={id:s,name:r,account:a,email:i},e.toString()===s.toString()||this.$router.push({name:"not-fount"})},textWarning:function(e){this.isExceed=e>50},inputWarning:function(){var e=/^[A-Za-z0-9]*$/,t=/^([A-Za-z]{1,}\s?-?)*[A-Za-z]{1,}$/,s=/[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/;e.test(this.user.account)?this.wrongAccount=!1:this.wrongAccount=!0,t.test(this.user.name)?this.wrongName=!1:this.wrongName=!0,s.test(this.user.email)||""===this.user.email.trim()?this.wrongEmail=!1:this.wrongEmail=!0,e.test(this.user.password)?this.wrongPassword=!1:this.wrongPassword=!0,e.test(this.user.passwordCheck)?this.wrongPasswordCheck=!1:this.wrongPasswordCheck=!0,e.test(this.user.account)&&t.test(this.user.name)&&s.test(this.user.email)&&e.test(this.user.password)&&e.test(this.user.passwordCheck)?this.isWarning=!1:this.isWarning=!0},handleSubmit:function(){var e=this;return Object(n["a"])(regeneratorRuntime.mark((function t(){var s,r,a,i;return regeneratorRuntime.wrap((function(t){while(1)switch(t.prev=t.next){case 0:if(t.prev=0,e.isProcessing=!0,e.user.account&&e.user.name&&e.user.email&&e.user.password&&e.user.passwordCheck){t.next=6;break}return u["a"].fire({icon:"warning",title:"請輸入所有欄位"}),e.isProcessing=!1,t.abrupt("return");case 6:if(e.user.password===e.user.passwordCheck){t.next=10;break}return u["a"].fire({icon:"warning",title:"密碼不一致，請再次輸入"}),e.isProcessing=!1,t.abrupt("return");case 10:return s={account:e.user.account,name:e.user.name,email:e.user.email,password:e.user.password,passwordCheck:e.user.passwordCheck},t.next=13,c["a"].update({userId:e.user.id,formData:s});case 13:if(r=t.sent,a=r.data,i=r.statusText,"OK"===i){t.next=20;break}throw new Error(a.message);case 20:u["a"].fire({icon:"success",title:"修改完成"}),e.user.password="",e.user.passwordCheck="",e.$store.commit("setCurrentUser",e.user);case 24:e.isProcessing=!1,t.next=31;break;case 27:t.prev=27,t.t0=t["catch"](0),e.isProcessing=!1,500===t.t0.response.status?(console.log(t.t0),console.log(t.t0.response),u["a"].fire({icon:"warning",title:"account/email 已存在！"})):u["a"].fire({icon:"error",title:"無法編輯，請稍後再試"});case 31:case"end":return t.stop()}}),t,null,[[0,27]])})))()}},computed:Object(i["a"])({},Object(l["b"])(["currentUser"]))},d=m,p=(s("e421"),s("2877")),g=Object(p["a"])(d,r,a,!1,null,"055cfffa",null);t["default"]=g.exports},"90d8":function(e,t,s){var r=s("c65b"),a=s("1a2d"),i=s("3a9b"),n=s("ad6d"),o=RegExp.prototype;e.exports=function(e){var t=e.flags;return void 0!==t||"flags"in o||a(e,"flags")||!i(o,e)?t:r(n,e)}},e421:function(e,t,s){"use strict";s("2e6b")}}]);
//# sourceMappingURL=chunk-05db5318.0a2c62e8.js.map