var sp,
    theToken;

$(function () {
    initSth();
});

//初始化操作
function initSth() {
    theToken = $('input[name="_token"]').val();

    var saveResult = $('#saveResult').val();

    //显示保存结果
    if(saveResult){
        toastr.options = {
            "positionClass": "toast-top-center"
        };

        if(saveResult.indexOf('成功') > -1){
            toastr["success"](saveResult);
        }else{
            toastr["error"](saveResult);
        }
    }

    initToastr();

    initCategory();

    //请求数据
    sp = $('#alContainer').shellPaginate({
        token: theToken,
        table: 'articles',
        orderBy: 'order by created_at desc',
        nameStr: 'news_categories.id.name,users.userId.name',
        modifyFun: modifyArticles,
        delFun: delArticles,
        listObj: [
            {
                type : 'checkbox',
                value : 'id',
                width : '10%'
            },
            {
                type : 'content',
                value : 'title',
                showName : '标题',
                orderField : 'title'
            },
            {
                type : 'content',
                value : 'categoryId',
                showName : '所属分类',
                orderField : 'categoryId',
                matchField : 'news_categories_id'
            },
            {
                type : 'content',
                value : 'author',
                showName : '添加人',
                orderField : 'author',
                matchField : 'users_userId'
            },
            {
                type : 'content',
                value : 'created_at',
                showName : '添加时间',
                orderField : 'created_at'
            },
            {
                type : 'operation',
                value : { 'modify' : 'id', 'del' : 'id' },
                showName : '操作'
            }
        ]
    });

    $('.spOpContainer').on('click','.btn-primary',function () {
        queryArticles();
    }).on('click','.btn-danger',function () {
        delArticles();
    });
}

//初始化分类
function initCategory() {
    $.ajax({
        type: 'post',
        url: '/admin/news/categoryAll',
        headers: {
            'X-CSRF-TOKEN': theToken
        },
        success: function (res) {
            var opt = '<option value="">请选择</option>';

            if(res && res.data){
                for(var p in res.data){
                    opt += '<option value="'+p+'">'+res.data[p]+'</option>';
                }
            }

            $('#queryType').html(opt);
        }
    });
}

//提示框参数设置
function initToastr() {
    toastr.options = {
        "positionClass": "toast-top-center"
    };
}

//搜索操作
function queryArticles() {
    var queryType = $('#queryType').val(),
        queryName = $("#queryName").val(),
        queryCon = "";

    if(queryType){
        queryCon = "categoryId = '"+queryType+"'";
    }

    if(queryName){
        if(queryCon) queryCon += " and ";
        queryCon += "title like '%"+queryName+"%'";
    }

    sp.reList(queryCon);
}

//修改操作
function modifyArticles(id) {
    $('#modifyId').val(id);
    $('#modifyForm').submit();
}

//删除操作
function delArticles(id) {
    var ids = [];

    if(id){
        ids.push(id);
    }else{
        $('.spListOne:checked').each(function () {
            ids.push($(this).val());
        });

        if (ids.length < 1) {
            toastr["error"]("请选择要删除的数据！");
            return false;
        }
    }

    if(!confirm('删除后数据不可恢复，确认删除所选数据吗？')) return false;

    $.ajax({
        type: 'post',
        url: '/admin/news/del',
        headers: {
            'X-CSRF-TOKEN': theToken
        },
        data: {
            ids: ids.join(',')
        },
        success: function (res) {
            switch (res.flag){
                case 'success':
                    toastr["success"]("删除成功！");
                    sp.reList();
                    break;
                default:
                    toastr["error"]("删除失败！");
                    break;
            }
        }
    });
}