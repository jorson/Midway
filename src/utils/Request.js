export var requestParams = {
    params: {},
    get: ()=> {
        return this.params;
    }
};

let search = location.search;
search = search.substr(1, search.length);
let params = search.split('&');
params.forEach((name)=> {
    let p = name.split("=");
    let key = p[0];
    if(key) {
        requestParams.params[key] = decodeURIComponent(p[1]);
    }
});


