(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-3410352d"],{4488:function(t,e,a){},"46f8":function(t,e,a){"use strict";a.r(e);var n=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",{staticClass:"app-container"},[a("div",{staticClass:"search_box"},[a("el-input",{staticStyle:{width:"200px"},attrs:{clearable:"",placeholder:"领用人名称"},model:{value:t.contactName,callback:function(e){t.contactName="string"===typeof e?e.trim():e},expression:"contactName"}}),a("el-select",{staticStyle:{width:"150px"},attrs:{placeholder:"仓库"},model:{value:t.whse_id,callback:function(e){t.whse_id=e},expression:"whse_id"}},t._l(t.whse_list,(function(t){return a("el-option",{key:t.whseId,attrs:{label:t.whseName,value:t.whseId}})})),1),a("el-date-picker",{staticStyle:{width:"250px"},attrs:{type:"daterange","range-separator":"至","value-format":"yyyy-MM-dd HH:mm:ss","start-placeholder":"开始日期","end-placeholder":"结束日期","default-time":["00:00:00","23:59:59"]},model:{value:t.creat_time,callback:function(e){t.creat_time=e},expression:"creat_time"}})],1),a("div",{staticStyle:{"margin-top":"20px"}},[a("el-button-group",[a("el-button",{attrs:{type:"primary",icon:"el-icon-search"},on:{click:function(e){return t.getList(1)}}},[t._v("搜索")]),a("el-button",{attrs:{type:"primary",icon:"el-icon-refresh-right"},on:{click:t.restParams}},[t._v("重置")]),a("el-button",{attrs:{type:"primary",icon:"el-icon-download"},on:{click:t.out_product_excel}},[t._v("导出领用人领用统计列表")])],1)],1),a("div",{staticClass:"table_box"},[a("el-table",{staticClass:"table",staticStyle:{width:"100%"},attrs:{data:t.customerList,stripe:"",border:"",height:"100%"}},[a("el-table-column",{attrs:{label:"操作",width:"160",align:"center"},scopedSlots:t._u([{key:"default",fn:function(e){return[a("el-button",{attrs:{size:"mini",type:"primary"},on:{click:function(a){return t.getDetail(e.$index,e.row.contactId,e.row.contactName)}}},[t._v("详情")])]}}])}),a("el-table-column",{attrs:{prop:"contactName",label:"领用人 ",align:"center"}}),a("el-table-column",{attrs:{prop:"weight",label:"期间计重领用数量",width:"200",align:"center"}}),a("el-table-column",{attrs:{prop:"weightMoney",label:"期间计重领用金额",width:"200",align:"center"}}),a("el-table-column",{attrs:{prop:"piecegoods",label:"期间计件领用数量",width:"200",align:"center"}}),a("el-table-column",{attrs:{prop:"piecegoodsMoney",label:"期间计件领用金额",width:"200",align:"center"}}),a("el-table-column",{attrs:{prop:"money",label:"期间领用金额合计",width:"200",align:"center"}})],1)],1),a("el-dialog",{attrs:{title:"物品领用详情",visible:t.show_dialog,width:"1000px"},on:{"update:visible":function(e){t.show_dialog=e}}},[a("span",{staticStyle:{"font-size":"15px"}},[t._v("领用人名称:"+t._s(t.detailContactName))]),a("el-table",{attrs:{data:t.productDetail}},[a("el-table-column",{attrs:{property:"productName",label:"物品名称",width:"200",align:"center"}}),a("el-table-column",{attrs:{property:"skuId",label:"物品编号",width:"200",align:"center"}}),a("el-table-column",{attrs:{label:"计量单位",align:"center"},scopedSlots:t._u([{key:"default",fn:function(e){return[a("span",[t._v(t._s(t._f("sexToString")(e.row.unitType)))])]}}])}),a("el-table-column",{attrs:{property:"amount",label:"领用数量",align:"center"}}),a("el-table-column",{attrs:{property:"money",label:"领用金额",align:"center"}})],1)],1),t.total>15?a("div",{staticClass:"page_box"},[a("el-pagination",{attrs:{background:"",layout:"prev, pager, next","page-size":15,"current-page":t.current,total:t.total},on:{"current-change":t.getList,"update:currentPage":function(e){t.current=e},"update:current-page":function(e){t.current=e}}})],1):t._e()],1)},i=[],c=(a("a434"),a("e5bf")),o=a("ed08"),r={data:function(){return{status_list:[{name:"启用",value:!0},{name:"禁用",value:!1}],creat_time:[Object(o["b"])(new Date((new Date).getTime()-2592e6),"{y}-{m}-{d} ")+"00:00:00",Object(o["b"])(new Date,"{y}-{m}-{d} ")+"23:59:59"],contactName:"",detailContactName:"",whse_list:[],whse_id:"",customer_name:"",customer_phone:"",productName:"",isEnable:"",region:[],city:[],total:0,current:1,customerList:[],productDetail:[],regionName:"",editIndex:"",show_dialog:!1,customer_form:{status:"",name:"",user:"",amount:"",city:"",address:""},options:[],props:{value:"code",label:"regionName",children:"sonRegionList",checkStrictly:!0}}},mounted:function(){this.getList()},filters:{sexToString:function(t){return 2==t?"KG":1==t?"件":void 0}},methods:{getList:function(t){var e=this,a={pageNo:t||this.current,pageSize:15,contactName:this.contactName,whseId:this.whse_id};this.creat_time&&this.creat_time.length&&(a.createTime=this.creat_time[0],a.endTime=this.creat_time[1]),console.log(a),Object(c["c"])(a).then((function(t){e.customerList=t.records,e.total=t.total,e.current=t.current})),Object(c["e"])().then((function(t){e.whse_list=t,e.total=t.total,e.current=t.current}))},restParams:function(){this.contactName="",this.sku_id="",this.whse_id="",this.creat_time=[Object(o["b"])(new Date((new Date).getTime()-2592e6),"{y}-{m}-{d} {h}:{i}:{s}"),Object(o["b"])(new Date,"{y}-{m}-{d} {h}:{i}:{s}")]},open_add_customer:function(){this.editIndex="",this.customer_form={status:"",name:"",user:"",phone:"",city:"",address:""},this.show_dialog=!0},getDetail:function(t,e,a){var n=this;this.detailContactName=a;var i={contactId:e,contactName:this.contactName,whseId:this.whse_id};this.creat_time&&this.creat_time.length&&(i.createTime=this.creat_time[0],i.endTime=this.creat_time[1]),console.log(i),Object(c["a"])(i).then((function(t){n.productDetail=t,n.show_dialog=!0}))},handleDelete:function(t,e){var a=this;console.log(e),this.$confirm("此操作将永久删除该供应商, 是否继续?","提示",{confirmButtonText:"确定",cancelButtonText:"取消",type:"warning"}).then((function(){delSupplier({companyId:e}).then((function(e){a.$message.success("删除成功"),a.customerList.splice(t,1)}))}))},switchCompany:function(t,e,a){var n=this;console.log({companyId:a}),enableCompany({companyId:a}).then((function(a){n.$message.success("操作成功"),n.customerList[e].isEnable=t}))},out_product_excel:function(){var t={contactName:this.contactName,whseId:this.whse_id};this.creat_time&&this.creat_time.length&&(t.createTime=this.creat_time[0],t.endTime=this.creat_time[1]),window.open("//192.168.1.155:28081/contact/excelOutRecord?contactName="+t.contactName+"&whseId="+t.whseId+"&createTime="+t.createTime+"&endTime="+t.endTime+"&token="+this.$store.state.user.token)}}},s=r,l=(a("613a"),a("2877")),u=Object(l["a"])(s,n,i,!1,null,"c79c3e62",null);e["default"]=u.exports},"613a":function(t,e,a){"use strict";a("4488")},e5bf:function(t,e,a){"use strict";a.d(e,"d",(function(){return i})),a.d(e,"e",(function(){return c})),a.d(e,"b",(function(){return o})),a.d(e,"c",(function(){return r})),a.d(e,"a",(function(){return s}));var n=a("a880");function i(t){return n["a"].post("/product/recordList",t)}function c(){return n["a"].get("/warehouse/list")}function o(t){return n["a"].post("/product/recordDetail",t)}function r(t){return n["a"].post("/contact/recordList",t)}function s(t){return n["a"].post("/contact/recordDetail",t)}}}]);