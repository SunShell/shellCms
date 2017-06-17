var ueToolbars = [[
    'source', '|', 'undo', 'redo', '|',
    'bold', 'italic', 'underline', 'fontborder', 'strikethrough', 'superscript', 'subscript', 'removeformat', 'formatmatch', 'autotypeset', 'blockquote', 'pasteplain', '|', 'forecolor', 'backcolor', 'insertorderedlist', 'insertunorderedlist', 'selectall', 'cleardoc', '|',
    'rowspacingtop', 'rowspacingbottom', 'lineheight', '|',
    'customstyle', 'paragraph', 'fontfamily', 'fontsize', '|',
    'directionalityltr', 'directionalityrtl', 'indent', '|',
    'justifyleft', 'justifycenter', 'justifyright', 'justifyjustify', '|', 'touppercase', 'tolowercase', '|',
    'link', 'unlink', 'anchor', '|', 'imagenone', 'imageleft', 'imageright', 'imagecenter', '|',
    'simpleupload', 'insertimage', 'map', 'insertcode', 'pagebreak', 'template', '|',
    'horizontal', 'date', 'time', 'spechars', 'snapscreen', 'wordimage', '|',
    'inserttable', 'deletetable', 'insertparagraphbeforetable', 'insertrow', 'deleterow', 'insertcol', 'deletecol', 'mergecells', 'mergeright', 'mergedown', 'splittocells', 'splittorows', 'splittocols', 'charts'
]];

