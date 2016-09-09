/**
 * Created by leixianhua on 16/8/5.
 */

function checkLogin() {
    var authorization = window.localStorage.getItem('Authorization');
    if (authorization) {
        return authorization;
    }
    // if (location.pathname.indexOf('/login')!==0) {
    //     location.href='/login';
    // }
    return false
}
module.exports = {
    checkLogin: checkLogin,
    setToken: (token)=> {
        window.localStorage.setItem('Authorization', token);


    },
    clearToken:()=>{
        window.localStorage.removeItem('Authorization');

    }
}