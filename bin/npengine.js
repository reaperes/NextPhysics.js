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
}, NextPhysics = function(a, b) {
    document.oncontextmenu = document.body.oncontextmenu = function() {
        return !1;
    };
    var c = new NP.Engine(this), d = new NP.Renderer(a), e = d.camera;
    this.forces = [], this.deltaT = 1, this.setValues(b), this.add = function(a) {
        c.add(a), d.add(a);
    }, this.update = function() {
        c.update(this.deltaT);
    }, this.render = function() {
        f.update(), d.render();
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
    }, this.apply = function(a) {
        if (void 0 !== a) {
            var b, c, d = Object.keys(a);
            for (b = 0, c = d.length; c > b; b++) {
                var e = d[b], f = a[e];
                if ("force" == e) {
                    if (!(f instanceof NP.Force)) throw new Error("NextPhysics#apply: force value must be NP.Force object");
                    this.forces.push(f);
                }
            }
        }
    }, this.remove = function(a) {
        if (void 0 !== a) {
            var b, c, d = Object.keys(a);
            for (b = 0, c = d.length; c > b; b++) {
                var e = d[b], f = a[e];
                if ("force" == e) {
                    if ("string" != typeof f) throw new Error("NextPhysics#remove: force value must be force name (string)");
                    var g, h, i = this.forces;
                    for (g = 0, h = this.forces.length; h > g; g++) i[g].name == name && i.splice(g, 1);
                }
            }
        }
    };
    var f = new THREE.TrackballControls(e);
    f.rotateSpeed = 1, f.zoomSpeed = 1.2, f.panSpeed = .8, f.noZoom = !1, f.noPan = !1, 
    f.staticMoving = !0, f.dynamicDampingFactor = .3, this.setCameraPosition = function(a, b, c) {
        e.position.set(a, b, c);
    };
}, NextPhysics.prototype.constructor = NextPhysics, NextPhysics.prototype.setValues = function(a) {
    if (void 0 !== a) for (var b = Object.keys(a), c = 0, d = b.length; d > c; c++) {
        var e = b[c], f = a[e];
        void 0 !== f ? e in this && (this[e] = f) : console.warn("NextPhysics: '" + e + "' parameter is undefined.");
    }
}, NP.Attraction = function(a, b, c) {
    this.name = "", this.gravitationalConstant = 1.181e-19, this.objectA = a, this.objectB = b, 
    this.setValues(c);
}, NP.Attraction.prototype = {
    constructor: NP.Attraction,
    setValues: function(a) {
        if (void 0 !== a) for (var b = Object.keys(a), c = 0, d = b.length; d > c; c++) {
            var e = b[c], f = a[e];
            void 0 !== f ? e in this && (this[e] = f) : console.warn("NP.Attraction#setValues: '" + e + "' parameter is undefined.");
        }
    },
    getForceAB: function() {
        var a = new THREE.Vector3().subVectors(this.objectB.position, this.objectA.position), b = this.gravitationalConstant * this.objectA.mass * this.objectB.mass / this.objectA.position.distanceToSquared(this.objectB.position);
        return a.normalize().multiplyScalar(b);
    }
}, NP.Engine = function(a) {
    function b(a) {
        a.force.set(0, 0, 0);
    }
    function c(b) {
        var c, d, e = a.forces, f = b.force;
        for (c = 0, d = e.length; d > c; c++) e[c].regardlessOfMass ? f.add(e[c]) : 0 != b.mass && (f.x += e[c].x / b.mass, 
        f.y += e[c].y / b.mass, f.z += e[c].z / b.mass);
        for (e = b.forces, f = b.force, c = 0, d = e.length; d > c; c++) e[c].regardlessOfMass ? f.add(e[c]) : 0 != b.mass && (f.x += e[c].x / b.mass, 
        f.y += e[c].y / b.mass, f.z += e[c].z / b.mass);
        var g = b.attractions;
        for (c = 0, d = g.length; d > c; c++) {
            var h = g[c];
            if (h.objectA.id == b.id) {
                var i = h.getForceAB();
                f.x += i.x / b.mass, f.y += i.y / b.mass, f.z += i.z / b.mass;
                var j = h.objectB, k = j.force;
                k.x -= i.x / j.mass, k.y -= i.y / j.mass, k.z -= i.z / j.mass;
            }
        }
    }
    function d(a, b) {
        a.velocity.x += a.force.x * b, a.velocity.y += a.force.y * b, a.velocity.z += a.force.z * b;
    }
    function e(a, b) {
        a.position.x += a.velocity.x * b, a.position.y += a.velocity.y * b, a.position.z += a.velocity.z * b;
    }
    var f = [];
    this.objects = f, this.add = function(a) {
        f.push(a);
    }, this.update = function(a) {
        var g, h, i;
        for (g = 0, h = f.length; h > g; g++) b(f[g]);
        for (g = 0; h > g; g++) c(f[g]);
        for (g = 0; h > g; g++) i = f[g], d(i, a), e(i, a);
    };
}, NP.Engine.prototype.constructor = NP.Engine, NP.Force = function(a, b, c, d) {
    THREE.Vector3.call(this), this.name = "", this.x = void 0 !== a ? a : 0, this.y = void 0 !== b ? b : 0, 
    this.z = void 0 !== c ? c : 0, this.regardlessOfMass = !1, this.setValues(d);
}, NP.Force.prototype = Object.create(THREE.Vector3.prototype), NP.Force.prototype.constructor = NP.Force, 
NP.Force.prototype.setValues = function(a) {
    if (void 0 !== a) for (var b = Object.keys(a), c = 0, d = b.length; d > c; c++) {
        var e = b[c], f = a[e];
        if (void 0 !== f) {
            if (e in this) {
                var g = this[e];
                g instanceof THREE.Vector3 && f instanceof THREE.Vector3 ? g.copy(f) : this[e] = f;
            }
        } else console.warn("NP.Object#setValues: '" + e + "' parameter is undefined.");
    }
}, NP.Object = function() {
    this.id = ++NP.ObjectIdCount, this.name = "", this.forces = [], this.force = new THREE.Vector3(), 
    this.velocity = new THREE.Vector3(), this.position = new THREE.Vector3(), this.mass = 1, 
    this.attractions = [];
}, NP.Object.prototype = {
    constructor: NP.Object,
    setValues: function(a) {
        if (void 0 !== a) for (var b = Object.keys(a), c = 0, d = b.length; d > c; c++) {
            var e = b[c], f = a[e];
            if (void 0 !== f) {
                if (e in this) {
                    var g = this[e];
                    g instanceof THREE.Vector3 && f instanceof THREE.Vector3 ? g.copy(f) : this[e] = f;
                }
            } else console.warn("NP.Object#setValues: '" + e + "' parameter is undefined.");
        }
    },
    applyForce: function(a) {
        if (!(a instanceof NP.Force)) throw new Error("NP.Object#applyForce: param must be a NP.Force object.");
        this.forces.push(a);
    },
    removeForce: function(a) {
        if ("string" != typeof a) throw new Error("NP.Object#removeForce: param must be a force name (string).");
        var b, c, d = this.forces;
        for (b = 0, c = this.forces.length; c > b; b++) d[b].name == a && d.splice(b, 1);
    },
    applyAttraction: function(a, b) {
        if (!(a instanceof NP.Object)) throw new Error("NP.Object#applyAttraction: param must be a NP.Object object.");
        var c = new NP.Attraction(this, a, b);
        this.attractions.push(c), a.attractions.push(c);
    },
    removeAttraction: function(a) {
        if ("string" != typeof a) throw new Error("NP.Object#removeForce: param must be a object name (string).");
        var b, c, d = this.attractions;
        for (b = 0, c = d.length; c > b; b++) {
            var e = d[b];
            e.name == a && (e.objectA.id == this.id ? (d.splice(b, 1), e.objectB._removeAttraction(a)) : (d.splice(b, 1), 
            e.objectA._removeAttraction(a)));
        }
    },
    _removeAttraction: function(a) {
        var b, c, d = this.attractions;
        for (b = 0, c = this.attractions.length; c > b; b++) {
            var e = d[b];
            e.name == a && d.splice(b, 1);
        }
    }
}, NP.ObjectIdCount = 0, NP.Sphere = function(a, b, c, d, e) {
    NP.Object.call(this), this.position = new THREE.Vector3(a, b, c), this.radius = void 0 !== d ? d : 1, 
    this.setValues(e);
}, NP.Sphere.prototype = Object.create(NP.Object.prototype), NP.Sphere.prototype.constructor = NP.Sphere, 
NP.Sphere.prototype.renderScript = function(a) {
    var b = new THREE.SphereGeometry(this.radius), c = new THREE.Mesh(b, new THREE.MeshBasicMaterial({
        color: 16777215 * Math.random(),
        wireframe: !0
    }));
    c.position.set(this.position.x, this.position.y, this.position.z), this.position = c.position, 
    a.add(c);
}, NP.Renderer = function(a) {
    var b = new THREE.WebGLRenderer({
        antialias: !0,
        alpha: !0
    }), c = new THREE.Scene();
    this.scene = c;
    var d = [];
    b.setClearColor(new THREE.Color(0)), b.setSize(a.offsetWidth, a.offsetHeight), a.appendChild(b.domElement);
    var e = new THREE.PerspectiveCamera(45, a.offsetWidth / a.offsetHeight, .001, 1e4);
    e.position.z = 100, this.camera = e, c.add(new THREE.AmbientLight(3355443));
    var f = new THREE.AxisHelper(1e3);
    c.add(f), this.canvas = b.domElement, this.render = function() {
        var a, f;
        for (a = 0, f = d.length; f > a; a++) d[a].call(this);
        b.render(c, e);
    }, this.add = function(a) {
        var b = {
            segments: 16
        };
        a.renderScript(c, b, d);
    };
}, NP.Renderer.prototype.constructor = NP.Renderer;