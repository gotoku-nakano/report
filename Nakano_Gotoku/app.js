

var video,tmp,tmp_ctx,prev,prev_ctx,w,h,m,x1,y1,customer_number,coupon_number;

window.addEventListener("load",function(){
    video=document.createElement('video');
    video.setAttribute("autoplay","");
    video.setAttribute("muted","");
    video.setAttribute("playsinline","");
    video.onloadedmetadata = function(e){video.play();};
    prev=document.getElementById("preview");
    prev_ctx=prev.getContext("2d");
    tmp = document.createElement('canvas');
    tmp_ctx = tmp.getContext("2d");


    //カメラ使用の許可ダイアログが表示される
    navigator.mediaDevices.getUserMedia(
      //マイクはオフ, カメラの設定   できれば背面カメラ    できれば640×480
      {"audio":false,"video":{"facingMode":"environment","width":{"ideal":640},"height":{"ideal":480}}}
    ).then( //許可された場合
        function(stream){
            video.srcObject = stream;
            //0.5秒後にスキャンする
            setTimeout(Scan,200);
        }
    ).catch( //許可されなかった場合
        function(err) {
            alert('Error!!!!!');
        }
    );

    function Scan(){
        //選択された幅高さ
        w=video.videoWidth;
        h=video.videoHeight;
        //画面上の表示サイズ
        prev.style.width="100%";
        prev.style.height="100%";
        //内部のサイズ
        prev.setAttribute("width",w);
        prev.setAttribute("height",h);
        if(w>h){m=h*0.5;}else{m=w*0.5;}
        x1=(w-m)/2;
        y1=(h-m)/2;
        prev_ctx.drawImage(video,0,0,w,h);
        prev_ctx.beginPath();
        prev_ctx.strokeStyle="rgb(255,0,0)";
        prev_ctx.lineWidth=2;
        prev_ctx.rect(x1,y1,m,m);
        prev_ctx.stroke();
        tmp.setAttribute("width",m);
        tmp.setAttribute("height",m);
        tmp_ctx.drawImage(prev,x1,y1,m,m,0,0,m,m);
        let imageData = tmp_ctx.getImageData(0,0,m,m);
        let scanResult = jsQR(imageData.data,m,m);
        if(scanResult){
            //会員情報のQRコードをスキャンした結果を出力
            if(scanResult.data.match(/customer./)){
                customer_number = scanResult.data.replace("customer.", "");
                if(confirm("会員情報"+customer_number+"を開きますか？")){
                    window.location.href = "./qrcord/customer/" + customer_number ;
                }
            //クーポン情報のQRコードをスキャンした結果を出力
            }else if(scanResult.data.match(/coupon./)){
                coupon_number = scanResult.data.replace("coupon.", "");
                if(confirm("クーポン番号"+coupon_number+"を開きますか？")){
                    location.href = "admin/coupon/new";
                }
            }
        }
        setTimeout(Scan,100);
      }
});