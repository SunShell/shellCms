<!-- NAVBAR -->
<nav class="navbar navbar-default navbar-fixed-top">
    <div class="brand">
        <a href="/admin"><img src="{{ asset('/images/logo.png') }}" alt="Site Logo" class="img-responsive logo navLogo"></a>
    </div>
    <div class="container-fluid">
        <div class="navbar-btn">
            <button title="隐藏侧边栏" type="button" class="btn-toggle-fullwidth"><i class="lnr lnr-arrow-left-circle"></i></button>
        </div>

        {{--<form class="navbar-form navbar-left">
            <div class="input-group">
                <input type="text" value="" class="form-control" placeholder="请输入搜索关键词">
                <span class="input-group-btn"><button type="button" class="btn btn-primary">搜索</button></span>
            </div>
        </form>--}}

        <div id="navbar-menu">
            <ul class="nav navbar-nav navbar-right">
                <li class="dropdown">
                    <a href="#" class="dropdown-toggle" data-toggle="dropdown">
                        <img src="{{ asset('/images/user.png') }}" class="img-circle" alt="{{ Auth::user()->name }}">
                        <span>{{ Auth::user()->name }}</span>
                        <i class="icon-submenu lnr lnr-chevron-down"></i>
                    </a>

                    <ul class="dropdown-menu">
                        <li><a href="#" id="modifyPwd"><i class="lnr lnr-lock"></i> <span>修改密码</span></a></li>
                        <li><a href="/admin/logout"><i class="lnr lnr-exit"></i> <span>退出</span></a></li>
                    </ul>
                </li>
            </ul>
        </div>
    </div>
</nav>
<!-- END NAVBAR -->
<!-- LEFT SIDEBAR -->
<div id="sidebar-nav" class="sidebar">
    <div class="sidebar-scroll">
        <nav>
            <ul class="nav">
                <li>
                    <a href="/admin" class="active"><i class="fa fa-home"></i> <span>首页</span></a>
                </li>

                @if($ups == 'all' || hasRoute($ups,array('news_categoryList','news_add','news_list')))
                <li>
                    <a href="#subNews" data-toggle="collapse" class="collapsed">
                        <i class="fa fa-file-o"></i> <span>文章</span>
                        <i class="icon-submenu lnr lnr-chevron-left"></i>
                    </a>
                    <div id="subNews" class="collapse">
                        <ul class="nav">
                            @if($ups == 'all' || hasRoute($ups,array('news_categoryList')))
                                <li><a href="/admin/news/categoryList"><i class="fa fa-sitemap"></i> <span>分类管理</span></a></li>
                            @endif
                            @if($ups == 'all' || hasRoute($ups,array('news_add')))
                                <li><a href="/admin/news/add"><i class="fa fa-file-text-o"></i> <span>文章添加</span></a></li>
                            @endif
                            @if($ups == 'all' || hasRoute($ups,array('news_list')))
                                <li><a href="/admin/news/list"><i class="fa fa-list"></i> <span>文章列表</span></a></li>
                            @endif
                        </ul>
                    </div>
                </li>
                @endif

                @if($ups == 'all' || hasRoute($ups,array('mall_categoryList','mall_list','mall_orderList')))
                <li>
                    <a href="#subCarts" data-toggle="collapse" class="collapsed">
                        <i class="fa fa-shopping-bag"></i> <span>商城</span>
                        <i class="icon-submenu lnr lnr-chevron-left"></i>
                    </a>
                    <div id="subCarts" class="collapse">
                        <ul class="nav">
                            @if($ups == 'all' || hasRoute($ups,array('mall_categoryList')))
                                <li><a href="/admin/mall/categoryList"><i class="fa fa-sitemap"></i> <span>分类管理</span></a></li>
                            @endif
                            @if($ups == 'all' || hasRoute($ups,array('mall_list')))
                                <li><a href="/admin/mall/list"><i class="fa fa-shopping-basket"></i> <span>产品管理</span></a></li>
                            @endif
                            @if($ups == 'all' || hasRoute($ups,array('mall_orderList')))
                                <li><a href="/admin/mall/orderList"><i class="fa fa-shopping-cart"></i> <span>订单管理</span></a></li>
                            @endif
                        </ul>
                    </div>
                </li>
                @endif

                @if($ups == 'all' || hasRoute($ups,array('config_roleList','config_userList','config_configSet')))
                <li>
                    <a href="#subSettings" data-toggle="collapse" class="collapsed">
                        <i class="fa fa-cogs"></i> <span>设置</span>
                        <i class="icon-submenu lnr lnr-chevron-left"></i>
                    </a>
                    <div id="subSettings" class="collapse">
                        <ul class="nav">
                            @if($ups == 'all' || hasRoute($ups,array('config_roleList')))
                                <li><a href="/admin/config/roleList"><i class="fa fa-users"></i> <span>角色管理</span></a></li>
                            @endif
                            @if($ups == 'all' || hasRoute($ups,array('config_userList')))
                                <li><a href="/admin/config/userList"><i class="fa fa-user-circle"></i> <span>用户管理</span></a></li>
                            @endif
                            @if($ups == 'all' || hasRoute($ups,array('config_configSet')))
                                <li><a href="/admin/config/configSet"><i class="fa fa-cog"></i> <span>参数设置</span></a></li>
                            @endif
                        </ul>
                    </div>
                </li>
                @endif
            </ul>
        </nav>
    </div>
</div>
<!-- END LEFT SIDEBAR -->
<?php
    function hasRoute($arr,$brr){
        foreach ($brr as $one){
            if(in_array($one, $arr)){
                return true;
            }
        }
        return false;
    }
?>