/*
 * (C) Mahesh Khanal, Laboratory for Advanced Visualization and Applications, University of Hawaii at Manoa.
 */


/*
Copyright 2018 The Trustees of Indiana University

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/


import { MetricsPanelCtrl } from 'app/plugins/sdk';
import _ from 'lodash';
import { Scale } from './scale';
import { CustomHover } from './CustomHover';
import './css/migrationmap_styles.css!';
import L from './js/migrationmap_leaflet.js';
import './js/migrationmap_leaflet.migrationlayer.js';
//import d3 from './js/migrationmap_d3.v3';

////// place global variables here ////
const panelDefaults = {
  num_lines: 10,
  dark_map_url: "https://api.tiles.mapbox.com/v4/mapbox.dark/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw",
  light_map_url: "https://stamen-tiles-{s}.a.ssl.fastly.net/toner-lite/{z}/{x}/{y}{r}.png",
  center_lat: 15,
  center_lon: 9,
  zoom_lvl: 3,
  dark_mode: false,
  showControls: true,
  animationPlaying: false,
  choices: [],
  array_option_1: [],
  array_option_2: [],
  array_option_3: [],
  array_option_4: [],
  parsed_data: [],
  max_total: 0,
  DarkColorPallet: ["#EA3788", "#89FC00", "#01FDF6", "#C200FB", "#731DD8", "#CEB9DA", "#D6FF79", "#FF206E", "#F5B700",
    "#00A1EA", "#8224E3", "#96F727", "#C04D9B"
  ],
  //DarkColorPallet: ["#0A369D", "#D53675", "#0B9290", "#FB1919", "#610DA7", "#F8A824", "#EA1AE0", "#531014", "#EF810B", "#4472CA", "#C1292E", "#356E46", "#D086F5", "#2CCB7A", "#6D5BDD"],

  //LightColorPallet: ["#D53675", "#0B9290", "#FB1919", "#610DA7", "#F8A824", "#EA1AE0", "#531014", "#EF810B", "#4472CA", "#C1292E", "#356E46", "#D086F5", "#2CCB7A", "#6D5BDD"],
  //migrationLayer: {},


  //table_data: [],
  out_field_one : "Discipline", 
  out_field_two : "To", 
  out_field_three: "Resource", 
  out_field_four : "Volume",
  in_field_one : "Discipline", 
  in_field_two : "To", 
  in_field_three: "Resource", 
  in_field_four : "Volume",
  to_Byte: false,
  color: {
    mode: 'spectrum',
    cardColor: '#b4ff00',
    colorScale: 'linear',
    exponent: 0.5,
    colorScheme: 'interpolateOranges',
    fillBackground: false
  },
  legend: {
    show: true,
    legend_colors: []
  },
  tooltip: {
    show: true,
    showDefault: true,
    content: ' '
  },
  to_si: 1000000000,
  scales: ['linear', 'sqrt'],
  colorScheme: 'NetSage',
  rgb_values: [],
  hex_values: [],
  //colorModes : ['opacity','spectrum'],
  colorModes: ['spectrum'],
  custom_hover: ' '
};

var migrationLayer = {};
var tempArray = [];
var datatoviz = [];
var LightColorPallet = [
  "#4472CA",
  "#0B9290",
  "#610DA7",
  "#D53675",
  "#356E46",
  "#531014",
  "#C1292E",
  "#D086F5",
  "#2CCB7A",
  "#6D5BDD",
  "#0A369D",
  "#F8A824",
  "#EA1AE0"];
var table_data = [];
var endpoint_data = [];


export class NetsageMigrationMap extends MetricsPanelCtrl {

  constructor($scope, $injector) {
    super($scope, $injector);

    _.defaults(this.panel, panelDefaults);
    this.migrationmap_holder_id = 'migrationmap_' + this.panel.id;
    this.containerDivId = 'container_' + this.migrationmap_holder_id;
    this.custom_hover = new CustomHover(this.panel.tooltip.content);
    this.scale = new Scale(this.colorScheme);
    this.colorSchemes = this.scale.getColorSchemes();
    this.events.on('data-received', this.onDataReceived.bind(this));
    this.events.on('data-error', this.onDataError.bind(this));
    this.events.on('data-snapshot-load', this.onDataReceived.bind(this));
    this.events.on('init-edit-mode', this.onInitEditMode.bind(this));
    this.events.on('init-panel-actions', this.onInitPanelActions.bind(this));

    this.events.on('render', this.setup.bind(this));
    this.events.on('refresh', this.setup.bind(this));
  }



  onDataReceived(dataList) {
    console.log("Raw data");
    console.log(dataList);
    this.panel.parsed_data = [];
    this.panel.max_total = 0;
    this.process_data(dataList);
    this.render();
  }



  process_data(dataList) {
    table_data = [];
    endpoint_data = [];
    if (dataList.length != 0) {
      try {
        this.process_table(dataList);
      } catch (error) {
        console.error("ERROR PARSING DATA. PLEASE MAKE SURE THE DATA IS SET PROPERLY");
      }

    }
  }

  getFixedColor(i) {
    var colorAr = [];

    //  if (this.panel.dark_mode) {
    //colorAr = this.panel.DarkColorPallet;
    //  } else {
    colorAr = LightColorPallet;
    // }

    return colorAr[i];
  }


  getFormattedValue(value) {
    value = value / 1000;
    var volume = value;
    if (value < 1000) {
      volume = (Math.round(value * 10) / 10) + " KB";
    } else {
      value = value / 1000;
      if (value < 1000) {
        volume = (Math.round(value * 10) / 10) + " MB"
      } else {
        value = value / 1000;
        if (value < 1000) {
          volume = (Math.round(value * 10) / 10) + " GB"
        } else {
          value = value / 1000;
          if (value < 1000) {
            volume = (Math.round(value * 10) / 10) + " TB"
          } else {
            volume = (Math.round(value * 10) / 10) + " PB"
          }
        }
      }
    }
    return volume;
  }

  process_table(tableData) {

    var filteredSet = [];
    var endPointSet = [];
    var num_lines = this.panel.num_lines;

    tableData.forEach(element => {
      var datarows = element.rows;

      var valIndex = datarows[0].length - 1;
      var sortedData = datarows.sort(function(a,b) {return b[valIndex] - a[valIndex]});
      console.log("sorted:");
      console.log(sortedData);

      if(sortedData.length > num_lines) {
        var filteredTopData = sortedData.slice(0, num_lines);
      } else {
        filteredTopData = sortedData;
      }
      

      filteredTopData.forEach(function (el) {
        if (true) {
          var discipline_name = el[0];

          var newObj = {};
          newObj.values = [];
          newObj.name = discipline_name;
          newObj.values.push(el);

          var found = false;
          var filteredSetVal = 0;
          var filteredValtoPush = [];

          for (var i = 0; i < filteredSet.length; i++) {
            if (filteredSet[i].name == discipline_name) {
              found = true;
              filteredSetVal = i;


            }
          }
          if (!found) {
            filteredSet.push(newObj);
          } else {
            var theone = filteredSet.find(function (e) {
              return e.name == discipline_name;
              console.log("reached here and did nothing");
            })
            filteredSet[filteredSetVal].values.push(el);
          }

        }

      })

    });
    //need to fix filtered set because the endpoints are also added. 

    for (var i = 0; i < filteredSet.length; i++) {
      //need to get color for each source 
      var color = this.getFixedColor(i) || this.getRandomColor();

      // console.log(filteredSet[i]);
      for (var j = 0; j < filteredSet[i].values.length; j++) {


        var element = filteredSet[i].values[j];
        if (element.length > 6) {
          var obj = {};
          obj.name = element[0];
          obj.from = [element[4], element[3]];
          obj.to = [element[8], element[7]];
          obj.labels = [element[1], element[5]];
          obj.color = color;
          obj.value = 1;
          obj.valInBytes = element[9];
          obj.srcResourceName = element[2];
          obj.destResourceName = element[6];
          obj.destResourceDisplayName = element[6];
          obj.destDisplayName = element[5];

          console.log("Color is " + color + " with index " + i);
          table_data.push(obj);
        } else {
          var obj = {};
          obj.name = element[0];
          obj.from = [element[3], element[2]];
          obj.to = [element[3], element[2]];
          obj.labels = [element[1], element[1]];
          obj.color = color;
          obj.value = 1;
          obj.valInBytes = element[5];
          obj.srcResourceName = element[4];
          obj.destResourceName = element[4];
          obj.destResourceDisplayName = "UNKNOWN";
          obj.destDisplayName = "UNKNOWN";

          console.log("Color is " + color + " with index " + i);
          table_data.push(obj);


        }




      }


    }


  }



  onDataError(err) {
    this.dataRaw = [];
  }



  onInitEditMode() {
    this.addEditorTab('Options', 'public/plugins/netsage-migrationmap/editor.html', 2);
    this.render();
  }



  onInitPanelActions(actions) {
    this.render();
  }


  addNewChoice() {
    var num = this.panel.choices.length + 1;
    this.panel.choices.push(num);
    this.panel.array_option_1.push('');
    this.panel.array_option_2.push('');
    this.panel.array_option_3.push('');
    this.panel.array_option_4.push('');
  }


  removeChoice(index) {
    this.panel.choices.splice(index, 1);
    this.panel.array_option_1.splice(index, 1);
    this.panel.array_option_2.splice(index, 1);
    this.panel.array_option_3.splice(index, 1);
    this.panel.array_option_4.splice(index, 1);
  }


  display() {
    this.panel.colors = this.scale.displayColor(this.panel.colorScheme);
    this.panel.rgb_values = this.panel.colors.rgb_values;
    this.panel.hex_values = this.panel.colors.hex_values;
  }



  getHtml(htmlContent) {
    return this.custom_hover.parseHtml(htmlContent);
    ///use in link///
    //             let html_content = ctrl.getHtml(ctrl.panel.tooltip.content);
    //             ctrl.panel.tooltip.content = html_content;
  }

  formatBytes(val) {
    var hrFormat = null;
    var factor = 1024.0
    val = val / 8.0;

    var b = val;
    var k = val / factor;
    var m = ((val / factor) / factor);
    var g = (((val / factor) / factor) / factor);
    var t = ((((val / factor) / factor) / factor) / factor);
    var p = (((((val / factor) / factor) / factor) / factor) / factor);

    if (p > 1) {
      hrFormat = p.toFixed(2) + "(PB)";
    } else if (t > 1) {
      hrFormat = t.toFixed(2) + "(TB)";
    } else if (g > 1) {
      hrFormat = g.toFixed(2) + "(GB)";
    } else if (m > 1) {
      hrFormat = m.toFixed(2) + "(MB)";
    } else if (k > 1) {
      hrFormat = k.toFixed(2) + "(KB)";
    } else {
      hrFormat = b.toFixed(2) + "(Bytes)";
    }

    return hrFormat
  }

  formatBits(val) {
    var hrFormat = null;
    var factor = 1024.0

    var b = val;
    var k = val / factor;
    var m = ((val / factor) / factor);
    var g = (((val / factor) / factor) / factor);
    var t = ((((val / factor) / factor) / factor) / factor);
    var p = (((((val / factor) / factor) / factor) / factor) / factor);

    if (p > 1) {
      hrFormat = p.toFixed(2) + "(Pb)";
    } else if (t > 1) {
      hrFormat = t.toFixed(2) + "(Tb)";
    } else if (g > 1) {
      hrFormat = g.toFixed(2) + "(Gb)";
    } else if (m > 1) {
      hrFormat = m.toFixed(2) + "(Mb)";
    } else if (k > 1) {
      hrFormat = k.toFixed(2) + "(Kb)";
    } else {
      hrFormat = b.toFixed(2) + "(bits)";
    }

    return hrFormat
  }

  getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }


  setup() {
    if (!table_data) {
      return;
    }

    /*
    This is the fix for map not rendering completely. 
    */
    var ctrl = this;
    var offh = 450;
    if (document.getElementById(this.migrationmap_holder_id)) {
      offh = document.getElementById(this.migrationmap_holder_id).offsetHeight;
    }
    if (offh == 0) {
      return setTimeout(function () { ctrl.setup(); }, 250);
    }


    if (migrationLayer) {
      if (migrationLayer.hasOwnProperty("canvas")) {
        if (typeof migrationLayer.destroy === 'function') {
          try {
            migrationLayer.destroy();
          } catch (error) {
            console.error("ERROR WHILE DESTROYING MIGRATION LAYER!!");
          }

        }
      }
    }


    if (document.getElementById(ctrl.migrationmap_holder_id)) {

      document.getElementById(ctrl.containerDivId).innerHTML = '<div id="map"><div id = "legend" >LEGEND </br> </div></div>';



      var map_url = "";

      if (this.panel.dark_mode) {
        //console.log("Dark Loaded");
        map_url = ctrl.panel.dark_map_url;
      } else {
        map_url = ctrl.panel.light_map_url;
        // console.log("Light loaded");
      }



      var id = document.getElementById("map");
      // var id = document.getElementById(ctrl.migrationmap_holder_id);
      if (id) {

        try {
          var container = L.DomUtil.get('map'); if (container != null) { container._leaflet_id = null; }

          var map = L.map('map', {
            minZoom: 2,
            scrollWheelZoom: false,
            // maxBounds:bounds
          }).setView([ctrl.panel.center_lat || 35, ctrl.panel.center_lon || -95], ctrl.panel.zoom_lvl || 5);
          L.tileLayer(map_url || "https://api.tiles.mapbox.com/v4/mapbox.dark/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw")
            .addTo(map);

          map.on('zoomend', () => {

            if (!ctrl.panel.animationPlaying) {
              migrationLayer.play();
              migrationLayer.setData(table_data);
              migrationLayer.pause();
            } else {
              migrationLayer.setData(table_data);
            }

          });


          map.on('dragend', function () {
            //turn off auto-fit
            if (!ctrl.panel.animationPlaying) {
              migrationLayer.play();
              migrationLayer.setData(table_data);
              migrationLayer.pause();
            } else {
              migrationLayer.setData(table_data);
            }
          })

          // map.setMaxBounds(map.getBounds()); 

        } catch (error) {
          console.log("MAP INITIALIZATION FAILED.");
        }




        migrationLayer = new L.migrationLayer({
          map: map,
          data: [],
          pulseRadius: 0,
          pulseBorderWidth: 0,
          arcWidth: 0.5,
          arcLabel: false,
          arcLabelFont: '10px sans-serif',
          maxWidth: 5
        });


        migrationLayer.addTo(map);


        if (ctrl.panel.animationPlaying) {
          migrationLayer.play();
        }
        if (!ctrl.panel.animationPlaying) {
          setTimeout(() => {
            migrationLayer.pause();
          }, 3000);

        }

        migrationLayer.setData(table_data);






      }





      //Create legend 

      var legendDivData = [];
      var markerLocations = [];




      table_data.forEach(element => {

        //var customPopup = "<h2 class = 'custom' style = 'color:" + element.color + "'> Discipline : " + element.name + " </h2></br><h3>Source : " + element.labels[0] + "</h2><br/><h3>Destination : " + element.labels[1] + " </h2></br><h3 class = 'custom'> Value : " + element.valInBytes + " Bytes </h3>"
        //var customPopup2 = "<h2 class = 'custom' style = 'color:" + element.color + "'> Discipline : " + element.name + " </h2></br><h3>Source : " + element.labels[0] + "</h2><br/><h3>Destination : " + element.labels[1] + " </h2></br><h3 class = 'custom'> Value : " + element.valInBytes + " Bytes </h3>"

        var legendInfo = { name: element.name, color: element.color }
        legendDivData.push(legendInfo);
        var SrcMarkerInfo = { placeName: element.labels[0], latlong: [element.from[1], element.from[0]] };
        var DestMarkerInfo = { placeName: element.labels[1], latlong: [element.to[1], element.to[0]] };
        markerLocations.push(SrcMarkerInfo);
        markerLocations.push(DestMarkerInfo);
      });



      var legendDiv = document.getElementById("legend");

      var filteredData = Array.from(new Set(legendDivData.map(JSON.stringify))).map(JSON.parse);
      filteredData.forEach(element => {
        var lineToAdd = '<span class = "legendItem" style= "color: ' + element.color + ';">' + element.name + '</span></br>';
        legendDiv.innerHTML += lineToAdd;
      });

      legendDiv.innerHTML += '<div id="controls"></div>';
      let controlsDiv = document.getElementById("controls");
      if (ctrl.panel.showControls) {
        controlsDiv.innerHTML = '<br/><span>ANIMATIONS</span><br/>';
        controlsDiv.innerHTML += '<label class="switch"><input type="checkbox" id="playPause"><span class="slider round"></span></label>'
      }

      let playPauseBtn = document.getElementById("playPause");


      if (playPauseBtn) {

        playPauseBtn.checked = ctrl.panel.animationPlaying;
        playPauseBtn.addEventListener("change", function () {
          if (playPauseBtn.checked) {
            ctrl.panel.animationPlaying = true;
            migrationLayer.play();
          } else {
            ctrl.panel.animationPlaying = false;
            migrationLayer.pause();
          }
        })
      }





      //Markers 
      var filteredMarkers = Array.from(new Set(markerLocations.map(JSON.stringify))).map(JSON.parse);
      //console.log(filteredMarkers);
      filteredMarkers.forEach(element => {
        var customPopup = "<h3 class='orgName'>" + element.placeName + "</h3>";
        var customOptions =
        {
          'maxWidth': '310',
          'maxHeight': '200',
          'className': 'customPopUp',
          'overflow-y': 'scroll',
          'border-bottom': '0px',
          'border-top': '0px'
        }

        var data = table_data;

        //var filteredSource = data.filter(({ labels }) => labels[0] === element.placeName);
        //var existsAsSource = data.filter(({ srcResourceName }) => srcResourceName === element.resourceName);
        var existsAsSource = data.filter(({ from }) => from[0] === element.latlong[1] && from[1] === element.latlong[0]);
        // var existsAsSource = Array.from(new Set(filteredSource.map(JSON.stringify))).map(JSON.parse);



        var sourceValue = 0.0;
        var destValue = 0.0;

        if (existsAsSource.length > 0) {
          //console.log(existsAsSource);
          var outGoingDiv = "<h5><u>Outgoing </u></h5>";
          for (var i = 0; i < existsAsSource.length; i++) {
            if (existsAsSource[i]) {
              var destName = "";
              var valinGB = existsAsSource[i].valInBytes / 8589934592;
              sourceValue += valinGB;
              valinGB = valinGB.toFixed(3);
              var formattedValue = this.getFormattedValue(existsAsSource[i].valInBytes);
              //outGoingDiv += "<span style = 'color: " + existsAsSource[i].color + "'> Discipline : " + existsAsSource[i].name + "  </br> To : " + existsAsSource[i].labels[1] + " </br> Value : " + valinGB + " GB</span></br></br>"
              outGoingDiv += "<span style = 'color: " + existsAsSource[i].color + "'> "+ ctrl.panel.out_field_one + ": " + existsAsSource[i].name + "  </br> " +ctrl.panel.out_field_two + ": " + existsAsSource[i].destDisplayName + "</br>" + ctrl.panel.out_field_three + ": " + existsAsSource[i].destResourceDisplayName + " </br>" + ctrl.panel.out_field_four + ": " + formattedValue + "</span></br></br>"

            }

          }
          customPopup += outGoingDiv;

        }

        //var filteredDest = data.filter(({ labels }) => labels[1] === element.placeName);
        var existsAsDest = data.filter(({ to }) => to[0] === element.latlong[1] && to[1] === element.latlong[0]);
        //var existsAsDest = data.filter(({ destResourceName }) => destResourceName === element.resourceName);
        // var existsAsDest = Array.from(new Set(filteredDest.map(JSON.stringify))).map(JSON.parse);

        if (existsAsDest.length > 0) {
          var incomingDiv = "<h5><u>Incoming</u> </h5>";

          for (var i = 0; i < existsAsDest.length; i++) {
            if (existsAsDest[i]) {
              //need to check if its endpoint
              if (existsAsDest[i].labels[0] === existsAsDest[i].labels[1]) {
                //do nothing
              } else {
                var valinGB = existsAsDest[i].valInBytes / 8589934592;
                destValue += valinGB;
                valinGB = valinGB.toFixed(3);
                var formattedValue = this.getFormattedValue(existsAsDest[i].valInBytes);

                //incomingDiv += "<span style = 'color: " + existsAsDest[i].color + "'> Discipline : " + existsAsDest[i].name + "  </br> From : " + existsAsDest[i].labels[0] + "</br>Value : " + valinGB + " GB</span></br></br>"
                incomingDiv += "<span style = 'color: " + existsAsDest[i].color + "'>"+ ctrl.panel.in_field_one + ": " + existsAsDest[i].name + "  </br>"+ ctrl.panel.in_field_two + ": " + existsAsDest[i].labels[0] + "</br>" + ctrl.panel.in_field_three+ ": " + existsAsDest[i].srcResourceName + "</br>"+ ctrl.panel.in_field_four + ": " + formattedValue + "</span></br></br>"
              }

            }

          }
          customPopup += incomingDiv;


        }

        var circle = L.circleMarker([element.latlong[0], element.latlong[1]], {
          color: "black",
          weight: 0.6,
          fillColor: "rgba(255,165,0,0.9)",
          fillOpacity: 0.9,
          // radius: 5 + existsAsSource.length + existsAsDest.length
          radius: 5 + Math.log10(sourceValue + destValue) * 2
        }).addTo(map);
        circle.bindPopup(customPopup, customOptions);
        circle.on('mouseover', function (e) {
          this.openPopup();
        });
        circle.on('mouseout', function (e) {
          // this.closePopup();
        });
      });

    }

  }

  link(scope, elem, attrs, ctrl) {
    if (!document.getElementById(ctrl.slopegraph_holder_id)) {
      return;
    }
    this.render();
  }

}

NetsageMigrationMap.templateUrl = 'module.html';
