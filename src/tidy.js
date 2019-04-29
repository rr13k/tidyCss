/**
 *
 * @method 提取html中的css列表
 * @param {*} _html 提取的css的html string字符串
 * @returns 返回源css列表
 */
function ExtractClsAll(_html){
	let re = /class="([a-z|A-Z|0-9|\s]+)"/gms
	return _html.match(re)
}

/**
 * @method 解析html中的css,并进行标记。 
 * @param {*} _html 传输string 类型的html的源文件
 * @returns 返回格式:{ source : bool, annotation : string }
 */
function Extractcss(_html){
	let styleRe = /(?<=style([^>]*)>)([^<]*)(?=<\/style)/gms
	let cssSource =_html.match(styleRe)
	let _list = []
	for (let i in cssSource){
		let debrisList = cssSource[i].split('}')
		for(let j in debrisList){
			let _str =  debrisList[j] + "}"
			let class_re = /.([A-Za-z0-9]+)([\s]*){(.+?)}/mgs
			if(class_re.test(_str)){ //判断是否为合法的class
				try {
					let annotation = false
					if(_str.indexOf("/*") > -1)annotation = true;
					let source = _str.match(/\.[^\{\"=]+\{[^\}]+\}/gms)[0]
					let clsnameRe =  /\.([^\{\s>]*)/
					let name =  source.match(clsnameRe)[1]
					let obj = {
						"source":source,
						"annotation":annotation,
						"class":name
					}
					_list.push(obj)
				} catch (error) {
					console.log(error)
				}
		   } 
		}
	}
	return _list
}

/**
 *
 * @method 传入string格式html文件，对css细节标识
 * @param {*} _html
 * @returns 返回 cssList格式为{ source : bool , annotation: bool , class : string}
 */
function tidyReBody(_html){
	var cssList = Extractcss(_html)
	var clsAll = ExtractClsAll(_html);
	if(clsAll){
		let clsAllStr = clsAll.toString()
		for(let i=cssList.length - 1;i>-1;i--){
			let _str = cssList[i].class
			let re = new RegExp(`(["\\s]+)${_str}(["\\s]+)`,"smg")
			if(cssList[i].annotation){ //已注释css的逻辑，如果在试用则取消注释
				re.test(clsAllStr)?cssList[i].isUse = true:cssList[i].isUse = false
			}else{ //未注释css的逻辑，如果没使用则进行注释
				re.test(clsAllStr)?cssList[i].isUse = true:cssList[i].isUse = false
			}
		}
	}
	console.dir(cssList)  //关键调试输出
	return cssList
}
/**
 *
 *
 * @param {*} _html 源html文件
 * @param {*} cssList 标记完成的css列表
 * @returns 修改后的html文件
 */
function tidyCss(_html,cssList){
	for(let i in cssList){
		if(!cssList[i].isUse && !cssList[i].annotation){
			_html = _html.replace(cssList[i].source,`/* ${cssList[i].source} */`)
		}else if(cssList[i].isUse && cssList[i].annotation){
			let _str = cssList[i].source
			let re = new RegExp(`\\/\\*([\\s]*)${_str}([\\s]*)\\*\/`,"smg")
			let source_str = _html.match(re)[0]
			let new_str = source_str.replace("/*","")
			new_str = new_str.replace("*/","")
			_html = _html.replace(source_str,new_str);
		}
	}
	return _html
}

module.exports ={
    tidyReBody,tidyCss
}