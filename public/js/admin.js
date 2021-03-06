
var fromDate = document.getElementById('fromDate');
var untilDate = document.getElementById('untilDate');
var fromMonth = document.getElementById('fromMonth');
var untilMonth = document.getElementById('untilMonth');
var fromDay = document.getElementById('fromDay');
var untilDay = document.getElementById('untilDay');
var fromTime = document.getElementById('fromTime');
var untilTime = document.getElementById('untilTime');
var toggleCheckboxes = document.getElementById('toggleCheckboxes');
var labelWait = document.getElementById('labelWait');

var checkBoxObject = {
  IN_VEHICLE: document.getElementById('IN_VEHICLE').checked,
  ON_BICYCLE: document.getElementById('ON_BICYCLE'),
  ON_FOOT: document.getElementById('ON_FOOT'),
  STILL: document.getElementById('STILL'),
  TILTING: document.getElementById('TILTING'),
  UNKNOWN: document.getElementById('UNKNOWN')
}




var dateArr = [];
dateArr.push(fromDate, untilDate, fromMonth, untilMonth, fromDay, untilDay, fromTime, untilTime);




// ----- FRONT ENT FUNCITON ----- 
// Chcecks if a date has been choosed.
function noDateChoosed(arr) {

  let i;
  for (i = 0; i < arr.length; i++) {
    console.log(arr[i].value)
    if (arr[i].value.length > 0) {
      return false;
    }
  }
  return true;
}

function noCheckboxChoosed() {
  if (document.getElementById('IN_VEHICLE').checked == true ||
    document.getElementById('ON_BICYCLE').checked == true ||
    document.getElementById('ON_FOOT').checked == true ||
    document.getElementById('STILL').checked == true ||
    document.getElementById('TILTING').checked == true ||
    document.getElementById('UNKNOWN').checked == true) {
    return false
  }
  else {
    return true
  }
}



function toggleCheckboxed() {
  if (document.getElementById('IN_VEHICLE').checked == false) {
    document.getElementById('IN_VEHICLE').checked = true
    document.getElementById('ON_BICYCLE').checked = true
    document.getElementById('ON_FOOT').checked = true
    document.getElementById('STILL').checked = true
    document.getElementById('TILTING').checked = true
    document.getElementById('UNKNOWN').checked = true
  }
  else {
    document.getElementById('IN_VEHICLE').checked = false
    document.getElementById('ON_BICYCLE').checked = false
    document.getElementById('ON_FOOT').checked = false
    document.getElementById('STILL').checked = false
    document.getElementById('TILTING').checked = false
    document.getElementById('UNKNOWN').checked = false
  }
}


function run() {

  var checkBoxObject = {
    IN_VEHICLE: document.getElementById('IN_VEHICLE').checked,
    ON_BICYCLE: document.getElementById('ON_BICYCLE').checked,
    ON_FOOT: document.getElementById('ON_FOOT').checked,
    STILL: document.getElementById('STILL').checked,
    TILTING: document.getElementById('TILTING').checked,
    UNKNOWN: document.getElementById('UNKNOWN').checked
  }




  console.log(checkBoxObject)

}



// ---------------- MAP ---------------- // 

// Create Heatmap Instance
var heatmapLayer = new HeatmapOverlay(cfg);

// Declaer the baseLayer
baseLayer = L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoicmFuZG9tbmFtZWdyIiwiYSI6ImNrZHJwaWdkbDBiNXYyeW83NmQ1aDU2bDkifQ.TAMboxLmOiUsmRbljrplEQ',
  {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox/streets-v11',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: 'your.mapbox.access.token'
  })

//Iniate map 
var map = L.map('mapid', {
  selectArea: true, // will enable it by default
  center: patrasLatLng,
  zoom: 13,
  layers: [baseLayer, heatmapLayer]
});


//heatmapLayer.setData(testData);


// Add ta marker in Given Cetner Of Patras 
var marker = L.marker(patrasLatLng).addTo(map);

