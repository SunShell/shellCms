var sp,
    layerIndex,
    theToken,
    roleData;

$(function () {
    initSth();
});

//初始化操作
function initSth() {
    theToken = $('#theToken').val();

    getAllRoles();

    initToastr();

    //请求数据
    sp = $('#rlContainer').shellPaginate({
        token: theToken,
        table: 'user_roles',
        orderBy: 'order by created_at desc',
        nameStr: 'users.userId.name',
        modifyFun: modifyFun,
        delFun: delFun,
        listObj: [
            {
                type : 'checkbox',
                value : 'id',
                width : '10%'
            },
            {
                type : 'content',
                value : 'name',
                showName : '角色名称',
                orderField : 'name'
            },
            {
                type : 'content',
                value : 'addUser',
                showName : '添加人',
                orderField : 'addUser',
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
        queryFun();
    }).on('click','.btn-success',function () {
        addFun();
    }).on('click','.btn-danger',function () {
        delFun();
    });
}

//获取权限
function getAllRoles() {
    $.ajax({
        type: 'post',
        url: '/admin/config/getAllRoles',
        headers: {
            'X-CSRF-TOKEN': theToken
        },
        success: function (res) {
            roleData = res;
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
function queryFun() {
    var queryName = $('#queryName').val().trim();

    sp.reList("name like '%" + queryName + "%'");
}

//修改操作
function modifyFun(id) {
    $.ajax({
        type: 'post',
        url: '/admin/config/roleGet',
        headers: {
            'X-CSRF-TOKEN': theToken
        },
        data: {
            roleId: id
        },
        success: function (res) {
            switch (res.flag){
                case 'success':
                    addFun(id,res.data,res.subData);
                    break;
                default:
                    toastr["error"]("未知错误！");
                    break;
            }
        }
    });
}

//添加和修改操作
function addFun(id,data,subData) {
    layer.open({
        type: 1,
        title: '添加角色',
        area: ['400px', '600px'],
        zIndex: 1500,
        content: '<form class="spAddForm">'+
                    '<div class="form-group">'+
                        '<label for="roleName">角色名称</label>'+
                        '<input type="text" class="form-control" id="roleName" name="roleName" placeholder="角色名称" value="'+(data ? data.name : '')+'">'+
                    '</div>'+
                    '<div class="form-group roleListDiv">'+
                        '<label>权限选择</label>' + getConfigHtml(subData || []) +
                    '</div>'+
                    '<button type="button" class="btn btn-primary" id="roleSave">'+(id ? '修 改' : '添 加')+'</button>'+
                 '</form>',
        success: function(layero, index){
            layerIndex = index;

            //部分全选
            $('.rolePart').on('click', function () {
                $(this.parentNode.parentNode.parentNode).find('.roleValue').prop('checked', $(this).prop('checked'));
            });

            //保存数据
            $('.spAddForm').on('click','#roleSave',function () {
                var roleName = $('#roleName').val(),
                    roleArr = [],
                    tip = id ? '修改' : '添加';

                $('.roleValue').each(function () {
                    if($(this).prop('checked')){
                        roleArr.push($(this).val());
                    }
                });

                if(!roleName){
                    toastr["error"]("请填写角色名称！");
                    return false;
                }

                if(roleArr.length < 1){
                    toastr["error"]("请选择权限！");
                    return false;
                }

                $.ajax({
                    type: 'post',
                    url: id ? '/admin/config/roleModify' : '/admin/config/roleAdd',
                    headers: {
                        'X-CSRF-TOKEN': theToken
                    },
                    data: {
                        modifyId: id || '',
                        roleName: roleName,
                        roleValue: roleArr.join(',')
                    },
                    success: function (res) {
                        switch (res.flag){
                            case 'exist':
                                toastr["error"]("已存在相同名称的角色，无法" + tip + "！");
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

//获取权限部分html
function getConfigHtml(arr) {
    var html = '',
        tmpObj;

    $(roleData).each(function () {
        html += '<fieldset><legend><label><input type="checkbox" class="rolePart"> '+this.name+'</label></legend>';

        tmpObj = this.data;

        for(var p in tmpObj){
            if(arr.length > 0 && arr.indexOf(p) > -1){
                html += '<label><input type="checkbox" class="roleValue" value="'+p+'" checked> '+tmpObj[p]+'</label>&nbsp;&nbsp;';
            }else{
                html += '<label><input type="checkbox" class="roleValue" value="'+p+'"> '+tmpObj[p]+'</label>&nbsp;&nbsp;';
            }
        }

        html += '</fieldset>';
    });

    return html;
}

//删除操作
function delFun(id) {
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
        url: '/admin/config/roleDel',
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