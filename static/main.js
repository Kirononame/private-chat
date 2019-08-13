function SHA1(msg) {
    function rotate_left(n,s) {
      var t4 = ( n<<s ) | (n>>>(32-s));
      return t4;
    };
    function lsb_hex(val) {
      var str="";
      var i;
      var vh;
      var vl;
      for( i=0; i<=6; i+=2 ) {
        vh = (val>>>(i*4+4))&0x0f;
        vl = (val>>>(i*4))&0x0f;
        str += vh.toString(16) + vl.toString(16);
      }
      return str;
    };
    function cvt_hex(val) {
      var str="";
      var i;
      var v;
      for( i=7; i>=0; i-- ) {
        v = (val>>>(i*4))&0x0f;
        str += v.toString(16);
      }
      return str;
    };
    function Utf8Encode(string) {
      string = string.replace(/\r\n/g,"\n");
      var utftext = "";
      for (var n = 0; n < string.length; n++) {
        var c = string.charCodeAt(n);
        if (c < 128) {
          utftext += String.fromCharCode(c);
        }
        else if((c > 127) && (c < 2048)) {
          utftext += String.fromCharCode((c >> 6) | 192);
          utftext += String.fromCharCode((c & 63) | 128);
        }
        else {
          utftext += String.fromCharCode((c >> 12) | 224);
          utftext += String.fromCharCode(((c >> 6) & 63) | 128);
          utftext += String.fromCharCode((c & 63) | 128);
        }
      }
      return utftext;
    };
    var blockstart;
    var i, j;
    var W = new Array(80);
    var H0 = 0x67452301;
    var H1 = 0xEFCDAB89;
    var H2 = 0x98BADCFE;
    var H3 = 0x10325476;
    var H4 = 0xC3D2E1F0;
    var A, B, C, D, E;
    var temp;
    msg = Utf8Encode(msg);
    var msg_len = msg.length;
    var word_array = new Array();
    for( i=0; i<msg_len-3; i+=4 ) {
      j = msg.charCodeAt(i)<<24 | msg.charCodeAt(i+1)<<16 |
      msg.charCodeAt(i+2)<<8 | msg.charCodeAt(i+3);
      word_array.push( j );
    }
    switch( msg_len % 4 ) {
      case 0:
        i = 0x080000000;
      break;
      case 1:
        i = msg.charCodeAt(msg_len-1)<<24 | 0x0800000;
      break;
      case 2:
        i = msg.charCodeAt(msg_len-2)<<24 | msg.charCodeAt(msg_len-1)<<16 | 0x08000;
      break;
      case 3:
        i = msg.charCodeAt(msg_len-3)<<24 | msg.charCodeAt(msg_len-2)<<16 | msg.charCodeAt(msg_len-1)<<8  | 0x80;
      break;
    }
    word_array.push( i );
    while( (word_array.length % 16) != 14 ) word_array.push( 0 );
    word_array.push( msg_len>>>29 );
    word_array.push( (msg_len<<3)&0x0ffffffff );
    for ( blockstart=0; blockstart<word_array.length; blockstart+=16 ) {
      for( i=0; i<16; i++ ) W[i] = word_array[blockstart+i];
      for( i=16; i<=79; i++ ) W[i] = rotate_left(W[i-3] ^ W[i-8] ^ W[i-14] ^ W[i-16], 1);
      A = H0;
      B = H1;
      C = H2;
      D = H3;
      E = H4;
      for( i= 0; i<=19; i++ ) {
        temp = (rotate_left(A,5) + ((B&C) | (~B&D)) + E + W[i] + 0x5A827999) & 0x0ffffffff;
        E = D;
        D = C;
        C = rotate_left(B,30);
        B = A;
        A = temp;
      }
      for( i=20; i<=39; i++ ) {
        temp = (rotate_left(A,5) + (B ^ C ^ D) + E + W[i] + 0x6ED9EBA1) & 0x0ffffffff;
        E = D;
        D = C;
        C = rotate_left(B,30);
        B = A;
        A = temp;
      }
      for( i=40; i<=59; i++ ) {
        temp = (rotate_left(A,5) + ((B&C) | (B&D) | (C&D)) + E + W[i] + 0x8F1BBCDC) & 0x0ffffffff;
        E = D;
        D = C;
        C = rotate_left(B,30);
        B = A;
        A = temp;
      }
      for( i=60; i<=79; i++ ) {
        temp = (rotate_left(A,5) + (B ^ C ^ D) + E + W[i] + 0xCA62C1D6) & 0x0ffffffff;
        E = D;
        D = C;
        C = rotate_left(B,30);
        B = A;
        A = temp;
      }
      H0 = (H0 + A) & 0x0ffffffff;
      H1 = (H1 + B) & 0x0ffffffff;
      H2 = (H2 + C) & 0x0ffffffff;
      H3 = (H3 + D) & 0x0ffffffff;
      H4 = (H4 + E) & 0x0ffffffff;
    }
    var temp = cvt_hex(H0) + cvt_hex(H1) + cvt_hex(H2) + cvt_hex(H3) + cvt_hex(H4);
  
    return temp.toLowerCase();
}

function hex2bin(hex)
{
    var bytes = [], str;

    for(var i=0; i< hex.length-1; i+=2)
        bytes.push(parseInt(hex.substr(i, 2), 16));

    return String.fromCharCode.apply(String, bytes);    
}

function hex2a(hexx) {
    var hex = hexx.toString();//force conversion
    var str = '';
    for (var i = 0; i < hex.length; i += 2)
        str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
    return str;
}

