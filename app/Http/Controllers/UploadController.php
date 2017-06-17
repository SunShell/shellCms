<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class UploadController extends Controller
{
    public function commonUploadImage()
    {
        $request = request();
        $file = $request->file('cuiValue');

        //上传格式
        $cuiExtensions = $request->cuiExtensions;
        if($cuiExtensions){
            $allowed_extensions = explode(',', $cuiExtensions);
        }else{
            $allowed_extensions = ["png", "jpg", "gif", 'jpeg'];
        }

        $file_extension = $file->getClientOriginalExtension();

        if ($file_extension && !in_array($file_extension, $allowed_extensions)) {
            return response()->json(array('error'=> '只能上传以下格式的图片：'.implode('、', $allowed_extensions).'！'), 200);
        }

        if($file->getSize() > 2097152){
            return response()->json(array('error'=> '请上传2M以下的图片！'), 200);
        }

        $destinationPath = 'uploads/image/'.($request->cuiPath ? $request->cuiPath.'/' : '');
        $fileName = time().str_random(5).'.'.$file_extension;
        $file->move($destinationPath, $fileName);

        return response()->json(array('success'=> true, 'src' => asset($destinationPath.$fileName), 'fileName' => $fileName, 'path' => $destinationPath.$fileName), 200);
    }
}
