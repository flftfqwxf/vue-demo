var Server = require("ohana");
// 使用 madoka.generate 为默认的解析器，解析数据模板
var server = new Server();

server.start(80,'static.gmmtour.com');