//Useful Functions
function checkBin(n){return/^[01]{1,64}$/.test(n)}
function checkDec(n){return/^[0-9]{1,64}$/.test(n)}
function checkHex(n){return/^[0-9A-Fa-f]{1,64}$/.test(n)}
function pad(s,z){s=""+s;return s.length<z?pad("0"+s,z):s}
function unpad(s){s=""+s;return s.replace(/^0+/,'')}

//Decimal operations
function Dec2Bin(n){if(!checkDec(n)||n<0)return 0;return n.toString(2)}
function Dec2Hex(n){if(!checkDec(n)||n<0)return 0;return n.toString(16)}

//Binary Operations
function Bin2Dec(n){if(!checkBin(n))return 0;return parseInt(n,2).toString(10)}
function Bin2Hex(n){if(!checkBin(n))return 0;return parseInt(n,2).toString(16)}

//Hexadecimal Operations
function Hex2Bin(n){if(!checkHex(n))return 0;return parseInt(n,16).toString(2)}
function Hex2Dec(n){if(!checkHex(n))return 0;return parseInt(n,16).toString(10)}

var asciiToBin = (function () {
    var pad = '00000000';

    return function (str) {
        return str.replace(/./g, function (c) {
            var bin = c.charCodeAt(0).toString(2);
            return pad.substring(bin.length) + bin;
        });
    };
}());

var binToAscii = function (bin) {
    return bin.replace(/[01]{8}/g, function (v) {
        return String.fromCharCode(parseInt(v, 2));
    });
};

var ascii = "abcdefghijklmnopqrstuvwxyz"

var times = 0

var g = 5
var p = 23

var privateKey = Math.floor(Math.random() * (p - g)) + g;
//console.log(privateKey)

var a = Math.pow(g, privateKey) % p
//console.log(a)

var mutualKey = NaN
var tryq = NaN

sendKey(a)

function padDecode(strr) {
    strr = strr.toLowerCase()
    var i
    var s = ""
    for(i = 0; i < strr.length; i++){
        h = strr.charCodeAt(i) - 97
        mk = mutualKey.charCodeAt(i) % 26

        dif = h - mk

        while(dif < 0){
            dif += 26
        }

        s = s + ascii[dif]

    }
    return s
}

function padEncode(strr) {
    strr = strr.toLowerCase()
    var i
    var s = ""
    for(i = 0; i < strr.length; i++){
        h = strr.charCodeAt(i) - 97
        mk = mutualKey.charCodeAt(i) % 26

        dif = (h + mk) % 26

        s = s + ascii[dif]

    }
    return s
}


function loadDoc() {
    
  var xhttp = new XMLHttpRequest();
    
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
     document.getElementById("demo").innerHTML = this.responseText;
    }
  };
    
  xhttp.open("GET", "/", true);
  xhttp.send();
}

function sendDoc(){
    var http = new XMLHttpRequest();
    var name = document.getElementById("input1").value;
    // alert(name)
    
    http.onreadystatechange = function() {
        //Call a function when the state changes.
        if(http.readyState == 4 && http.status == 200) {
            //alert(input)
            alert('Thanks for adding your name');
            window.location.href = '/'
        }
    }
    
    http.open("POST", "/name", true);

    //Send the proper header information along with the request
    http.setRequestHeader("Content-Type", "application/json");
    
    input = "{\"name\":\"" + name + "\"}";
             
    http.send(input);
}

function sendMessage(){
    var http = new XMLHttpRequest();

    if(times == 1){
        var message = document.getElementById("input1").value;
        // alert(name)
        
        message = padEncode(message)

        http.onreadystatechange = function() {
            //Call a function when the state changes.
            if(http.readyState == 4 && http.status == 200) {
                
            }
        }
        
        console.log('Message seen by server: ', message)

        http.open("POST", "/message", true);

        //Send the proper header information along with the request
        http.setRequestHeader("Content-Type", "application/json");
        
        input = "{\"message\":\"" + message + "\"}";
                
        http.send(input);
    }
}

function loadKey() {
    
    var xhttp = new XMLHttpRequest();
      
    xhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
        if(times == 0){

            if(this.responseText != 'No'){
                tryq = parseInt(this.responseText, 10)
                var mKey = Math.pow(tryq, privateKey) % p
                var n = mKey.toString();
                mutualKey = SHA1(n)

                //sd = privateKey.toString() + '  ' + a.toString() + '  ' + tryq.toString() +  '  '  + mKey.toString() + '<br>' + mutualKey
                document.getElementById("test").innerHTML = "Connection Established"
                times = 1
            }
        }
      }
    };
      
    xhttp.open("GET", "/key", true);
    xhttp.send();
  }

function sendKey(key){
    var http = new XMLHttpRequest();

    http.onreadystatechange = function() {
        //Call a function when the state changes.
        if(http.readyState == 4 && http.status == 200) {
            
        }
    }
    
    http.open("POST", "/key", true);

    //Send the proper header information along with the request
    http.setRequestHeader("Content-Type", "application/json");
    
    input = "{\"key\":\"" + key + "\"}";
             
    http.send(input);
}


function repeatLoad() {
    
    var xhttp = new XMLHttpRequest();
      
    if(times == 1){

        xhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                text = this.responseText
                inString = ""
                var obj = JSON.parse(text);
                for(i = 0; i < obj.length; i++){
                    // console.log(i)
                    //console.log(obj[i].message)
                    //console.log(obj[i].message)
                    decoded = padDecode(obj[i].message)
                    //console.log(decoded)
                    
                    inString = inString + obj[i].ip + ": &nbsp;&nbsp;" + decoded + "<br>"
                    // console.log(z)
                }
                document.getElementById("demo").innerHTML = inString;
            }
        };
        
        xhttp.open("GET", "/message", true);
        xhttp.send();
  }

}
  
setInterval(loadKey, 2000)

setInterval(repeatLoad, 1000)
