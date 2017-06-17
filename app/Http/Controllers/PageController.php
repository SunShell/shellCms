<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\DB;

class PageController extends Controller
{
    //获取页数信息和第一页数据
    public function getPageInfo()
    {
        $pageSize = request('pageSize');
        $pageNum = request('pageNum');
        $table = request('table');
        $defaultCon = request('defaultCon');
        $orderBy = request('orderBy');
        $nameStr = request('nameStr');
        $queryCon = request('queryCon');

        $nameArr = array();

        if($nameStr){
            $tmpArr = explode(',', $nameStr);

            foreach ($tmpArr as $tmpOne){
                if(!$tmpOne) continue;

                $tmpBrr = explode('.', $tmpOne);

                $sqlOne = "select ".$tmpBrr[1].",".$tmpBrr[2]." from ".$tmpBrr[0];
                $resOne = DB::select($sqlOne);
                $nameArr[$tmpBrr[0].'_'.$tmpBrr[1]] = $resOne;
            }
        }

        $where = $defaultCon == "" ? "" : " where (".$defaultCon.") ";
        if($queryCon){
            if($where){
                $where .= " and (".$queryCon.") ";
            }else{
                $where = " where ".$queryCon." ";
            }
        }

        $sql = "select * from ".$table.$where." ".($orderBy == "" ? "" : $orderBy)." limit ".(($pageNum-1)*$pageSize).",".$pageSize;

        $allNum = DB::select("select count(*) as allNum from ".$table.$where);
        $list = DB::select($sql);

        return response()->json(array('allNum'=> $allNum[0], 'pageData' => $list, 'nameData' => $nameArr), 200);
    }

    //翻页
    public function getPage()
    {
        $pageSize = request('pageSize');
        $pageNum = request('pageNum');
        $table = request('table');
        $defaultCon = request('defaultCon');
        $orderBy = request('orderBy');
        $queryCon = request('queryCon');

        $where = $defaultCon == "" ? "" : " where (".$defaultCon.") ";
        if($queryCon){
            if($where){
                $where .= " and (".$queryCon.") ";
            }else{
                $where = " where ".$queryCon." ";
            }
        }

        $sql = "select * from ".$table.$where." ".($orderBy == "" ? "" : $orderBy)." limit ".(($pageNum-1)*$pageSize).",".$pageSize;

        $list = DB::select($sql);

        return response()->json(array('pageData' => $list), 200);
    }
}
