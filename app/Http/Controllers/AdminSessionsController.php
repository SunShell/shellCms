<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class AdminSessionsController extends Controller
{
    public function __construct()
    {
        $this->middleware('guest', ['except' => 'destroy']);
    }

    //登录页
    public function create()
    {
        return view('admin.login.login');
    }

    //登录
    public function store()
    {
        if(!auth()->attempt(['userId' => request('login_id'), 'password' => request('login_password')])){
            return back()->withErrors([
                'message' => '用户名或密码不正确！'
            ]);
        }

        return redirect()->home();
    }

    //登出
    public function destroy()
    {
        //清楚权限session
        session()->forget('userPermissions');

        //登出
        auth()->logout();

        return redirect()->home();
    }
}
