// カメラ／マイクにアクセスするためのメソッドを取得しておく
navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
var localStream;    // 自分の映像ストリームを保存しておく変数
var connectedCall = new Array(7);  // 接続したコールを保存しておく変数
var connectedConn = new Array(7);
var connectedNum=0;
var peer = new Peer({ key: '2e8076d1-e14c-46d4-a001-53637dfee5a4', debug: 3});
peer.on('open', function(){
        $('#my-id').text(peer.id);
});//自分のID表示
peer.on('call', function(call){ //かかってきたとき
    connectedNum++;
    connectedCall[connectedNum]= call;
    connectedCall[connectedNum].answer(localStream);
    calledDo();
});
peer.on('connection',function(conn){    //接続されたとき
        connectedConn[connectedNum] = conn;
        connectedDo();
});
$(function() {  //能動的に動く部分
    navigator.getUserMedia({audio: false, video: true}, function(stream){
        localStream = stream;
        var url = URL.createObjectURL(stream);
        $('#my-video').prop('src', url);
    }, function() { alert("Error!"); });
    $('#call-start').click(function(){  //コネクションボタン押した
        connectedNum++;
        var peer_id = $('#peer-id-input').val(); //相手のID
        connectedCall[connectedNum] = peer.call(peer_id, localStream);//これで接続
        connectedConn[connectedNum] = peer.connect(peer_id);//これでデータコネクション接続
       // connectedCall=call; connectedConn=conn; //グローバル変数に記録
        calledDo();
        connectedDo(); //接続したあとにデータのやりとり
    });
    $("#sender").click(function(){ //送信
        var selected = $("input[name=submitNum]:checked").val();
        connectedConn[selected].send($("#send-data").val());
    });
    $('#call-end').click(function(){ //終了
        var selected = $("input[name=closeNum]:checked").val();
        connectedCall[selected].close();
        connectedConn[selected].close();
        connectedNum--;
        $("#peer-id"+connectedNum).text("");
    });
});
function connectedDo(){ //データのやりとり
        connectedConn[connectedNum].on("open",function(){//コネクション利用可能リスナ
        connectedConn[connectedNum].on("data",function(data){//data受信リスナ
                $("#data-received").text(data+"\n"+$("#data-received").val()); //テキストとして受信データを表示
        });
        });
}
function calledDo(){ //コネクションした後のやりとり
        $("#peer-num").text(connectedNum);
        $("#peer-id"+connectedNum).text(connectedCall[connectedNum].peer);
        connectedCall[connectedNum].on('stream', function(stream){//callのリスナ
            var url = URL.createObjectURL(stream);
            $('#peer-video'+connectedNum).prop('src', url);
        });
}
