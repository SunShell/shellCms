<?php

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

//首页
Route::get('/', function () {
    return view('welcome');
});

//后台登录页
Route::get('/admin/login', 'AdminSessionsController@create')->name('login');
//后台登录
Route::post('/admin/login', 'AdminSessionsController@store');
//后台登出
Route::get('/admin/logout', 'AdminSessionsController@destroy');
//默认home路由跳转
Route::get('/home', 'AdminsController@goIndex');
//后台管理首页
Route::get('/admin', 'AdminsController@index')->name('home');
//修改密码
Route::post('/admin/modifyPwd', 'AdminsController@modifyPwd');

/*
 * 后台文章相关路由
 */
//后台管理-文章类别管理
Route::get('/admin/news/categoryList', 'NewsController@categoryList');
//后台管理-文章类别添加
Route::post('/admin/news/categoryAdd', 'NewsController@categoryAdd');
//后台管理-文章类别删除
Route::post('/admin/news/categoryDel', 'NewsController@categoryDel');
//后台管理-文章类别获取某一条的信息
Route::post('/admin/news/categoryGet', 'NewsController@categoryGet');
//后台管理-文章类别修改
Route::post('/admin/news/categoryModify', 'NewsController@categoryModify');
//后台管理-文章类别获取
Route::post('/admin/news/categoryAll', 'NewsController@categoryAll');
//后台管理-文章添加
Route::get('/admin/news/add', 'NewsController@add')->name('newsAdd');
//后台管理-文章添加保存
Route::post('/admin/news/store', 'NewsController@store');
//后台管理-文章列表
Route::get('/admin/news/list', 'NewsController@newsList')->name('newsList');;
//后台管理-文章删除
Route::post('/admin/news/del', 'NewsController@del');
//后台管理-文章修改
Route::post('/admin/news/modify', 'NewsController@modify');
//后台管理-文章修改保存
Route::post('/admin/news/storeModify', 'NewsController@storeModify');

/*
 * 后台商城相关路由
 */
//后台管理-产品分类列表
Route::get('/admin/mall/categoryList', 'MallController@categoryList');
//后台管理-产品类别添加
Route::post('/admin/mall/categoryAdd', 'MallController@categoryAdd');
//后台管理-产品类别删除
Route::post('/admin/mall/categoryDel', 'MallController@categoryDel');
//后台管理-产品类别获取某一条的信息
Route::post('/admin/mall/categoryGet', 'MallController@categoryGet');
//后台管理-产品类别修改
Route::post('/admin/mall/categoryModify', 'MallController@categoryModify');
//后台管理-产品类别获取
Route::post('/admin/mall/categoryAll', 'MallController@categoryAll');
//后台管理-产品列表
Route::get('/admin/mall/list', 'MallController@productList');
//后台管理-产品保存
Route::post('/admin/mall/store', 'MallController@store');
//后台管理-产品修改
Route::post('/admin/mall/modify', 'MallController@modify');
//后台管理-产品删除
Route::post('/admin/mall/del', 'MallController@del');
//后台管理-获取产品的详情
Route::post('/admin/mall/getOne', 'MallController@getOne');

/*
 * 后台设置相关路由
 */
//后台管理-角色列表
Route::get('/admin/config/roleList', 'ConfigController@roleList');
//后台管理-获取所有权限
Route::post('/admin/config/getAllRoles', 'ConfigController@getAllRoles');
//后台管理-角色添加
Route::post('/admin/config/roleAdd', 'ConfigController@roleAdd');
//后台管理-角色删除
Route::post('/admin/config/roleDel', 'ConfigController@roleDel');
//后台管理-单个角色数据获取
Route::post('/admin/config/roleGet', 'ConfigController@roleGet');
//后台管理-角色修改
Route::post('/admin/config/roleModify', 'ConfigController@roleModify');
//后台管理-获取所有角色信息
Route::post('/admin/config/getRoles', 'ConfigController@getRoles');
//后台管理-用户列表
Route::get('/admin/config/userList', 'ConfigController@userList');
//后台管理-用户添加
Route::post('/admin/config/userAdd', 'ConfigController@userAdd');
//后台管理-用户删除
Route::post('/admin/config/userDel', 'ConfigController@userDel');
//后台管理-用户删除
Route::post('/admin/config/userGet', 'ConfigController@userGet');
//后台管理-用户删除
Route::post('/admin/config/userModify', 'ConfigController@userModify');
//后台管理-参数设置页
Route::get('/admin/config/configSet', 'ConfigController@configSet');
//后台管理-参数存储
Route::post('/admin/config/store', 'ConfigController@store');

/*
 * 翻页相关路由
 */
//获取翻页信息和第一页数据
Route::post('/page/getPageInfo', 'PageController@getPageInfo');
//获取列表数据
Route::post('/page/getPage', 'PageController@getPage');

/*
 * 通用上传图片
 */
Route::post('/commonUploadImage', 'UploadController@commonUploadImage');