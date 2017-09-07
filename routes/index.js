const express = require('express');
const router = express.Router();
const http = require("http");
const cheerio = require("cheerio");
/* GET home page. */


router.get('/listImg.json', function(request, response, next) {
 
	http.get("http://beijing.leying.com/", function(res) {

		if(res.statusCode == "200") {

			let html = '';

			res.on("data", function(data) { //返回的结果是一个流，一旦有数据=返回就挂在html中
				html += data;
			})

			res.on("end", function(){
				var $ = cheerio.load(html),
					result = [],
					list = $(".movie-count").nextAll(0).find("li");   //表示里边项的集合

					//创建一个方法，获取等号后边的字符
					var str="";
					function getStr(str){
						if (str && str.length) {
							return str.split("=")[1];
						}else {
							return '';
						}
					}

				for (var i = 0; i < list.length; i++) {
					let item = list.eq(i),
						title = item.find("a").attr("title"),
						name = item.find("b").attr("title"),  //电影名
						price = item.find(".price").find(".f18").text(),   //价格
						// hasImg = item.parent().find("img").length ? true: false,
						imgSrc = item.find("a").find("img").attr("data-original"),
						oldStr = item.find("a").attr("href") || "",    //获取到带有id 的字符串
						id=getStr(oldStr);
						// id =oldStr.match(/[0-9]{4}/);
						isChoose=item.find(".ticket-btn").find("a").text();
						// id =oldStr.match(/[0-9]+/);
						// matches = item.attr("href").match(/([0-9]+)/),
						// categoryName = item.parent().find("font").text(),
						// color = item.parent().find("font").attr("color");

						// date = date.replace(/(\()|(\))/g, '');
						// categoryName = categoryName.replace(/(\[)|(\])/g, '');
						// if (matches && matches.length) {
						// 	id = matches[0];
						// }
					
					if (title && price) {
						result.push({
							title: title,
							name: name,
							price: price,
							imgSrc: imgSrc,
							id: id,
							isChoose: isChoose
							// categoryName: categoryName,
							// color: color
						})
					}
				}

				response.json({   //网页面上输出
					ret: true,
					data: {
						articles:result
					}
				});
				
			})

		}
	})

});

	

module.exports = router;
