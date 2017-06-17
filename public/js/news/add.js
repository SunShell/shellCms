var ue,
    theToken = '';

$(function () {
    initSth();
});

//初始化
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

    initEditor();
    
    initCategory();

    $('#saveBtn').on('click', saveFun);
}

//初始化编辑器
function initEditor() {
    ue = UE.getEditor('acContents', {
        initialFrameWidth: '100%',
        initialFrameHeight: '300',
        enableAutoSave: false,
        toolbars: ueToolbars
    });

    ue.ready(function() {
        ue.execCommand('serverparam', '_token', theToken);
    });
}

//初始化分类
function initCategory() {
    var initCategory = $('#initCategory').val();

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
                    if(initCategory && initCategory == p){
                        opt += '<option value="'+p+'" selected>'+res.data[p]+'</option>';
                    }else{
                        opt += '<option value="'+p+'">'+res.data[p]+'</option>';
                    }
                }
            }

            $('#acCategory').html(opt);
        }
    });
}

//保存
function saveFun() {
    var flag = true;

    $('#acContent').val(ue.getContent());

    $('.newsNeed').each(function () {
        if(!$(this).val()){
            alert('请'+(this.tagName === 'SELECT' ? '选择' : '填写')+$(this).attr('tip')+'！');
            flag = false;
            return false;
        }
    });

    if(!flag) return false;

    $('#newsForm').submit();
}