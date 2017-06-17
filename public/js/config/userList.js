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

    getRoles();

    initToastr();

    //请求数据
    sp = $('#rlContainer').shellPaginate({
        token: theToken,
        table: 'users',
        orderBy: 'order by created_at desc',
        defaultCon: "userId <> 'admin'",
        nameStr: 'user_roles.id.name',
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
                value : 'userId',
                showName : '用户ID',
                orderField : 'userId'
            },
            {
                type : 'content',
                value : 'name',
                showName : '用户名称',
                orderField : 'name'
            },
            {
                type : 'content',
                value : 'roleId',
                showName : '用户角色',
                matchField : 'user_roles_id'
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
function getRoles() {
    $.ajax({
        type: 'post',
        url: '/admin/config/getRoles',
        headers: {
            'X-CSRF-TOKEN': theToken
        },
        success: function (res) {
            roleData = res.data;
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
        url: '/admin/config/userGet',
        headers: {
            'X-CSRF-TOKEN': theToken
        },
        data: {
            userId: id
        },
        success: function (res) {
            switch (res.flag){
                case 'success':
                    addFun(id,res.data);
                    break;
                default:
                    toastr["error"]("未知错误！");
                    break;
            }
        }
    });
}

//添加和修改操作
function addFun(id,data) {
    layer.open({
        type: 1,
        title: '添加角色',
        area: ['400px', '450px'],
        zIndex: 1500,
        content: '<form class="spAddForm">'+
                    '<div class="form-group">'+
                        '<label for="sp_userId">用户ID</label>'+
                        '<input type="text" class="form-control" id="sp_userId" name="sp_userId" placeholder="用户ID，用于登录" value="'+(data ? data.userId : '')+'" '+(id ? 'readonly' : '')+'>'+
                    '</div>'+
                    '<div class="form-group">'+
                        '<label for="sp_userName">用户名称</label>'+
                        '<input type="text" class="form-control" id="sp_userName" name="sp_userName" placeholder="角色名称" value="'+(data ? data.name : '')+'">'+
                    '</div>'+
                    '<div class="form-group">'+
                        '<label for="sp_userPwd">登录密码</label>'+
                        '<input type="password" class="form-control" id="sp_userPwd" name="sp_userPwd" placeholder="登录密码，至少六位'+(data ? '（如需重置，请直接填写新密码）' : '')+'">'+
                    '</div>'+
                    '<div class="form-group roleListDiv">'+
                        '<label>用户权限</label>' + getRoleHtml(data ? data.roleId : '') +
                    '</div>'+
                    '<button type="button" class="btn btn-primary" id="userSave">'+(id ? '修 改' : '添 加')+'</button>'+
                 '</form>',
        success: function(layero, index){
            layerIndex = index;

            //保存数据
            $('.spAddForm').on('click','#userSave',function () {
                var sp_userId = $('#sp_userId').val(),
                    sp_userName = $('#sp_userName').val(),
                    sp_userPwd = $('#sp_userPwd').val(),
                    sp_userRole = $('#sp_userRole').val();

                if(!sp_userId){
                    toastr["error"]("请填写用户ID！");
                    return false;
                }

                if(!sp_userName){
                    toastr["error"]("请填写用户名称！");
                    return false;
                }

                if(!id) {
                    if (!sp_userPwd) {
                        toastr["error"]("请填写登录密码！");
                        return false;
                    }

                    if (sp_userPwd.length < 6) {
                        toastr["error"]("密码长度至少六位！");
                        return false;
                    }
                }

                if(!sp_userRole){
                    toastr["error"]("请选择用户角色！");
                    return false;
                }

                $.ajax({
                    type: 'post',
                    url: id ? '/admin/config/userModify' : '/admin/config/userAdd',
                    headers: {
                        'X-CSRF-TOKEN': theToken
                    },
                    data: {
                        modifyId: id || '',
                        sp_userId: sp_userId,
                        sp_userName: sp_userName,
                        sp_userPwd: sp_userPwd,
                        sp_userRole: sp_userRole
                    },
                    success: function (res) {
                        switch (res.flag){
                            case 'success':
                                toastr["success"](res.tip);
                                sp.reList();
                                closeLayer();
                                break;
                            default:
                                toastr["error"](res.tip);
                                break;
                        }
                    }
                });
            });
        }
    });
}

//获取权限部分html
function getRoleHtml(val) {
    var html = '<select class="form-control" id="sp_userRole">'+
                    '<option value="">请选择</option>';

    for(var p in roleData){
        if(val && val == p){
            html += '<option value="'+p+'" selected>'+roleData[p]+'</option>';
        }else{
            html += '<option value="'+p+'">'+roleData[p]+'</option>';
        }
    }

    html += '</select>';

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
        url: '/admin/config/userDel',
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