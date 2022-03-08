import axios from 'axios'
import Element from 'element-ui'
import store from './store'
import router from './router'
import Global from "@/Global";


axios.defaults.baseURL = Global.url

const request = axios.create({
    timeout: 5000
})


// 前置拦截
request.interceptors.request.use(config => {
  return config
})

request.interceptors.response.use(response => {

    let res = response.data;

    //controller里直接return Result.fail的话在这里
    if (res.code === 200) {
      return response
    } else {

        if (res.code === 401) {
            store.commit("REMOVE_INFO")
            router.push("/login")
        }

      Element.Message.error(res.msg, {duration: 3 * 1000})

      return Promise.reject(res.msg)
    }
  },
  error => {
    //controller之外抛出的异常。error.response:
      // {data: '<!doctype html><html lang="en"><head><title>HTTP S…ne" /><h3>Apache Tomcat/9.0.56</h3></body></html>', status: 500, statusText: '', headers: {…}, config: {…}, …}
      // config: {transitional: {…}, transformRequest: Array(1), transformResponse: Array(1), timeout: 5000, adapter: ƒ, …}
      // data: "<!doctype html><html lang=\"en\"><head><title>HTTP Status 500 – Internal Server Error</title><style type=\"text/css\">body {font-family:Tahoma,Arial,sans-serif;} h1, h2, h3, b {color:white;background-color:#525D76;} h1 {font-size:22px;} h2 {font-size:16px;} h3 {font-size:14px;} p {font-size:12px;} a {color:black;} .line {height:1px;background-color:#525D76;border:none;}</style></head><body><h1>HTTP Status 500 – Internal Server Error</h1><hr class=\"line\" /><p><b>Type</b> Exception Report</p><p><b>Message</b> java.lang.ArithmeticException: &#47; by zero</p><p><b>Description</b> The server encountered an unexpected condition that prevented it from fulfilling the request.</p><p><b>Exception</b></p><pre>javax.servlet.ServletException: java.lang.ArithmeticException: &#47; by zero\n\torg.apache.shiro.web.servlet.AdviceFilter.cleanup(AdviceFilter.java:196)\n\torg.apache.shiro.web.filter.authc.AuthenticatingFilter.cleanup(AuthenticatingFilter.java:155)\n\torg.apache.shiro.web.servlet.AdviceFilter.doFilterInternal(AdviceFilter.java:148)\n\torg.apache.shiro.web.servlet.OncePerRequestFilter.doFilter(OncePerRequestFilter.java:125)\n\torg.apache.shiro.web.servlet.ProxiedFilterChain.doFilter(ProxiedFilterChain.java:66)\n\torg.apache.shiro.web.servlet.AdviceFilter.executeChain(AdviceFilter.java:108)\n\torg.apache.shiro.web.servlet.AdviceFilter.doFilterInternal(AdviceFilter.java:137)\n\torg.apache.shiro.web.servlet.OncePerRequestFilter.doFilter(OncePerRequestFilter.java:125)\n\torg.apache.shiro.web.servlet.ProxiedFilterChain.doFilter(ProxiedFilterChain.java:66)\n\torg.apache.shiro.web.servlet.AbstractShiroFilter.executeChain(AbstractShiroFilter.java:450)\n\torg.apache.shiro.web.servlet.AbstractShiroFilter$1.call(AbstractShiroFilter.java:365)\n\torg.apache.shiro.subject.support.SubjectCallable.doCall(SubjectCallable.java:90)\n\torg.apache.shiro.subject.support.SubjectCallable.call(SubjectCallable.java:83)\n\torg.apache.shiro.subject.support.DelegatingSubject.execute(DelegatingSubject.java:387)\n\torg.apache.shiro.web.servlet.AbstractShiroFilter.doFilterInternal(AbstractShiroFilter.java:362)\n\torg.apache.shiro.web.servlet.OncePerRequestFilter.doFilter(OncePerRequestFilter.java:125)\n\torg.springframework.web.filter.RequestContextFilter.doFilterInternal(RequestContextFilter.java:100)\n\torg.springframework.web.filter.OncePerRequestFilter.doFilter(OncePerRequestFilter.java:117)\n\torg.springframework.web.filter.FormContentFilter.doFilterInternal(FormContentFilter.java:93)\n\torg.springframework.web.filter.OncePerRequestFilter.doFilter(OncePerRequestFilter.java:117)\n\torg.springframework.web.filter.CharacterEncodingFilter.doFilterInternal(CharacterEncodingFilter.java:201)\n\torg.springframework.web.filter.OncePerRequestFilter.doFilter(OncePerRequestFilter.java:117)\n</pre><p><b>Root Cause</b></p><pre>java.lang.ArithmeticException: &#47; by zero\n\tcom.markerhub.shiro.JwtFilter.onAccessDenied(JwtFilter.java:78)\n\torg.apache.shiro.web.filter.AccessControlFilter.onAccessDenied(AccessControlFilter.java:133)\n\torg.apache.shiro.web.filter.AccessControlFilter.onPreHandle(AccessControlFilter.java:162)\n\torg.apache.shiro.web.filter.PathMatchingFilter.isFilterChainContinued(PathMatchingFilter.java:214)\n\torg.apache.shiro.web.filter.PathMatchingFilter.preHandle(PathMatchingFilter.java:189)\n\tcom.markerhub.shiro.JwtFilter.preHandle(JwtFilter.java:142)\n\torg.apache.shiro.web.servlet.AdviceFilter.doFilterInternal(AdviceFilter.java:131)\n\torg.apache.shiro.web.servlet.OncePerRequestFilter.doFilter(OncePerRequestFilter.java:125)\n\torg.apache.shiro.web.servlet.ProxiedFilterChain.doFilter(ProxiedFilterChain.java:66)\n\torg.apache.shiro.web.servlet.AdviceFilter.executeChain(AdviceFilter.java:108)\n\torg.apache.shiro.web.servlet.AdviceFilter.doFilterInternal(AdviceFilter.java:137)\n\torg.apache.shiro.web.servlet.OncePerRequestFilter.doFilter(OncePerRequestFilter.java:125)\n\torg.apache.shiro.web.servlet.ProxiedFilterChain.doFilter(ProxiedFilterChain.java:66)\n\torg.apache.shiro.web.servlet.AbstractShiroFilter.executeChain(AbstractShiroFilter.java:450)\n\torg.apache.shiro.web.servlet.AbstractShiroFilter$1.call(AbstractShiroFilter.java:365)\n\torg.apache.shiro.subject.support.SubjectCallable.doCall(SubjectCallable.java:90)\n\torg.apache.shiro.subject.support.SubjectCallable.call(SubjectCallable.java:83)\n\torg.apache.shiro.subject.support.DelegatingSubject.execute(DelegatingSubject.java:387)\n\torg.apache.shiro.web.servlet.AbstractShiroFilter.doFilterInternal(AbstractShiroFilter.java:362)\n\torg.apache.shiro.web.servlet.OncePerRequestFilter.doFilter(OncePerRequestFilter.java:125)\n\torg.springframework.web.filter.RequestContextFilter.doFilterInternal(RequestContextFilter.java:100)\n\torg.springframework.web.filter.OncePerRequestFilter.doFilter(OncePerRequestFilter.java:117)\n\torg.springframework.web.filter.FormContentFilter.doFilterInternal(FormContentFilter.java:93)\n\torg.springframework.web.filter.OncePerRequestFilter.doFilter(OncePerRequestFilter.java:117)\n\torg.springframework.web.filter.CharacterEncodingFilter.doFilterInternal(CharacterEncodingFilter.java:201)\n\torg.springframework.web.filter.OncePerRequestFilter.doFilter(OncePerRequestFilter.java:117)\n</pre><p><b>Note</b> The full stack trace of the root cause is available in the server logs.</p><hr class=\"line\" /><h3>Apache Tomcat/9.0.56</h3></body></html>"
      // headers: {content-language: 'en', content-length: '5286', content-type: 'text/html;charset=utf-8'}
      // request: XMLHttpRequest {onreadystatechange: null, readyState: 4, timeout: 5000, withCredentials: false, upload: XMLHttpRequestUpload, …}
      // status: 500
      // statusText: ""

      // error.message:
      // Request failed with status code 500

      //error.response.data: tomcat的错误页面html

      //经过全局异常处理的话，result会抛到这里面
      if (error.response.data) {

          if (error.response.data.code === 401) {
              store.commit("REMOVE_INFO")
              router.push("/login")
          }

          Element.Message.error(error.response.data.msg, {duration: 3 * 1000})
          return Promise.reject(error)
      }

      //不在controller里的异常，如果没有处理就抛到这里
      Element.Message.error(error.message, {duration: 3 * 1000})
      return Promise.reject(error)
  }
)

export default request
