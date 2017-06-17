@extends('admin.layouts.master')

@section('cssContent')
    @include('vendor.ueditor.assets')
@endsection

@section('content')
    <div class="panel panel-headline">
        <div class="panel-heading">
            <h3 class="panel-title">文章{{ session('articleData') ? '修改' : '添加' }}</h3>
        </div>
        <div class="panel-body" id="acContainer">
            <input type="hidden" id="saveResult" value="{{ session('saveResult') }}">
            <form id="newsForm" method="post" action="{{ session('articleData') ? '/admin/news/storeModify' : '/admin/news/store' }}">
                {{ csrf_field() }}
                <input type="hidden" id="modifyId" name="modifyId" value="{{ session('articleData') ? session('articleData')->id : '' }}">
                <div class="form-group">
                    <label for="acCategory">分类</label>
                    <input type="hidden" id="initCategory"  value="{{ session('articleData') ? session('articleData')->categoryId : '' }}">
                    <select class="form-control newsNeed" id="acCategory" name="acCategory" tip="分类"></select>
                </div>
                <div class="form-group">
                    <label for="acTitle">标题</label>
                    <input type="text" class="form-control newsNeed" id="acTitle" name="acTitle" placeholder="标题" tip="标题" value="{{ session('articleData') ? session('articleData')->title : '' }}">
                </div>
                <div class="form-group">
                    <label for="acKeywords">关键词</label>
                    <input type="text" class="form-control" id="acKeywords" name="acKeywords" placeholder="页面关键词，配合SEO，如不设置将和标题一致" value="{{ session('articleData') ? session('articleData')->keywords : '' }}">
                </div>
                <div class="form-group">
                    <label for="acContents">内容</label>
                    <input type="hidden" class="newsNeed" id="acContent" name="acContent" tip="内容">
                    <script id="acContents" name="content" type="text/plain">
                        {!! session('articleData') ? session('articleData')->content : '' !!}
                    </script>
                </div>
                <button type="button" class="btn btn-primary" id="saveBtn">保 存</button>
            </form>
        </div>
    </div>
@endsection

@section('jsContent')
    <script src="{{ asset('/js/news/add.js') }}"></script>
@endsection