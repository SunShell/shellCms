<?php

namespace App\Http\Controllers;

use App\Article;
use App\NewsCategory;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class NewsController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth');
    }

    //分类列表
    public function categoryList()
    {
        return view('admin.dashboard.news.categoryList');
    }

    //分类添加
    public function categoryAdd()
    {
        $name = request('categoryName');

        $num = NewsCategory::where('name',$name)->count();

        if($num > 0){
            return response()->json(array('flag'=> 'exist'), 200);
        }else{
            $userId = Auth::user()->userId;
            $res = NewsCategory::create(['parentId' => 0, 'name' => $name, 'userId' => $userId]);

            if($res){
                $res = 'success';
            }else{
                $res = 'error';
            }

            return response()->json(array('flag'=> $res), 200);
        }
    }

    //分类删除
    public function categoryDel()
    {
        $ids = request('ids');

        $res = DB::delete("delete from news_categories where id in (".$ids.")");

        if($res){
            $res = 'success';
        }else{
            $res = 'error';
        }

        return response()->json(array('flag'=> $res), 200);
    }

    //获取信息
    public function categoryGet()
    {
        $id = request('categoryId');

        $data = NewsCategory::where('id', $id)->value('name');

        if($data){
            return response()->json(array('flag'=> 'success', 'data'=> $data), 200);
        }else{
            return response()->json(array('flag'=> 'error'), 200);
        }
    }

    //分类修改
    public function categoryModify()
    {
        $id = request('categoryId');
        $name = request('categoryName');

        $num = NewsCategory::where('id', '<>', $id)->where('name', $name)->count();

        if($num > 0){
            return response()->json(array('flag'=> 'exist'), 200);
        }else{
            $res = NewsCategory::where('id', $id)->update(['name' => $name]);

            $flag = 'error';
            if($res) $flag = 'success';

            return response()->json(array('flag'=> $flag), 200);
        }
    }

    //获取全部分类
    public function categoryAll()
    {
        $res = NewsCategory::pluck('name', 'id');

        return response()->json(array('data'=> $res), 200);
    }

    //文章列表
    public function newsList()
    {
        return view('admin.dashboard.news.list');
    }

    //文章删除
    public function del()
    {
        $ids = request('ids');

        $res = DB::delete("delete from articles where id in (".$ids.")");

        if($res){
            $res = 'success';
        }else{
            $res = 'error';
        }

        return response()->json(array('flag'=> $res), 200);
    }

    //文章修改
    public function modify()
    {
        $modifyId = request('modifyId');

        $data = Article::where('id', $modifyId)->first();

        session()->flash('articleData', $data);

        return redirect()->route('newsAdd');
    }

    //文章修改保存
    public function storeModify()
    {
        $modifyId = request('modifyId');
        $acCategory = request('acCategory');
        $acTitle = request('acTitle');
        $acKeywords = request('acKeywords');
        $acContent = request('acContent');

        $res = Article::where('id', $modifyId)->update([
            'categoryId' => $acCategory,
            'keywords' => $acKeywords,
            'title' => $acTitle,
            'content' => $acContent
        ]);

        $flag = '修改失败！';

        if($res) $flag = '修改成功！';

        session()->flash('saveResult', $flag);

        return redirect()->route('newsList');
    }

    //文章添加
    public function add()
    {
        return view('admin.dashboard.news.add');
    }

    //文章添加保存
    public function store()
    {
        $acCategory = request('acCategory');
        $acTitle = request('acTitle');
        $acKeywords = request('acKeywords');
        $acContent = request('acContent');

        if(!$acKeywords) $acKeywords = $acTitle;

        $res = Article::create([
            'categoryId' => $acCategory,
            'keywords' => $acKeywords,
            'title' => $acTitle,
            'content' => $acContent,
            'author' => Auth::user()->userId
        ]);

        $flag = '添加失败！';

        if($res) $flag = '添加成功！';

        session()->flash('saveResult', $flag);

        return redirect()->route('newsAdd');
    }
}
