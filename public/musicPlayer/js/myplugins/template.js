define([],function () {
    function template(id,data) {
        var str = document.querySelector('#'+id).innerHTML;

        var str = "log(`" + str + "`)";
        var str = str.replace(/<%=(.+?)%>/g,"`); log($1); log(`");
        var str = str.replace(/<%(.+?)%>/g,"`); $1 log(`");
        var realfunc = function (data) {
            var htmlstr =  "";
            function log(str) {
                htmlstr += str;
            }
            eval(str);
            return htmlstr;
        };
        return realfunc(data);
    }
    return template;
});