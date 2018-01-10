
//全局配置
var global={
	//website:"http://192.168.1.33/igift_new_copy/",
	//apiBaseUrl:'http://192.168.1.33/igift_new_copy/mobileapp_interface/',
	website:"http://www.igift.hk/",
	apiBaseUrl:'http://www.igift.hk/mobileapp_interface/'
}

//localStorage缓存
var ls = {
	setItem : function (key,value){
		localStorage.setItem(key,value)
	},
	getItem : function(key){
		return localStorage.getItem(key)
	}
}
//sessionStorage缓存
var ss = {
	setItem : function (key,value){
		sessionStorage.setItem(key,value)
	},
	getItem : function(key){
		return sessionStorage.getItem(key)
	}
}


//本地數據庫
var db = {

	dataBase:null,
	dbLink:function(dbname){
		this.dataBase = openDatabase(dbname, "1.0", "description", 5 * 1024 * 1024);
	},
	dbCreate:function(tbname){
		this.dataBase.transaction(function (tx) {
			tx.executeSql("CREATE TABLE IF NOT EXISTS "+tbname+" ('idPrimaryKey' INTEGER PRIMARY KEY ASC, step text)");
		})
	},
	dbDrop:function(tbname){
		this.dataBase.transaction(function (tx) {
			tx.executeSql("DROP TABLE "+tbname);
		})
	},
	dbDel:function(tbname,id){
		if(id){
			var sel = 'SELECT * FROM '+tbname+' where id='+id+'';
			var del = 'delete from '+tbname+' where id='+id+'';
		}else{
			var sel = 'SELECT * FROM '+tbname+'';
			var del = 'delete from '+tbname+'';
		}
		this.dataBase.transaction(function (tx) {
			tx.executeSql(sel, [], function (tx, results) {
				var len = results.rows.length;
				if(len!=0){
					tx.executeSql(del,[],null,null);
				}
			})
		})
	},
	dbTotal:function(tbname,cid,page,success){
		var len = 0;
		var where =  cid ? ' where cid='+cid+' and page='+page+'':'';
		var sel = 'SELECT * FROM '+tbname+where+'';
		//console.log(sel)
		this.dataBase.transaction(function (tx) {
			tx.executeSql(sel, [], function (tx, results) {
				len = results.rows.length;
				if( typeof(success) == 'function') success(len);
			})
		})
		return len;
	},
	dbLists:function(tbname,cid,page,success){
		var result = [];
		var where =  cid ? ' where cid='+cid+' and page='+page+'':'';
		var orderBy = tbname=='igift_category' ? ' order by id' : ' order by id desc';
		var sel = 'SELECT * FROM '+tbname+where+orderBy+'';
		//console.log(sel);
		this.dataBase.transaction(function(tx) {
				tx.executeSql(sel, [],function(tx, rs) {
						for(var i=0; i<rs.rows.length; i++) {
								var row = rs.rows.item(i)
								result[i] = row;
						}
						success(result);
				})
		})
		return result;
	},
	dbGet:function(tbname,id,idPrimaryKey,success){
		var result = [];
		var where = id ? ' where id='+id+'':' where idPrimaryKey='+idPrimaryKey+'';
		var sel = 'SELECT * FROM '+tbname+where+'';
		//console.log(sel);
		this.dataBase.transaction(function(tx) {
				tx.executeSql(sel, [],function(tx, rs) {
						for(var i=0; i<rs.rows.length; i++) {
								var row = rs.rows.item(i)
								result[i] = row;
						}
						success(result);
				})
		})
		return result;
	}


}
