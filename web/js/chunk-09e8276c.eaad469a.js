(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-09e8276c"],{"0781":function(t,e,a){},"17eb":function(t,e,a){"use strict";a("265a")},"265a":function(t,e,a){},"2bb5":function(t,e,a){},"2dbc":function(t,e,a){"use strict";a.r(e);var i=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",{staticClass:"flex-1 flex-vertical m-l-r-16"},[a("div",{staticClass:"home-padding background-white m-b-16"},[a("data-board")],1),a("div",{staticClass:"user-trend home-padding background-white m-b-16"},[a("user-trend")],1),a("div",{staticClass:"home-padding background-white m-b-16"},[a("type-ratio")],1)])},n=[],o=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",{staticClass:"data-list m-t-10"},[a("div",{staticClass:"flex"},t._l(t.data,(function(e,i){return a("span",{directives:[{name:"loading",rawName:"v-loading",value:e.loading,expression:"item.loading"}],key:i,staticClass:"list-item inline-block"},[a("p",{staticClass:"item-top"},[t._v(" "+t._s(t.headListReduce[i])+" ")]),a("p",{staticClass:"item-middle"},[t._v(t._s(parseFloat(e.data.now).toLocaleString()))]),e.data.last?a("p",{staticClass:"item-bottom flex-space-between"},[a("span",{staticClass:"date-item"},[t._v("日环比 "),a("i",{class:e.data.uad?"red-color":"green-color"},[t._v(t._s(Number(e.data.circleRatio).toFixed(0)+"%"))])]),a("span",[t._v("命中率"),a("i",[t._v(t._s(" "+Number(e.data.hit).toFixed(1)+"%"))])])]):t._e()])})),0)])},s=[],r=(a("af47"),a("87c5"),a("a57c"),a("00fe"),a("11e1"),{data_board:{rta:"昨日实时RTA目标用户",oss:"昨日离线OSS目标用户",task:"任务总数"}}),l={rta:{data:{now:"0",last:"1",circleRatio:0,hit:0},loading:!1},oss:{data:{now:"0",last:"0",circleRatio:0,hit:0},loading:!1},task:{data:{now:"0"},loading:!1}},c={name:"DataBoard",props:{},computed:{headList:function(){return r},headListReduce:function(){return Object.keys(r).reduce((function(t,e){var a=r[e];return Object.keys(a).reduce((function(t,e){return t[e]=a[e],t}),t)}),{})}},mounted:function(){this.selectDate()},data:function(){return{date:"yesterday",data:l}},methods:{selectDate:function(){var t=this;Object.keys(r).forEach((function(e){var a=r[e];Object.keys(a).forEach((function(e){return t.data[e].loading=!0})),t.axiosList(e).then((function(a){if(a&&200===a.data.code){var i=r[e];Object.keys(i).forEach((function(e){return t.data[e].data=a.data.data.list[e]}))}}))["catch"]((function(t){console.warn(t)}))["finally"]((function(){var a=r[e];Object.keys(a).forEach((function(e){return t.data[e].loading=!1}))}))}))},axiosList:function(t){return this.$http.get("rta/data/list",{params:{date_type:this.date,module:t}})}}},d=c,u=(a("17eb"),a("cba8")),h=Object(u["a"])(d,o,s,!1,null,"5a260f48",null),m=h.exports,p=function(){var t=this,e=this,a=e.$createElement,i=e._self._c||a;return i("div",{directives:[{name:"loading",rawName:"v-loading",value:e.loading,expression:"loading"}],staticClass:"container"},[i("el-form",{staticClass:"customized-form flex",attrs:{inline:!0}},[i("span",{staticClass:"form-title"},[e._v("目标用户变化趋势")]),i("el-form-item",{attrs:{prop:"dateValue"}},[i("customized-time-picker",{staticClass:"time-picker long-item",attrs:{date:e.optionsForm.dateValue,"max-date":1,showShortcutsSetting:!1,"min-date":e.minDate},on:{"update:date":function(t){return e.$set(e.optionsForm,"dateValue",t)},change:e.dataChange}})],1),i("el-form-item",{staticClass:"rankRange"},e._l(e.rangeList,(function(t,a){return i("el-button",{key:a,class:e.rankButtonStyle==t.value?"button-active":"",attrs:{size:"small"},on:{click:function(t){return e.getRangList(a)}}},[e._v(" "+e._s(t.label)+" ")])})),1),i("el-form-item",{directives:[{name:"show",rawName:"v-show",value:"chart"===e.buttonStyle,expression:"buttonStyle === 'chart'"}],staticClass:"middle-item"},[i("el-select",{attrs:{placeholder:"选择查询类型",clearable:""},on:{change:e.listLoadCopy},model:{value:e.optionsForm.type,callback:function(t){e.$set(e.optionsForm,"type",t)},expression:"optionsForm.type"}},e._l(e.searchWay,(function(t,e){return i("el-option",{key:e,attrs:{label:e,value:t}})})),1)],1),i("el-form-item",{directives:[{name:"show",rawName:"v-show",value:"chart"===e.buttonStyle,expression:"buttonStyle === 'chart'"}],staticClass:"middle-item"},[i("el-select",{attrs:{placeholder:"选择任务",filterable:"",clearable:""},on:{change:e.listLoad},model:{value:e.optionsForm.task_id,callback:function(t){e.$set(e.optionsForm,"task_id",t)},expression:"optionsForm.task_id"}},e._l(e.taskList,(function(t){return i("el-option",{key:t.id,attrs:{label:t.task_name,value:t.task_id}})})),1)],1),i("el-form-item",{directives:[{name:"show",rawName:"v-show",value:"chart"===e.buttonStyle,expression:"buttonStyle === 'chart'"}],staticClass:"middle-item"},[i("el-select",{attrs:{placeholder:"选择设备号类型",filterable:"",clearable:""},on:{change:e.listLoad},model:{value:e.optionsForm.id_type,callback:function(t){e.$set(e.optionsForm,"id_type",t)},expression:"optionsForm.id_type"}},e._l(e.typeList,(function(t,e){return i("el-option",{key:e,attrs:{label:e,value:t}})})),1)],1),i("div",{staticClass:"align-right"},[i("el-form-item",{attrs:{size:"mini"}},e._l(e.buttonList,(function(t){return i("el-button",{key:t.value,class:e.buttonStyle==t.value?"button-active":"",on:{click:function(a){return e.buttonClick(t.value)}}},[i("span",{staticClass:"iconfont",class:t.iconName})])})),1),i("el-form-item",{staticClass:"chart-table-button"},[i("el-button",{directives:[{name:"show",rawName:"v-show",value:"table"===e.buttonStyle,expression:"buttonStyle === 'table'"}],staticClass:"small-button",attrs:{type:"primary",size:"small"},on:{click:e.exportTable}},[e._v("导出表格 ")])],1)],1)],1),i("div",{directives:[{name:"show",rawName:"v-show",value:"chart"===e.buttonStyle,expression:"buttonStyle === 'chart'"}],ref:"chart",class:e.list&&e.list.length?"":"empty-chart",staticStyle:{height:"318px"}}),i("customized-table",{directives:[{name:"show",rawName:"v-show",value:"table"===e.buttonStyle,expression:"buttonStyle === 'table'"}],ref:"customizedTable",staticClass:"customized-table white-table mini-table",attrs:{"max-height":null,"table-height":241,"show-column-border":!0,Data:e.tableList,Header:e.header,total:e.total,"page-size":e.pageSize,"current-page":e.currentPage},on:{"size-change":function(a){e.pageSizeChange(e.tableListLoad,t,a)},"current-change":function(a){e.pageChange(e.tableListLoad,t,a)}}})],1)},f=[],b=(a("9664"),a("89a9")),g=a("6aee"),y=(a("5f92"),{tooltip:{trigger:"axis",textStyle:{fontWeight:"normal"}},grid:{left:"3%",right:"4%",top:"10%",bottom:"11%",containLabel:!0},xAxis:{type:"category",boundaryGap:!0,data:[],axisTick:{show:!0,inside:!0,lineStyle:{color:"#EBEBEB"}},axisLine:{show:!1}},yAxis:[{type:"value",nameLocation:"end",axisTick:{show:!1},splitLine:{lineStyle:{color:"#ebebeb"}}}],series:[{name:"目标用户数",type:"line",smooth:.4,symbolSize:8,showSymbol:!1,itemStyle:{color:"#2B4DFF",borderColor:"#2B4DFF"},data:[]}]}),v=function(t){return parseFloat(t.total).toLocaleString()},w=[{prop:"dt",label:"日期",width:"250",align:"center"},{prop:"task_id",label:"任务ID",align:"center"},{prop:"get_type",label:"查询类型",align:"center"},{prop:"task_name",label:"任务名称",align:"center"},{prop:"total",label:"目标用户数",align:"center",formatter:v}],_=[{label:"近7日",value:7,isPlain:!0},{label:"近30日",value:30,isPlain:!0}],C=a("7eeb"),L=a("4bbd"),k=a("f904"),x={name:"UserTrend",mixins:[b["a"],L["a"]],created:function(){this.header=w},data:function(){return{header:"",option:y,common:k["a"],rangeList:_,rankRangeList:{7:Object(C["d"])(7,1),30:Object(C["d"])(30,1)},rankButtonStyle:7,optionsForm:{dateValue:Object(C["d"])(7,1),type:"",task_id:"",id_type:""},searchWay:{"实时RTA":"1","离线OSS":"2","实时RTA,离线OSS":"3"},typeList:{IDFA:"idfamd5",IMEI:"imeimd5",OAID:"oaidmd5"},minDate:365,_header:w,list:[],tableList:[{dt:"2022-01-13",get_type:"实时rta",task_id:"32896",task_name:"淘宝促活定向",total:"4035395550"}],taskList:[],buttonList:[{iconName:"icon-chart",value:"chart"},{iconName:"icon-table",value:"table"}],buttonStyle:"chart"}},mounted:function(){this.initChart(),this.axiosTaskList(),this.buttonClick(this.buttonStyle)},deactivated:function(){this.reset()},methods:{exportTable:function(){var t=this;this.$http.get("rta/data/list",{params:{start_date:this.common.getNewDay(this.optionsForm.dateValue[0]),end_date:this.common.getNewDay(this.optionsForm.dateValue[1]),is_export:1,module:"user_trend_execl"},responseType:"blob"}).then((function(e){t.common.downloadFileBlob(e)}))},getRangList:function(t){this.rankButtonStyle=this.rangeList[t].value,this.optionsForm.dateValue=this.rankRangeList[this.rangeList[t].value],this.buttonClick(this.buttonStyle)},dataChange:function(){this.rankButtonStyle=0,this.buttonClick(this.buttonStyle)},buttonClick:function(t){this.buttonStyle!==t&&this.reset(),this.buttonStyle=t,"chart"===this.buttonStyle?this.listLoad():(this.chart.clear(),this.tableListLoad(1))},initChart:function(){this.chart=g["a"](this.$refs.chart),this.resizeChart()},paintChart:function(){this.optionData(this.list),this.chart.clear(),this.chart.setOption(this.option,!0)},axiosList:function(){return this.$http.get("rta/data/list",{params:{start_date:this.common.getNewDay(this.optionsForm.dateValue[0]),end_date:this.common.getNewDay(this.optionsForm.dateValue[1]),api_type:this.optionsForm.type,tb_id:this.optionsForm.task_id,id_type:this.optionsForm.id_type,module:"user_trend"}})},axiosTableList:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:1;return this.$http.get("rta/data/list",{params:{start_date:this.common.getNewDay(this.optionsForm.dateValue[0]),end_date:this.common.getNewDay(this.optionsForm.dateValue[1]),page:t,page_size:this.pageSize,module:"user_trend_execl"}})},axiosTaskList:function(){var t=this;return this.$http.get("task/list",{params:{search_get_type:this.optionsForm.type,get_all:1}}).then((function(e){t.taskList=e.data.data.list}))},optionData:function(t){var e=[],a=[];t.forEach((function(t){e.push(t["dt"]),a.push(t["total"])})),this.option.xAxis.data=e,this.option.series[0].data=a},listLoadCopy:function(){this.listLoad(),this.axiosTaskList()},listLoad:function(){var t=this;this.loading=!0,this.axiosList().then((function(e){e&&200===e.data.code&&(t.list=e.data.data.list)}))["catch"]((function(t){console.warn(t)}))["finally"]((function(){t.loading=!1,t.paintChart()}))},tableListLoad:function(t){var e=this;this.loading=!0,this.axiosTableList(t).then((function(a){a&&200===a.data.code&&(e.tableList=a.data.data.list,e.total=Number(a.data.data.pagination.total),e.currentPage=t)}))["catch"]((function(t){console.warn(t)}))["finally"]((function(){e.$nextTick(e.$refs.customizedTable.doLayout),e.loading=!1}))},reset:function(){this.rankButtonStyle=7,this.optionsForm.dateValue=Object(C["d"])(7,1),this.optionsForm.type="",this.optionsForm.task_id=""}}},S=x,D=(a("bb5d"),Object(u["a"])(S,p,f,!1,null,"547e99ac",null)),F=D.exports,T=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",{directives:[{name:"loading",rawName:"v-loading",value:t.loading,expression:"loading"}],staticClass:"container"},[a("el-form",{staticClass:"customized-form flex",attrs:{inline:!0}},[a("span",{staticClass:"form-title"},[t._v("设备类型占比")]),a("el-form-item",{attrs:{prop:"dateValue"}},[a("el-date-picker",{staticClass:"single-time-picker middle-item",attrs:{type:"date",placeholder:"选择日期"},on:{change:t.handleDate},model:{value:t.dateValue,callback:function(e){t.dateValue=e},expression:"dateValue"}})],1)],1),a("el-row",{staticClass:"m-t-10"},[a("el-col",{attrs:{span:12,xs:24}},[a("pie-chart",{ref:"Mobile",attrs:{list:t.MobileRatioList,title:t.MobileChartTitle,"color-list":t.MobileColorList}})],1),a("el-col",{attrs:{span:12,xs:24}},[a("pie-chart",{ref:"Android",attrs:{list:t.AndroidRatioList,title:t.AndroidChartTitle,"color-list":t.AndroidColorList}})],1)],1)],1)},z=[],N=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",[a("span",[t._v(t._s(t.title))]),a("div",{ref:"chart",class:t.isNull?"empty-chart":"",staticStyle:{height:"330px"}})])},O=[],A=(a("5270"),a("7ef0"),{title:{left:"left",textStyle:{fontSize:14,fontWeight:"normal",fontColor:"#333333"}},tooltip:{show:!0,formatter:function(t){var e="目标用户数: "+parseFloat(t.data.num).toLocaleString()+"</br>占比: "+t.value+"%";return e}},legend:{top:"bottom",icon:"circle",itemWidth:10,itemHeight:10},series:[{type:"pie",radius:"50%",minAngle:10,showEmptyCircle:!1,color:[],data:[],itemStyle:{borderWidth:8,borderColor:"#fff"},label:{fontSize:14,lineHeight:25},labelLine:{length:20,length2:20,lineStyle:{color:"#D9D9D9"}},emphasis:{scale:!1}}]}),j=a("7c98"),R={name:"PieChart",mixins:[b["a"]],props:{list:[Object,Array],colorList:Array,title:String},mounted:function(){this.option=this.common.deepCopy(A,this.option),this.initChart()},data:function(){return{common:k["a"],showPie:!1,isNull:!1}},methods:{searchFn:function(){this.paintChart()},initChart:function(){this.chart=g["a"](this.$refs.chart),this.resizeChart()},paintChart:function(){this.optionData(this.list),this.chart.clear(),this.chart.setOption(this.option,!0)},optionData:function(t){if(this.option.series[0].color=this.colorList,Object(j["isArray"])(this.list))return this.option.series[0].data=[],void(this.isNull=!0);this.isNull=!1;var e=Object.keys(t).reduce((function(e,a){return e.push({name:a,value:t[a].ratio.toFixed(0),num:t[a].num.toFixed(0)}),e}),[]);this.option.series[0].data=e.reverse()}}},V=R,$=Object(u["a"])(V,N,O,!1,null,"381b51a6",null),E=$.exports,M={name:"TypeRatio",mixins:[b["a"]],components:{PieChart:E},mounted:function(){this.listLoad()},data:function(){return{MobileRatioList:{},AndroidRatioList:{},minDate:Math.ceil((new Date-new Date("2018-1-1"))/864e5),dateValue:new Date-864e5,MobileChartTitle:"移动端设备类型占比",AndroidChartTitle:"安卓手机类型占比",MobileColorList:["#F1902C","#4CBD42"],AndroidColorList:["#F1902C","#4063DF"],common:k["a"]}},methods:{handleDate:function(){this.listLoad()},listLoad:function(){var t=this;this.loading=!0,this.axiosList().then((function(e){e&&200===e.data.code&&(t.MobileRatioList=e.data.data.list.device,t.AndroidRatioList=e.data.data.list.android)}))["catch"]((function(t){console.warn(t)}))["finally"]((function(){t.loading=!1,t.$refs.Mobile.searchFn(),t.$refs.Android.searchFn()}))},axiosList:function(){return this.$http.get("rta/data/list",{params:{start_date:this.dateValue?this.common.getNewDay(this.dateValue):this.common.getNewDay(Object(C["d"])(1,1)[0]),end_date:this.dateValue?this.common.getNewDay(this.dateValue):this.common.getNewDay(Object(C["d"])(1,1)[0]),module:"type_ratio"}})}}},B=M,P=(a("f10f"),Object(u["a"])(B,T,z,!1,null,"f75c899c",null)),W=P.exports,I={name:"DataScreen",mixins:[b["a"]],components:{DataBoard:m,UserTrend:F,TypeRatio:W},data:function(){return{}},methods:{}},H=I,J=(a("ad75"),a("a93d"),Object(u["a"])(H,i,n,!1,null,"344a16c8",null));e["default"]=J.exports},"4bbd":function(t,e,a){"use strict";a("cd5c");e["a"]={data:function(){return{pageSize:10,total:0,currentPage:1,header:null,tableData:[],loading:!1}},mounted:function(){},methods:{pageChange:function(t,e,a){this.currentPage=a;for(var i=arguments.length,n=new Array(i>3?i-3:0),o=3;o<i;o++)n[o-3]=arguments[o];t.call.apply(t,[e,a].concat(n))},pageSizeChange:function(t,e,a){this.pageSize=a;for(var i=arguments.length,n=new Array(i>3?i-3:0),o=3;o<i;o++)n[o-3]=arguments[o];this.pageChange.apply(this,[t,e,1].concat(n))}}}},"5f92":function(t,e,a){var i=a("e7b1"),n=a("79d4");i({global:!0,forced:parseFloat!=n},{parseFloat:n})},"79d4":function(t,e,a){var i=a("d10e"),n=a("2f67"),o=a("9e4a"),s=a("7995"),r=a("87e1").trim,l=a("ba54"),c=o("".charAt),d=i.parseFloat,u=i.Symbol,h=u&&u.iterator,m=1/d(l+"-0")!==-1/0||h&&!n((function(){d(Object(h))}));t.exports=m?function(t){var e=r(s(t)),a=d(e);return 0===a&&"-"==c(e,0)?-0:a}:d},"7eeb":function(t,e,a){"use strict";a.d(e,"d",(function(){return i})),a.d(e,"b",(function(){return n})),a.d(e,"e",(function(){return o})),a.d(e,"a",(function(){return s})),a.d(e,"c",(function(){return r}));a("3c7d"),a("dfcf"),a("f904");var i=function(t){var e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:0,a=new Date,i=new Date,n=e+t-1;return a.setTime(a.getTime()-864e5*n),i.setTime(i.getTime()-864e5*e),[a,i]},n=function(){var t=new Date,e=new Date,a=t.getDay()>0?t.getDay()-1:6;return e.setTime(e.getTime()-864e5*a),[e,t]},o=function(){var t=new Date,e=new Date,a=t.getDay();return e.setTime(e.getTime()-864e5*(a+6)),t.setTime(t.getTime()-864e5*a),[e,t]},s=function(){var t=new Date,e=new Date,a=t.getDate()-1;return e.setTime(e.getTime()-864e5*a),[e,t]},r=function(){var t=new Date,e=t.getDate(),a=t.getFullYear()-(t.getMonth()>0?0:1),i=(t.getMonth()+11)%12,n=new Date(a,i,1);return t.setTime(t.getTime()-864e5*e),[n,t]}},"89a9":function(t,e,a){"use strict";e["a"]={data:function(){return{date:[],chart:null,loading:!1,export:""}},mounted:function(){},beforeDestroy:function(){window.removeEventListener("resize",this.resizeChartMethod)},methods:{resizeChart:function(){window.addEventListener("resize",this.resizeChartMethod)},resizeChartMethod:function(){this.chart.resize()}}}},a93d:function(t,e,a){"use strict";a("c7b6")},ad75:function(t,e,a){"use strict";a("0781")},b59c:function(t,e,a){},bb5d:function(t,e,a){"use strict";a("b59c")},c7b6:function(t,e,a){},f10f:function(t,e,a){"use strict";a("2bb5")}}]);