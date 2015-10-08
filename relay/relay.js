/*初めにかけてきた方には、普通に対応するが
 *後からかけ的他方には、Stream_firstを返す
 * */

// カメラ／マイクにアクセスするためのメソッドを取得しておく
navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
var Stream_first;    //はじめにかけてきたほう
var Stream_second;        //あとにかけてきたほう
var connectedCall_first;  // 接続したコールを保存しておく変数
var connectedCall_second;
var current = 0;
//var connectedConn;
var peer = new Peer({ key: '01d0ec7d-62bf-4be2-ad40-cf26ae96cf59', debug: 3});
peer.on('open', function(){
        $('#my-id').text(peer.id);
});//自分のID表示
peer.on('call', function(call){ //かかってきたとき
    if(current==0){     //はじめにかけてきたやつ
        connectedCall_first = call;
        call.answer(localStream);
        current=1;
        calledDo_first();
    }else{      //あとにかけてきたやつ
        connectedCall_second = call;
        call.answer(stream_first);
        calledDo_second();
    }
});
/*
peer.on('connection',function(conn){    //接続されたとき
        connectedConn = conn;
        connectedDo();
});
*/
$(function() {  //能動的に動く部分
    navigator.getUserMedia({audio: false, video: true}, function(stream){
        localStream = stream;
        var url = URL.createObjectURL(stream);
        $('#my-video').prop('src', url);
    }, function() { alert("Error!"); });

/*
    $('#call-start').click(function(){  //コネクションボタン押した
        var peer_id = $('#peer-id-input').val(); //相手のID
        var call = peer.call(peer_id, localStream);//これで接続
    //    var conn = peer.connect(peer_id);//これでデータコネクション接続
        connectedCall=call; connectedConn=conn; //グローバル変数に記録
        calledDo();
  //      connectedDo(); //接続したあとにデータのやりとり
    });
*/

/*   $("#sender").click(function(){ //送信
        connectedConn.send($("#send-data").val());
    });
 */
    $('#call-end').click(function(){ //終了
        connectedCall_first.close();
        connectedCall_second.close();
      //  connectedConn.close();
    });
});
/*
function connectedDo(){ //データのやりとり
        connectedConn.on("open",function(){//コネクション利用可能リスナ
        connectedConn.on("data",function(data){//data受信リスナ
                $("#data-received").text(data+"\n"+$("#data-received").val()); //テキストとして受信データを表示
        });
        });
}
*/
function calledDo_first(){ //初めにかけてきたほう
        $("#peer-id").text(connectedCall_first.peer);
        connectedCall_first.on('stream', function(stream){//callのリスナ
            stream_first = stream;
            var url = URL.createObjectURL(stream);
            $('#peer-video1').prop('src', url);
        });
}
function calledDo_second(){
        $("#peer-id").text(connectedCall_second.peer);
        connectedCall_second.on('stream', function(stream){//callのリスナ
            stream_second = stream;
            localStream = stream;
            var url = URL.createObjectURL(stream);
            $('#peer-video2').prop('src', url);
        });
}

