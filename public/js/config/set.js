var theToken,
    fileObj;

$(function () {
    initSth();
});

function initSth() {
    theToken = $('#theToken').val();

    toastr.options = {
        "positionClass": "toast-top-center"
    };

    $('#wc_save').on('click', updateConfig);
    
    $('.upBtn').on('click', uploadImage);
}

function updateConfig() {
    var wc_siteName = $('#wc_siteName').val(),
        wc_siteTitle = $('#wc_siteTitle').val(),
        wc_siteKeywords = $('#wc_siteKeywords').val(),
        wc_siteDescription = $('#wc_siteDescription').val(),
        wc_siteLogo = $('#wc_siteLogo').val(),
        wc_siteIcon = $('#wc_siteIcon').val();

    if(!wc_siteName){
        toastr["error"]("请填写网站名称！");
        return false;
    }

    if(!wc_siteTitle){
        toastr["error"]("请填写网站Title！");
        return false;
    }

    if(!wc_siteKeywords){
        toastr["error"]("请填写网站关键词！");
        return false;
    }

    if(!wc_siteDescription){
        toastr["error"]("请填写网站介绍！");
        return false;
    }

    $.ajax({
        type: 'post',
        url: '/admin/config/store',
        headers: {
            'X-CSRF-TOKEN': theToken
        },
        data: {
            wc_siteName: wc_siteName,
            wc_siteTitle: wc_siteTitle,
            wc_siteKeywords: wc_siteKeywords,
            wc_siteDescription: wc_siteDescription,
            wc_siteLogo : wc_siteLogo,
            wc_siteIcon : wc_siteIcon
        },
        success: function (res) {
            if(res.flag === 'success'){
                toastr["success"]('保存成功！');
            }else{
                toastr["error"]('保存失败！');
            }
        }
    });
}

function uploadImage() {
    var cuiValue = $(this).siblings('.fileIpt').val();

    if(!cuiValue){
        toastr["error"]('请选择文件！');
        return false;
    }

    fileObj = this;

    $(this.parentNode.parentNode.parentNode).ajaxForm({
        success: showImages,
        dataType: 'json'
    }).submit();
}

function showImages(res) {
    if(res.success){
        toastr["success"]('上传成功！');

        $(fileObj).siblings('.cs_commonImg').attr('src', res.src);

        $(fileObj).siblings('.fileIpt').val('');

        $(fileObj).siblings('.imagePath').val(res.path);

        fileObj = null;
    }else{
        toastr["error"](res.error);
    }
}