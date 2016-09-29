const http = require('http');
const fs = require('fs');
const qs = require('querystring');
const projectspage = require('./projectspage.js');
var projects = ['/catcarousel', '/hangman', '/slider', '/spotify', '/sprint'];
var projectsWithHtml = projects.map(function(project){
    return project + '.html';
});
var checker = projects.concat(projectsWithHtml);
var project;

var server = http.createServer(function(request, response){
    var method = request.method;
    var url = request.url;
    var headers = request.headers;
    var pUrl = qs.parse(url);
    console.log(pUrl);
    console.log('method:' + method + '\nurl:' + url + '\nheaders:' + JSON.stringify(headers));
    request.on('error', function(err){
        console.log(err);
    });
    response.on('error', function(err){
        console.log(err);
    });
    if (method != 'GET'){
        response.statusCode = 404;
        response.end();
    }
    else if(method == 'GET' && url == '/'){
        response.setHeader('Content-Type', 'text/html');
        response.end(projectspage.Page);
    }
    else{
        var type = url.split('.')[1];
        var isProject = checker.indexOf(url);
        if (isProject != -1 ){
            if (type != undefined){
                url = url.split('.')[0];
            }
            project = url;
            response.setHeader('Content-Type', 'text/html');
            var index = fs.createReadStream('projects' + url + '/index.html');
            index.pipe(response);
        }
        else if (type == 'css'){
            response.setHeader('Content-Type', 'text/' + type);
            var css = fs.createReadStream('projects' + project + url);
            css.pipe(response);
        }
        else if (type == 'js'){
            response.setHeader('Content-Type', 'text/' + type);
            var js = fs.createReadStream('projects' + project + url);
            js.pipe(response);
        }
        else if (type == 'jpg'){
            response.setHeader('Content-Type', 'image/jpeg');
            var jImage = fs.createReadStream('projects' + project + url);
            jImage.pipe(response);
        }
        else if (type == 'png'){
            response.setHeader('Content-Type', 'image/' + type);
            var pImage = fs.createReadStream('projects' + project + url);
            pImage.pipe(response);
        }
        else if (type == 'svg'){
            response.setHeader('Content-Type', 'image/svg+xml');
            var sImage = fs.createReadStream('projects' + project + url);
            sImage.pipe(response);
        }
        else if (type == 'wav'){
            response.setHeader('Content-Type', 'audio/x-wav');
            var wav = fs.createReadStream('projects' + project + url);
            wav.pipe(response);
        }
        else if (type == 'mp3'){
            response.setHeader('Content-Type', 'audio/mpeg');
            var mp3 = fs.createReadStream('projects' + project + url);
            mp3.pipe(response);
        }
        else{
            response.statusCode = 404;
            response.end();
        }
    }
}).listen(8080);
