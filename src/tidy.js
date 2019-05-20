/**
 *
 * @method 提取html中的class返回列表
 * @param {string} _html 提取的css的html string字符串
 * @returns 返回class列表
 */
function ExtractClsAll(_html){
	_html = scriptPop(_html)
	let re = /class="([^'|^"]+)"/gms
	return _html.match(re)
}

/**
 *
 * @method 去掉script标签对tidy的干扰
 * @param {string} _html
 * @returns 返回更干净的源文件
 */
function scriptPop(_html){
	let re = /<script([^>]*)>(.+?)(<\/script([^>]*)>)/smg
	let scriptList = _html.match(re)
	for(let i in scriptList ){
		_html = _html.replace(scriptList[i],"")
	}
	return _html
}

/**
 *
 * @method 提取所有的id返回列表
 * @param {string} _html 传入html String类型源码
 * @returns 返回id列表
 */
function ExtractIdAll(_html){
	_html = scriptPop(_html)
	let re = /id="([a-z|A-Z|0-9|\s|_]+)"/gms
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
		let debrisList = cssSource[i].split('}') //拆分为单独的css
		for(let j in debrisList){
			let _str =  debrisList[j] + "}"
			let class_re = /([\.#]?)([A-Z|a-z|0-9|_]+)([\s]*){(.*)}/mgs  //判断是否为正确css的正则
			if(class_re.test(_str)){ //判断是否为合法的class
				try {
					let name,_type;
					let annotation = false
					if(_str.indexOf("/*") > -1)annotation = true;  //判断是否已被注释
					var source = _str.match(/([\.|#]+)([^\{]+)\{([^\}]*)}/)
					if(source == null){continue}  // 不是id 和class 的直接跳过
					let sourceStr = source[0]   //类型问题需要转换
					let id_re = /#([a-z|A-Z|0-9|_]+){/
					if(id_re.test(sourceStr)){
						name =  sourceStr.match(id_re)[1] //获取名称
						_type = "id"
					}else{
						let clsnameRe =  /\.([^\{\s>]*)/
						name =  sourceStr.match(clsnameRe)[1]
						if(name.indexOf(":") > -1){
							name = name.split(":")[0]
						}
						_type ="class"
					}
					let obj = {
						"source":sourceStr,
						"annotation":annotation,
						"name":name,
						"type":_type
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
 * @method 将字符串进行正则转义，用于匹配
 * @param {*} _str  string 类型，需转义的字符串
 * @returns  string  类型，转义后的字符串
 */
function escapeReStr(_str){
	let _escapeChars = '{}.+?*[]^|$()\\'
	let _newStr = ''
	for(let i in _str){
		_escapeChars.indexOf(_str[i]) > -1 ? _newStr = _newStr + '\\' + _str[i]: _newStr = _newStr  + _str[i]
	}
	return _newStr
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
	var idAll =  ExtractIdAll(_html)
		for(let i=cssList.length - 1;i>-1;i--){
			let _str = cssList[i].name
			if(cssList[i].type == "class"){
				let re = new RegExp(`(["|\\s]+)${_str}(["|\\s]+)`)
				if(clsAll){
					let clsAllStr = clsAll.toString()
					re.test(clsAllStr)?cssList[i].isUse = true:cssList[i].isUse = false
				} else{
					cssList[i].isUse = false
				}
			}else if(cssList[i].type == "id"){
				let re = new RegExp(`(["|\\s]+)${_str}(["|\\s]+)`,"smg") // 判断id 是否在使用
				if(idAll){
					let idAllStr = idAll.toString()
					re.test(idAllStr)?cssList[i].isUse = true:cssList[i].isUse = false
				}else{
					cssList[i].isUse = false
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
		if(cssList[i].type == "class"){
			if(!cssList[i].isUse && !cssList[i].annotation  ){
				_html = _html.replace(cssList[i].source,`/* ${cssList[i].source} */`)
			}else if(cssList[i].isUse && cssList[i].annotation){
				let _str = escapeReStr(cssList[i].source) 
				try {
					let re = new RegExp(`\\/\\*([\\s]*)${_str}([\\s]*)\\*\/`,"smg")
					let source_str = _html.match(re)[0]
					let new_str = source_str.replace("/*","")
					new_str = new_str.replace("*/","")
					_html = _html.replace(source_str,new_str);
				} catch (error) {
					console.dir(error)
				}
			}
		}else if(cssList[i].type == "id"){
			if(!cssList[i].isUse && !cssList[i].annotation  ){ //没有使用，且没有注释
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
	}
	return _html
}

module.exports ={
    tidyReBody,tidyCss
}