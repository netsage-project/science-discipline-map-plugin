'use strict';

System.register(['app/plugins/sdk', 'lodash', './scale', './CustomHover', './css/migrationmap_styles.css!', './js/migrationmap_leaflet.js', './js/migrationmap_leaflet.migrationlayer.js'], function (_export, _context) {
  "use strict";

  var MetricsPanelCtrl, _, first, Scale, CustomHover, L, _createClass, panelDefaults, migrationLayer, tempArray, datatoviz, LightColorPallet, table_data, endpoint_data, NetsageMigrationMap;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _possibleConstructorReturn(self, call) {
    if (!self) {
      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }

    return call && (typeof call === "object" || typeof call === "function") ? call : self;
  }

  function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
      throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
    }

    subClass.prototype = Object.create(superClass && superClass.prototype, {
      constructor: {
        value: subClass,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
    if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
  }

  return {
    setters: [function (_appPluginsSdk) {
      MetricsPanelCtrl = _appPluginsSdk.MetricsPanelCtrl;
    }, function (_lodash) {
      _ = _lodash.default;
      first = _lodash.first;
    }, function (_scale) {
      Scale = _scale.Scale;
    }, function (_CustomHover) {
      CustomHover = _CustomHover.CustomHover;
    }, function (_cssMigrationmap_stylesCss) {}, function (_jsMigrationmap_leafletJs) {
      L = _jsMigrationmap_leafletJs.default;
    }, function (_jsMigrationmap_leafletMigrationlayerJs) {}],
    execute: function () {
      _createClass = function () {
        function defineProperties(target, props) {
          for (var i = 0; i < props.length; i++) {
            var descriptor = props[i];
            descriptor.enumerable = descriptor.enumerable || false;
            descriptor.configurable = true;
            if ("value" in descriptor) descriptor.writable = true;
            Object.defineProperty(target, descriptor.key, descriptor);
          }
        }

        return function (Constructor, protoProps, staticProps) {
          if (protoProps) defineProperties(Constructor.prototype, protoProps);
          if (staticProps) defineProperties(Constructor, staticProps);
          return Constructor;
        };
      }();

      panelDefaults = {
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
        DarkColorPallet: ["#EA3788", "#89FC00", "#01FDF6", "#C200FB", "#731DD8", "#CEB9DA", "#D6FF79", "#FF206E", "#F5B700", "#00A1EA", "#8224E3", "#96F727", "#C04D9B"],
        //DarkColorPallet: ["#0A369D", "#D53675", "#0B9290", "#FB1919", "#610DA7", "#F8A824", "#EA1AE0", "#531014", "#EF810B", "#4472CA", "#C1292E", "#356E46", "#D086F5", "#2CCB7A", "#6D5BDD"],

        //LightColorPallet: ["#D53675", "#0B9290", "#FB1919", "#610DA7", "#F8A824", "#EA1AE0", "#531014", "#EF810B", "#4472CA", "#C1292E", "#356E46", "#D086F5", "#2CCB7A", "#6D5BDD"],
        //migrationLayer: {},


        //table_data: [],
        out_field_one: "Discipline",
        out_field_two: "To",
        out_field_three: "Resource",
        out_field_four: "Volume",
        in_field_one: "Discipline",
        in_field_two: "To",
        in_field_three: "Resource",
        in_field_four: "Volume",
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
      migrationLayer = {};
      tempArray = [];
      datatoviz = [];
      LightColorPallet = ["#4472CA", "#0B9290", "#610DA7", "#D53675", "#356E46", "#531014", "#C1292E", "#D086F5", "#2CCB7A", "#6D5BDD", "#0A369D", "#F8A824", "#EA1AE0"];
      table_data = [];
      endpoint_data = [];

      _export('NetsageMigrationMap', NetsageMigrationMap = function (_MetricsPanelCtrl) {
        _inherits(NetsageMigrationMap, _MetricsPanelCtrl);

        function NetsageMigrationMap($scope, $injector) {
          _classCallCheck(this, NetsageMigrationMap);

          var _this = _possibleConstructorReturn(this, (NetsageMigrationMap.__proto__ || Object.getPrototypeOf(NetsageMigrationMap)).call(this, $scope, $injector));

          _.defaults(_this.panel, panelDefaults);
          _this.migrationmap_holder_id = 'migrationmap_' + _this.panel.id;
          _this.containerDivId = 'container_' + _this.migrationmap_holder_id;
          _this.custom_hover = new CustomHover(_this.panel.tooltip.content);
          _this.scale = new Scale(_this.colorScheme);
          _this.colorSchemes = _this.scale.getColorSchemes();
          _this.events.on('data-received', _this.onDataReceived.bind(_this));
          _this.events.on('data-error', _this.onDataError.bind(_this));
          _this.events.on('data-snapshot-load', _this.onDataReceived.bind(_this));
          _this.events.on('init-edit-mode', _this.onInitEditMode.bind(_this));
          _this.events.on('init-panel-actions', _this.onInitPanelActions.bind(_this));

          _this.events.on('render', _this.setup.bind(_this));
          _this.events.on('refresh', _this.setup.bind(_this));
          return _this;
        }

        _createClass(NetsageMigrationMap, [{
          key: 'onDataReceived',
          value: function onDataReceived(dataList) {
            console.log("Raw data");
            console.log(dataList);
            this.panel.parsed_data = [];
            this.panel.max_total = 0;
            this.process_data(dataList);
            this.render();
          }
        }, {
          key: 'process_data',
          value: function process_data(dataList) {
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
        }, {
          key: 'getFixedColor',
          value: function getFixedColor(i) {
            var colorAr = [];

            //  if (this.panel.dark_mode) {
            //colorAr = this.panel.DarkColorPallet;
            //  } else {
            colorAr = LightColorPallet;
            // }

            return colorAr[i];
          }
        }, {
          key: 'getFormattedValue',
          value: function getFormattedValue(value) {
            value = value / 1000;
            var volume = value;
            if (value < 1000) {
              volume = Math.round(value * 10) / 10 + " KB";
            } else {
              value = value / 1000;
              if (value < 1000) {
                volume = Math.round(value * 10) / 10 + " MB";
              } else {
                value = value / 1000;
                if (value < 1000) {
                  volume = Math.round(value * 10) / 10 + " GB";
                } else {
                  value = value / 1000;
                  if (value < 1000) {
                    volume = Math.round(value * 10) / 10 + " TB";
                  } else {
                    volume = Math.round(value * 10) / 10 + " PB";
                  }
                }
              }
            }
            return volume;
          }
        }, {
          key: 'process_table',
          value: function process_table(tableData) {

            var filteredSet = [];
            var endPointSet = [];
            var num_lines = this.panel.num_lines;

            tableData.forEach(function (element) {
              var datarows = element.rows;

              var valIndex = datarows[0].length - 1;
              var sortedData = datarows.sort(function (a, b) {
                return b[valIndex] - a[valIndex];
              });
              console.log("sorted:");
              console.log(sortedData);

              if (sortedData.length > num_lines) {
                var filteredTopData = sortedData.slice(0, num_lines);
              } else {
                filteredTopData = sortedData;
              }

              var first = true;
              // for legend
              filteredTopData.forEach(function (el) {
                if (true) {
                  if (first) {
                    first = false;
                    console.log('filtered element');
                    console.log(el);
                  }

                  var source_name = el[0];
                  var dst_name = el[1];

                  var newObj = {};
                  newObj.values = [];
                  newObj.name = source_name;
                  newObj.name2 = dst_name;
                  newObj.values.push(el);

                  var found = false;
                  var filteredSetVal = 0;
                  var filteredValtoPush = [];

                  for (var i = 0; i < filteredSet.length; i++) {
                    if (filteredSet[i].name == source_name && filteredSet[i].name2 == dst_name) {
                      found = true;
                      filteredSetVal = i;
                    }
                  }
                  if (!found) {
                    filteredSet.push(newObj);
                  } else {
                    var theone = filteredSet.find(function (e) {
                      return e.name == source_name && e.name2 == dst_name;
                      console.log("reached here and did nothing");
                    });
                    filteredSet[filteredSetVal].values.push(el);
                  }
                }
              });
            });
            //need to fix filtered set because the endpoints are also added. 
            console.log('filteredSet');
            console.log(filteredSet);
            for (var i = 0; i < filteredSet.length; i++) {
              //need to get color for each source 
              var color = this.getFixedColor(i) || this.getRandomColor();

              // console.log(filteredSet[i]);
              for (var j = 0; j < filteredSet[i].values.length; j++) {

                var element = filteredSet[i].values[j];
                if (element.length > 10) {
                  var obj = {};
                  obj.name = element[0];
                  obj.name2 = element[1]; // add
                  obj.from = [element[5], element[4]]; // coordinates
                  obj.to = [element[9], element[8]]; // coordinates
                  obj.labels = [element[2], element[6]];
                  obj.color = color;
                  obj.value = 1;
                  obj.valInBytes = element[10];
                  obj.srcResourceName = element[3];
                  obj.destResourceName = element[7];
                  obj.destResourceDisplayName = element[7];
                  obj.destDisplayName = element[6];

                  table_data.push(obj);
                } else if (element.length == 10) {
                  var obj = {};
                  obj.name = element[0];
                  obj.name2 = '';
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
        }, {
          key: 'onDataError',
          value: function onDataError(err) {
            this.dataRaw = [];
          }
        }, {
          key: 'onInitEditMode',
          value: function onInitEditMode() {
            this.addEditorTab('Options', 'public/plugins/netsage-migrationmap/editor.html', 2);
            this.render();
          }
        }, {
          key: 'onInitPanelActions',
          value: function onInitPanelActions(actions) {
            this.render();
          }
        }, {
          key: 'addNewChoice',
          value: function addNewChoice() {
            var num = this.panel.choices.length + 1;
            this.panel.choices.push(num);
            this.panel.array_option_1.push('');
            this.panel.array_option_2.push('');
            this.panel.array_option_3.push('');
            this.panel.array_option_4.push('');
          }
        }, {
          key: 'removeChoice',
          value: function removeChoice(index) {
            this.panel.choices.splice(index, 1);
            this.panel.array_option_1.splice(index, 1);
            this.panel.array_option_2.splice(index, 1);
            this.panel.array_option_3.splice(index, 1);
            this.panel.array_option_4.splice(index, 1);
          }
        }, {
          key: 'display',
          value: function display() {
            this.panel.colors = this.scale.displayColor(this.panel.colorScheme);
            this.panel.rgb_values = this.panel.colors.rgb_values;
            this.panel.hex_values = this.panel.colors.hex_values;
          }
        }, {
          key: 'getHtml',
          value: function getHtml(htmlContent) {
            return this.custom_hover.parseHtml(htmlContent);
            ///use in link///
            //             let html_content = ctrl.getHtml(ctrl.panel.tooltip.content);
            //             ctrl.panel.tooltip.content = html_content;
          }
        }, {
          key: 'formatBytes',
          value: function formatBytes(val) {
            var hrFormat = null;
            var factor = 1024.0;
            val = val / 8.0;

            var b = val;
            var k = val / factor;
            var m = val / factor / factor;
            var g = val / factor / factor / factor;
            var t = val / factor / factor / factor / factor;
            var p = val / factor / factor / factor / factor / factor;

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

            return hrFormat;
          }
        }, {
          key: 'formatBits',
          value: function formatBits(val) {
            var hrFormat = null;
            var factor = 1024.0;

            var b = val;
            var k = val / factor;
            var m = val / factor / factor;
            var g = val / factor / factor / factor;
            var t = val / factor / factor / factor / factor;
            var p = val / factor / factor / factor / factor / factor;

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

            return hrFormat;
          }
        }, {
          key: 'getRandomColor',
          value: function getRandomColor() {
            var letters = '0123456789ABCDEF';
            var color = '#';
            for (var i = 0; i < 6; i++) {
              color += letters[Math.floor(Math.random() * 16)];
            }
            return color;
          }
        }, {
          key: 'setup',
          value: function setup() {
            var _this2 = this;

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
              return setTimeout(function () {
                ctrl.setup();
              }, 250);
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
                  var container = L.DomUtil.get('map');if (container != null) {
                    container._leaflet_id = null;
                  }

                  var map = L.map('map', {
                    minZoom: 2,
                    scrollWheelZoom: false
                    // maxBounds:bounds
                  }).setView([ctrl.panel.center_lat || 35, ctrl.panel.center_lon || -95], ctrl.panel.zoom_lvl || 5);
                  L.tileLayer(map_url || "https://api.tiles.mapbox.com/v4/mapbox.dark/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw").addTo(map);

                  map.on('zoomend', function () {

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
                  });

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
                  setTimeout(function () {
                    migrationLayer.pause();
                  }, 3000);
                }

                migrationLayer.setData(table_data);
              }

              //Create legend 

              var legendDivData = [];
              var markerLocations = [];

              table_data.forEach(function (element) {

                //var customPopup = "<h2 class = 'custom' style = 'color:" + element.color + "'> Discipline : " + element.name + " </h2></br><h3>Source : " + element.labels[0] + "</h2><br/><h3>Destination : " + element.labels[1] + " </h2></br><h3 class = 'custom'> Value : " + element.valInBytes + " Bytes </h3>"
                //var customPopup2 = "<h2 class = 'custom' style = 'color:" + element.color + "'> Discipline : " + element.name + " </h2></br><h3>Source : " + element.labels[0] + "</h2><br/><h3>Destination : " + element.labels[1] + " </h2></br><h3 class = 'custom'> Value : " + element.valInBytes + " Bytes </h3>"

                var legendInfo = { name: element.name, name2: element.name2, color: element.color };
                legendDivData.push(legendInfo);
                var SrcMarkerInfo = { placeName: element.labels[0], latlong: [element.from[1], element.from[0]] };
                var DestMarkerInfo = { placeName: element.labels[1], latlong: [element.to[1], element.to[0]] };
                markerLocations.push(SrcMarkerInfo);
                markerLocations.push(DestMarkerInfo);
              });

              var legendDiv = document.getElementById("legend");

              var filteredData = Array.from(new Set(legendDivData.map(JSON.stringify))).map(JSON.parse);
              filteredData.forEach(function (element) {
                var lineToAdd = '<span class = "legendItem" style= "color: ' + element.color + ';">' + element.name + ' - ' + element.name2 + '</span></br>';
                legendDiv.innerHTML += lineToAdd;
              });

              legendDiv.innerHTML += '<div id="controls"></div>';
              var controlsDiv = document.getElementById("controls");
              if (ctrl.panel.showControls) {
                controlsDiv.innerHTML = '<br/><span>ANIMATIONS</span><br/>';
                controlsDiv.innerHTML += '<label class="switch"><input type="checkbox" id="playPause"><span class="slider round"></span></label>';
              }

              var playPauseBtn = document.getElementById("playPause");

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
                });
              }

              //Markers 
              var filteredMarkers = Array.from(new Set(markerLocations.map(JSON.stringify))).map(JSON.parse);
              //console.log(filteredMarkers);
              filteredMarkers.forEach(function (element) {
                var customPopup = "<h3 class='orgName'>" + element.placeName + "</h3>";
                var customOptions = {
                  'maxWidth': '310',
                  'maxHeight': '200',
                  'className': 'customPopUp',
                  'overflow-y': 'scroll',
                  'border-bottom': '0px',
                  'border-top': '0px'
                };

                var data = table_data;

                //var filteredSource = data.filter(({ labels }) => labels[0] === element.placeName);
                //var existsAsSource = data.filter(({ srcResourceName }) => srcResourceName === element.resourceName);
                var existsAsSource = data.filter(function (_ref) {
                  var from = _ref.from;
                  return from[0] === element.latlong[1] && from[1] === element.latlong[0];
                });
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
                      var formattedValue = _this2.getFormattedValue(existsAsSource[i].valInBytes);
                      //outGoingDiv += "<span style = 'color: " + existsAsSource[i].color + "'> Discipline : " + existsAsSource[i].name + "  </br> To : " + existsAsSource[i].labels[1] + " </br> Value : " + valinGB + " GB</span></br></br>"
                      outGoingDiv += "<span style = 'color: " + existsAsSource[i].color + "'> " + ctrl.panel.out_field_one + ": " + existsAsSource[i].name + "  </br> " + ctrl.panel.out_field_two + ": " + existsAsSource[i].destDisplayName + "</br>" + ctrl.panel.out_field_three + ": " + existsAsSource[i].destResourceDisplayName + " </br>" + ctrl.panel.out_field_four + ": " + formattedValue + "</span></br></br>";
                    }
                  }
                  customPopup += outGoingDiv;
                }

                //var filteredDest = data.filter(({ labels }) => labels[1] === element.placeName);
                var existsAsDest = data.filter(function (_ref2) {
                  var to = _ref2.to;
                  return to[0] === element.latlong[1] && to[1] === element.latlong[0];
                });
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
                        var formattedValue = _this2.getFormattedValue(existsAsDest[i].valInBytes);

                        //incomingDiv += "<span style = 'color: " + existsAsDest[i].color + "'> Discipline : " + existsAsDest[i].name + "  </br> From : " + existsAsDest[i].labels[0] + "</br>Value : " + valinGB + " GB</span></br></br>"
                        incomingDiv += "<span style = 'color: " + existsAsDest[i].color + "'>" + ctrl.panel.in_field_one + ": " + existsAsDest[i].name + "  </br>" + ctrl.panel.in_field_two + ": " + existsAsDest[i].labels[0] + "</br>" + ctrl.panel.in_field_three + ": " + existsAsDest[i].srcResourceName + "</br>" + ctrl.panel.in_field_four + ": " + formattedValue + "</span></br></br>";
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
        }, {
          key: 'link',
          value: function link(scope, elem, attrs, ctrl) {
            if (!document.getElementById(ctrl.slopegraph_holder_id)) {
              return;
            }
            this.render();
          }
        }]);

        return NetsageMigrationMap;
      }(MetricsPanelCtrl));

      _export('NetsageMigrationMap', NetsageMigrationMap);

      NetsageMigrationMap.templateUrl = 'module.html';
    }
  };
});
//# sourceMappingURL=netsage_migrationmap.js.map