$(document).ready(function() {
    /*
        导航激活状态赋值
    */
    var routeUri = $('#routeUri').val(),
        parentId = '';

    $('.sidebar-scroll a').each(function () {
        if($(this).attr('data-toggle') === 'collapse') return true;

        if($(this).attr('href') === '/' + routeUri){
            $(this).addClass('active');

            var pNode = this.parentNode.parentNode.parentNode;

            if($(pNode).hasClass('collapse')){
                parentId = $(pNode).attr('id');
                $(pNode).addClass('in').attr('aria-expanded','true');
                $(pNode).siblings('a').addClass('active').removeClass('collapsed').attr('aria-expanded','true');
            }
        }else{
            $(this).removeClass('active');

            var pNode = this.parentNode.parentNode.parentNode;

            if($(pNode).hasClass('collapse')) {
                if($(pNode).attr('id') !== parentId){
                    $(pNode).removeClass('in').attr('aria-expanded','false');
                    $(pNode).siblings('a').addClass('collapsed').removeClass('active').attr('aria-expanded','false');
                }
            }
        }
    });

	/*-----------------------------------/
	/*	TOP NAVIGATION AND LAYOUT
	/*----------------------------------*/

	$('.btn-toggle-fullwidth').on('click', function() {
		if(!$('body').hasClass('layout-fullwidth')) {
			$('body').addClass('layout-fullwidth');

		} else {
			$('body').removeClass('layout-fullwidth');
			$('body').removeClass('layout-default'); // also remove default behaviour if set
		}

		$(this).find('.lnr').toggleClass('lnr-arrow-left-circle lnr-arrow-right-circle');

		if($(window).innerWidth() < 1025) {
			if(!$('body').hasClass('offcanvas-active')) {
				$('body').addClass('offcanvas-active');
			} else {
				$('body').removeClass('offcanvas-active');
			}
		}
	});

	$(window).on('load', function() {
		if($(window).innerWidth() < 1025) {
			$('.btn-toggle-fullwidth').find('.icon-arrows')
			.removeClass('icon-arrows-move-left')
			.addClass('icon-arrows-move-right');
		}

		// adjust right sidebar top position
		$('.right-sidebar').css('top', $('.navbar').innerHeight());

		// if page has content-menu, set top padding of main-content
		if($('.has-content-menu').length > 0) {
			$('.navbar + .main-content').css('padding-top', $('.navbar').innerHeight());
		}

		// for shorter main content
		if($('.main').height() < $('#sidebar-nav').height()) {
			$('.main').css('min-height', $('#sidebar-nav').height());
		}
	});


	/*-----------------------------------/
	/*	SIDEBAR NAVIGATION
	/*----------------------------------*/

	$('.sidebar a[data-toggle="collapse"]').on('click', function() {
		if($(this).hasClass('collapsed')) {
			$(this).addClass('active');
		} else {
			$(this).removeClass('active');
		}
	});

	if( $('.sidebar-scroll').length > 0 ) {
		$('.sidebar-scroll').slimScroll({
			height: '95%',
			wheelStep: 2,
		});
	}


	/*-----------------------------------/
	/*	PANEL FUNCTIONS
	/*----------------------------------*/

	// panel remove
	$('.panel .btn-remove').click(function(e){

		e.preventDefault();
		$(this).parents('.panel').fadeOut(300, function(){
			$(this).remove();
		});
	});

	// panel collapse/expand
	var affectedElement = $('.panel-body');

	$('.panel .btn-toggle-collapse').clickToggle(
		function(e) {
			e.preventDefault();

			// if has scroll
			if( $(this).parents('.panel').find('.slimScrollDiv').length > 0 ) {
				affectedElement = $('.slimScrollDiv');
			}

			$(this).parents('.panel').find(affectedElement).slideUp(300);
			$(this).find('i.lnr-chevron-up').toggleClass('lnr-chevron-down');
		},
		function(e) {
			e.preventDefault();

			// if has scroll
			if( $(this).parents('.panel').find('.slimScrollDiv').length > 0 ) {
				affectedElement = $('.slimScrollDiv');
			}

			$(this).parents('.panel').find(affectedElement).slideDown(300);
			$(this).find('i.lnr-chevron-up').toggleClass('lnr-chevron-down');
		}
	);


	/*-----------------------------------/
	/*	PANEL SCROLLING
	/*----------------------------------*/

	if( $('.panel-scrolling').length > 0) {
		$('.panel-scrolling .panel-body').slimScroll({
			height: '430px',
			wheelStep: 2,
		});
	}

	if( $('#panel-scrolling-demo').length > 0) {
		$('#panel-scrolling-demo .panel-body').slimScroll({
			height: '175px',
			wheelStep: 2,
		});
	}

	/*-----------------------------------/
	/*	TODO LIST
	/*----------------------------------*/

	$('.todo-list input').change( function() {
		if( $(this).prop('checked') ) {
			$(this).parents('li').addClass('completed');
		}else {
			$(this).parents('li').removeClass('completed');
		}
	});

	/*-----------------------------------/
	 /*	保持footer在最底部
	 /*----------------------------------*/

	/*$('.main').resize(function () {
		var bodyHeight = $('body').height();
		console.log(1,bodyHeight);
    });*/

	/*-----------------------------------/
	 /*	修改密码
	 /*----------------------------------*/

	$('#modifyPwd').on('click', function () {
        layer.open({
            type: 1,
            title: '修改密码',
            area: ['400px', '400px'],
            zIndex: 1500,
            content: '<form id="userPwdModify" style="padding: 20px;">'+
            '<div class="form-group">'+
            '<label for="sp_userPwdOld">旧密码</label>'+
            '<input type="password" class="form-control" id="sp_userPwdOld" placeholder="请输入旧密码">'+
            '</div>'+
            '<div class="form-group">'+
            '<label for="sp_userPwdNew">新密码</label>'+
            '<input type="password" class="form-control" id="sp_userPwdNew" placeholder="请输入新密码，至少六位">'+
            '</div>'+
            '<div class="form-group">'+
            '<label for="sp_userPwdConfirm">确认密码</label>'+
            '<input type="password" class="form-control" id="sp_userPwdConfirm" placeholder="请再次输入新密码">'+
            '</div>'+
            '<button type="button" class="btn btn-primary" id="pwdSave">修改</button>'+
            '</form>',
            success: function(layero, index){
                toastr.options = {
                    "positionClass": "toast-top-center"
                };

                //保存数据
                $('#userPwdModify').on('click','#pwdSave',function () {
                    var sp_userPwdOld = $('#sp_userPwdOld').val(),
                        sp_userPwdNew = $('#sp_userPwdNew').val(),
                        sp_userPwdConfirm = $('#sp_userPwdConfirm').val();

                    if(!sp_userPwdOld){
                        toastr["error"]("请输入旧密码！");
                        return false;
                    }

                    if(!sp_userPwdNew){
                        toastr["error"]("请输入新密码！");
                        return false;
                    }

                    if(sp_userPwdNew.length < 6){
                        toastr["error"]("新密码长度至少六位！");
                        return false;
                    }

                    if(sp_userPwdNew !== sp_userPwdConfirm){
                        toastr["error"]("两次密码输入不一致！");
                        return false;
                    }

                    $.ajax({
                        type: 'post',
                        url: '/admin/modifyPwd',
                        headers: {
                            'X-CSRF-TOKEN': commonToken
                        },
                        data: {
                            sp_userPwdOld: sp_userPwdOld,
                            sp_userPwdNew: sp_userPwdNew
                        },
                        success: function (res) {
                            switch (res.flag){
                                case 'success':
                                    toastr["success"](res.tip);
                                    layer.close(index);
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
    });
});

// toggle function
$.fn.clickToggle = function( f1, f2 ) {
	return this.each( function() {
		var clicked = false;
		$(this).bind('click', function() {
			if(clicked) {
				clicked = false;
				return f2.apply(this, arguments);
			}

			clicked = true;
			return f1.apply(this, arguments);
		});
	});

}


