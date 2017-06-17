@extends('admin.layouts.master')

@section('content')
    <div class="panel panel-headline">
        <div class="panel-heading">
            <h3 class="panel-title">网站参数设置</h3>
        </div>

        <input type="hidden" id="theToken" value="{{ csrf_token() }}">

        <form class="form-horizontal mySetForm col-sm-12 col-md-8 col-lg-6">
            <div class="form-group">
                <label for="wc_siteName" class="col-sm-2 control-label">网站名称</label>
                <div class="col-sm-10">
                    <input type="text" class="form-control" id="wc_siteName" placeholder="网站名称" value="{{ $configData['siteName'] }}">
                </div>
            </div>

            <div class="form-group">
                <label for="wc_siteTitle" class="col-sm-2 control-label">网站Title</label>
                <div class="col-sm-10">
                    <input type="text" class="form-control" id="wc_siteTitle" placeholder="网站Title" value="{{ $configData['siteTitle'] }}">
                </div>
            </div>

            <div class="form-group">
                <label for="wc_siteKeywords" class="col-sm-2 control-label">网站关键词</label>
                <div class="col-sm-10">
                    <input type="text" class="form-control" id="wc_siteKeywords" placeholder="网站关键词" value="{{ $configData['siteKeywords'] }}">
                </div>
            </div>

            <div class="form-group">
                <label for="wc_siteDescription" class="col-sm-2 control-label">网站介绍</label>
                <div class="col-sm-10">
                    <input type="text" class="form-control" id="wc_siteDescription" placeholder="网站介绍" value="{{ $configData['siteDescription'] }}">
                </div>
            </div>
        </form>

        <form class="form-horizontal mySetForm col-sm-12 col-md-8 col-lg-6" action="/commonUploadImage" enctype="multipart/form-data" method="post">
            {{ csrf_field() }}
            <div class="form-group">
                <label for="wc_siteLogoFile" class="col-sm-2 control-label">网站logo</label>
                <div class="col-sm-10">
                    <input type="hidden" class="imagePath" id="wc_siteLogo">

                    <img class="cs_commonImg cs_logo" src="{{ asset('/images/logo.png') }}">

                    <input type="hidden" name="cuiExtensions" value="png">
                    <input type="hidden" name="cuiPath" value="logo">
                    <input type="file" class="fileIpt" id="wc_siteLogoFile" name="cuiValue" style="display: inline-block;">

                    <button type="button" class="btn btn-sm btn-success upBtn" style="display: inline-block;">上传</button>
                </div>
            </div>
        </form>

        <form class="form-horizontal mySetForm col-sm-12 col-md-8 col-lg-6" action="/commonUploadImage" enctype="multipart/form-data" method="post">
            {{ csrf_field() }}
            <div class="form-group">
                <label for="wc_siteIconFile" class="col-sm-2 control-label">网站icon</label>
                <div class="col-sm-10">
                    <input type="hidden" class="imagePath" id="wc_siteIcon">

                    <img class="cs_commonImg cs_icon" src="{{ asset('/images/logo-icon.png') }}">

                    <input type="hidden" name="cuiExtensions" value="png">
                    <input type="hidden" name="cuiPath" value="logo">
                    <input type="file" class="fileIpt" id="wc_siteIconFile" name="cuiValue" style="display: inline-block;">

                    <button type="button" class="btn btn-sm btn-success upBtn" style="display: inline-block;">上传</button>
                </div>
            </div>
        </form>

        <form class="form-horizontal mySetForm col-sm-12 col-md-8 col-lg-6">
            <div class="form-group">
                <div class="col-sm-offset-2 col-sm-10">
                    <button type="button" class="btn btn-primary" id="wc_save">保存</button>
                </div>
            </div>
        </form>

        <div style="clear: both;"></div>
    </div>
@endsection

@section('jsContent')
    <script src="https://cdn.bootcss.com/jquery.form/4.2.1/jquery.form.min.js"></script>
    <script src="{{ asset('/js/config/set.js') }}"></script>
@endsection