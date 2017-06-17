<?php

namespace App\Http\Controllers;

use App\ProductCategory;
use App\Product;
use App\ProductAttr;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class MallController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth');
    }

    //分类列表
    public function categoryList()
    {
        return view('admin.dashboard.mall.categoryList');
    }

    //分类添加
    public function categoryAdd()
    {
        $name = request('categoryName');

        $num = ProductCategory::where('name',$name)->count();

        if($num > 0){
            return response()->json(array('flag'=> 'exist'), 200);
        }else{
            $userId = Auth::user()->userId;
            $res = ProductCategory::create(['parentId' => 0, 'name' => $name, 'userId' => $userId]);

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

        $res = DB::delete("delete from product_categories where id in (".$ids.")");

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

        $data = ProductCategory::where('id', $id)->value('name');

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

        $num = ProductCategory::where('id', '<>', $id)->where('name', $name)->count();

        if($num > 0){
            return response()->json(array('flag'=> 'exist'), 200);
        }else{
            $res = ProductCategory::where('id', $id)->update(['name' => $name]);

            $flag = 'error';
            if($res) $flag = 'success';

            return response()->json(array('flag'=> $flag), 200);
        }
    }

    //获取全部分类
    public function categoryAll()
    {
        $res = ProductCategory::pluck('name', 'id');

        return response()->json(array('data'=> $res), 200);
    }

    //产品列表
    public function productList()
    {
        return view('admin.dashboard.mall.list');
    }

    //产品保存
    public function store()
    {
        $res = Product::create([
            'categoryId' => request('fpCategory'),
            'name' => request('fpName'),
            'price' => request('fpPrice'),
            'addUser' => Auth::user()->userId,
            'images' => request('fpImage'),
            'introduce' => request('fpIntroduce')
        ]);

        if($res){
            $arr = explode(chr(1), request('fpAttr'));

            foreach ($arr as $arrOne){
                $brr = explode(chr(2), $arrOne);

                ProductAttr::create([
                    'categoryId' => $res->id,
                    'attrKey' => $brr[0],
                    'attrValue' => $brr[1]
                ]);
            }

            return response()->json(array('flag'=> 'success'), 200);
        }else{
            return response()->json(array('flag'=> 'error'), 200);
        }
    }

    //产品修改
    public function modify()
    {
        $modifyId = request('modifyId');

        $res = Product::where('id', $modifyId)->update([
            'categoryId' => request('fpCategory'),
            'name' => request('fpName'),
            'price' => request('fpPrice'),
            'images' => request('fpImage'),
            'introduce' => request('fpIntroduce')
        ]);

        if($res){
            $rel = ProductAttr::where('categoryId', $modifyId)->delete();

            if($rel){
                $arr = explode(chr(1), request('fpAttr'));

                foreach ($arr as $arrOne){
                    $brr = explode(chr(2), $arrOne);

                    ProductAttr::create([
                        'categoryId' => $modifyId,
                        'attrKey' => $brr[0],
                        'attrValue' => $brr[1]
                    ]);
                }
            }

            return response()->json(array('flag'=> 'success'), 200);
        }else{
            return response()->json(array('flag'=> 'error'), 200);
        }
    }

    //产品删除
    public function del()
    {
        $ids = request('ids');

        $res = DB::delete("delete from products where id in (".$ids.")");

        if($res){
            $res = 'success';

            DB::delete("delete from product_attrs where categoryId in (".$ids.")");
        }else{
            $res = 'error';
        }

        return response()->json(array('flag'=> $res), 200);
    }

    //获取产品详情
    public function getOne()
    {
        $productId = request('productId');

        $mainData = Product::where('id', $productId)->first();

        $subData = ProductAttr::where('categoryId', $productId)->get();

        $flag = 'error';

        if($mainData) $flag = 'success';

        return response()->json(array('flag' => $flag, 'data' => $mainData, 'subData' => $subData), 200);
    }
}