//Patras Circle Range
var circle = L.circle(patrasLatLng, {
  color: 'green',
  fillColor: '#3388ff',
  fillOpacity: 0.01,
  radius: 10000 //10KM
}).addTo(map);

// ---------------- MAP ---------------- //




// Database Delete All Data, by sending post
function deleteAllData() {
  console.log('front end delete func')
  $.ajax({
    url: "/deleteData",
    type: "post",
    cache: false,
    contentType: false,
    processData: false,
    success: function (response) {
      console.log('All data Deleted!')
    }
  })
}



function showFullHeatmap() {
  console.log('wholeheatmap')
  $.ajax({
    url: "/drawfullheatmap",
    type: "get",
    cache: false,
    contentType: false,
    processData: false,
    success: function (response) {
      console.log('data recieved')
      heatmapLayer.setData(response)

    }
  })

}

function rangedHeatmap() {

  // send the mode to the server to bring back the right heatmap proccessed.

  var mode = -1;

  if (noDateChoosed(dateArr) && noCheckboxChoosed()) { // NO DATE, NO CHEKCBOX
    mode = 1;
    showFullHeatmap();
    return;
  }

  else if (!noDateChoosed(dateArr) && noCheckboxChoosed()) { // YES DATE, NO CHEKCBOX
    mode = 2;
  }

  else if (noDateChoosed(dateArr) && !noCheckboxChoosed()) { //NO DATE, YES CHECKBOX
    mode = 3;
  }

  else if (!noDateChoosed(dateArr) && !noCheckboxChoosed()) { //YES DATE, YES CHECKBOX
    mode = 4;
  }

  console.log('mode');


  var checkBoxObject = {
    IN_VEHICLE: document.getElementById('IN_VEHICLE').checked,
    ON_BICYCLE: document.getElementById('ON_BICYCLE').checked,
    ON_FOOT: document.getElementById('ON_FOOT').checked,
    STILL: document.getElementById('STILL').checked,
    TILTING: document.getElementById('TILTING').checked,
    UNKNOWN: document.getElementById('UNKNOWN').checked
  }

  var datesObject = {
    fromDate: document.getElementById('fromDate').value,
    untilDate: document.getElementById('untilDate').value,
    fromMonth: document.getElementById('fromMonth').value,
    untilMonth: document.getElementById('untilMonth').value,
    fromDay: document.getElementById('fromDay').value,
    untilDay: document.getElementById('untilDay').value,
    fromTime: document.getElementById('fromTime').value,
    untilTime: document.getElementById('untilTime').value
  }


  var formFile = new FormData();
  formFile.append('mode', mode);
  formFile.append('checkboxes', JSON.stringify(checkBoxObject))
  formFile.append('dates', JSON.stringify(datesObject))

  $.ajax({
    url: "/drawSpecifiedHeatmap",
    type: "post",
    cache: false,
    contentType: false,
    processData: false,
    data: formFile,
    success: function (response) {
      console.log('data recieved')
      heatmapLayer.setData(response)

    }
  })



}


// Get the modal
var modal = document.getElementById("myModal");

// Get the button that opens the modal
var btn = document.getElementById("delete_btn");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// When the user clicks the button, open the modal 
btn.onclick = function () {
  modal.style.display = "block";
}

// When the user clicks on <span> (x), close the modal
span.onclick = function () {
  modal.style.display = "none";
}

var backbtn = document.getElementById("goback");
// When the user clicks on <span> (x), close the modal
backbtn.onclick = function () {
  modal.style.display = "none";
}

