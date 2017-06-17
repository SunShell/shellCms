var sp,
    ue = null,
    layerIndex,
    theToken,
    categoryObj = {},
    cuiDatePath = '';

$(function () {
    initSth();
});

//初始化操作
function initSth() {
    theToken = $('#theToken').val();

    var theDate = new Date();

    cuiDatePath = theDate.getFullYear() + '/' + (theDate.getMonth() + 1) + '/' + theDate.getDate();

    initToastr();

    initCategory();

    //请求数据
    sp = $('#plContainer').shellPaginate({
        token: theToken,
        table: 'products',
        orderBy: 'order by created_at desc',
        nameStr: 'product_categories.id.name,users.userId.name',
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
                showName : '产品名称',
                orderField : 'name'
            },
            {
                type : 'content',
                value : 'categoryId',
                showName : '产品分类',
                orderField : 'categoryId',
                matchField : 'product_categories_id'
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

//提示框参数设置
function initToastr() {
    toastr.options = {
        "positionClass": "toast-top-center"
    };
}

//初始化分类
function initCategory() {
    $.ajax({
        type: 'post',
        url: '/admin/mall/categoryAll',
        headers: {
            'X-CSRF-TOKEN': theToken
        },
        success: function (res) {
            var opt = '<option value="">请选择</option>';

            if(res && res.data){
                categoryObj = res.data;

                for(var p in res.data){
                    opt += '<option value="'+p+'">'+res.data[p]+'</option>';
                }
            }

            $('#queryType').html(opt);
        }
    });
}

//搜索操作
function queryFun() {
    var queryType = $('#queryType').val(),
        queryName = $('#queryName').val().trim(),
        queryCon = "";

    if(queryType){
        queryCon = " categoryId = '"+queryType+"' ";
    }

    if(queryName){
        if(queryCon) queryCon += " and ";
        queryCon += " name like '%"+queryName+"%' ";
    }

    sp.reList(queryCon);
}

//修改操作
function modifyFun(id) {
    $.ajax({
        type: 'post',
        url: '/admin/mall/getOne',
        headers: {
            'X-CSRF-TOKEN': theToken
        },
        data: {
            productId: id
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
        title: (id ? '修改' : '添加') + '产品',
        area: ['800px', '850px'],
        zIndex: 1500,
        content: '<form class="spAddForm" style="padding-bottom: 0;">'+
                    getFormHtml(data)+
                 '</form>'+
                 '<form id="cuiForm" action="/commonUploadImage" enctype="multipart/form-data" method="post" style="padding: 0 20px;">'+
                    '<input type="hidden" name="_token" value="'+theToken+'">'+
                    '<div class="form-group">'+
                        '<label for="cuiValue">产品图片</label>'+
                        '<div class="uploadImageContainer" id="uploadImageContainer">' + getImageHtml(data) + '</div>'+
                        '<div>'+
                            '<input type="file" id="cuiValue" name="cuiValue" style="display: inline-block;">'+
                            '<input type="hidden" id="cuiPath" name="cuiPath" value="product/'+cuiDatePath+'">'+
                            '<button type="button" class="btn btn-sm btn-success" id="cuiBtn" style="display: inline-block;">上 传</button>'+
                        '</div>'+
                    '</div>'+
                 '</form>'+
                 '<form style="padding: 10px 20px 0; border-top: 1px solid #CCCCCC;">'+
                    '<div class="form-group">'+
                        '<label>产品属性</label>'+
                        '<button type="button" id="productAttrAddBtn" class="btn btn-sm btn-warning" style="margin-left: 20px;">添 加</button>'+
                        '<table id="productAttrContainer" class="table table-bordered" style="margin-top: 10px;">'+
                            '<thead>'+
                            '<tr>'+
                                '<th width="45%">属性名称</th>'+
                                '<th width="45%">属性值</th>'+
                                '<th class="text-center">操作</th>'+
                            '</tr>'+
                            '</thead>'+
                            '<tbody>' + getAttrHtml(subData) + '</tbody>'+
                        '</table>'+
                    '</div>'+
                 '</form>'+
                 '<div class="text-center" style="padding: 20px;">'+
                    '<button type="button" class="btn btn-primary" id="saveBtn">产 品 '+(id ? '修 改' : '添 加')+'</button>'+
                 '</div>',
        success: function(layero, index){
            layerIndex = index;

            //初始化ue
            ue = UE.getEditor('fpIntroduce', {
                initialFrameWidth: '100%',
                initialFrameHeight: '250',
                enableAutoSave: false,
                toolbars: ueToolbars
            });

            ue.ready(function() {
                ue.execCommand('serverparam', '_token', theToken);
            });

            //绑定图片上传
            $('#cuiBtn').on('click',function () {
                var cuiValue = $('#cuiValue').val();

                if(!cuiValue){
                    toastr["error"]("请选择要上传的图片！");
                    return false;
                }

                $('#cuiForm').ajaxForm({
                    success: showImages,
                    dataType: 'json'
                }).submit();
            });

            //删除图片操作
            $('#uploadImageContainer').on('click', 'a', function () {
                $(this.parentNode).remove();
            });

            //添加属性
            $('#productAttrAddBtn').on('click', function () {
                var attrHtml =  '<tr class="productAttrKV">'+
                                    '<td>'+
                                        '<input type="text" class="form-control productAttrKey">'+
                                    '</td>'+
                                    '<td>'+
                                        '<input type="text" class="form-control productAttrValue">'+
                                    '</td>'+
                                    '<td class="text-center" style="vertical-align: middle;">'+
                                        '<i class="fa fa-times productAttrDel" title="删除"></i>'+
                                    '</td>'+
                                '</tr>';

                $('#productAttrContainer tbody').append(attrHtml);
            });

            //删除属性
            $('#productAttrContainer').on('click', '.productAttrDel', function () {
                $(this.parentNode.parentNode).remove();
            });

            //保存数据
            $('#saveBtn').on('click', function () {
                var tmpArr = [],
                    tmpBrr = [],
                    tmpKey = '',
                    tmpVal = '';

                $('#uploadImageContainer a').each(function () {
                    tmpArr.push($(this).attr('filename'));
                });

                $('.productAttrKV').each(function () {
                    tmpKey = $(this).find('.productAttrKey').val();
                    tmpVal = $(this).find('.productAttrValue').val();

                    if(tmpKey && tmpVal) tmpBrr.push(tmpKey + '\2' + tmpVal);
                });

                var fpCategory = $('#fpCategory').val(),
                    fpName = $('#fpName').val(),
                    fpPrice = $('#fpPrice').val(),
                    fpImage = tmpArr.join('\2'),
                    fpIntroduce = ue.getContent(),
                    tip = id ? '修改' : '添加';

                if(!fpCategory){
                    toastr["error"]("请选择产品分类！");
                    return false;
                }

                if(!fpName){
                    toastr["error"]("请填写产品名称！");
                    return false;
                }

                if(!fpPrice){
                    toastr["error"]("请填写产品价格！");
                    return false;
                }

                if(!/^\d+(\.\d{1,2})?$/.test(fpPrice)){
                    toastr["error"]("请输入正确的产品价格！");
                    return false;
                }

                if(!fpIntroduce){
                    toastr["error"]("请填写产品介绍！");
                    return false;
                }

                if(!fpImage){
                    toastr["error"]("请至少上传一张产品图片！");
                    return false;
                }

                $.ajax({
                    type: 'post',
                    url: id ? '/admin/mall/modify' : '/admin/mall/store',
                    headers: {
                        'X-CSRF-TOKEN': theToken
                    },
                    data: {
                        modifyId: id || '',
                        fpCategory: fpCategory,
                        fpName: fpName,
                        fpPrice: fpPrice,
                        fpImage: fpImage,
                        fpIntroduce: fpIntroduce,
                        fpAttr: tmpBrr.join('\1')
                    },
                    success: function (res) {
                        switch (res.flag){
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
        },
        cancel: function(index, layero){
            if(ue) ue.destroy();

            layer.close(index);

            return false;
        }
    });
}

//上传图片后显示
function showImages(response) {
    if(response.success){
        toastr["success"]("上传成功！");

        $('#cuiValue').val('');

        var img = '<div>'+
                    '<img src="'+response.src+'">'+
                    '<a filename="'+response.fileName+'">删除</a>'+
                  '</div>';

        $('#uploadImageContainer').append(img);
    }else{
        toastr["error"](response.error);
    }
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
        url: '/admin/mall/del',
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

//获取表单html内容
function getFormHtml(data) {
    var html =  '<input type="hidden" id="fpImage">'+
                '<div class="form-group">'+
                    '<label for="fpCategory">产品分类</label>'+
                    '<select class="form-control" id="fpCategory">'+getCategory(data ? data.categoryId : '')+'</select>'+
                '</div>'+
                '<div class="form-group">'+
                    '<label for="fpName">产品名称</label>'+
                    '<input type="text" class="form-control" id="fpName" placeholder="产品名称" value="'+(data ? data.name : '')+'">'+
                '</div>'+
                '<div class="form-group">'+
                    '<label for="fpPrice">产品价格（单位：元）</label>'+
                    '<input type="text" class="form-control" id="fpPrice" placeholder="产品价格（单位：元）" value="'+(data ? data.price : '')+'">'+
                '</div>'+
                '<div class="form-group">'+
                    '<label for="fpIntroduce">产品介绍</label>'+
                    '<script id="fpIntroduce" name="content" type="text/plain">'+(data ? data.introduce : '')+'</script>'+
                '</div>';

    return html;
}

//获取产品分类选项
function getCategory(cId) {
    var opt = '<option value="">请选择</option>';

    for(var p in categoryObj){
        if(cId && cId == p){
            opt += '<option value="'+p+'" selected>'+categoryObj[p]+'</option>';
        }else{
            opt += '<option value="'+p+'">'+categoryObj[p]+'</option>';
        }
    }

    return opt;
}

//获取图片html
function getImageHtml(data) {
    if(!data || !data.images) return '';

    var html = '',
        src = $('#theSrc').val() + '/' + getDateSrc(data.created_at),
        arr = data.images.split('\2');

    $(arr).each(function () {
        html += '<div>'+
                    '<img src="'+src+this+'">'+
                    '<a filename="'+this+'">删除</a>'+
                '</div>';
    });

    return html;
}

//获取日期路径
function getDateSrc(d) {
    var str = d.substr(0,10),
        arr = str.split('-');

    return arr[0] + '/' + +arr[1] + '/' + +arr[2] + '/';
}

//获取属性html
function getAttrHtml(arr) {
    if(!arr || arr.length < 1) return '';

    var html = '';

    $(arr).each(function () {
        html += '<tr class="productAttrKV">'+
                    '<td>'+
                        '<input type="text" class="form-control productAttrKey" value="'+this.attrKey+'">'+
                    '</td>'+
                    '<td>'+
                        '<input type="text" class="form-control productAttrValue" value="'+this.attrValue+'">'+
                    '</td>'+
                    '<td class="text-center" style="vertical-align: middle;">'+
                        '<i class="fa fa-times productAttrDel" title="删除"></i>'+
                    '</td>'+
                '</tr>';
    });

    return html;
}

//关闭弹窗
function closeLayer() {
    if(ue) ue.destroy();
    if(layerIndex) layer.close(layerIndex);
    layerIndex = '';
}