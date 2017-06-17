<?php

namespace App\Http\Controllers;

use App\User;
use App\UserRoleConfig;
use App\WebsiteConfig;
use Illuminate\Support\Facades\Auth;

class WebsiteConfigController extends Controller
{
    public function getWebsiteConfig($key,$language = 'zh')
    {
        return WebsiteConfig::where('language', $language)->where('key', $key)->value('value');
    }

    public function getUserPermission()
    {
        if(Auth::check()){
            if(!session()->has('userPermissions')){
                $userId = Auth::user()->userId;

                $roleId = User::where('userId', $userId)->value('roleId');

                if($roleId == 0){
                    $data = 'all';
                }else{
                    $res = UserRoleConfig::where('roleId', $roleId)->pluck('value');

                    if($res){
                        $data = array();

                        foreach ($res as $one){
                            array_push($data, $one);
                        }
                    }else{
                        $data = null;
                    }
                }

                session('userPermissions', null);
                session(['userPermissions' => $data]);
            }

            return session('userPermissions');
        }else{
            return null;
        }
    }
}
