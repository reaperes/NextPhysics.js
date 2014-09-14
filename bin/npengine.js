if (NP = {}, NP.DEBUG = !0, NP.DEBUG) {
    NP.DEBUG_KEY = "debug_key", NP.DEBUG_VALUE = "debug_value";
    var _debug_container = document.createElement("div");
    _debug_container.id = "debug", _debug_container.style.cssText = "width:0px;height:0px;opacity:0.9;";
    var _debug_addKey = function(a, b) {
        var c = document.createElement("span");
        c.id = "debug_key", c.style.cssText = "width:200px;height:100px;background-color:#fff;color:#000;font-size:14px;font-family:Helvetica,Arial,sans-serif;line-height:20px;top:50px;left:0px;position:absolute;padding-left:10px;", 
        c.textContent = a, _debug_container.appendChild(c);
        var d = document.createElement("span");
        d.id = "debug_key", d.style.cssText = "width:200px;height:100px;background-color:#fff;color:#000;font-size:14px;font-family:Helvetica,Arial,sans-serif;line-height:20px;top:70px;left:0px;position:absolute;padding-left:10px;", 
        d.textContent = b, _debug_container.appendChild(d);
    };
    window.onload = function() {
        document.body.appendChild(_debug_container);
    };
}

NP.Util = function() {
    this.isInt = function(a) {
        return "number" == typeof a && a % 1 === 0;
    };
}, NextPhysics = function(a) {
    function b() {
        if (o[k] != o[l]) {
            var a = s;
            o[k] ? (f.position.y += a, g.y += a) : (f.position.y -= a, g.y -= a), r.position.set(g.x, g.y, g.z);
        }
        if (o[m] != o[n]) {
            var b = -s * Math.cos(i * Math.PI / 360), c = s * Math.sin(i * Math.PI / 360);
            o[m] ? (f.position.x += b, g.x += b, f.position.z += c, g.z += c) : (f.position.x -= b, 
            g.x -= b, f.position.z -= c, g.z -= c), r.position.set(g.x, g.y, g.z);
        }
    }
    document.oncontextmenu = document.body.oncontextmenu = function() {
        return !1;
    };
    var c = new NP.Engine(this), d = new NP.Renderer(a), e = .01;
    this.add = function(a) {
        c.add(a), d.add(a);
    }, this.border = function() {}, this.update = function() {
        b(), c.update(e);
    }, this.render = function() {
        d.render();
    }, this.start = function() {
        var a = function() {
            this.update(), this.render(), requestAnimationFrame(a, d.canvas);
        }.bind(this), b = function() {
            c.begin(), this.update(), this.render(), c.end(), requestAnimationFrame(b, d.canvas);
        }.bind(this);
        if (NP.DEBUG) {
            var c = new Stats();
            c.setMode(0), c.domElement.style.position = "absolute", c.domElement.style.left = "0px", 
            c.domElement.style.top = "0px", document.body.appendChild(c.domElement), requestAnimationFrame(b, d.canvas);
        } else requestAnimationFrame(a, d.canvas);
    };
    var f = d.camera, g = d.scene.position, h = 30, i = 30, j = 50, k = 0, l = 2, m = 1, n = 5, o = {
        0: !1,
        2: !1,
        1: !1,
        5: !1
    }, p = new THREE.SphereGeometry(.5), q = new THREE.MeshBasicMaterial({
        transparent: !0,
        opacity: .5,
        color: 16777215
    }), r = new THREE.Mesh(p, q);
    r.position.set(g.x, g.y, g.z), d.scene.add(r);
    var s = .5;
    !function() {
        f.position.x = h * Math.sin(i * Math.PI / 360) * Math.cos(j * Math.PI / 360), f.position.y = h * Math.sin(j * Math.PI / 360), 
        f.position.z = h * Math.cos(i * Math.PI / 360) * Math.cos(j * Math.PI / 360), f.lookAt(g);
        var b, c, d, e = new THREE.Vector2();
        a.addEventListener("mousedown", function(a) {
            a.preventDefault(), b = !0, c = i, d = j, e.x = a.pageX, e.y = a.pageY;
        }, !1), a.addEventListener("mousemove", function(a) {
            a.preventDefault(), b && (i = 1.5 * -(a.pageX - e.x) + c, j = 1.5 * (a.clientY - e.y) + d, 
            f.position.x = g.x + h * Math.sin(i * Math.PI / 360) * Math.cos(j * Math.PI / 360), 
            f.position.y = g.y + h * Math.sin(j * Math.PI / 360), f.position.z = g.z + h * Math.cos(i * Math.PI / 360) * Math.cos(j * Math.PI / 360), 
            f.lookAt(g));
        }, !1), a.addEventListener("mouseup", function(a) {
            a.preventDefault(), b = !1, e.x = a.pageX - e.x, e.y = a.pageY - e.y;
        }, !1), a.addEventListener("mouseover", function() {}.bind(this), !1), a.addEventListener("mousewheel", function(a) {
            a.preventDefault();
            var b = .1 * f.position.distanceTo(g);
            a.wheelDelta > 0 ? (f.position.x -= b * Math.sin(i * Math.PI / 360) * Math.cos(j * Math.PI / 360), 
            f.position.y -= b * Math.sin(j * Math.PI / 360), f.position.z -= b * Math.cos(i * Math.PI / 360) * Math.cos(j * Math.PI / 360), 
            h -= b) : (f.position.x += b * Math.sin(i * Math.PI / 360) * Math.cos(j * Math.PI / 360), 
            f.position.y += b * Math.sin(j * Math.PI / 360), f.position.z += b * Math.cos(i * Math.PI / 360) * Math.cos(j * Math.PI / 360), 
            h += b);
        }, !1), window.addEventListener("keydown", function(a) {
            switch (a.keyCode) {
              case 87:
              case 38:
                o[k] = !0;
                break;

              case 83:
              case 40:
                o[l] = !0;
                break;

              case 65:
              case 37:
                o[m] = !0;
                break;

              case 68:
              case 39:
                o[n] = !0;
            }
        }, !1), window.addEventListener("keyup", function(a) {
            switch (a.keyCode) {
              case 87:
              case 38:
                o[k] = !1;
                break;

              case 83:
              case 40:
                o[l] = !1;
                break;

              case 65:
              case 37:
                o[m] = !1;
                break;

              case 68:
              case 39:
                o[n] = !1;
            }
        }, !1);
    }();
}, NextPhysics.prototype.constructor = NextPhysics, NP.Engine = function() {
    function a(a) {
        a.force.set(0, 0, 0);
    }
    function b(a) {
        _.each(a.forces, function(b) {
            a.force.add(b);
        });
    }
    function c(a, b) {
        a.velocity.x += a.force.x * b, a.velocity.y += a.force.y * b, a.velocity.z += a.force.z * b;
    }
    function d(a, b) {
        a.position.x += a.velocity.x * b, a.position.y += a.velocity.y * b, a.position.z += a.velocity.z * b;
    }
    function e(a) {
        a.position.y < 0 && (a.velocity.y = Math.abs(a.velocity.y), a.position.y = 0);
    }
    var f = [];
    this.add = function(a) {
        f.push(a);
    }, this.update = function(g) {
        _.each(f, function(f) {
            a(f), b(f), c(f, g), d(f, g), e(f);
        });
    };
}, NP.Engine.prototype.constructor = NP.Engine, NP.Force = function(a, b, c) {
    THREE.Vector3.call(this), this.x = void 0 !== a ? a : 0, this.y = void 0 !== b ? b : 0, 
    this.z = void 0 !== c ? c : 0;
}, NP.Force.prototype = Object.create(THREE.Vector3.prototype), NP.Force.prototype.constructor = NP.Force, 
NP.Object = function() {
    this.forces = [], this.force = new THREE.Vector3(), this.velocity = new THREE.Vector3(), 
    this.position = new THREE.Vector3();
}, NP.Object.prototype = {
    constructor: NP.Object,
    applyForce: function(a) {
        if (!(a instanceof NP.Force)) throw new Error("NP.Object#applyForce: param must be a NP.Force object.");
        this.forces.push(a);
    }
}, NP.ObjectContainer = function() {
    NP.Object.call(this), this.childs = [];
}, NP.ObjectContainer.prototype = Object.create(NP.Object.prototype), NP.ObjectContainer.prototype.constructor = NP.ObjectContainer, 
NP.Sphere = function(a, b, c, d) {
    NP.Object.call(this), this.position = new THREE.Vector3(a, b, c), this.radius = void 0 !== d ? d : 1;
}, NP.Sphere.prototype = Object.create(NP.Object.prototype), NP.Sphere.prototype.constructor = NP.Sphere, 
NP.Sphere.prototype.renderScript = function(a) {
    var b = new THREE.SphereGeometry(this.radius), c = new THREE.Mesh(b, new THREE.MeshBasicMaterial({
        color: 16777215 * Math.random(),
        wireframe: !0
    }));
    c.position.set(this.position.x, this.position.y, this.position.z), this.position = c.position, 
    a.add(c);
}, NP.ColorSets = function() {
    var a = {
        background: 16777215,
        color1: 14633289,
        color2: 14842431,
        color3: 15714636,
        color4: 4567709,
        color5: 3362140
    };
    return [ a ];
}(), NP.Renderer = function(a) {
    var b = new THREE.WebGLRenderer(), c = new THREE.Scene();
    this.scene = c;
    var d = new THREE.PerspectiveCamera(45, a.offsetWidth / a.offsetHeight, 1e-4, 1e5), e = NP.ColorSets[0], f = [];
    b.setClearColor(new THREE.Color(15658734)), b.setSize(a.offsetWidth, a.offsetHeight), 
    a.appendChild(b.domElement), c.add(d);
    for (var g = new THREE.LineBasicMaterial({
        color: 10526880
    }), h = new THREE.Geometry(), i = -.04, j = 1, k = 14, l = 0; k / j * 2 >= l; l++) h.vertices.push(new THREE.Vector3(-k, i, l * j - k)), 
    h.vertices.push(new THREE.Vector3(k, i, l * j - k)), h.vertices.push(new THREE.Vector3(l * j - k, i, -k)), 
    h.vertices.push(new THREE.Vector3(l * j - k, i, k));
    var m = new THREE.Line(h, g, THREE.LinePieces);
    c.add(m);
    var n = new THREE.AxisHelper(100);
    c.add(n), this.camera = d, this.canvas = b.domElement, this.render = function() {
        var a, e;
        for (a = 0, e = f.length; e > a; a++) f[a].call(this);
        b.render(c, d);
    }, this.add = function(a) {
        var b = {
            segments: 16,
            color1: e.color1
        };
        a.renderScript(c, b, f);
    };
}, NP.Renderer.prototype.constructor = NP.Renderer;