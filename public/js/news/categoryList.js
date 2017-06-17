var sp,
    layerIndex,
    theToken;

$(function () {
    initSth();
});

//初始化操作
function initSth() {
    theToken = $('#theToken').val();

    initToastr();

    //请求数据
    sp = $('#clContainer').shellPaginate({
        token: theToken,
        table: 'news_categories',
        orderBy: 'order by created_at desc',
        nameStr: 'users.userId.name',
        modifyFun: modifyCategory,
        delFun: delCategory,
        listObj: [
            {
                type : 'checkbox',
                value : 'id',
                width : '10%'
            },
            {
                type : 'content',
                value : 'name',
                showName : '分类名称',
                orderField : 'name'
            },
            {
                type : 'content',
                value : 'userId',
                showName : '添加人',
                orderField : 'userId',
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
        queryCategory();
    }).on('click','.btn-success',function () {
        addCategory();
    }).on('click','.btn-danger',function () {
        delCategory();
    });
}

//提示框参数设置
function initToastr() {
    toastr.options = {
        "positionClass": "toast-top-center"
    };
}

//搜索操作
function queryCategory() {
    var queryCN = $('#queryCN').val().trim();

    sp.reList("name like '%" + queryCN + "%'");
}

//修改操作
function modifyCategory(id) {
    $.ajax({
        type: 'post',
        url: '/admin/news/categoryGet',
        headers: {
            'X-CSRF-TOKEN': theToken
        },
        data: {
            categoryId: id
        },
        success: function (res) {
            switch (res.flag){
                case 'success':
                    addCategory(id,res.data);
                    break;
                default:
                    toastr["error"]("未知错误！");
                    break;
            }
        }
    });
}

//添加和修改操作
function addCategory(id,name) {
    layer.open({
        type: 1,
        title: '添加文章分类',
        area: ['400px', '200px'],
        zIndex: 1500,
        content: '<form class="spAddForm">'+
                    '<div class="form-group">'+
                        '<label for="categoryName">分类名称</label>'+
                        '<input type="text" class="form-control" id="categoryName" name="categoryName" placeholder="分类名称" value="'+(name||'')+'">'+
                    '</div>'+
                    '<button type="button" class="btn btn-primary btn-block" id="addCategory">'+(id ? '修 改' : '添 加')+'</button>'+
                 '</form>',
        success: function(layero, index){
            layerIndex = index;

            //保存数据
            $('.spAddForm').on('click','#addCategory',function () {
                var categoryName = $('#categoryName').val(),
                    tip = id ? '修改' : '添加';

                if(!categoryName){
                    toastr["error"]("请填写分类名称！");
                    return false;
                }

                $.ajax({
                    type: 'post',
                    url: id ? '/admin/news/categoryModify' : '/admin/news/categoryAdd',
                    headers: {
                        'X-CSRF-TOKEN': theToken
                    },
                    data: {
                        categoryName: categoryName,
                        categoryId: id || ''
                    },
                    success: function (res) {
                        switch (res.flag){
                            case 'exist':
                                toastr["error"]("已存在相同名称的分类，无法" + tip + "！");
                                break;
                            case 'success':
                                toastr["success"](tip + "成功！");
                                sp.reList();
                                closeLayer();
                                break;
                            default:
                                toastr["error"](tip + "失败！");
                                break;
                        }
                    }
                });
            });
        }
    });
}

//删除操作
function delCategory(id) {
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
        url: '/admin/news/categoryDel',
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

//关闭弹窗
function closeLayer() {
    if(layerIndex) layer.close(layerIndex);
    layerIndex = '';
}