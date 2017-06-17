<?php

use Carbon\Carbon;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $now = Carbon::now();

        //用户表
        DB::table('users')->insert([
            'userId' => 'admin',
            'name' => '超级管理员',
            'isAdmin' => 1,
            'password' => bcrypt('test'),
            'roleId' => '0',
            'created_at' => $now,
            'updated_at' => $now
        ]);

        //网站配置表-中文
        DB::table('website_configs')->insert([
            [
                'language' => 'zh',
                'key' => 'siteName',
                'value' => '淄博天德网络科技有限公司',
                'created_at' => $now,
                'updated_at' => $now
            ],
            [
                'language' => 'zh',
                'key' => 'siteTitle',
                'value' => '淄博天德网络科技有限公司',
                'created_at' => $now,
                'updated_at' => $now
            ],
            [
                'language' => 'zh',
                'key' => 'siteKeywords',
                'value' => '淄博天德网络科技有限公司',
                'created_at' => $now,
                'updated_at' => $now
            ],
            [
                'language' => 'zh',
                'key' => 'siteDescription',
                'value' => '淄博天德网络科技有限公司',
                'created_at' => $now,
                'updated_at' => $now
            ]
        ]);

        //网站配置表-英文
        DB::table('website_configs')->insert([
            [
                'language' => 'en',
                'key' => 'siteName',
                'value' => 'Tiande Network Technology Co.,Ltd',
                'created_at' => $now,
                'updated_at' => $now
            ],
            [
                'language' => 'en',
                'key' => 'siteTitle',
                'value' => 'Tiande Network Technology Co.,Ltd',
                'created_at' => $now,
                'updated_at' => $now
            ],
            [
                'language' => 'en',
                'key' => 'siteKeywords',
                'value' => 'Tiande Network Technology Co.,Ltd',
                'created_at' => $now,
                'updated_at' => $now
            ],
            [
                'language' => 'en',
                'key' => 'siteDescription',
                'value' => 'Tiande Network Technology Co.,Ltd',
                'created_at' => $now,
                'updated_at' => $now
            ]
        ]);
    }
}
