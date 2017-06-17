<?php
    use App\Http\Controllers\WebsiteConfigController;

    $wcc = new WebsiteConfigController();
    $ups = $wcc->getUserPermission();

    $routeUri = Route::current()->uri;
    $tmpArr = explode('/', $routeUri);

    if($ups != 'all' && count($tmpArr) == 3){
        $rup = $tmpArr[1].'_'.$tmpArr[2];

        //没有权限则直接返回首页
        if(!$ups || !in_array($rup, $ups)){
            Redirect::to('/admin')->send();
        }
    }
?>
        <!doctype html>
<html class="fullscreen-bg">
<head>
    <meta charset="utf-8">
    <title>管理后台-{{ $wcc->getWebsiteConfig('siteName') }}</title>
    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0">

    <link rel="icon" type="image/png" sizes="96x96" href="{{ asset('/images/logo-icon.png') }}">

    <link href="https://cdn.bootcss.com/bootstrap/3.3.7/css/bootstrap.min.css" rel="stylesheet">
    <link href="https://cdn.bootcss.com/font-awesome/4.7.0/css/font-awesome.min.css" rel="stylesheet">

    <link href="{{ asset('/lib/linearicons/style.css') }}" rel="stylesheet">
    <link href="{{ asset('/lib/toastr/toastr.min.css') }}" rel="stylesheet">

    <link href="{{ asset('/css/mainAdmin.css') }}" rel="stylesheet">
    <link href="{{ asset('/css/customAdmin.css') }}" rel="stylesheet">

    @yield('cssContent')

    <script type="text/javascript">
        var commonToken = '{{ csrf_token() }}';
    </script>
</head>

<body>
<input type="hidden" id="routeUri" value="{{ $routeUri }}">
<div id="wrapper">
@include('admin.dashboard.nav')

<!-- MAIN -->
    <div class="main">
        <div class="main-content">
            <div class="container-fluid">
                @yield('content')
            </div>
        </div>
    </div>
    <!-- END MAIN -->
    <div class="clearfix"></div>

    {{--<footer>
        <div class="container-fluid">
            <p class="copyright">&copy; 2017 {{ $wcc->getWebsiteConfig('siteName') }} 版权所有</p>
        </div>
    </footer>--}}
</div>

<script src="https://cdn.bootcss.com/jquery/3.2.1/jquery.min.js"></script>
<script src="https://cdn.bootcss.com/bootstrap/3.3.7/js/bootstrap.min.js"></script>
<script src="{{ asset('/lib/jquery-slimscroll/jquery.slimscroll.min.js') }}"></script>
<script src="{{ asset('/lib/toastr/toastr.min.js') }}"></script>
<script src="{{ asset('/lib/layer/layer.js') }}"></script>
<script src="{{ asset('/js/adminCommon.js') }}"></script>
@yield('jsContent')
</body>
</html>