var okdelete = document.getElementById("okdelete");
okdelete.onclick = function () {
  deleteAllData();
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function (event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}


//for navbar
let mainNav = document.getElementById("js-menu");
let navBarToggle = document.getElementById("js-navbar-toggle");

navBarToggle.addEventListener("click", function () {
  mainNav.classList.toggle("active");
});

window.onscroll = function () { myFunction() };

var navbar = document.getElementById("navigationbar");
var sticky = navbar.offsetTop;

function myFunction() {
  if (window.pageYOffset >= sticky) {
    navbar.classList.add("sticky")
  } else {
    navbar.classList.remove("sticky");
  }
}
//


function exportData() {
  var mode = -1;

  if (noDateChoosed(dateArr) && noCheckboxChoosed()) { // NO DATE, NO CHEKCBOX
    mode = 1;
    showFullHeatmap();
    return;
  }

  else if (!noDateChoosed(dateArr) && noCheckboxChoosed()) { // YES DATE, NO CHEKCBOX
    mode = 2;
  }

  else if (noDateChoosed(dateArr) && !noCheckboxChoosed()) { //NO DATE, YES CHECKBOX
    mode = 3;
  }

  else if (!noDateChoosed(dateArr) && !noCheckboxChoosed()) { //YES DATE, YES CHECKBOX
    mode = 4;
  }

  console.log('mode');


  var checkBoxObject = {
    IN_VEHICLE: document.getElementById('IN_VEHICLE').checked,
    ON_BICYCLE: document.getElementById('ON_BICYCLE').checked,
    ON_FOOT: document.getElementById('ON_FOOT').checked,
    STILL: document.getElementById('STILL').checked,
    TILTING: document.getElementById('TILTING').checked,
    UNKNOWN: document.getElementById('UNKNOWN').checked
  }

  var datesObject = {
    fromDate: document.getElementById('fromDate').value,
    untilDate: document.getElementById('untilDate').value,
    fromMonth: document.getElementById('fromMonth').value,
    untilMonth: document.getElementById('untilMonth').value,
    fromDay: document.getElementById('fromDay').value,
    untilDay: document.getElementById('untilDay').value,
    fromTime: document.getElementById('fromTime').value,
    untilTime: document.getElementById('untilTime').value
  }



  var fileType = document.getElementById('fileType')
  console.log('WERTYUI ', fileType.value)

  var forms = new FormData();
  forms.append('mode', mode);
  forms.append('checkboxes', JSON.stringify(checkBoxObject))
  forms.append('dates', JSON.stringify(datesObject))
  forms.append('choices', fileType.value)

  labelWait.innerHTML = 'Please waiting while we get your File Ready...';
  $.ajax({
    url: "/export",
    type: "POST",
    cache: false,
    contentType: false,
    processData: false,
    data: forms,
    success: function (response) {
      labelWait.innerHTML = 'File Ready';
      console.log("SUCESS EC{PRTS")
      window.open('/download/'+fileType.value)

      }
  })
}

function logout() {
  $.ajax({
    url: "/logout",
    type: "post",
    cache: false,
    contentType: false,
    processData: false,
    data: false,
    success: function () {
      console.log("Logged out")
      window.location.href = "/"

    }
  })

}

function JsonToCsv(jsonData) {
  var items = jsonData;
  var replacer = (key, value) => value === null ? ' ' : value; // specify how you want to handle null values here
  var header = Object.keys(items[0]);
  var csv = items.map(row => header.map(fieldName => JSON.stringify(row[fieldName], replacer)).join(','))
  csv.unshift(header.join(','));
  csv = csv.join('\r\n');

  return csv;
}

function JSONtoXML(obj) {
  var xml = '';
  for (var prop in obj) {
    xml += obj[prop] instanceof Array ? '' : "<" + prop + ">";
    if (obj[prop] instanceof Array) {
      for (var array in obj[prop]) {
        xml += "<" + prop + ">";
        xml += OBJtoXML(new Object(obj[prop][array]));
        xml += "</" + prop + ">";
      }
    } else if (typeof obj[prop] == "object") {
      xml += OBJtoXML(new Object(obj[prop]));
    } else {
      xml += obj[prop];
    }
    xml += obj[prop] instanceof Array ? '' : "</" + prop + ">";
  }
  var xml = xml.replace(/<\/?[0-9]{1,}>/g, '');
  return xml
}