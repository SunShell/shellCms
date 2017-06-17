<?php
    use App\Http\Controllers\WebsiteConfigController;

    $wcc = new WebsiteConfigController();
?>
<!doctype html>
<html class="fullscreen-bg">
<head>
    <meta charset="utf-8">
    <title>登录-管理后台-{{ $wcc->getWebsiteConfig('siteName') }}</title>
    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0">

    <link rel="icon" type="image/png" sizes="96x96" href="{{ asset('/images/logo-icon.png') }}">

    <link href="https://cdn.bootcss.com/bootstrap/3.3.7/css/bootstrap.min.css" rel="stylesheet">
    <link href="https://cdn.bootcss.com/font-awesome/4.7.0/css/font-awesome.min.css" rel="stylesheet">
    <link href="{{ asset('/lib/toastr/toastr.min.css') }}" rel="stylesheet">
    <link href="{{ asset('/css/mainAdmin.css') }}" rel="stylesheet">
</head>

<body class="login-body">
    <div id="wrapper">
        <div class="vertical-align-wrap">
            <div class="vertical-align-middle">
                <div class="auth-box ">
                    <div class="left">
                        <div class="content">
                            <div class="header">
                                <div class="logo text-center">
                                    <img src="{{ asset('/images/logo.png') }}" alt="Site Logo">
                                </div>
                                <br>
                                <p class="lead">后台登录</p>
                            </div>

                            <form class="form-auth-small" method="post" action="/admin/login">
                                {{ csrf_field() }}

                                <div class="form-group">
                                    <label for="signin-email" class="control-label sr-only">Email</label>
                                    <input type="text" class="form-control" id="login_id" name="login_id" placeholder="用户名">
                                </div>

                                <div class="form-group">
                                    <label for="signin-password" class="control-label sr-only">Password</label>
                                    <input type="password" class="form-control" id="login_password" name="login_password" placeholder="密码">
                                </div>

                                <div class="form-group clearfix">
                                    <!--label class="fancy-checkbox element-left">
                                        <input type="checkbox">
                                        <span>Remember me</span>
                                    </label-->
                                </div>

                                <button type="submit" class="btn btn-primary btn-lg btn-block">登录</button>

                                <!--div class="bottom">
                                    <span class="helper-text"><i class="fa fa-lock"></i> <a href="#">Forgot password?</a></span>
                                </div-->
                            </form>
                        </div>
                    </div>

                    <div class="right">
                        <div class="overlay"></div>
                        <div class="content text">
                            <h1 class="heading">{{ $wcc->getWebsiteConfig('siteName') }}</h1>
                            <p>管理后台</p>
                        </div>
                    </div>

                    <div class="clearfix"></div>
                </div>
            </div>
        </div>
    </div>

    <script src="https://cdn.bootcss.com/jquery/3.2.1/jquery.min.js"></script>
    <script src="{{ asset('/lib/jquery-slimscroll/jquery.slimscroll.min.js') }}"></script>
    <script src="{{ asset('/lib/toastr/toastr.min.js') }}"></script>
    @include('admin.layouts.errors')
</body>
</html>
