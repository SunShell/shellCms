; (function ($, window, document, undefined) {
    var defaults = {
            pageSize: 10,       //每页多少数据
            pageNum: 1,         //当前页数
            allNum: 0,          //数据总条数
            pageCount: 1,       //总页数
            dataUrl: '/page',   //数据请求地址
            token: '',          //CSRF
            table: '',          //表名
            defaultCon: '',     //默认查询条件
            orderBy: '',        //排序条件
            queryCon: '',       //查询条件
            listObj: [],        //显示的字段与名称对照
            orderField: '',     //排序字段
            orderFlag: '',      //排序标志
            nameStr: '',        //需要取对照的字段
            nameObj: {},        //对照存储的对象
            modifyFun: null,    //修改方法
            delFun: null        //删除方法
        },
        tools = {};

    function ShellPaginate($ele, options) {
        this.$ele = $ele;
        this.config = $.extend(defaults, options || {});
        this.init();
    }

    ShellPaginate.prototype = {
        constructor : ShellPaginate,
        //初始化
        init : function () {
            this.bindFlag = true;
            this.getPageInfo();
        },
        //获取分页信息和第一页的数据
        getPageInfo : function () {
            var _this = this;

            $.ajax({
                type    : 'post',
                url     : _this.config.dataUrl + '/getPageInfo',
                headers : {
                    'X-CSRF-TOKEN'  : _this.config.token
                },
                data    : {
                    pageSize    : _this.config.pageSize,
                    pageNum     : _this.config.pageNum,
                    table       : _this.config.table,
                    defaultCon  : _this.config.defaultCon,
                    orderBy     : _this.config.orderBy,
                    nameStr     : _this.bindFlag ? _this.config.nameStr : '',
                    queryCon    : _this.config.queryCon
                },
                success : function (res) {
                    _this.config.allNum     = res.allNum.allNum;
                    _this.config.pageCount  = Math.ceil(_this.config.allNum / _this.config.pageSize) + (_this.config.allNum === 0 ? 1 : 0);

                    //对照赋值
                    if(_this.bindFlag && _this.config.nameStr){
                        var tmpObj = res.nameData,
                            tmpArr = [];

                        for(var o in tmpObj){
                            if(!_this.config.nameObj[o]) _this.config.nameObj[o] = {};

                            $(tmpObj[o]).each(function () {
                                tmpArr = [];

                                for(var p in this){
                                    tmpArr.push(this[p]);
                                }

                                _this.config.nameObj[o][tmpArr[0]] = tmpArr[1];
                            });
                        }
                    }

                    //加载列表
                    _this.renderData(res.pageData);
                }
            });
        },
        //渲染数据
        renderData : function (arr) {
            var _this = this,
                listObj = _this.config.listObj,
                data = '<table class="table table-striped spListTable">';

            //表头
            data += '<thead><tr>';
            for(var o in listObj) {
                switch (listObj[o].type){
                    case 'checkbox':
                        data += '<th '+(listObj[o].width ? 'width="'+listObj[o].width+'"' : '')+'>'+
                                    '<input type="checkbox" class="spListAll">'+
                                '</th>';
                        break;
                    case 'radio':
                        data += '<th '+(listObj[o].width ? 'width="'+listObj[o].width+'"' : '')+'></th>';
                        break;
                    default:
                        if(listObj[o].orderField){
                            data += '<th '+(listObj[o].width ? 'width="'+listObj[o].width+'"' : '')+'>' +
                                        '<a class="spListOrder" orderField="'+listObj[o].orderField+'">' +
                                            listObj[o].showName + (listObj[o].value === _this.config.orderField ? _this.config.orderFlag : '') +
                                        '</a>'+
                                    '</th>';
                        }else{
                            data += '<th '+(listObj[o].width ? 'width="'+listObj[o].width+'"' : '')+'>' + listObj[o].showName + '</th>';
                        }
                        break;
                }
            }
            data += '</tr></thead>';

            //内容部分
            data += '<tbody>';
            for(var i=0;i<arr.length;i++){
                data += '<tr>';

                for(var p in listObj){
                    data += _this.getTd(listObj[p],arr[i]);
                }

                data += '</tr>';
            }
            data += '</tbody>';

            data += '</table>';

            //翻页工具条
            data += _this.renderPageBar();

            //置空
            _this.config.orderField = '';
            _this.config.orderFlag = '';

            //加载表格
            _this.$ele.html(data);

            //绑定事件
            if(_this.bindFlag){
                _this.bindFlag = false;
                _this.bindOp();
            }
        },
        //获取td
        getTd : function (obj,objData) {
            var _this = this,
                td = '<td>';

            switch (obj.type){
                case 'checkbox':
                    td += '<input type="checkbox" class="spListOne" value="'+objData[obj.value]+'">';
                    break;
                case 'radio':
                    td += '<input type="radio" class="spListOne" value="'+objData[obj.value]+'">';
                    break;
                case 'content':
                    if(obj.matchField){
                        td += _this.config.nameObj[obj.matchField][objData[obj.value]] || objData[obj.value];
                    }else{
                        td += objData[obj.value];
                    }
                    break;
                case 'operation':
                    //修改
                    if(obj.value['modify']){
                        td += '<a class="spListModify" title="修改" data-value="'+objData[obj.value['modify']]+'">'+
                                '<i class="fa fa-edit"></i>'+
                              '</a>&nbsp;&nbsp;';
                    }

                    //删除
                    if(obj.value['del']){
                        td += '<a class="spListDel" title="删除" data-value="'+objData[obj.value['del']]+'">'+
                                '<i class="fa fa-times"></i>'+
                              '</a>&nbsp;&nbsp;';
                    }
                    break;
            }

            td += '</td>';

            return td;
        },
        //渲染翻页条
        renderPageBar : function () {
            var _this   = this,
                pageBar = '<div class="container text-center spPageBar">',
                pageNum = _this.config.pageNum,
                sPage   = pageNum - 2,
                ePage   = pageNum + 2;

            pageBar +=  '<a class="btn btn-sm btn-primary spPaging llPage" title="首页"><i class="fa fa-angle-double-left"></i></a>&nbsp;'+
                        '<a class="btn btn-sm btn-primary spPaging lPage" title="上一页"><i class="fa fa-angle-left"></i></a>&nbsp;';

            if(sPage < 1){
                if(sPage < 0){
                    ePage += 2;
                }else{
                    ePage += 1;
                }
                sPage = 1;
            }

            if(ePage > _this.config.pageCount){
                ePage = _this.config.pageCount;
            }

            for(var i=sPage;i<=ePage;i++){
                if(i === pageNum){
                    pageBar += '<a class="btn btn-sm btn-primary spPaging spCurrentPage">'+i+'</a>&nbsp;';
                }else{
                    pageBar += '<a class="btn btn-sm btn-primary spPaging">'+i+'</a>&nbsp;';
                }
            }

            pageBar +=  '<a class="btn btn-sm btn-primary spPaging rPage" title="下一页"><i class="fa fa-angle-right"></i></a>&nbsp;'+
                        '<a class="btn btn-sm btn-primary spPaging rrPage" title="末页"><i class="fa fa-angle-double-right"></i></a>';

            pageBar += '</div>';

            return pageBar;
        },
        //绑定事件
        bindOp : function () {
            var _this   = this;

            _this.$ele.on('click', '.spPaging', function () {
                //翻页
                _this.paging(this);
            }).on('click', '.spListOrder', function () {
                //排序
                _this.orderList(this);
            }).on('click', '.spListAll', function () {
                //全选
                $('.spListOne').prop('checked', $(this).prop('checked'));
            }).on('click', '.spListModify', function () {
                if ($.isFunction(_this.config.modifyFun)) {
                    _this.config.modifyFun.apply(_this,[$(this).attr('data-value')]);
                }
            }).on('click', '.spListDel', function () {
                if ($.isFunction(_this.config.delFun)) {
                    _this.config.delFun.apply(_this,[$(this).attr('data-value')]);
                }
            });
        },
        //翻页事件
        paging : function (obj) {
            var _this = this,
                _page = _this.config.pageNum;

            if($(obj).hasClass('llPage')){
                _page = 1;
            }else if($(obj).hasClass('lPage')){
                _page -= 1;
                if(_page < 1) _page = 1;
            }else if($(obj).hasClass('rPage')){
                _page += 1;
                if(_page > _this.config.pageCount) _page = _this.config.pageCount;
            }else if($(obj).hasClass('rrPage')){
                _page = _this.config.pageCount;
            }else{
                _page = +$(obj).text();
            }

            if(_page === _this.config.pageNum) return false;

            _this.config.pageNum = _page;

            _this.getPage();
        },
        //排序事件
        orderList : function (obj) {
            var _this = this,
                orderField = $(obj).attr('orderField'),
                orderType = $(obj).find('.fa-caret-down').length > 0 ? 'asc' : 'desc',
                orderFlag = '<i>&nbsp;</i><i class="fa fa-caret-' + (orderType === 'asc' ? 'up' : 'down') + '"></i>';

            if(_this.config.allNum < 1) return false;

            _this.config.orderBy = "order by " + orderField + " " + orderType;
            _this.config.orderField = orderField;
            _this.config.orderFlag = orderFlag;
            _this.config.pageNum = 1;

            _this.getPage();
        },
        //翻页或者排序
        getPage : function () {
            var _this = this;

            $.ajax({
                type    : 'post',
                url     : _this.config.dataUrl + '/getPage',
                headers : {
                    'X-CSRF-TOKEN'  : _this.config.token
                },
                data    : {
                    pageSize    : _this.config.pageSize,
                    pageNum     : _this.config.pageNum,
                    table       : _this.config.table,
                    defaultCon  : _this.config.defaultCon,
                    orderBy     : _this.config.orderBy,
                    queryCon    : _this.config.queryCon
                },
                success : function (res) {
                    //加载列表
                    _this.renderData(res.pageData);
                }
            });
        },
        //重新请求
        reList : function (queryCon) {
            this.config.queryCon = queryCon || '';
            this.getPageInfo();
        }
    };

    $.fn.shellPaginate = function (options) {
        options = $.extend(defaults, options || {});

        return new ShellPaginate($(this), options);
    };
})(jQuery, window, document);