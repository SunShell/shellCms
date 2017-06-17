<?php

namespace App\Http\Controllers;

use App\UserRole;
use App\UserRoleConfig;
use App\User;
use App\WebsiteConfig;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\File;

class ConfigController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth');
    }

    //角色列表
    public function roleList()
    {
        return view('admin.dashboard.config.roleList');
    }

    //获取所有权限
    public function getAllRoles()
    {
        return response()->json(array(
            array(
                'id' => 'news',
                'name' => '文章权限',
                'data' => array(
                    'news_categoryList' => '分类管理',
                    'news_add' => '文章编辑',
                    'news_list' => '文章查看'
                )
            ),
            array(
                'id' => 'mall',
                'name' => '商城权限',
                'data' => array(
                    'mall_categoryList' => '分类管理',
                    'mall_list' => '产品管理',
                    'mall_orderList' => '订单管理'
                )
            ),
            array(
                'id' => 'config',
                'name' => '系统设置',
                'data' => array(
                    'config_roleList' => '角色管理',
                    'config_userList' => '用户管理',
                    'config_configSet' => '参数设置'
                )
            )
        ), 200);
    }

    //角色添加
    public function roleAdd()
    {
        $num = UserRole::where('name', request('roleName'))->count();

        if($num > 0){
            return response()->json(array('flag'=> 'exist'), 200);
        }

        $res = UserRole::create([
            'name' => request('roleName'),
            'addUser' => Auth::user()->userId
        ]);

        if($res){
            $arr = explode(',', request('roleValue'));

            foreach ($arr as $one){
                UserRoleConfig::create([
                    'roleId' => $res->id,
                    'value' => $one
                ]);
            }

            return response()->json(array('flag'=> 'success'), 200);
        }else{
            return response()->json(array('flag'=> 'error'), 200);
        }
    }

    //角色删除
    public function roleDel()
    {
        $ids = request('ids');

        $res = DB::delete("delete from user_roles where id in (".$ids.")");

        if($res){
            $flag = 'success';

            DB::delete("delete from user_role_configs where roleId in (".$ids.")");
        }else{
            $flag = 'error';
        }

        return response()->json(array('flag'=> $flag), 200);
    }

    //单个角色数据获取
    public function roleGet()
    {
        $roleId = request('roleId');

        $data = UserRole::where('id', $roleId)->first();

        $subData = UserRoleConfig::where('roleId', $roleId)->pluck('value');

        return response()->json(array('flag'=> ($data ? 'success' : 'error'), 'data' => $data, 'subData' => $subData), 200);
    }

    //角色修改
    public function roleModify()
    {
        $modifyId = request('modifyId');

        $num = UserRole::where('name', request('roleName'))->where('id', '<>', $modifyId)->count();

        if($num > 0){
            return response()->json(array('flag'=> 'exist'), 200);
        }

        $res = UserRole::where('id', $modifyId)->update([
            'name' => request('roleName')
        ]);

        if($res){
            UserRoleConfig::where('roleId', $modifyId)->delete();

            $arr = explode(',', request('roleValue'));

            foreach ($arr as $one){
                UserRoleConfig::create([
                    'roleId' => $modifyId,
                    'value' => $one
                ]);
            }

            return response()->json(array('flag'=> 'success'), 200);
        }else{
            return response()->json(array('flag'=> 'error'), 200);
        }
    }

    //获取所有角色信息
    public function getRoles()
    {
        $data = UserRole::pluck('name', 'id');

        return response()->json(array('data'=> $data), 200);
    }

    //用户列表
    public function userList()
    {
        return view('admin.dashboard.config.userList');
    }

    //用户添加
    public function userAdd()
    {
        $sp_userId = request('sp_userId');
        $sp_userName = request('sp_userName');
        $sp_userPwd = request('sp_userPwd');
        $sp_userRole = request('sp_userRole');

        $num_id = User::where('userId', $sp_userId)->count();

        if($num_id > 0){
            return response()->json(array('flag'=> 'error', 'tip' => '已存在相同ID的用户，无法添加！'), 200);
        }

        $num_name = User::where('name', $sp_userName)->count();

        if($num_name > 0){
            return response()->json(array('flag'=> 'error', 'tip' => '已存在相同名称的用户，无法添加！'), 200);
        }

        $res = User::create([
            'userId' => $sp_userId,
            'name' => $sp_userName,
            'password' => bcrypt($sp_userPwd),
            'roleId' => $sp_userRole
        ]);

        $flag = 'error';
        $tip = '添加失败！';

        if($res){
            $flag = 'success';
            $tip = '添加失败！';
        }

        return response()->json(array('flag'=> $flag, 'tip' => $tip), 200);
    }

    //用户删除
    public function userDel()
    {
        $ids = request('ids');

        $res = DB::delete("delete from users where id in (".$ids.")");

        $flag = 'error';

        if($res) $flag = 'success';

        return response()->json(array('flag'=> $flag), 200);
    }

    //用户获取
    public function userGet()
    {
        $userId = request('userId');

        $data = User::where('id', $userId)->first();

        $flag = 'error';

        if($data) $flag = 'success';

        return response()->json(array('flag' => $flag, 'data'=> $data), 200);
    }

    //用户修改
    public function userModify()
    {
        $modifyId = request('modifyId');

        $userId = User::where('id', $modifyId)->value('userId');

        if($userId == 'admin'){
            return response()->json(array('flag'=> 'error', 'tip' => '超级管理员用户无法修改！'), 200);
        }

        $num_name = User::where('name', request('sp_userName'))->where('id', '<>', $modifyId)->count();

        if($num_name > 0){
            return response()->json(array('flag'=> 'error', 'tip' => '已存在相同名称的用户，无法修改！'), 200);
        }

        $update = array(
            'name' => request('sp_userName'),
            'roleId' => request('sp_userRole')
        );

        $sp_userPwd = request('sp_userPwd');

        if($sp_userPwd){
            $update['password'] = bcrypt($sp_userPwd);
        }

        $res = User::where('id', $modifyId)->update($update);

        if($res){
            return response()->json(array('flag'=> 'success', 'tip' => '修改成功！'), 200);
        }else{
            return response()->json(array('flag'=> 'error', 'tip' => '修改失败！'), 200);
        }
    }

    //参数设置页
    public function configSet()
    {
        $configData = WebsiteConfig::where('language', 'zh')->pluck('value', 'key');

        return view('admin.dashboard.config.set', compact('configData'));
    }

    //参数存储
    public function store()
    {
        $one = WebsiteConfig::where('language', 'zh')->delete();

        if($one){
            $two = DB::table('website_configs')->insert(array(
                array(
                    'language' => 'zh',
                    'key' => 'siteName',
                    'value' => request('wc_siteName')
                ),
                array(
                    'language' => 'zh',
                    'key' => 'siteTitle',
                    'value' => request('wc_siteTitle')
                ),
                array(
                    'language' => 'zh',
                    'key' => 'siteKeywords',
                    'value' => request('wc_siteKeywords')
                ),
                array(
                    'language' => 'zh',
                    'key' => 'siteDescription',
                    'value' => request('wc_siteDescription')
                )
            ));

            $wc_siteLogo = request('wc_siteLogo');
            $wc_siteIcon = request('wc_siteIcon');

            if($wc_siteLogo){
                File::move($wc_siteLogo, 'images/logo.png');
            }

            if($wc_siteIcon){
                File::move($wc_siteIcon, 'images/logo-icon.png');
            }

            if($two){
                return response()->json(array('flag'=> 'success'), 200);
            }else{
                return response()->json(array('flag'=> 'error'), 200);
            }
        }else{
            return response()->json(array('flag'=> 'error'), 200);
        }
    }
}
