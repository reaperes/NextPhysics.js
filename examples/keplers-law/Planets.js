/**
 * @author namhoon / emerald105@hanmail.net
 */

/**
 * Sun spec (by nylee)
 *
 * Average Radius 6 9634 2000 m x109 by earth (1 m)
 * Mass 1.98855 * 10^30 kg (33 2965 kg)
 */
var Sun = function (x, y, z, radius, parameters) {
  NP.Sphere.call(this, x, y, z, radius);
  this.mass = 332965;

  this.setValues(parameters);
};
Sun.prototype = Object.create(NP.Sphere.prototype);
Sun.prototype.constructor = Sun;
Sun.prototype.renderScript = function(scene) {
  var sunGeometry	= new THREE.SphereGeometry(this.radius, 32, 32);
  var sunTexture	= THREE.ImageUtils.loadTexture('images/sunmap_1k.jpg');
  var material	= new THREE.MeshPhongMaterial({
    map	: sunTexture,
    bumpMap	: sunTexture,
    bumpScale: 0.05,
    specular: 0xffffff
  });
  var sunMesh = new THREE.Mesh(sunGeometry, material);

  var sun2Geometry	= new THREE.SphereGeometry(this.radius, 32, 32);
  var material2	= new THREE.MeshBasicMaterial({
    map	: sunTexture,
    transparent: true,
    opacity: 0.8,
    blending: THREE.AdditiveBlending
  });
  var sunMesh2 = new THREE.Mesh(sun2Geometry, material2);

  var light = new THREE.PointLight(0xffffff, 2, 10);
  light.color.setHSL(.5,.5, 1);
  light.add(sunMesh);
  light.add(sunMesh2);

  scene.add(light);
};

/**
 * Earth spec (by nylee)
 *
 * Equatorial radius 637 8100 m (1 m)
 * Mass 5.9736e+24 kg (1 kg)
 */
var Earth = function (x, y, z, radius, parameters) {
  NP.Sphere.call(this, x, y, z, radius);
  this.mass = 1;

  this.setValues(parameters);
};
Earth.prototype = Object.create(NP.Sphere.prototype);
Earth.prototype.constructor = Earth;
Earth.prototype.renderScript = function(scene) {
  var plain = new THREE.Mesh(
    new THREE.SphereGeometry(this.radius, 32, 32),
    new THREE.MeshPhongMaterial({
      map: THREE.ImageUtils.loadTexture('images/earth_no_clouds_4k.jpg'),
      bumpMap: THREE.ImageUtils.loadTexture('images/earth_elev_bump_4k.jpg'),
      bumpScale: 0.005,
      specularMap: THREE.ImageUtils.loadTexture('images/earth_water_4k.png'),
      specular: new THREE.Color(0x333333)
    })
  );

  var cloud = new THREE.Mesh(
    new THREE.SphereGeometry(this.radius, 32, 32),
    new THREE.MeshPhongMaterial({
      map: THREE.ImageUtils.loadTexture('images/earth_fair_clouds_4k.png'),
      transparent: true
    })
  );

  var earth = new THREE.Object3D();
  earth.position.copy(this.position);
  this.position = earth.position;
  earth.add(plain);
  earth.add(cloud);
  scene.add(earth);
};

/**
 * Moon spec (by nylee)
 *
 * Equatorial radius 173 8140 km (1 m)
 * Mass 7.3477×10^22 kg (1.23e-2 kg)
 */
var Moon = function (x, y, z, radius, parameters) {
  NP.Sphere.call(this, x, y, z, radius);
  this.mass = 1.23e-2;

  this.setValues(parameters);
};
Moon.prototype = Object.create(NP.Sphere.prototype);
Moon.prototype.constructor = Moon;
Moon.prototype.renderScript = function(scene) {
  var mesh = new THREE.Mesh(
    new THREE.SphereGeometry(this.radius, 32, 32),
    new THREE.MeshPhongMaterial({
      map: THREE.ImageUtils.loadTexture('images/moon_map_2500.jpg'),
      bumpMap: THREE.ImageUtils.loadTexture('images/moon_bump_4k.jpg'),
      bumpScale: 0.05
    })
  );
  mesh.position.copy(this.position);
  this.position = mesh.position;
  scene.add(mesh);
};
