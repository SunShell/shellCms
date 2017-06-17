@extends('admin.layouts.master')

@section('cssContent')
    <link href="{{ asset('/css/shellPaginate.css') }}" rel="stylesheet">
@endsection

@section('content')
    <div class="panel panel-headline">
        <div class="panel-heading">
            <h3 class="panel-title">文章列表</h3>
        </div>
        <input type="hidden" id="saveResult" value="{{ session('saveResult') }}">
        <form id="modifyForm" method="post" action="/admin/news/modify" style="display: none;">
            {{ csrf_field() }}
            <input type="hidden" id="modifyId" name="modifyId">
        </form>
        <div class="spOpContainer">
            <label for="queryType">文章分类：</label>
            <select class="form-control spOpIpt" id="queryType"></select>&nbsp;&nbsp;
            <label for="queryName">文章标题：</label>
            <input type="text" class="form-control spOpIpt" id="queryName" placeholder="文章标题">&nbsp;&nbsp;
            <a class="btn btn-primary"><i class="fa fa-search"></i> 搜索</a>&nbsp;
            <a class="btn btn-danger"><i class="fa fa-times"></i> 删除</a>
        </div>
        <div class="panel-body no-padding" id="alContainer"></div>
    </div>
@endsection

@section('jsContent')
    <script src="{{ asset('/js/shellPaginate.js') }}"></script>
    <script src="{{ asset('/js/news/list.js') }}"></script>
@endsection