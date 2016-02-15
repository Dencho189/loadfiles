<?php
/**
 * Created by PhpStorm.
 * User: Denys
 * Date: 14.02.2016
 * Time: 18:32
 */
$action = isset($_POST['action']) ? htmlspecialchars(trim($_POST['action'])) : " ";
$file = isset($_POST['file']) ? htmlspecialchars(trim($_POST['file'])) : " ";

define ("MAX_SIZE","10000");
$size_file = MAX_SIZE*1024;                                                                    //Размер файла
$path_file = "../img/uploads/";                                                                //Папка загрузки
$file_ext = array("jpg", "png", "gif", "bmp","jpeg","doc","docx","xls","txt","rar","zip");     //Разширения файлов

function getExtension($str){
    $i = strrpos($str,".");
    if (!$i) { return ""; }
    $l = strlen($str) - $i;
    $ext = substr($str,$i+1,$l);
    return $ext;
}

function load_file($files, $size_file, $file_ext, $path){
    $error = "";
    $file_count = 0;
    foreach ($files as $file) {
        if (in_array(getExtension($file['name']), $file_ext)) {
            if ($file['size'] < $size_file) {
                $new_name = $path . $file['name'];
                $tmp_file = $file['tmp_name'];
                if (move_uploaded_file($tmp_file, $new_name)) {
                    $file_count++;
                }else{
                    $error = "error copy"; //"Помилка при копіюванні файлу"
                }
            }else{
                $error = "error size"; //" Розмір файлу перевищує 2МВ"
            }
        }else{
            $error = "error ext"; //"Невідоме розширення завантажуваного файлу"
        }
    }
    if (count($_FILES) == $file_count){
        return true;
    } else {
        return $error;
    }
}

if($action == "add_img" && isset($_FILES)){
    //Если есть каталог
    $files = array();

    if (file_exists($path_file)){
        @chmod($path_file, 0777);
        $load = load_file($_FILES, $size_file, $file_ext, $path_file);
        if(is_bool($load)){
            $file_dir = scandir($path_file);
            foreach ($file_dir as $key => $file) {
                if (is_file($path_file.$file)){
                    $files[] = $file;
                }
            }
            echo json_encode($files);
        }else{
            echo json_encode($load);
        }
    }else{
        //Если нет каталога
        if(!mkdir($path_file)){
            echo json_encode("error_create_folder");
        }else{
            @chmod($path_file, 0777);
            $load = load_file($_FILES, $size_file, $file_ext, $path_file);
            if(is_bool($load)){
                $file_dir = scandir($path_file);
                foreach ($file_dir as $file) {
                    if (is_file($path_file.$file)){
                        $files[] = $file;
                    }
                }
                echo json_encode($files);
            }else{
                echo json_encode($load);
            }
        }
    }

}elseif($action == "del_img" && isset($file)){

    $file_path = $path_file . $file;
    $del_file = unlink($file_path);
    if ($del_file){
        $files = array();
        $file_dir = scandir($path_file);
        foreach ($file_dir as $file) {
            if (is_file($path_file.$file)){
                $files[] = $file;
            }
        }
        echo json_encode($files);
    }else{
        echo json_encode("error_del");
    }
}
