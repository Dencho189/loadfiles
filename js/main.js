/**
 * Created by Denys on 14.02.2016.
 */
$(document).ready(function(){
    //При добавление файла
    $('.custom-file-input').on('change', function() {
        var fileList = this.files;
        //console.log(fileList);
        sendFile(fileList);
    });

    //Смена класса кнопки
    $('.custom-file-input').on('mouseenter mouseleave', function() {
        $(this).closest('.mask').find('.add_file').toggleClass('hovered');
    });
});

//Отправка файла
function sendFile(files) {
    var data = new FormData();
    $.each(files, function(key, value)
    {
        data.append(key, value);
    });
    data.append("action", "add_img");

    $(document).ajaxStart(function(){
        $('#load').empty();
        var img = $('<img style="width: 100%;" src="../img/loader.gif"/>');
        $('#load').html(img);
    });


    $.ajax({
        url: '../php/ajax.php',
        type: 'POST',
        data: data,
        cache: false,
        processData: false, // Don't process the files
        contentType: false, // Set content type to false as jQuery will tell the server its a query string request
        success: function(data, textStatus, jqXHR )
        {
            if (typeof data.error === 'undefined'){
                var data_file = JSON.parse(data);
                var error = $('.error');
                var path = '../img/uploads/';

                console.log(data_file);
                if (data == 'error_copy'){
                    error.text("Помилка при копіюванні файлу!");
                    error.css({"display":"block"});
                }else if(data == 'error_create_folder'){
                    error.text("Помилка при створенні папки!");
                    error.css({"display":"block"});
                }else if(data == 'error size'){
                    error.text("Помилка розір файлу перевищує 10МБ!");
                    error.css({"display":"block"});
                }else if (data == 'error ext'){
                    error.text("Помилка  невірне розширення файлу!");
                    error.css({"display":"block"});
                }else{
                    var styles = {
                        "width": "100px",
                        "margin-right": "3px",
                        "margin-bottom": "3px"
                    };
                    var styles_del_btn = {
                        "float": "right",
                        "margin-right": "5px",
                        "cursor": "pointer"
                    };
                    var styles_div = {
                        "display": "inline-block",
                        "position": "relative"
                    };
                    var style_span = {
                        "position": "absolute",
                        "top": "45%",
                        "left": "10%",
                        "font-size": "2em",
                        "color": "white"
                    };
                    $('#load-file').empty();
                    for (var i=0; i<=data_file.length-1 ; i++){
                        console.log(data_file[i]);
                        var div = $('<div>');
                        var del_btn = $('<i>');
                        var img = $('<img class="img">');
                        var span = $('<span>');
                        var file = data_file[i];

                        del_btn.addClass( "fa fa-times" );
                        del_btn.attr('onclick', "del_img('" + file + "')");

                        var find_img = find_img_exec(file);
                        if (find_img > 0){
                            img.attr('src', path+file);
                            img.attr('alt', file);
                            div.append(img);
                        }else{
                            var default_img = $('<img src="../img/default.png" alt="default" >');
                            var text = file.split('.');
                            span.text(text[1]);
                            span.css(style_span);
                            div.append(span);
                            div.append(default_img);
                        }
                        div.append(del_btn);
                        img.css(styles);
                        del_btn.css(styles_del_btn);
                        div.css(styles_div);
                        $('#load-file').append(div);
                    }
                    $('#load').empty();
                }
            }else{
                console.log('ОШИБКИ ОТВЕТА сервера: ' + data.error );
            }
        },
        error: function(jqXHR, textStatus, errorThrown )
        {
            // Handle errors here
            console.log('ОШИБКИ AJAX запроса: ' + textStatus );
            // STOP LOADING SPINNER
        }
    });
}
//Конец Отправка файла

//Удаление файла
function del_img(file) {

    var params = {
        file: file,
        action: "del_img"
    };

    var confirm_del = confirm("Ви впевнені що хочете видалити дане зображення ?");

    if (confirm_del){
        $.ajax({
            url: '../php/ajax.php',
            type: "POST",
            data: params,
            success: function (data, textStatus) {
                console.log(data);

                if (typeof data.error === 'undefined'){
                    var data_file = JSON.parse(data);
                    var error = $('.error');
                    var path = '../img/uploads/';

                    if (data == 'error_del'){
                        error.text("Помилка при видаленні файлу!");
                        error.css({"display":"block"});
                    }else{
                        var styles = {
                            "width": "100px",
                            "margin-right": "3px",
                            "margin-bottom": "3px"
                        };
                        var styles_del_btn = {
                            "float": "right",
                            "margin-right": "5px",
                            "cursor": "pointer"
                        };
                        var styles_div = {
                            "display": "inline-block",
                            "position": "relative"
                        };
                        var style_span = {
                            "position": "absolute",
                            "top": "45%",
                            "left": "10%",
                            "font-size": "2em",
                            "color": "white"
                        };
                        $('#load-file').empty();
                        for (var i=0; i<=data_file.length-1 ; i++){
                            console.log(data_file[i]);
                            var div = $('<div>');
                            var del_btn = $('<i>');
                            var img = $('<img class="img">');
                            var span = $('<span>');
                            var file = data_file[i];

                            del_btn.addClass( "fa fa-times" );
                            del_btn.attr('onclick', "del_img('" + file + "')");

                            var find_img = find_img_exec(file);
                            if (find_img > 0){
                                img.attr('src', path+file);
                                img.attr('alt', file);
                                div.append(img);
                            }else{
                                var default_img = $('<img src="../img/default.png" alt="default" >');
                                var text = file.split('.');
                                span.text(text[1]);
                                span.css(style_span);
                                div.append(span);
                                div.append(default_img);
                            }
                            div.append(del_btn);
                            img.css(styles);
                            del_btn.css(styles_del_btn);
                            div.css(styles_div);
                            $('#load-file').append(div);
                        }
                        $('#load').empty();
                        alert("Зображення выдалено");
                    }
                }else{
                    console.log('ОШИБКИ ОТВЕТА сервера: ' + data.error );
                }
            },
            error: function (textStatus, data) {
                console.log('ОШИБКИ AJAX запроса: ' + textStatus);
            }
        });
    }else{
        return false
    }
}
//Конец Удаление файла

//Поиск только картинок
function find_img_exec(name){
    var exec = ['jpeg','jpg','gif','bmp','png'];
    var image = false;
    var str = "";
    for (var i=0; i<exec.length; i++){
        var k = name.search(exec[i]);
        if (k>0) break;
    }
    return k;
}