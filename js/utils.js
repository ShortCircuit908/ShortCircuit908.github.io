/**
 * Created by Caleb Milligan on 4/11/2016.
 */

function setCookie(key, value, expire) {
    expire = expire || 0;
    var date = new Date();
    date.setTime(date.getTime() + expire);
    var expires = "expires=" + date.toUTCString();
    document.cookie = key + "=" + value + "; " + expires;
}

function getCookie(key) {
    key += "=";
    var cookies = document.cookie.split(';');
    for (var i = 0; i < cookies.length; i++) {
        var c = cookies[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(key) == 0) {
            return c.substring(key.length, c.length)
        }
    }
    return undefined;
}

function hasCookie(key) {
    return getCookie(key) !== undefined;
}