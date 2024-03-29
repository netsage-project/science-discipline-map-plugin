(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g=(g.Netsage||(g.Netsage = {}));g=(g.MigrationMap||(g.MigrationMap = {}));g=(g.leaflet||(g.leaflet = {}));g.migrationLayer = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
! function (t) {
    var i = {
        calculateColor: function (t, i) {
            if (0 === t.indexOf("#")) {
                var s = t.slice(1),
                    a = parseInt(s.slice(0, 2), 16),
                    e = parseInt(s.slice(2, 4), 16),
                    r = parseInt(s.slice(4), 16)
                return "rgba(" + a + "," + e + "," + r + "," + i + ")"
            }
            return /^rgb\(/.test(t) ? t.replace(/rgb/, "rgba").replace(")", ",") + i + ")" : t.split(",").splice(0, 3).join(",") + i + ")"
        }
    },
        s = {
            forEach: function (t, i, s) {
                if ("function" == typeof Array.prototype.forEach) t.forEach(i, s)
                else
                    for (var a = 0, e = t.length; e > a; a++) i.apply(s, [t[a], a, t])
            },
            map: function (t, i, s) {
                if ("function" == typeof Array.prototype.map) return t.map(i, s)
                for (var a = [], e = 0, r = t.length; r > e; e++) a[e] = i.apply(s, [t[e], e, t])
                return a
            }
        },
        a = function () {
            var t = function (t) {
                this.x = t.x, this.y = t.y, this.rotation = t.rotation, this.style = t.style, this.color = t.color, this.size = t.size, this.borderWidth = t.borderWidth, this.borderColor = t.borderColor
            }
            return t.prototype.draw = function (t) {
                t.save(), t.translate(this.x, this.y), t.rotate(this.rotation), t.lineWidth = this.borderWidth || 0, t.strokeStyle = this.borderColor || "#000", t.fillStyle = this.color || "#000", t.beginPath(), "circle" === this.style ? t.arc(0, 0, this.size, 0, 2 * Math.PI, !1) : "arrow" === this.style && (t.moveTo(-this.size, -this.size), t.lineTo(this.size, 0), t.lineTo(-this.size, this.size), t.lineTo(-this.size / 4, 0), t.lineTo(-this.size, -this.size)), t.closePath(), t.stroke(), t.fill(), t.restore()
            }, t
        }(),
        e = function () {
            var t = function (t) {
                var i = t.startX,
                    s = t.startY,
                    a = t.endX,
                    e = t.endY,
                    r = Math.sqrt(Math.pow(i - a, 2) + Math.pow(s - e, 2)),
                    o = (i + a) / 2,
                    n = (s + e) / 2,
                    h = 1.5,
                    l = (s - e) * h + o,
                    d = (a - i) * h + n,
                    c = Math.sqrt(Math.pow(r / 2, 2) + Math.pow(r * h, 2)),
                    p = Math.atan2(s - d, i - l),
                    u = Math.atan2(e - d, a - l)
                this.startX = i, this.startY = s, this.endX = a, this.endY = e, this.centerX = l, this.centerY = d, this.startAngle = p, this.endAngle = u, this.startLabel = t && t.labels && t.labels[0], this.endLabel = t && t.labels && t.labels[1], this.radius = c, this.lineWidth = t.width || 1, this.strokeStyle = t.color || "#000", this.label = t.label, this.font = t.font, this.shadowBlur = t.shadowBlur
            }
            return t.prototype.draw = function (t) {
                //changed shadowblur to 0 from 2
                if (t.save(), t.lineWidth = this.lineWidth, t.strokeStyle = this.strokeStyle, t.shadowColor = this.strokeStyle, t.shadowBlur = this.shadowBlur || 2, t.beginPath(), t.arc(this.centerX, this.centerY, this.radius, this.startAngle, this.endAngle, !1), t.stroke(), t.restore(), t.save(), t.fillStyle = this.strokeStyle, this.label) {
                    if (t.font = this.label, this.startLabel) {
                        var i = this.startX - 15,
                            s = this.startY + 5
                        t.fillText(this.startLabel, i, s)
                    }
                    if (this.endLabel) {
                        var i = this.endX - 15,
                            s = this.endY - 5
                        t.fillText(this.endLabel, i, s)
                    }
                }
                t.restore()
            }, t
        }(),
        r = function () {
            function t(t) {
                //changed to 0 from 5
                this.x = t.x, this.y = t.y, this.maxRadius = t.radius, this.color = t.color, this.shadowBlur = 5, this.lineWidth = t.borderWidth, this.r = 0, this.factor = 2 / t.radius
            }
            return t.prototype.draw = function (t) {
                var s = .5
                this.r += s, t.save(), t.translate(this.x, this.y)
                var a = this.color
                a = i.calculateColor(a, 1 - this.r / this.maxRadius), t.strokeStyle = a, t.shadowBlur = this.shadowBlur, t.shadowColor = a, t.lineWidth = this.lineWidth, t.beginPath(), t.arc(0, 0, this.r, 0, 2 * Math.PI, !1), t.stroke(), t.restore(), Math.abs(this.maxRadius - this.r) < .8 && (this.r = 0)
            }, t
        }(),
        o = function () {
            var t = function (t) {
                var i = t.startX,
                    s = t.startY,
                    e = t.endX,
                    r = t.endY,
                    o = Math.sqrt(Math.pow(i - e, 2) + Math.pow(s - r, 2)),
                    n = (i + e) / 2,
                    h = (s + r) / 2,
                    l = 1.5,
                    d = (s - r) * l + n,
                    c = (e - i) * l + h,
                    p = Math.sqrt(Math.pow(o / 2, 2) + Math.pow(o * l, 2)),
                    u = Math.atan2(s - c, i - d),
                    f = Math.atan2(r - c, e - d)
                0 > u * f && (0 > u ? (u += 2 * Math.PI, f += 2 * Math.PI) : f += 2 * Math.PI), this.tailPointsCount = 50, this.centerX = d, this.centerY = c, this.startAngle = u, this.endAngle = f, this.radius = p, this.lineWidth = t.width || 1, this.strokeStyle = t.color || "#fff", this.factor = 2 / this.radius, this.deltaAngle = 80 / Math.min(this.radius, 400) / this.tailPointsCount, this.trailAngle = this.startAngle, this.arcAngle = this.startAngle, this.animateBlur = !0, this.marker = new a({
                    x: 50,
                    y: 80,
                    rotation: 50 * Math.PI / 180,
                    style: "arrow",
                    //  color: "rgb(255, 255, 255)",
                    color: this.strokeStyle,
                    size: 4,
                    borderWidth: 0,
                    //borderColor: this.strokeStyle
                    borderColor: "rgb(255, 255, 255)"
                })
            }
            return t.prototype.drawArc = function (t, i, s, a, e) {
                t.save(), t.lineWidth = s, t.strokeStyle = i, t.shadowColor = this.strokeStyle, t.lineCap = "round", t.beginPath(), t.arc(this.centerX, this.centerY, this.radius, a, e, !1), t.stroke(), t.restore()
            }, t.prototype.draw = function (t) {
                var s = this.endAngle,
                    a = this.trailAngle + this.factor,
                    e = this.strokeStyle
                //change the calculate color value to change opacity of the blur. 
                this.animateBlur
                    && (this.arcAngle = a), this.trailAngle = a, e = i.calculateColor(e, 0), this.drawArc(t, e, this.lineWidth, this.startAngle, this.arcAngle)
                //commentedThis
                // for (var r = this.tailPointsCount, o = 0; r > o; o++) {
                //     var n = i.calculateColor(this.strokeStyle, .3 - .3 / r * o),
                //         h = 5
                //     this.trailAngle - this.deltaAngle * o > this.startAngle && this.drawArc(t, n, h - h / r * o, this.trailAngle - this.deltaAngle * o, this.trailAngle)
                // }
                t.save(), t.translate(this.centerX, this.centerY), this.marker.x = Math.cos(this.trailAngle) * this.radius, this.marker.y = Math.sin(this.trailAngle) * this.radius, this.marker.rotation = this.trailAngle + Math.PI / 2, this.marker.draw(t), t.restore(), 180 * (s - this.trailAngle) / Math.PI < .5 && (this.trailAngle = this.startAngle, this.animateBlur = !1)
            }, t
        }(),
        n = function () {
            var i = function (t) {
                this.data = t.data, this.store = {
                    arcs: [],
                    markers: [],
                    pulses: [],
                    sparks: []
                }, this.playAnimation = !0, this.started = !1, this.context = t.context, this.style = t.style, this.init()
            }
            return i.prototype.init = function () {
                this.updateData(this.data)
            }, i.prototype.add = function (t) { }, i.prototype.remove = function () { }, i.prototype.clear = function () {
                this.store = {
                    arcs: [],
                    markers: [],
                    pulses: [],
                    sparks: []
                }, this.playAnimation = !0, this.started = !1, t.cancelAnimationFrame(this.requestAnimationId)
            }, i.prototype.updateData = function (t) {
                t && 0 !== t.length && (this.clear(), this.data = t, this.data && this.data.length > 0 && s.forEach(this.data, function (t) {
                    var i = new e({
                        startX: t.from[0],
                        startY: t.from[1],
                        endX: t.to[0],
                        endY: t.to[1],
                        labels: t.labels,
                        label: this.style.arc.label,
                        font: this.style.arc.font,
                        width: this.style.arc.width,
                        color: t.color
                    }),
                        s = new a({
                            x: t.to[0],
                            y: t.to[1],
                            rotation: i.endAngle + Math.PI / 2,
                            style: "arrow",
                            color: t.color,
                            size: 4,
                            borderWidth: 0,
                            borderColor: t.color
                        }),
                        n = new r({
                            x: t.to[0],
                            y: t.to[1],
                            radius: this.style.pulse.radius,
                            color: t.color,
                            borderWidth: this.style.pulse.borderWidth
                        }),
                        h = new o({
                            startX: t.from[0],
                            startY: t.from[1],
                            endX: t.to[0],
                            endY: t.to[1],
                            width: 15,
                            color: t.color
                        })
                    this.store.arcs.push(i), this.store.markers.push(s), this.store.pulses.push(n), this.store.sparks.push(h)
                }, this))
            }, i.prototype.start = function (i) {
                var s = this
                this.started || (! function a() {
                    if (s.requestAnimationId = t.requestAnimationFrame(a, i), s.playAnimation) {
                        i.width += 1, i.width -= 1
                        for (var e in s.store)
                            for (var r = s.store[e], o = 0, n = r.length; n > o; o++) r[o].draw(s.context)
                    }
                }(), this.started = !0)
            }, i.prototype.play = function () {
                this.playAnimation = !0
            }, i.prototype.pause = function () {
                this.playAnimation = !1
            }, i
        }()
    L.MigrationLayer = L.Class.extend({
        options: {
            map: {},
            data: {},
            pulseRadius: 25,
            pulseBorderWidth: 3,
            arcWidth: 1,
            arcLabel: !0,
            arcLabelFont: "15px sans-serif",
            Marker: {},
            Spark: {}
        },
        _setOptions: function (t, i) {
            t.hasOwnProperty("options") || (t.options = t.options ? L.Util.create(t.options) : {})
            for (var s in i) t.options[s] = i[s]
            return t.options
        },
        initialize: function (t) {
            this._setOptions(this, t), this._map = this.options.map || {}, this._data = this.options.data || {}, this._style = {
                pulse: {
                    radius: this.options.pulseRadius,
                    borderWidth: this.options.pulseBorderWidth
                },
                arc: {
                    width: this.options.arcWidth,
                    label: this.options.arcLabel,
                    font: this.options.arcLabelFont
                }
            } || {}, this._show = !0, this._init()
        },
        _init: function () {
            var t = L.DomUtil.create("div", "leaflet-ODLayer-container")
            if (t.style.position = "absolute", t.style.width = this._map.getSize().x + "px", t.style.height = this._map.getSize().y + "px", this.container = t, this.canvas = document.createElement("canvas"), this.context = this.canvas.getContext("2d"), t.appendChild(this.canvas), this._map.getPanes().overlayPane.appendChild(t), !this.migration) {
                var i = this._convertData()
                this.migration = new n({
                    data: i,
                    context: this.context,
                    style: this._style
                })
            }
        },
        _resize: function () {
            var i = this._map.getBounds(),
                s = i.getNorthWest(),
                a = this._map.latLngToContainerPoint(s)
            a.y > 0 ? this.container.style.top = -a.y + "px" : this.container.style.top = "0px"
            var e = t.getComputedStyle(this._map.getContainer())
            this.canvas.setAttribute("width", parseInt(e.width, 10)), this.canvas.setAttribute("height", parseInt(e.height, 10))
        },
        _convertData: function () {
            var t = this._map.getBounds()
            if (this._data && t) {
                var i = s.map(this._data, function (t) {
                    var i = this._map.latLngToContainerPoint(new L.LatLng(t.from[1], t.from[0])),
                        s = this._map.latLngToContainerPoint(new L.LatLng(t.to[1], t.to[0]))
                    return {
                        from: [i.x, i.y],
                        to: [s.x, s.y],
                        labels: t.labels,
                        value: t.value,
                        color: t.color
                    }
                }, this)
                return i
            }
        },
        _bindMapEvents: function () {
            var t = this
            this._map.on("moveend", function () {
                // t.migration.play(), t._draw()
            }), this._map.on("zoomstart ", function () {
                t.container.style.display = "none"
            }), this._map.on("zoomend", function () {
                t._show && (t.container.style.display = "", t._draw())
            })
        },
        _draw: function () {
            var t = this._map.getBounds()
            if (t && this.migration.playAnimation) {
                this._resize(), this._transform()
                var i = this._convertData()
                this.migration.updateData(i), this.migration.start(this.canvas)
            }

        },
        _transform: function () {
            var t = this._map.getBounds(),
                i = this._map.latLngToLayerPoint(t.getNorthWest())
            L.DomUtil.setPosition(this.container, i)
        },
        addTo: function () {
            this._bindMapEvents()
            var t = this._map.getBounds()
            if (t && this.migration.playAnimation) {
                this._resize(), this._transform()
                var i = this._convertData()
                this.migration.updateData(i), this.migration.start(this.canvas)
            }
        },
        setData: function (t) {
            this._data = t, this._draw()
        },
        hide: function () {
            this.container.style.display = "none", this._show = !1
        },
        show: function () {
            this.container.style.display = "", this._show = !0

        },
        play: function () {
            this.migration.play()
        },
        pause: function () {
            this.migration.pause()
        },
        destroy: function () {
            this.migration.clear(), this.container.parentNode.removeChild(this.container), this._map.clearAllEventListeners(), this.mapHandles = []
        }
    }), L.migrationLayer = function (t) {
        return new L.MigrationLayer(t)
    }
}(window)
},{}]},{},[1])(1)
});
