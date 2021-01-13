import _ from 'lodash';
import ip from "../..";
// import Html5QrcodeScanner from "../qr/html5-qrcode-scanner.js";

document.addEventListener("DOMContentLoaded", function(){
    function onScanSuccess(code) {
        console.log("qr", code)

        const element = document.createElement('div');
        element.innerText(code)
        document.body.appendChild(element)
    }

    var html5QrcodeScanner = new Html5QrcodeScanner(
        "reader", { fps: 10, qrbox: 250 });
    html5QrcodeScanner.render(onScanSuccess);
});

