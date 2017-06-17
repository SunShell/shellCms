@extends('admin.layouts.master')

@section('cssContent')
    <link href="{{ asset('/css/shellPaginate.css') }}" rel="stylesheet">
@endsection

@section('content')
    <div class="panel panel-headline">
        <div class="panel-heading">
            <h3 class="panel-title">角色列表</h3>
        </div>

        <input type="hidden" id="theToken" value="{{ csrf_token() }}">

        <div class="spOpContainer">
            <label for="queryName">角色名称：</label>
            <input type="text" class="form-control spOpIpt" id="queryName" placeholder="产品名称">&nbsp;&nbsp;

            <a class="btn btn-primary"><i class="fa fa-search"></i> 搜索</a>&nbsp;
            <a class="btn btn-success"><i class="fa fa-plus"></i> 添加</a>&nbsp;
            <a class="btn btn-danger"><i class="fa fa-times"></i> 删除</a>
        </div>

        <div class="panel-body no-padding" id="rlContainer"></div>
    </div>
@endsection

@section('jsContent')
    <script src="{{ asset('/js/shellPaginate.js') }}"></script>
    <script src="{{ asset('/js/config/roleList.js') }}"></script>
@endsection