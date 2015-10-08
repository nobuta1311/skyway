// カメラ／マイクにアクセスするためのメソッドを取得しておく
navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
var localStream;    // 自分の映像ストリームを保存しておく変数
var connectedCall;  // 接続したコールを保存しておく変数
var connectedConn;
var peer = new Peer({ key: '01d0ec7d-62bf-4be2-ad40-cf26ae96cf59', debug: 3});
peer.on('open', function(){
        $('#my-id').text(peer.id);
});//自分のID表示
peer.on('call', function(call){ //かかってきたとき
    connectedCall = call;
    call.answer(localStream);
    calledDo();
});
peer.on('connection',function(conn){    //接続されたとき
        connectedConn = conn;
        connectedDo();
});
$(function() {  //能動的に動く部分
    navigator.getUserMedia({audio: false, video: true}, function(stream){
        localStream = stream;
        var url = URL.createObjectURL(stream);
        $('#my-video').prop('src', url);
    }, function() { alert("Error!"); });
    $('#call-start').click(function(){  //コネクションボタン押した
        var peer_id = $('#peer-id-input').val(); //相手のID
        var call = peer.call(peer_id, localStream);//これで接続
        var conn = peer.connect(peer_id);//これでデータコネクション接続
        connectedCall=call; connectedConn=conn; //グローバル変数に記録
        calledDo();
        connectedDo(); //接続したあとにデータのやりとり
    });
    $("#sender").click(function(){ //送信
        connectedConn.send($("#send-data").val());
    });
    $('#call-end').click(function(){ //終了
        connectedCall.close();
        connectedConn.close();
    });
});
function connectedDo(){ //データのやりとり
        connectedConn.on("open",function(){//コネクション利用可能リスナ
        connectedConn.on("data",function(data){//data受信リスナ
                $("#data-received").text(data+"\n"+$("#data-received").val()); //テキストとして受信データを表示
        });
        });
}
function calledDo(){ //コネクションした後のやりとり
        $("#peer-id").text(connectedCall.peer);
        connectedCall.on('stream', function(stream){//callのリスナ
            var url = URL.createObjectURL(stream);
            $('#peer-video').prop('src', url);
        });
}
