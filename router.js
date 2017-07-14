/**
 * @playWithRouter 
 * @authro: zhangxiang
 * @update: 2017/07/14
 */

var Util = {
    parseHashURL: function(){
        var hashDetail = location.hash.split('?'),
            hashPath = hashDetail[0].split("#")[1],
            params = hashDetail[1] ? hashDetail[1].split("&") : [],
            query = {};
        
        params.forEach(function(param){
            param = param.split('=');
            query[param[0]] = param[1];
        });

        return {
            path: hashPath,
            query: query
        }
    },
    hasClass: (function(target, className){
        
        if(document.body.classList) {
            return function(target, className){
                
                return target.classList.contains(className);
            }
        } else {

            return function(target, className){
                return new RegExp('(\\s|^)' + className + '(\\s|$').test(target.className);
            }
        }
    }())
}

var Router = function(config){
    this.mode = config.mode || 'hash';
    this.routes = config.routes || [];
    this.currentRoute = '/';
    this.init(this.mode);
    console.log(this);
}

Router.prototype.init = function(mode){
    var that = this;
    switch(mode) {
        case 'hash': 

            this.hashRoute(this.routes);
            window.addEventListener('hashchange', function(){

                console.log("路径变化为" + location.hash);
                var pathInfo = Util.parseHashURL();
                that.routeChange(pathInfo.path);
            });
            break;
        case 'history':
            this.historyRoute(this.routes);
            window.addEventListener('click', function(event){

                var target = event.target;

                if(!target.tagName.toLowerCase === 'a') {

                    return;
                } else {
                    
                    if(!Util.hasClass(target, 'router-link')) {
                        return;
                    } else {

                        event.preventDefault();
                        var href = target.getAttribute('href');
                        var path = href.split("?")[0];
                        var query = location.href.split("?")[1] || '';

                        window.history.pushState({
                            path: path
                        }, null, href);
                        
                        // console.log(path);
                        that.routeChange(path);
                    }
                }
            });
            window.addEventListener('popstate', function(event){
                console.log("?????????");
                console.log(history.state);
                console.log(event.state);
                that.routeChange(event.state.path);
            });
            break;
    }
}

Router.prototype.routeChange = function(path, query){
    // console.log(path);
    // console.log(this);
    this[path](query);
}

Router.prototype.hashRoute = (function(){

    var hashRouters = {};

    return function(configRoutes){
        
        configRoutes.forEach(function(eachRoute){

            eachRoute.path = eachRoute.path.replace(/\s*/g, '');

            if(eachRoute.callback && Object.prototype.toString.call(eachRoute.callback) === '[object Function]') {

                hashRouters[eachRoute.path] = eachRoute.callback;                
            } else {

                console.error("初始化" + eachRoute.path + "出错，回调不是一个函数！");
            }
        });

        this.routeChange = this.routeChange.bind(hashRouters);
    }
    
}());

Router.prototype.historyRoute = (function(){

    var historyRouters = {};

    return function(configRoutes){
        // popstate
        // pushState
        configRoutes.forEach(function(eachRoute){

            eachRoute.path = eachRoute.path.replace(/\s*/g, '');

            if(eachRoute.callback && Object.prototype.toString.call(eachRoute.callback) === '[object Function]') {

                historyRouters[eachRoute.path] = eachRoute.callback;                
            } else {

                console.error("初始化" + eachRoute.path + "出错，回调不是一个函数！");
            }
        });

        this.routeChange = this.routeChange.bind(historyRouters);
    }
}());


